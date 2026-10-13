import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { OpdQueuePage } from './pages/OpdQueuePage';
import { PatientsPage } from './pages/PatientsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { BillingPage } from './pages/BillingPage';
import { RemindersPage } from './pages/RemindersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { PatientDetailsModal } from './components/PatientDetailsModal';
import { NewPatientModal } from './components/NewPatientModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { RegisterClinicModal } from './components/RegisterClinicModal';

import { User, Patient, Appointment, DoctorProfile, Prescription, Invoice, Reminder, Clinic } from './types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data Collections
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [opdQueue, setOpdQueue] = useState<any>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [superAdminData, setSuperAdminData] = useState<any>(null);

  // Modal States
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isRegisterClinicOpen, setIsRegisterClinicOpen] = useState(false);
  const [selectedPatientForEhr, setSelectedPatientForEhr] = useState<Patient | null>(null);
  const [activeAppointmentForRx, setActiveAppointmentForRx] = useState<Appointment | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Load: check session or auto-login with default demo Clinic Admin
  useEffect(() => {
    const initAuth = async () => {
      try {
        const me = await api.getMe();
        setCurrentUser(me.user);
      } catch (e) {
        // Fallback to instant demo login so app is instantly ready for client review!
        try {
          const demoRes = await api.demoLogin('CLINIC_ADMIN', 'apex-clinic');
          setCurrentUser(demoRes.user);
        } catch (err) {
          console.error('Demo login error:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Fetch all clinical data whenever user changes
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      const [
        patientsRes,
        appointmentsRes,
        queueRes,
        doctorsRes,
        prescriptionsRes,
        invoicesRes,
        remindersRes,
        metricsRes,
      ] = await Promise.all([
        api.getPatients(),
        api.getAppointments(),
        api.getOpdQueue(),
        api.getDoctors(),
        api.getPrescriptions(),
        api.getInvoices(),
        api.getReminders(),
        api.getReportsMetrics(),
      ]);

      setPatients(patientsRes);
      setAppointments(appointmentsRes);
      setOpdQueue(queueRes);
      setDoctors(doctorsRes);
      setPrescriptions(prescriptionsRes);
      setInvoices(invoicesRes);
      setReminders(remindersRes);
      setMetrics(metricsRes);

      if (currentUser.role === 'SUPERADMIN') {
        const saRes = await api.getSuperAdminOverview();
        setSuperAdminData(saRes);
      }
    } catch (err) {
      console.error('Failed to load clinic data:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  // Demo Switcher handler
  const handleDemoSwitch = async (role: string) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(role, 'apex-clinic');
      setCurrentUser(res.user);
      showToast(`Switched active view to ${role.replace('_', ' ')}`);
    } catch (err) {
      alert('Failed to switch demo role');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.clearToken();
    handleDemoSwitch('CLINIC_ADMIN');
  };

  // Action Handlers
  const handleCreatePatient = async (data: any) => {
    try {
      const newPat = await api.createPatient(data);
      showToast(`Patient ${newPat.name} registered with ID ${newPat.patientIdNumber}`);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to create patient');
    }
  };

  const handleAddVitals = async (patientId: string, vitals: any) => {
    try {
      await api.addPatientVitals(patientId, vitals);
      showToast('Patient vital signs successfully updated in chart');
      refreshData();
      if (selectedPatientForEhr && selectedPatientForEhr.id === patientId) {
        const updatedPat = await api.getPatient(patientId);
        setSelectedPatientForEhr(updatedPat);
      }
    } catch (err: any) {
      alert('Failed to record vitals');
    }
  };

  const handleCreateAppointment = async (data: any) => {
    try {
      const res = await api.createAppointment(data);
      showToast(
        `Appointment booked! Token #${res.appointment.tokenNumber} issued. WhatsApp notification sent.`
      );
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to book appointment');
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointmentStatus(id, status);
      showToast(`Appointment status updated to ${status}`);
      refreshData();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleCallPatient = (appointmentId: string) => {
    handleUpdateAppointmentStatus(appointmentId, 'IN_CONSULTATION');
  };

  const handleCreatePrescription = async (data: any) => {
    try {
      await api.createPrescription(data);
      showToast('E-Prescription generated & dispatched to patient via WhatsApp');
      setActiveAppointmentForRx(null);
      refreshData();
      setCurrentTab('prescriptions');
    } catch (err: any) {
      alert(err.message || 'Failed to create prescription');
    }
  };

  const handleCreateInvoice = async (data: any) => {
    try {
      const res = await api.createInvoice(data);
      showToast(`Invoice #${res.invoice.invoiceNumber} generated & receipt issued.`);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  const handleRecordPayment = async (invoiceId: string, paymentData: any) => {
    try {
      await api.recordPayment(invoiceId, paymentData);
      showToast('Payment received & invoice reconciled');
      refreshData();
    } catch (err: any) {
      alert('Failed to record payment');
    }
  };

  const handleSendManualReminder = async (data: any) => {
    try {
      const res = await api.sendReminder(data);
      showToast(`Reminder dispatched via ${data.channel} to patient phone.`);
      refreshData();
    } catch (err: any) {
      alert('Failed to dispatch reminder');
    }
  };

  const handleDirectWhatsApp = async (appointmentId: string) => {
    try {
      const res = await api.getWhatsAppLink(appointmentId);
      if (res.url) {
        window.open(res.url, '_blank');
      }
    } catch (err) {
      alert('Failed to generate WhatsApp link');
    }
  };

  const handleUpdateClinicProfile = async (data: any) => {
    try {
      await api.updateClinicProfile(data);
      showToast('Clinic profile settings saved successfully');
      refreshData();
    } catch (err) {
      alert('Failed to update clinic');
    }
  };

  const handleUpdatePlan = async (plan: string) => {
    try {
      await api.updateSubscription(plan);
      showToast(`Subscription plan updated to ${plan}!`);
      refreshData();
    } catch (err) {
      alert('Failed to update plan');
    }
  };

  const handleRegisterClinic = async (data: any) => {
    try {
      const res = await api.registerClinic(data);
      setCurrentUser(res.user);
      showToast(`Clinic "${res.clinic.name}" subscribed & workspace ready!`);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to register clinic');
    }
  };

  const handleExportCsv = (type: 'invoices' | 'patients') => {
    const token = localStorage.getItem('curapulse_token');
    const url = `/api/reports/export?type=${type}&token=${token}`;
    window.open(url, '_blank');
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
        <h2 className="text-base font-bold text-slate-800">Initializing CuraPulse Smart Clinic...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting multi-tenant database & medical records</p>
      </div>
    );
  }

  const activeClinic = currentUser?.clinic;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        user={currentUser}
        onDemoSwitch={handleDemoSwitch}
        onLogout={handleLogout}
        onOpenRegisterClinic={() => setIsRegisterClinicOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser?.role}
          waitingCount={opdQueue?.waiting?.length || 0}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardPage
              metrics={metrics}
              opdQueue={opdQueue}
              clinic={activeClinic}
              onNavigate={setCurrentTab}
              onCallPatient={handleCallPatient}
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
              onOpenNewPatient={() => setIsNewPatientOpen(true)}
              onOpenNewInvoice={() => setCurrentTab('billing')}
            />
          )}

          {currentTab === 'opd-queue' && (
            <OpdQueuePage
              queueData={opdQueue}
              doctors={doctors}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onSendWhatsAppAlert={handleDirectWhatsApp}
              onOpenRxForAppointment={(appt) => {
                setActiveAppointmentForRx(appt);
                setCurrentTab('prescriptions');
              }}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsPage
              patients={patients}
              onOpenNewPatient={() => setIsNewPatientOpen(true)}
              onSelectPatient={(p) => setSelectedPatientForEhr(p)}
              onAddVitals={handleAddVitals}
              onBookAppointmentForPatient={(p) => {
                setSelectedPatientForEhr(null);
                setIsNewAppointmentOpen(true);
              }}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              doctors={doctors}
              onOpenBookAppointment={() => setIsNewAppointmentOpen(true)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onSendWhatsApp={(id) => handleSendManualReminder({ appointmentId: id, channel: 'WHATSAPP', templateType: 'CONFIRMATION' })}
              onDirectWhatsApp={handleDirectWhatsApp}
            />
          )}

          {currentTab === 'prescriptions' && (
            <PrescriptionsPage
              prescriptions={prescriptions}
              patients={patients}
              doctors={doctors}
              clinic={activeClinic}
              activeAppointmentForRx={activeAppointmentForRx}
              onCreatePrescription={handleCreatePrescription}
            />
          )}

          {currentTab === 'billing' && (
            <BillingPage
              invoices={invoices}
              patients={patients}
              clinic={activeClinic}
              onCreateInvoice={handleCreateInvoice}
              onRecordPayment={handleRecordPayment}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersPage
              reminders={reminders}
              patients={patients}
              appointments={appointments}
              clinic={activeClinic}
              onSendManualReminder={handleSendManualReminder}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage
              metrics={metrics}
              clinic={activeClinic}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              clinic={activeClinic}
              currentUser={currentUser}
              superAdminData={superAdminData}
              onUpdateClinic={handleUpdateClinicProfile}
              onUpdatePlan={handleUpdatePlan}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewPatientModal
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
        onSubmit={handleCreatePatient}
      />

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        patients={patients}
        doctors={doctors}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSubmit={handleCreateAppointment}
      />

      <RegisterClinicModal
        isOpen={isRegisterClinicOpen}
        onClose={() => setIsRegisterClinicOpen(false)}
        onSubmit={handleRegisterClinic}
      />

      <PatientDetailsModal
        patient={selectedPatientForEhr}
        onClose={() => setSelectedPatientForEhr(null)}
        onWriteRx={(p) => {
          setSelectedPatientForEhr(null);
          setCurrentTab('prescriptions');
        }}
        onCreateInvoice={(p) => {
          setSelectedPatientForEhr(null);
          setCurrentTab('billing');
        }}
      />

    </div>
  );
}
