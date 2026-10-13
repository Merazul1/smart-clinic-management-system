import React, { useState } from 'react';
import {
  Settings,
  Building2,
  CreditCard,
  Shield,
  Check,
  Sparkles,
  Users,
  Globe,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Clinic, User } from '../types';

interface SettingsPageProps {
  clinic?: Clinic;
  currentUser?: User | null;
  superAdminData?: any;
  onUpdateClinic: (data: any) => void;
  onUpdatePlan: (plan: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  clinic,
  currentUser,
  superAdminData,
  onUpdateClinic,
  onUpdatePlan,
}) => {
  const [formData, setFormData] = useState({
    name: clinic?.name || '',
    phone: clinic?.phone || '',
    email: clinic?.email || '',
    address: clinic?.address || '',
    currency: clinic?.currency || '₹',
    taxRate: clinic?.taxRate || 5.0,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClinic(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentPlan = clinic?.subscriptionPlan || 'PRO';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          Clinic Configuration & SaaS Subscription
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage practice profile branding, invoicing tax rates, and cloud tier subscription
        </p>
      </div>

      {/* Super Admin Platform Overview (if applicable) */}
      {currentUser?.role === 'SUPERADMIN' && superAdminData && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base">Super-Administrator Platform Metrics</h3>
                <p className="text-slate-400 text-xs">Global metrics across all clinic tenants subscribed to CuraPulse</p>
              </div>
            </div>
            <span className="text-xs bg-teal-900 text-teal-300 font-bold px-3 py-1 rounded-full border border-teal-700">
              Platform Master
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs uppercase font-semibold">Total Clinics</p>
              <h4 className="text-2xl font-bold text-white mt-1">
                {superAdminData.platformStats?.totalClinics || 2}
              </h4>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs uppercase font-semibold">Estimated MRR</p>
              <h4 className="text-2xl font-bold text-emerald-400 mt-1">
                ${superAdminData.platformStats?.estimatedMRR || 298}/mo
              </h4>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs uppercase font-semibold">Total Patients</p>
              <h4 className="text-2xl font-bold text-white mt-1">
                {superAdminData.platformStats?.totalPatients || 12}
              </h4>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs uppercase font-semibold">Total Appointments</p>
              <h4 className="text-2xl font-bold text-teal-400 mt-1">
                {superAdminData.platformStats?.totalAppointments || 18}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            SaaS Subscription Tier
          </h2>
          <p className="text-xs text-slate-500">
            Currently subscribed to <strong className="text-teal-700">{currentPlan} Plan</strong>. Billed monthly with zero setup fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Starter Plan */}
          <div className={`p-5 rounded-2xl border transition relative ${
            currentPlan === 'STARTER' ? 'border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <h3 className="font-bold text-slate-900 text-sm">Starter Plan</h3>
            <p className="text-slate-500 text-xs mt-0.5">For single-doctor practices</p>
            <div className="my-3">
              <span className="text-2xl font-black text-slate-900">₹3,999</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> 1 Doctor & 1 Receptionist</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Up to 500 Patients</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Standard Invoicing</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> SMS Appointment Alerts</li>
            </ul>
            <button
              onClick={() => onUpdatePlan('STARTER')}
              disabled={currentPlan === 'STARTER'}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                currentPlan === 'STARTER'
                  ? 'bg-teal-100 text-teal-800 cursor-default'
                  : 'bg-slate-900 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {currentPlan === 'STARTER' ? 'Current Active Plan' : 'Switch to Starter'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`p-5 rounded-2xl border transition relative ${
            currentPlan === 'PRO' ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500/30' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="absolute -top-2.5 right-4 bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Most Popular
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Professional Plan</h3>
            <p className="text-slate-500 text-xs mt-0.5">For busy clinics & polyclinics</p>
            <div className="my-3">
              <span className="text-2xl font-black text-slate-900">₹7,999</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Unlimited Doctors & Staff</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Unlimited Patients & EHR</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> WhatsApp Cloud Automation</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Digital E-Prescriptions PDF</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Live OPD Token Calling</li>
            </ul>
            <button
              onClick={() => onUpdatePlan('PRO')}
              disabled={currentPlan === 'PRO'}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                currentPlan === 'PRO'
                  ? 'bg-teal-600 text-white cursor-default'
                  : 'bg-slate-900 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {currentPlan === 'PRO' ? 'Current Active Plan' : 'Switch to Pro'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={`p-5 rounded-2xl border transition relative ${
            currentPlan === 'ENTERPRISE' ? 'border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <h3 className="font-bold text-slate-900 text-sm">Enterprise Multi-Branch</h3>
            <p className="text-slate-500 text-xs mt-0.5">Hospitals & clinic chains</p>
            <div className="my-3">
              <span className="text-2xl font-black text-slate-900">₹14,999</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Multi-Branch Architecture</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Dedicated SQL Server / DB</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Custom Domain & Whitelabel</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> 24/7 Priority Support SLA</li>
            </ul>
            <button
              onClick={() => onUpdatePlan('ENTERPRISE')}
              disabled={currentPlan === 'ENTERPRISE'}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                currentPlan === 'ENTERPRISE'
                  ? 'bg-teal-100 text-teal-800 cursor-default'
                  : 'bg-slate-900 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              {currentPlan === 'ENTERPRISE' ? 'Current Active Plan' : 'Switch to Enterprise'}
            </button>
          </div>

        </div>
      </div>

      {/* Clinic Profile Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          Clinic Details & Invoice Letterhead
        </h2>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
            ✓ Clinic details successfully updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Address & Suite</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="AED">AED (Dirham)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax / GST Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              Save Clinic Settings
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
