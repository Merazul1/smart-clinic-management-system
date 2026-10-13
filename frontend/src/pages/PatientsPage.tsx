import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Calendar,
  X,
  CreditCard,
  Droplet,
} from 'lucide-react';
import { Patient, PatientVital } from '../types';

interface PatientsPageProps {
  patients: Patient[];
  onOpenNewPatient: () => void;
  onSelectPatient: (patient: Patient) => void;
  onAddVitals: (patientId: string, vitals: any) => void;
  onBookAppointmentForPatient: (patient: Patient) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  patients,
  onOpenNewPatient,
  onSelectPatient,
  onAddVitals,
  onBookAppointmentForPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientForVitals, setSelectedPatientForVitals] = useState<Patient | null>(null);
  const [vitalsForm, setVitalsForm] = useState({
    bpSystolic: '120',
    bpDiastolic: '80',
    heartRate: '72',
    temperature: '98.6',
    weight: '68',
    bloodSugar: '95',
    spo2: '98',
  });

  const filteredPatients = patients.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.phone.includes(s) ||
      p.patientIdNumber.toLowerCase().includes(s)
    );
  });

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForVitals) return;
    onAddVitals(selectedPatientForVitals.id, vitalsForm);
    setSelectedPatientForVitals(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Electronic Health Records (EHR) & Patient Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized patient demographics, vitals tracking, allergies, and clinical history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Name, Phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>

          <button
            onClick={onOpenNewPatient}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Patient
          </button>
        </div>
      </div>

      {/* Patient List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Patient ID & Name</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Age / Gender / Blood</th>
                <th className="px-5 py-3.5">Clinical Alerts & Allergies</th>
                <th className="px-5 py-3.5">Visits</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-teal-50/30 transition">
                  {/* Patient Name & ID */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className="font-bold text-sm text-slate-900 hover:text-teal-600 text-left"
                        >
                          {patient.name}
                        </button>
                        <p className="text-[11px] font-mono text-slate-400">{patient.patientIdNumber}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {patient.phone}
                      </div>
                      {patient.email && (
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-300" />
                          {patient.email}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Demographic */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-700">
                        {patient.age} yrs • {patient.gender}
                      </div>
                      {patient.bloodGroup && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                          <Droplet className="w-2.5 h-2.5 text-rose-500" /> {patient.bloodGroup}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Clinical Alerts */}
                  <td className="px-5 py-4">
                    <div className="space-y-1 max-w-xs">
                      {patient.allergies ? (
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] px-2 py-0.5 rounded-md font-medium border border-amber-200/60">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{patient.allergies}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No known allergies</span>
                      )}
                      {patient.chronicConditions && (
                        <p className="text-[11px] text-slate-500 truncate">
                          {patient.chronicConditions}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Total Visits */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-sm">
                      {patient._count?.appointments || 0}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1">visits</span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPatientForVitals(patient)}
                        title="Record Vitals"
                        className="px-2.5 py-1 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg font-semibold text-xs transition flex items-center gap-1"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Vitals
                      </button>

                      <button
                        onClick={() => onBookAppointmentForPatient(patient)}
                        title="Book Appointment"
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-xs transition flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book
                      </button>

                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-2.5 py-1 text-slate-700 hover:text-teal-700 font-semibold text-xs transition"
                      >
                        View EHR →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Vitals Modal */}
      {selectedPatientForVitals && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Record Vitals: {selectedPatientForVitals.name}
                </h3>
                <p className="text-xs text-slate-500">Triage and physiological monitoring</p>
              </div>
              <button
                onClick={() => setSelectedPatientForVitals(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVitalsSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    BP Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitalsForm.bpSystolic}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, bpSystolic: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    BP Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={vitalsForm.bpDiastolic}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, bpDiastolic: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={vitalsForm.heartRate}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temp (°F)
                  </label>
                  <input
                    type="text"
                    value={vitalsForm.temperature}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    value={vitalsForm.weight}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={vitalsForm.spo2}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, spo2: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={vitalsForm.bloodSugar}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, bloodSugar: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForVitals(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  Save Vitals to Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
