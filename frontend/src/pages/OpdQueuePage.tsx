import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Activity,
  Heart,
  Droplet,
  ExternalLink,
  Volume2,
  Calendar,
} from 'lucide-react';
import { Appointment, DoctorProfile } from '../types';

interface OpdQueuePageProps {
  queueData: any;
  doctors: DoctorProfile[];
  onUpdateStatus: (id: string, status: string) => void;
  onSendWhatsAppAlert: (appointmentId: string) => void;
  onOpenRxForAppointment: (appointment: Appointment) => void;
}

export const OpdQueuePage: React.FC<OpdQueuePageProps> = ({
  queueData,
  doctors,
  onUpdateStatus,
  onSendWhatsAppAlert,
  onOpenRxForAppointment,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('ALL');
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const appointments: Appointment[] = queueData?.all || [];

  const filteredAppts = appointments.filter((a) => {
    if (selectedDoctorId === 'ALL') return true;
    return a.doctorId === selectedDoctorId;
  });

  const waiting = filteredAppts.filter((a) => a.status === 'WAITING');
  const inConsultation = filteredAppts.filter((a) => a.status === 'IN_CONSULTATION');
  const scheduled = filteredAppts.filter((a) => a.status === 'SCHEDULED');
  const completed = filteredAppts.filter((a) => a.status === 'COMPLETED');

  const handleCallToken = (appt: Appointment) => {
    onUpdateStatus(appt.id, 'IN_CONSULTATION');
    const msg = `Now calling Token #${appt.tokenNumber} - ${appt.patient.name} to ${appt.doctor.roomNumber || 'Consultation Room'}!`;
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 7000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Doctor Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Live OPD Waiting Room & Token Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time digital triage, cabin call sequence, and live status broadcaster
          </p>
        </div>

        {/* Doctor filter dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Cabin:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option value="ALL">All Doctors & Rooms</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.user?.name} ({doc.roomNumber || 'Cabin'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audio Announcement Simulator Banner */}
      {announcement && (
        <div className="bg-teal-900 text-white p-4 rounded-xl shadow-md border-2 border-teal-400 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500 rounded-lg text-slate-900">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-teal-300 uppercase font-bold tracking-wider">Lobby PA System Announcement</p>
              <p className="text-sm font-semibold">{announcement}</p>
            </div>
          </div>
          <span className="text-xs bg-teal-800 text-teal-200 px-3 py-1 rounded-full border border-teal-600">
            Audio Broadcasted
          </span>
        </div>
      )}

      {/* 3-Column Kanban Board for Today's OPD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Waiting in Lobby */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h2 className="font-bold text-sm text-slate-800">Waiting in Lobby</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {waiting.length}
            </span>
          </div>

          <div className="space-y-3">
            {waiting.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs hover:border-amber-400 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                      #{appt.tokenNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{appt.patient.name}</h3>
                      <p className="text-xs text-slate-500">{appt.patient.age}y • {appt.patient.gender} • {appt.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {appt.reason && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <strong>Complaint:</strong> {appt.reason}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Dr. {appt.doctor.user?.name}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSendWhatsAppAlert(appt.id)}
                      title="Send WhatsApp queue reminder"
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCallToken(appt)}
                      className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                    >
                      Call to Cabin
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {waiting.length === 0 && (
              <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No patients currently waiting in lobby.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Inside Consultation Cabin */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-bold text-sm text-slate-800">In Cabin Consultation</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {inConsultation.length}
            </span>
          </div>

          <div className="space-y-3">
            {inConsultation.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-4 rounded-xl border-2 border-emerald-400/80 shadow-md ring-2 ring-emerald-500/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      #{appt.tokenNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{appt.patient.name}</h3>
                      <p className="text-xs text-emerald-700 font-medium">Inside {appt.doctor.roomNumber || 'Cabin 101'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    Active
                  </span>
                </div>

                <div className="mt-3 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Doctor:</span>
                    <strong className="text-slate-800">Dr. {appt.doctor.user?.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fee:</span>
                    <strong className="text-slate-800">₹{appt.doctor.consultationFee}</strong>
                  </div>
                  {appt.patient.allergies && (
                    <div className="text-rose-600 font-semibold text-[11px] pt-1 border-t border-emerald-200/40">
                      ⚠️ Allergies: {appt.patient.allergies}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onOpenRxForAppointment(appt)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Write Prescription & Finish
                  </button>
                </div>
              </div>
            ))}

            {inConsultation.length === 0 && (
              <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No active consultation in progress.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Scheduled / Completed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <h2 className="font-bold text-sm text-slate-800">Upcoming & Completed</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {scheduled.length + completed.length}
            </span>
          </div>

          <div className="space-y-3">
            {scheduled.map((appt) => (
              <div key={appt.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">#{appt.tokenNumber}</span>
                    <span className="font-bold text-xs text-slate-800">{appt.patient.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{appt.timeSlot} • Dr. {appt.doctor.user?.name}</p>
                </div>
                <button
                  onClick={() => onUpdateStatus(appt.id, 'WAITING')}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 font-semibold rounded-lg transition"
                >
                  Mark Arrived
                </button>
              </div>
            ))}

            {completed.map((appt) => (
              <div key={appt.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 flex justify-between items-center opacity-75">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-xs text-slate-700">{appt.patient.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Token #{appt.tokenNumber} • Completed</p>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  Finished
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
