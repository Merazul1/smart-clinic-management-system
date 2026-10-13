import { prisma } from '../prisma';

export interface ReminderPayload {
  clinicId: string;
  patientId: string;
  appointmentId?: string;
  channel?: 'WHATSAPP' | 'SMS';
  templateType: 'CONFIRMATION' | 'REMINDER_24H' | 'QUEUE_ALERT' | 'RX_READY' | 'INVOICE';
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  clinicName?: string;
  date?: string;
  time?: string;
  tokenNumber?: number;
  invoiceNumber?: string;
  amount?: string;
}

export function buildNotificationMessage(payload: ReminderPayload): string {
  const clinic = payload.clinicName || 'Smart Clinic';
  const doctor = payload.doctorName ? `Dr. ${payload.doctorName}` : 'Doctor';

  switch (payload.templateType) {
    case 'CONFIRMATION':
      return `🩺 *${clinic} - Appointment Confirmed*\n\nDear *${payload.patientName}*,\nYour appointment with *${doctor}* has been confirmed.\n\n📅 Date: ${payload.date}\n⏰ Time: ${payload.time}\n🎟️ Token Number: *#${payload.tokenNumber || 1}*\n\nPlease arrive 10 minutes prior to your time. Thank you for choosing us!`;

    case 'REMINDER_24H':
      return `⏰ *${clinic} - Upcoming Appointment Reminder*\n\nHi *${payload.patientName}*,\nThis is a quick reminder for your scheduled visit with *${doctor}* on ${payload.date} at ${payload.time} (Token #${payload.tokenNumber}). Reply to reschedule.`;

    case 'QUEUE_ALERT':
      return `🔔 *${clinic} - Live Queue Update*\n\nDear *${payload.patientName}*,\n*${doctor}* is ready for your consultation! Token #${payload.tokenNumber}.\nPlease proceed to Consultation Room.`;

    case 'RX_READY':
      return `📋 *${clinic} - Digital Prescription Ready*\n\nDear *${payload.patientName}*,\nYour e-prescription from *${doctor}* has been issued. View and download your medicines & follow-up instructions on our patient portal.`;

    case 'INVOICE':
      return `💳 *${clinic} - Payment Receipt / Invoice*\n\nDear *${payload.patientName}*,\nInvoice *${payload.invoiceNumber}* for amount *${payload.amount}* has been issued. Thank you for visiting ${clinic}.`;

    default:
      return `Hello ${payload.patientName}, message from ${clinic}.`;
  }
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  // Normalize phone (strip spaces, dashes, ensure country code if missing)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // default country code fallback
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export async function sendAndLogReminder(payload: ReminderPayload) {
  const messageBody = buildNotificationMessage(payload);
  const channel = payload.channel || 'WHATSAPP';

  // Save to database
  const reminder = await prisma.reminder.create({
    data: {
      clinicId: payload.clinicId,
      patientId: payload.patientId,
      appointmentId: payload.appointmentId || null,
      channel,
      templateType: payload.templateType,
      recipientPhone: payload.patientPhone,
      messageBody,
      status: 'SENT',
      externalMessageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    },
  });

  return {
    reminder,
    messageBody,
    whatsAppDirectUrl: generateWhatsAppUrl(payload.patientPhone, messageBody),
  };
}
