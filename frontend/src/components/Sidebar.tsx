import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Users,
  Calendar,
  FileSignature,
  Receipt,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole?: string;
  waitingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  waitingCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'opd-queue',
      label: 'Live OPD Queue',
      icon: Clock,
      badge: waitingCount > 0 ? `${waitingCount} waiting` : undefined,
    },
    { id: 'patients', label: 'Patients & EHR', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'E-Prescriptions', icon: FileSignature },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'reminders', label: 'WhatsApp & SMS', icon: MessageSquare },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Clinic & Subscription', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Clinical Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 mt-4">
        {/* Role Indicator Card */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-teal-800 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Active Role Access</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Logged in as <strong className="text-slate-700">{userRole}</strong>. HIPAA & multi-tenant scoped.
          </p>
        </div>

        {/* Developer Attribution Card */}
        <a
          href="https://github.com/Merazul1"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs transition group shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Lead Developer</span>
            <span className="text-[10px] text-slate-400 group-hover:text-teal-300">@Merazul1 →</span>
          </div>
          <p className="font-semibold text-slate-100 text-xs mt-0.5">Merazul Khan</p>
        </a>
      </div>
    </aside>
  );
};
