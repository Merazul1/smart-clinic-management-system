import React from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  CreditCard,
  Users,
  Stethoscope,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Clinic } from '../types';

interface ReportsPageProps {
  metrics: any;
  clinic?: Clinic;
  onExportCsv: (type: 'invoices' | 'patients') => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  metrics,
  clinic,
  onExportCsv,
}) => {
  const currency = clinic?.currency || '₹';
  const summary = metrics?.summary || {};
  const paymentMethods = metrics?.paymentMethods || {};
  const doctorPerformance = metrics?.doctorPerformance || [];
  const trends = metrics?.dailyTrends || [];

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Clinic Intelligence & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time practice performance, doctor productivity analytics, and CSV exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCsv('invoices')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-teal-400" />
            Export Invoices CSV
          </button>
          <button
            onClick={() => onExportCsv('patients')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Patients CSV
          </button>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Gross Billing</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{currency}{(summary.totalBilled || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Total revenue generated</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Collected Cashflow</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{currency}{(summary.totalRevenue || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 mt-1">Reconciled payments</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 uppercase">Total Dues</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">{currency}{(summary.pendingBalance || 0).toLocaleString()}</h3>
          <p className="text-[11px] text-rose-500 mt-1">Pending collection</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-teal-600 uppercase">Automations Triggered</p>
          <h3 className="text-2xl font-bold text-teal-700 mt-1">{summary.recentRemindersCount || 0}</h3>
          <p className="text-[11px] text-teal-600 mt-1">WhatsApp & SMS notices sent</p>
        </div>
      </div>

      {/* Doctor Performance & Productivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Doctor Productivity & Consultation Metrics
            </h3>
            <p className="text-xs text-slate-500">Patient turnaround and electronic prescription volume per clinician</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Doctor Name</th>
                <th className="px-5 py-3.5">Specialization</th>
                <th className="px-5 py-3.5">Fee Rate</th>
                <th className="px-5 py-3.5">Total Visits</th>
                <th className="px-5 py-3.5">Completed Consultations</th>
                <th className="px-5 py-3.5">Rx Issued</th>
                <th className="px-5 py-3.5 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorPerformance.map((doc: any) => {
                const rate = doc.totalAppointments > 0 ? Math.round((doc.completedConsultations / doc.totalAppointments) * 100) : 100;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">Dr. {doc.name}</td>
                    <td className="px-5 py-3.5 text-teal-700 font-medium">{doc.specialization}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{currency}{doc.consultationFee}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{doc.totalAppointments}</td>
                    <td className="px-5 py-3.5 text-emerald-700 font-bold">{doc.completedConsultations}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">{doc.prescriptionsIssued}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modes Distribution Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          Payment Channels Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-4">Reconciled funds by collection mode</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(paymentMethods).map(([method, amount]: [string, any]) => (
            <div key={method} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 text-xs font-semibold uppercase">{method}</span>
              <h4 className="text-lg font-bold text-slate-800 mt-1">{currency}{Number(amount).toLocaleString()}</h4>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
