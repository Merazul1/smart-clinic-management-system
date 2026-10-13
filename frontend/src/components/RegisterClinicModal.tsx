import React, { useState } from 'react';
import { X, Building2, Shield, Check, Sparkles } from 'lucide-react';

interface RegisterClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const RegisterClinicModal: React.FC<RegisterClinicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    clinicName: '',
    adminName: '',
    email: '',
    password: 'Clinic@123',
    phone: '',
    address: '',
    subscriptionPlan: 'PRO',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clinicName || !formData.email || !formData.adminName) {
      alert('Please fill all required clinic registration fields.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Subscribe New Clinic Tenant</h3>
              <p className="text-xs text-slate-500">Instant multi-tenant onboarding for clinics & doctors</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital Name *</label>
            <input
              type="text"
              placeholder="e.g. Metro Care Multi-Specialty Clinic"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Admin Name *</label>
              <input
                type="text"
                placeholder="Dr. / Mr. Name"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Phone *</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Login Email *</label>
              <input
                type="email"
                placeholder="admin@metrocare.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Clinic Address</label>
            <input
              type="text"
              placeholder="Medical Enclave, Suite 300"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Subscription Tier Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subscription Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'STARTER', label: 'Starter', price: '₹3,999/mo' },
                { id: 'PRO', label: 'Pro', price: '₹7,999/mo' },
                { id: 'ENTERPRISE', label: 'Enterprise', price: '₹14,999/mo' },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setFormData({ ...formData, subscriptionPlan: tier.id })}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    formData.subscriptionPlan === tier.id
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{tier.label}</div>
                  <div className="text-[10px] text-slate-500">{tier.price}</div>
                </button>
              ))}
            </div>
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
              Subscribe & Launch Clinic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
