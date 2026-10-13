import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Reminder, Patient, Appointment, Clinic } from '../types';

interface RemindersPageProps {
  reminders: Reminder[];
  patients: Patient[];
  appointments: Appointment[];
  clinic?: Clinic;
  onSendManualReminder: (data: any) => void;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({
  reminders,
  patients,
  appointments,
  clinic,
  onSendManualReminder,
}) => {
  const [selectedApptId, setSelectedApptId] = useState<string>(appointments[0]?.id || '');
  const [templateType, setTemplateType] = useState<string>('CONFIRMATION');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');

  const selectedAppt = appointments.find((a) => a.id === selectedApptId);

  // Live message preview calculation
  const buildPreview = () => {
    if (!selectedAppt) return 'Please select an appointment to preview the personalized reminder message.';
    const pName = selectedAppt.patient.name;
    const dName = selectedAppt.doctor.user?.name || 'Doctor';
    const cName = clinic?.name || 'Smart Clinic';
    const date = selectedAppt.appointmentDate;
    const time = selectedAppt.timeSlot;
    const token = selectedAppt.tokenNumber;

    if (templateType === 'CONFIRMATION') {
      return `🩺 *${cName} - Appointment Confirmed*\n\nDear *${pName}*,\nYour appointment with *Dr. ${dName}* has been confirmed.\n\n📅 Date: ${date}\n⏰ Time: ${time}\n🎟️ Token Number: *#${token}*\n\nPlease arrive 10 minutes prior to your time. Thank you for choosing us!`;
    }
    if (templateType === 'REMINDER_24H') {
      return `⏰ *${cName} - Upcoming Appointment Reminder*\n\nHi *${pName}*,\nThis is a quick reminder for your scheduled visit with *Dr. ${dName}* on ${date} at ${time} (Token #${token}). Reply to reschedule.`;
    }
    if (templateType === 'QUEUE_ALERT') {
      return `🔔 *${cName} - Live Queue Update*\n\nDear *${pName}*,\n*Dr. ${dName}* is ready for your consultation! Token #${token}.\nPlease proceed to Consultation Room ${selectedAppt.doctor.roomNumber || ''}.`;
    }
    return `Hello ${pName}, message from ${cName}.`;
  };

  const previewMessage = buildPreview();

  const handleSend = () => {
    if (!selectedApptId) return;
    onSendManualReminder({
      appointmentId: selectedApptId,
      channel,
      templateType,
    });
  };

  const handleOpenWhatsAppWeb = () => {
    if (!selectedAppt) return;
    let cleanPhone = selectedAppt.patient.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(previewMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            WhatsApp & SMS Automated Reminder Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reduce no-shows by 40% with automated booking confirmations, 24h reminders, and token queue alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Cloud API Ready
          </span>
        </div>
      </div>

      {/* Grid: Interactive Sender & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Notification Composer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-teal-600" />
            Send On-Demand Reminder
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Select Appointment */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Patient Appointment</label>
              <select
                value={selectedApptId}
                onChange={(e) => setSelectedApptId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              >
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Token #{a.tokenNumber} - {a.patient.name} ({a.timeSlot})
                  </option>
                ))}
              </select>
            </div>

            {/* Template */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reminder Template</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="CONFIRMATION">Appointment Confirmed with Token #</option>
                <option value="REMINDER_24H">24-Hour Advance Reminder</option>
                <option value="QUEUE_ALERT">Lobby Token Call Alert (Ready now)</option>
              </select>
            </div>
          </div>

          {/* Delivery Channel Radio */}
          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700">Delivery Channel:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="channel"
                value="WHATSAPP"
                checked={channel === 'WHATSAPP'}
                onChange={() => setChannel('WHATSAPP')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-emerald-800">WhatsApp (Recommended)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="channel"
                value="SMS"
                checked={channel === 'SMS'}
                onChange={() => setChannel('SMS')}
                className="text-slate-600 focus:ring-slate-500"
              />
              <span className="text-slate-700 font-medium">Standard SMS Gateway</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch & Log in Database
            </button>

            <button
              onClick={handleOpenWhatsAppWeb}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Open Live in WhatsApp Web / App
            </button>
          </div>
        </div>

        {/* Right Column: WhatsApp Smartphone Mockup */}
        <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border-4 border-slate-800 max-w-sm mx-auto w-full">
          {/* Mockup screen header */}
          <div className="bg-[#075e54] text-white p-3 rounded-t-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              🩺
            </div>
            <div>
              <p className="font-bold text-xs truncate">{clinic?.name || 'CuraPulse Clinic'}</p>
              <p className="text-[10px] text-emerald-200">Online • Official Business Account</p>
            </div>
          </div>

          {/* Chat background */}
          <div className="bg-[#efeae2] p-4 min-h-[260px] rounded-b-2xl flex flex-col justify-end">
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm text-[11px] text-slate-800 whitespace-pre-line max-w-[95%] border border-slate-200">
              {previewMessage}
              <div className="text-right text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                <span>Just now</span>
                <span className="text-sky-500 font-bold">✓✓</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sent Reminders Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Delivery & Audit Log (Recent Messages)</h3>
          <span className="text-xs text-slate-400">{reminders.length} logged messages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Channel</th>
                <th className="px-5 py-3">Template</th>
                <th className="px-5 py-3">Message Content</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reminders.map((rem) => (
                <tr key={rem.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">
                    {new Date(rem.sentAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-800">
                    {rem.patient?.name}
                    <span className="block text-[10px] text-slate-400">{rem.recipientPhone}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      rem.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {rem.channel}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {rem.templateType}
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-sm truncate">
                    {rem.messageBody}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {rem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
