import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';
import { sendAndLogReminder, generateWhatsAppUrl, buildNotificationMessage } from '../services/notificationService';

export async function listReminders(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { channel } = req.query;

    const whereClause: any = { clinicId };
    if (channel) whereClause.channel = String(channel);

    const reminders = await prisma.reminder.findMany({
      where: whereClause,
      include: {
        patient: true,
        appointment: {
          include: {
            doctor: { include: { user: true } },
          },
        },
      },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    return res.json(reminders);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch reminder history' });
  }
}

export async function triggerManualReminder(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { appointmentId, channel = 'WHATSAPP', templateType = 'REMINDER_24H' } = req.body;

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        clinic: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const result = await sendAndLogReminder({
      clinicId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      channel,
      templateType,
      patientName: appointment.patient.name,
      patientPhone: appointment.patient.phone,
      doctorName: appointment.doctor.user.name,
      clinicName: appointment.clinic.name,
      date: appointment.appointmentDate,
      time: appointment.timeSlot,
      tokenNumber: appointment.tokenNumber,
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send reminder' });
  }
}

export async function getDirectWhatsAppLink(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { appointmentId } = req.params;

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        clinic: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const payload = {
      clinicId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      templateType: 'CONFIRMATION' as const,
      patientName: appointment.patient.name,
      patientPhone: appointment.patient.phone,
      doctorName: appointment.doctor.user.name,
      clinicName: appointment.clinic.name,
      date: appointment.appointmentDate,
      time: appointment.timeSlot,
      tokenNumber: appointment.tokenNumber,
    };

    const message = buildNotificationMessage(payload);
    const url = generateWhatsAppUrl(appointment.patient.phone, message);

    return res.json({ url, message, phone: appointment.patient.phone });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate WhatsApp link' });
  }
}
