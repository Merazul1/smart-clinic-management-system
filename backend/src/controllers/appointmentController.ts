import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';
import { sendAndLogReminder } from '../services/notificationService';

export async function listAppointments(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { date, doctorId, status } = req.query;

    const whereClause: any = { clinicId };
    if (date) whereClause.appointmentDate = String(date);
    if (doctorId) whereClause.doctorId = String(doctorId);
    if (status) whereClause.status = String(status);

    // If logged in as doctor, filter only doctor's own appointments unless admin
    if (req.user?.role === 'DOCTOR' && req.user.doctorProfileId) {
      whereClause.doctorId = req.user.doctorProfileId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: {
          include: { user: true },
        },
        prescription: true,
        invoices: true,
      },
      orderBy: [
        { appointmentDate: 'desc' },
        { tokenNumber: 'asc' },
      ],
    });

    return res.json(appointments);
  } catch (error: any) {
    console.error('List appointments error:', error);
    return res.status(500).json({ error: 'Failed to list appointments' });
  }
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { patientId, doctorId, appointmentDate, timeSlot, type, reason, notes, sendNotification } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ error: 'Patient, Doctor, Date, and Time Slot are required' });
    }

    // Auto-calculate next token number for this doctor on this day
    const existingTokens = await prisma.appointment.count({
      where: {
        clinicId,
        doctorId,
        appointmentDate,
      },
    });
    const tokenNumber = existingTokens + 1;

    const appointment = await prisma.appointment.create({
      data: {
        clinicId,
        patientId,
        doctorId,
        appointmentDate,
        timeSlot,
        tokenNumber,
        type: type || 'IN_PERSON',
        status: 'SCHEDULED',
        reason: reason || null,
        notes: notes || null,
      },
      include: {
        patient: true,
        doctor: {
          include: { user: true },
        },
        clinic: true,
      },
    });

    // Send automated WhatsApp/SMS confirmation
    let notificationResult = null;
    if (sendNotification !== false && appointment.patient.phone) {
      notificationResult = await sendAndLogReminder({
        clinicId,
        patientId,
        appointmentId: appointment.id,
        channel: 'WHATSAPP',
        templateType: 'CONFIRMATION',
        patientName: appointment.patient.name,
        patientPhone: appointment.patient.phone,
        doctorName: appointment.doctor.user.name,
        clinicName: appointment.clinic.name,
        date: appointmentDate,
        time: timeSlot,
        tokenNumber,
      });
    }

    return res.status(201).json({
      appointment,
      notification: notificationResult,
    });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create appointment' });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await prisma.appointment.findFirst({
      where: { id, clinicId },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        clinic: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        patient: true,
        doctor: { include: { user: true } },
      },
    });

    // If status became WAITING or IN_CONSULTATION, optionally alert patient
    let notification = null;
    if (status === 'IN_CONSULTATION' && appointment.patient.phone) {
      notification = await sendAndLogReminder({
        clinicId,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        channel: 'WHATSAPP',
        templateType: 'QUEUE_ALERT',
        patientName: appointment.patient.name,
        patientPhone: appointment.patient.phone,
        doctorName: appointment.doctor.user.name,
        clinicName: appointment.clinic.name,
        tokenNumber: appointment.tokenNumber,
      });
    }

    return res.json({ updated, notification });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
}

export async function getOpdQueue(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const today = new Date().toISOString().split('T')[0];
    const { doctorId } = req.query;

    const whereClause: any = {
      clinicId,
      appointmentDate: today,
    };

    if (doctorId) {
      whereClause.doctorId = String(doctorId);
    } else if (req.user?.role === 'DOCTOR' && req.user.doctorProfileId) {
      whereClause.doctorId = req.user.doctorProfileId;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            vitals: {
              orderBy: { recordedAt: 'desc' },
              take: 1,
            },
          },
        },
        doctor: {
          include: { user: true },
        },
        prescription: true,
      },
      orderBy: { tokenNumber: 'asc' },
    });

    const waiting = appointments.filter((a) => a.status === 'WAITING');
    const inConsultation = appointments.filter((a) => a.status === 'IN_CONSULTATION');
    const scheduled = appointments.filter((a) => a.status === 'SCHEDULED');
    const completed = appointments.filter((a) => a.status === 'COMPLETED');

    return res.json({
      date: today,
      total: appointments.length,
      waiting,
      inConsultation,
      scheduled,
      completed,
      all: appointments,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch OPD queue' });
  }
}
