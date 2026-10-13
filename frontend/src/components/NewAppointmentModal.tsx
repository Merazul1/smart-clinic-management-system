import React, { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope, MessageSquare } from 'lucide-react';
import { Patient, DoctorProfile } from '../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  patients: Patient[];
  doctors: DoctorProfile[];
  initialPatient?: Patient | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DEFAULT_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  patients,
  doctors,
  initialPatient,
  onClose,
  onSubmit,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [patientId, setPatientId] = useState(initialPatient?.id || (patients[0]?.id || ''));
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState(DEFAULT_SLOTS[2]);
  const [type, setType] = useState('IN_PERSON');
  const [reason, setReason] = useState('');
  const [sendNotification, setSendNotification] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) {
      alert('Patient and Doctor are required.');
      return;
    }

    onSubmit({
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      type,
      reason,
      sendNotification,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Book Appointment & Issue Token</h3>
              <p className="text-xs text-slate-500">Assign doctor slot and auto-generate token</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Patient */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              required
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientIdNumber} • {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Doctor *</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.user?.name} - {d.specialization} (Fee: ₹{d.consultationFee})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              >
                {DEFAULT_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Visit Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['IN_PERSON', 'FOLLOW_UP', 'EMERGENCY'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-2 rounded-xl font-semibold border text-center transition ${
                    type === t ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason / Symptoms</label>
            <input
              type="text"
              placeholder="e.g. Chest discomfort, follow up on BP"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          {/* WhatsApp toggle */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-800">Send WhatsApp Reminder</p>
                <p className="text-[10px] text-slate-500">Auto sends booking confirmation + Token #</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendNotification}
              onChange={(e) => setSendNotification(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
            >
              Confirm Booking & Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
