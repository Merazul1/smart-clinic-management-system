import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Printer,
  Trash2,
  Stethoscope,
  Calendar,
  CheckCircle2,
  X,
  Share2,
  Download,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Prescription, Patient, DoctorProfile, Clinic, PrescriptionItem } from '../types';

interface PrescriptionsPageProps {
  prescriptions: Prescription[];
  patients: Patient[];
  doctors: DoctorProfile[];
  clinic?: Clinic;
  activeAppointmentForRx?: any;
  onCreatePrescription: (data: any) => void;
}

const COMMON_DRUGS = [
  { name: 'Paracetamol 650mg (Dolo 650)', dosage: '1 Tablet', freq: '1-0-1', timing: 'AFTER_FOOD', dur: '3 days' },
  { name: 'Pantoprazole 40mg (Pan 40)', dosage: '1 Tablet', freq: '1-0-0', timing: 'BEFORE_FOOD', dur: '7 days' },
  { name: 'Amoxicillin + Clavulanate 625mg (Augmentin)', dosage: '1 Tablet', freq: '1-0-1', timing: 'AFTER_FOOD', dur: '5 days' },
  { name: 'Azithromycin 500mg (Azee 500)', dosage: '1 Tablet', freq: '1-0-0', timing: 'AFTER_FOOD', dur: '3 days' },
  { name: 'Telmisartan 40mg (Telma 40)', dosage: '1 Tablet', freq: '1-0-0', timing: 'AFTER_FOOD', dur: '30 days' },
  { name: 'Metformin 500mg (Glycomet 500)', dosage: '1 Tablet', freq: '1-0-1', timing: 'WITH_FOOD', dur: '30 days' },
  { name: 'Cetirizine 10mg (Cetzine)', dosage: '1 Tablet', freq: '0-0-1', timing: 'AFTER_FOOD', dur: '5 days' },
];

export const PrescriptionsPage: React.FC<PrescriptionsPageProps> = ({
  prescriptions,
  patients,
  doctors,
  clinic,
  activeAppointmentForRx,
  onCreatePrescription,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);

  // Form State
  const [patientId, setPatientId] = useState(activeAppointmentForRx?.patientId || '');
  const [doctorId, setDoctorId] = useState(activeAppointmentForRx?.doctorId || (doctors[0]?.id || ''));
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicineName: '', dosage: '1 Tablet', frequency: '1-0-1', timing: 'AFTER_FOOD', duration: '5 days', instructions: '' },
  ]);

  const handleAddItem = (preset?: any) => {
    if (preset) {
      setItems([
        ...items,
        {
          medicineName: preset.name,
          dosage: preset.dosage,
          frequency: preset.freq,
          timing: preset.timing,
          duration: preset.dur,
          instructions: '',
        },
      ]);
    } else {
      setItems([
        ...items,
        { medicineName: '', dosage: '1 Tablet', frequency: '1-0-1', timing: 'AFTER_FOOD', duration: '5 days', instructions: '' },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !diagnosis) {
      alert('Please select a patient and enter a diagnosis.');
      return;
    }

    const payload = {
      appointmentId: activeAppointmentForRx?.id || undefined,
      patientId,
      doctorId,
      diagnosis,
      symptoms,
      clinicalNotes,
      advice,
      followUpDate,
      items: items.filter((it) => it.medicineName.trim() !== ''),
      sendNotification: true,
    };

    onCreatePrescription(payload);
    setIsCreating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-teal-600" />
            Digital E-Prescription Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue standardized digital prescriptions with drug dosages, timings, and printable clinic headers
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Write Prescription
        </button>
      </div>

      {/* Creation Drawer / Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">New Clinical E-Prescription</h3>
                  <p className="text-xs text-slate-500">Record diagnosis, clinical findings, and medication regimen</p>
                </div>
              </div>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              {/* Patient & Doctor Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient *</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientIdNumber} - {p.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attending Doctor *</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.user?.name} - {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Diagnosis *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential Hypertension, Acute Bronchitis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Hypertension', 'Type 2 Diabetes', 'Acute Bronchitis', 'GERD', 'Viral Fever'].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setDiagnosis(tag)}
                        className="text-[10px] bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-800 px-2 py-0.5 rounded-md transition"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Symptoms / Complaints</label>
                  <input
                    type="text"
                    placeholder="e.g. Dry cough x 4 days, mild fever in evenings"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Quick Drug Autofill Chips */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Quick Add Common Drugs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_DRUGS.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddItem(d)}
                      className="text-[11px] bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-700 px-2.5 py-1 rounded-lg transition"
                    >
                      + {d.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Medicine Items Table */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Medications & Dosage Regimen
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine Row
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Medicine name & strength"
                          value={item.medicineName}
                          onChange={(e) => handleUpdateItem(idx, 'medicineName', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Dosage (1 tab)"
                          value={item.dosage}
                          onChange={(e) => handleUpdateItem(idx, 'dosage', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <select
                          value={item.frequency}
                          onChange={(e) => handleUpdateItem(idx, 'frequency', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="1-0-1">1-0-1 (Bid)</option>
                          <option value="1-0-0">1-0-0 (Morning)</option>
                          <option value="0-0-1">0-0-1 (Night)</option>
                          <option value="1-1-1">1-1-1 (Tds)</option>
                          <option value="Once weekly">Once Weekly</option>
                          <option value="SOS">SOS (As needed)</option>
                        </select>
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <select
                          value={item.timing}
                          onChange={(e) => handleUpdateItem(idx, 'timing', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="AFTER_FOOD">After Food</option>
                          <option value="BEFORE_FOOD">Before Food</option>
                          <option value="WITH_FOOD">With Food</option>
                        </select>
                      </div>
                      <div className="col-span-10 sm:col-span-1">
                        <input
                          type="text"
                          placeholder="5 days"
                          value={item.duration}
                          onChange={(e) => handleUpdateItem(idx, 'duration', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length === 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Advice / Diet / Precautions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Drink plenty of warm fluids, reduce salt, avoid heavy lifting."
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
                >
                  Save & Notify Patient via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescriptions List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Date & Patient</th>
                <th className="px-5 py-3.5">Doctor</th>
                <th className="px-5 py-3.5">Diagnosis</th>
                <th className="px-5 py-3.5">Medicines Prescribed</th>
                <th className="px-5 py-3.5">Follow-up</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{rx.patient?.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(rx.prescriptionDate).toLocaleDateString()} • {rx.patient?.patientIdNumber}
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">Dr. {rx.doctor?.user?.name}</div>
                    <div className="text-[11px] text-teal-600">{rx.doctor?.specialization}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900 bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md">
                      {rx.diagnosis}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="text-slate-600 font-medium">
                      {rx.items?.length || 0} drugs
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {rx.items?.map((i) => i.medicineName.split(' ')[0]).join(', ')}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-500 font-medium">
                    {rx.followUpDate || 'As needed'}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedRxForPrint(rx)}
                      className="px-3 py-1 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View & Print Rx
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable / PDF Prescription Viewer Modal */}
      {selectedRxForPrint && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 my-6 relative">
            
            {/* Top Toolbar (Non-printable) */}
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Clinical Letterhead View
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setSelectedRxForPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div id="printable-document" className="text-slate-900 font-sans text-xs space-y-6">
              
              {/* Clinic Header */}
              <div className="border-b-2 border-teal-700 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-teal-800 tracking-tight">
                    {clinic?.name || 'Apex Multi-Specialty Clinic & Diagnostics'}
                  </h2>
                  <p className="text-slate-600 text-xs mt-0.5">{clinic?.address || 'Metro Health Tower, MG Road, Bengaluru'}</p>
                  <p className="text-slate-500 text-[11px]">
                    Phone: {clinic?.phone || '+91 9820123456'} • Email: {clinic?.email || 'contact@apexclinic.com'}
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="text-sm font-bold text-slate-900">Dr. {selectedRxForPrint.doctor?.user?.name}</h3>
                  <p className="text-teal-700 font-medium text-[11px]">{selectedRxForPrint.doctor?.qualifications}</p>
                  <p className="text-slate-500 text-[10px]">Reg No: {selectedRxForPrint.doctor?.licenseNumber}</p>
                  <p className="text-slate-500 text-[10px]">{selectedRxForPrint.doctor?.specialization}</p>
                </div>
              </div>

              {/* Patient Meta Strip */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedRxForPrint.patient?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                  <span className="font-semibold text-slate-800">{selectedRxForPrint.patient?.age}y / {selectedRxForPrint.patient?.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient ID</span>
                  <span className="font-mono text-slate-700">{selectedRxForPrint.patient?.patientIdNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedRxForPrint.prescriptionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Clinical Diagnosis
                </span>
                <p className="font-bold text-sm text-slate-900">{selectedRxForPrint.diagnosis}</p>
                {selectedRxForPrint.symptoms && (
                  <p className="text-slate-600 text-xs mt-1">
                    <strong>Chief Complaints:</strong> {selectedRxForPrint.symptoms}
                  </p>
                )}
              </div>

              {/* Rx Medications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif italic font-black text-2xl text-teal-800">℞</span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Prescribed Medications
                  </span>
                </div>

                <table className="w-full border-collapse border border-slate-200 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold">
                      <th className="border border-slate-200 p-2 text-left">#</th>
                      <th className="border border-slate-200 p-2 text-left">Medicine & Strength</th>
                      <th className="border border-slate-200 p-2 text-left">Dosage</th>
                      <th className="border border-slate-200 p-2 text-left">Frequency</th>
                      <th className="border border-slate-200 p-2 text-left">Timing</th>
                      <th className="border border-slate-200 p-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRxForPrint.items?.map((item, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="border border-slate-200 p-2 font-mono">{i + 1}</td>
                        <td className="border border-slate-200 p-2 font-bold text-slate-900">
                          {item.medicineName}
                          {item.instructions && (
                            <span className="block text-[10px] font-normal text-slate-500 italic">
                              * {item.instructions}
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-200 p-2">{item.dosage}</td>
                        <td className="border border-slate-200 p-2 font-bold text-teal-700">{item.frequency}</td>
                        <td className="border border-slate-200 p-2">{item.timing.replace('_', ' ')}</td>
                        <td className="border border-slate-200 p-2">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice & Follow-up */}
              <div className="pt-2 space-y-2">
                {selectedRxForPrint.advice && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-800">Advice / Diet: </strong>
                    <span className="text-slate-700">{selectedRxForPrint.advice}</span>
                  </div>
                )}
                {selectedRxForPrint.followUpDate && (
                  <p className="text-slate-700 font-semibold">
                    📅 Next Review / Follow-up: <u>{selectedRxForPrint.followUpDate}</u>
                  </p>
                )}
              </div>

              {/* Doctor Signature Block */}
              <div className="pt-12 flex justify-between items-end border-t border-slate-200">
                <p className="text-[10px] text-slate-400">
                  Generated digitally via CuraPulse Smart Clinic Platform • Valid without physical stamp
                </p>
                <div className="text-right">
                  <div className="font-serif italic text-sm text-teal-800 mb-1">
                    Dr. {selectedRxForPrint.doctor?.user?.name}
                  </div>
                  <div className="w-48 border-t border-slate-400 pt-1 text-slate-600 text-[11px] font-bold">
                    Signature & Registration Stamp
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
