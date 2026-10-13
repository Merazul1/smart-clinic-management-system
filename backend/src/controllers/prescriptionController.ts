import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';
import { sendAndLogReminder } from '../services/notificationService';

export async function createPrescription(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const {
      appointmentId,
      patientId,
      doctorId,
      diagnosis,
      symptoms,
      clinicalNotes,
      advice,
      followUpDate,
      items,
      sendNotification,
    } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ error: 'Patient ID and Diagnosis are required' });
    }

    // Resolve doctorId
    let resolvedDoctorId = doctorId;
    if (!resolvedDoctorId && req.user?.doctorProfileId) {
      resolvedDoctorId = req.user.doctorProfileId;
    }
    if (!resolvedDoctorId) {
      const firstDoc = await prisma.doctorProfile.findFirst({ where: { clinicId } });
      resolvedDoctorId = firstDoc?.id;
    }

    const prescription = await prisma.prescription.create({
      data: {
        clinicId,
        appointmentId: appointmentId || null,
        patientId,
        doctorId: resolvedDoctorId,
        diagnosis,
        symptoms: symptoms || null,
        clinicalNotes: clinicalNotes || null,
        advice: advice || null,
        followUpDate: followUpDate || null,
        items: {
          create: (items || []).map((item: any) => ({
            medicineName: item.medicineName,
            dosage: item.dosage || '1 tablet',
            frequency: item.frequency || '1-0-1',
            timing: item.timing || 'AFTER_FOOD',
            duration: item.duration || '5 days',
            instructions: item.instructions || null,
          })),
        },
      },
      include: {
        items: true,
        patient: true,
        doctor: { include: { user: true } },
        clinic: true,
      },
    });

    // Mark appointment as COMPLETED if provided
    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'COMPLETED' },
      });
    }

    // Send WhatsApp notification
    let notification = null;
    if (sendNotification !== false && prescription.patient.phone) {
      notification = await sendAndLogReminder({
        clinicId,
        patientId,
        appointmentId: appointmentId || undefined,
        channel: 'WHATSAPP',
        templateType: 'RX_READY',
        patientName: prescription.patient.name,
        patientPhone: prescription.patient.phone,
        doctorName: prescription.doctor.user.name,
        clinicName: prescription.clinic.name,
      });
    }

    return res.status(201).json({ prescription, notification });
  } catch (error: any) {
    console.error('Create prescription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create prescription' });
  }
}

export async function getPrescriptionById(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;

    const prescription = await prisma.prescription.findFirst({
      where: { id, clinicId },
      include: {
        items: true,
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
        clinic: true,
        appointment: true,
      },
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    return res.json(prescription);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch prescription' });
  }
}

export async function listPrescriptions(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { patientId, doctorId } = req.query;

    const whereClause: any = { clinicId };
    if (patientId) whereClause.patientId = String(patientId);
    if (doctorId) whereClause.doctorId = String(doctorId);

    const prescriptions = await prisma.prescription.findMany({
      where: whereClause,
      include: {
        items: true,
        patient: true,
        doctor: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(prescriptions);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to list prescriptions' });
  }
}
