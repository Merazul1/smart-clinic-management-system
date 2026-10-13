import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Heart,
  Activity,
  FileSignature,
  Receipt,
  Calendar,
  Clock,
  Droplet,
} from 'lucide-react';
import { Patient, Prescription, Invoice } from '../types';

interface PatientDetailsModalProps {
  patient: Patient | null;
  onClose: () => void;
  onWriteRx: (patient: Patient) => void;
  onCreateInvoice: (patient: Patient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  onClose,
  onWriteRx,
  onCreateInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'prescriptions' | 'invoices' | 'appointments'>('vitals');

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with Patient Summary */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <span className="font-mono text-xs bg-slate-800 text-teal-400 px-2.5 py-1 rounded-md border border-slate-700">
                  {patient.patientIdNumber}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                {patient.age} years • {patient.gender} • Blood Group: <strong className="text-white">{patient.bloodGroup || 'Not Tested'}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-400" /> {patient.phone}
                </span>
                {patient.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-teal-400" /> {patient.email}
                  </span>
                )}
                {patient.emergencyContact && (
                  <span className="text-rose-300">
                    Emergency: {patient.emergencyContact}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onWriteRx(patient)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1"
            >
              <FileSignature className="w-3.5 h-3.5" />
              Write Rx
            </button>
            <button
              onClick={() => onCreateInvoice(patient)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1"
            >
              <Receipt className="w-3.5 h-3.5" />
              Bill
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Warning Bar */}
        {(patient.allergies || patient.chronicConditions) && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center gap-4 text-xs">
            {patient.allergies && (
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Allergies: <span className="font-normal">{patient.allergies}</span></span>
              </div>
            )}
            {patient.chronicConditions && (
              <div className="text-slate-700 font-semibold">
                Conditions: <span className="font-normal">{patient.chronicConditions}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'vitals'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            Vitals & Triage ({patient.vitals?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'prescriptions'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            Prescriptions History ({patient.prescriptions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Bills & Receipts ({patient.invoices?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-3 px-4 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Visits Log ({patient.appointments?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              {patient.vitals && patient.vitals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {patient.vitals.map((v) => (
                    <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="font-semibold text-slate-500">
                          {new Date(v.recordedAt).toLocaleString()}
                        </span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                          Recorded
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                          <span className="font-bold text-slate-800">{v.bpSystolic}/{v.bpDiastolic} mmHg</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Pulse</span>
                          <span className="font-bold text-slate-800">{v.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Temperature</span>
                          <span className="font-bold text-slate-800">{v.temperature}°F</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Weight</span>
                          <span className="font-bold text-slate-800">{v.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Blood Sugar</span>
                          <span className="font-bold text-slate-800">{v.bloodSugar} mg/dL</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">SpO2</span>
                          <span className="font-bold text-slate-800">{v.spo2}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-400 text-xs">No vitals recorded yet.</p>
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {patient.prescriptions && patient.prescriptions.length > 0 ? (
                patient.prescriptions.map((rx) => (
                  <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-3">
                    <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Diagnosis: {rx.diagnosis}</h4>
                        <p className="text-[11px] text-slate-500">
                          By Dr. {rx.doctor.user?.name} on {new Date(rx.prescriptionDate).toLocaleDateString()}
                        </p>
                      </div>
                      {rx.followUpDate && (
                        <span className="text-[11px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-semibold">
                          Follow-up: {rx.followUpDate}
                        </span>
                      )}
                    </div>

                    {/* Medications Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="p-2">Medicine</th>
                            <th className="p-2">Dosage</th>
                            <th className="p-2">Frequency</th>
                            <th className="p-2">Timing</th>
                            <th className="p-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rx.items?.map((item, i) => (
                            <tr key={i}>
                              <td className="p-2 font-semibold text-slate-800">{item.medicineName}</td>
                              <td className="p-2 text-slate-600">{item.dosage}</td>
                              <td className="p-2 font-mono text-teal-700">{item.frequency}</td>
                              <td className="p-2 text-slate-600">{item.timing.replace('_', ' ')}</td>
                              <td className="p-2 text-slate-600">{item.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {rx.advice && (
                      <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                        <strong>Doctor Advice:</strong> {rx.advice}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 text-xs">No previous prescriptions found.</p>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {patient.invoices && patient.invoices.length > 0 ? (
                patient.invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Date: {new Date(inv.date).toLocaleDateString()} • Method: {inv.paymentMethod}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">Total: ₹{inv.total}</p>
                      <p className="text-[11px] text-slate-500">
                        Paid: ₹{inv.paidAmount} | Balance: ₹{inv.balance}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 text-xs">No invoices found for this patient.</p>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-3">
              {patient.appointments && patient.appointments.length > 0 ? (
                patient.appointments.map((appt) => (
                  <div key={appt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{appt.appointmentDate} at {appt.timeSlot}</p>
                      <p className="text-[11px] text-slate-500">Dr. {appt.doctor?.user?.name} (Token #{appt.tokenNumber})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px]">
                      {appt.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 text-xs">No previous appointments logged.</p>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
