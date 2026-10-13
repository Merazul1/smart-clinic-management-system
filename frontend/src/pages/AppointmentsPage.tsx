import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  User,
  Filter,
} from 'lucide-react';
import { Appointment, DoctorProfile, Patient } from '../types';

interface AppointmentsPageProps {
  appointments: Appointment[];
  doctors: DoctorProfile[];
  onOpenBookAppointment: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSendWhatsApp: (appointmentId: string) => void;
  onDirectWhatsApp: (appointmentId: string) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  doctors,
  onOpenBookAppointment,
  onUpdateStatus,
  onSendWhatsApp,
  onDirectWhatsApp,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAppointments = appointments.filter((a) => {
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    if (selectedDoctor !== 'ALL' && a.doctorId !== selectedDoctor) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const patientMatch = a.patient.name.toLowerCase().includes(s) || a.patient.phone.includes(s);
      return patientMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            Appointments & Doctor Schedules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book visits, track token arrival flow, and dispatch patient reminders
          </p>
        </div>

        <button
          onClick={onOpenBookAppointment}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          {['ALL', 'WAITING', 'IN_CONSULTATION', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedStatus === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Doctor filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 font-medium"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.user?.name}
              </option>
            ))}
          </select>

          {/* Search by patient */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl w-40 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Token & Patient</th>
                <th className="px-5 py-3.5">Doctor & Specialization</th>
                <th className="px-5 py-3.5">Date & Time Slot</th>
                <th className="px-5 py-3.5">Reason / Notes</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Actions & Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/70 transition">
                  {/* Token & Patient */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                        #{appt.tokenNumber}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{appt.patient.name}</div>
                        <div className="text-[11px] text-slate-500">{appt.patient.phone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="font-semibold text-slate-800">Dr. {appt.doctor.user?.name}</div>
                      <div className="text-[11px] text-teal-600">{appt.doctor.specialization}</div>
                    </div>
                  </td>

                  {/* Date & Slot */}
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-700">{appt.appointmentDate}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{appt.timeSlot}</div>
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-3.5">
                    <div className="text-slate-600 max-w-xs truncate">
                      {appt.reason || 'General Health Consultation'}
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-3.5">
                    <select
                      value={appt.status}
                      onChange={(e) => onUpdateStatus(appt.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition ${
                        appt.status === 'IN_CONSULTATION'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : appt.status === 'WAITING'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : appt.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-sky-50 text-sky-800 border-sky-300'
                      }`}
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="WAITING">WAITING</option>
                      <option value="IN_CONSULTATION">IN CONSULTATION</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  {/* Actions & WhatsApp Reminder */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSendWhatsApp(appt.id)}
                        title="Simulate / Log WhatsApp confirmation"
                        className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-semibold text-xs transition flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Log Alert
                      </button>

                      <button
                        onClick={() => onDirectWhatsApp(appt.id)}
                        title="Open WhatsApp Web directly with pre-composed reminder"
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-xs transition flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                        wa.me
                      </button>
                    </div>
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
