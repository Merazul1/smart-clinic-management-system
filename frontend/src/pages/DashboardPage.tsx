import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  CreditCard,
  PlusCircle,
  FileSignature,
  Receipt,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Send,
} from 'lucide-react';
import { Appointment, Clinic } from '../types';

interface DashboardPageProps {
  metrics: any;
  opdQueue: any;
  clinic?: Clinic;
  onNavigate: (tab: string) => void;
  onCallPatient: (appointmentId: string) => void;
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  onOpenNewInvoice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  opdQueue,
  clinic,
  onNavigate,
  onCallPatient,
  onOpenNewAppointment,
  onOpenNewPatient,
  onOpenNewInvoice,
}) => {
  const currency = clinic?.currency || '₹';
  const summary = metrics?.summary || {
    totalPatients: 0,
    todayAppointments: 0,
    waitingQueueCount: 0,
    totalRevenue: 0,
    pendingBalance: 0,
    totalBilled: 0,
  };

  const trends = metrics?.dailyTrends || [];
  const maxRevenue = Math.max(...trends.map((t: any) => t.revenue), 1000);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500/30 text-teal-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30">
                Clinic Operations Console
              </span>
              <span className="text-teal-300 text-xs">● Live OPD Connected</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back to {clinic?.name || 'Smart Clinic Platform'}
            </h1>
            <p className="text-teal-100 text-sm mt-1 max-w-xl">
              Manage patient triage, doctor electronic prescriptions, automated WhatsApp reminders, and multi-tenant billing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewAppointment}
              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
            <button
              onClick={onOpenNewPatient}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              Add Walk-in Patient
            </button>
            <button
              onClick={onOpenNewInvoice}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              Create Bill
            </button>
          </div>
        </div>

        {/* Abstract background decorative shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-400 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Patients</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.totalPatients}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-teal-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-teal-600" />
            <span>Active Electronic Health Records</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-400 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Visits</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.todayAppointments}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-sky-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>Scheduled & Walk-ins</span>
          </div>
        </div>

        {/* OPD Waiting Queue */}
        <div
          onClick={() => onNavigate('opd-queue')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-400 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lobby Waiting</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{summary.waitingQueueCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-700 font-medium">
            <span>Patients awaiting consultation</span>
          </div>
        </div>

        {/* Total Billed / Revenue */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-400 transition cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Revenue</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">
                {currency}{summary.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
            <span>Pending dues: {currency}{summary.pendingBalance.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: OPD Live Queue & Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live OPD Queue Spotlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Live OPD Waiting Board
              </h2>
              <p className="text-xs text-slate-500">Real-time token sequence for current clinic consultation session</p>
            </div>
            <button
              onClick={() => onNavigate('opd-queue')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Full Queue View <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Queue List */}
          <div className="space-y-3">
            {opdQueue?.all && opdQueue.all.length > 0 ? (
              opdQueue.all.slice(0, 5).map((appt: Appointment) => (
                <div
                  key={appt.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    appt.status === 'IN_CONSULTATION'
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20'
                      : appt.status === 'WAITING'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        appt.status === 'IN_CONSULTATION'
                          ? 'bg-emerald-600 text-white'
                          : appt.status === 'WAITING'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      #{appt.tokenNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{appt.patient.name}</span>
                        <span className="text-[11px] text-slate-500">
                          ({appt.patient.age}y, {appt.patient.gender})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Dr. {appt.doctor.user?.name}</span>
                        <span>•</span>
                        <span>{appt.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        appt.status === 'IN_CONSULTATION'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'WAITING'
                          ? 'bg-amber-100 text-amber-800'
                          : appt.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {appt.status.replace('_', ' ')}
                    </span>

                    {appt.status === 'WAITING' && (
                      <button
                        onClick={() => onCallPatient(appt.id)}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                      >
                        Call In
                      </button>
                    )}

                    {appt.status === 'IN_CONSULTATION' && (
                      <button
                        onClick={() => onNavigate('prescriptions')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        Write Rx
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No active appointments in queue for today yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 14-Day Revenue Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Revenue Inflow (14 Days)
                </h2>
                <p className="text-xs text-slate-500">Collected consultation & diagnostic receipts</p>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 border-b border-slate-100">
              {trends.map((day: any, idx: number) => {
                const heightPercent = Math.max(8, Math.round((day.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 hidden group-hover:flex bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                      {currency}{day.revenue} ({day.date.slice(5)})
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        idx === trends.length - 1
                          ? 'bg-teal-600 shadow-sm'
                          : 'bg-teal-200 hover:bg-teal-400'
                      }`}
                    />
                    <span className="text-[9px] text-slate-400">
                      {idx % 3 === 0 ? day.date.slice(8) : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400">Total Billed</p>
              <p className="font-bold text-slate-800">{currency}{summary.totalBilled.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400">Payment Modes</p>
              <p className="font-medium text-teal-700">UPI, Cash, Card, Ins.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
