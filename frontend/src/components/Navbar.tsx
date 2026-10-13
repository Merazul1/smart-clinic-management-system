import React from 'react';
import { Activity, Shield, User as UserIcon, Building2, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onDemoSwitch: (role: string) => void;
  onLogout: () => void;
  onOpenRegisterClinic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onDemoSwitch,
  onLogout,
  onOpenRegisterClinic,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Clinic Information */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">CuraPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Smart Clinic SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {user?.clinic ? (
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Building2 className="w-3 h-3 text-teal-600 inline" />
                    {user.clinic.name}
                    <span className="text-[10px] text-teal-600 bg-teal-50 px-1.5 rounded font-normal">
                      {user.clinic.subscriptionPlan} Plan
                    </span>
                  </span>
                ) : (
                  'Platform Super-Administrator Mode'
                )}
              </p>
            </div>
          </div>

          {/* Quick Demo Switcher (Instant Impersonation) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Switch:
            </span>
            <button
              onClick={() => onDemoSwitch('CLINIC_ADMIN')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                user?.role === 'CLINIC_ADMIN'
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clinic Admin
            </button>
            <button
              onClick={() => onDemoSwitch('DOCTOR')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                user?.role === 'DOCTOR'
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor (Cardio)
            </button>
            <button
              onClick={() => onDemoSwitch('RECEPTIONIST')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                user?.role === 'RECEPTIONIST'
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Receptionist
            </button>
            <button
              onClick={() => onDemoSwitch('SUPERADMIN')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                user?.role === 'SUPERADMIN'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SuperAdmin
            </button>
          </div>

          {/* User info & CTA */}
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/Merazul1"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub: Merazul1"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <button
              onClick={onOpenRegisterClinic}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              Subscribe New Clinic
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-800 leading-tight">{user?.name}</div>
                <div className="text-[10px] text-teal-600 font-medium uppercase tracking-wide">
                  {user?.role.replace('_', ' ')}
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
