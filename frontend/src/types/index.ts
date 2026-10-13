export interface Clinic {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  country?: string;
  currency: string;
  taxRate: number;
  logo?: string;
  subscriptionPlan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
  phone?: string;
  avatar?: string;
  clinic?: Clinic;
  doctorProfile?: DoctorProfile;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  clinicId: string;
  specialization: string;
  qualifications: string;
  licenseNumber: string;
  consultationFee: number;
  roomNumber?: string;
  bio?: string;
  scheduleDays: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  _count?: {
    appointments?: number;
    prescriptions?: number;
  };
}

export interface PatientVital {
  id: string;
  patientId: string;
  recordedAt: string;
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bloodSugar?: number;
  spo2?: number;
  notes?: string;
}

export interface Patient {
  id: string;
  clinicId: string;
  patientIdNumber: string;
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  chronicConditions?: string;
  medicalNotes?: string;
  createdAt: string;
  vitals?: PatientVital[];
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  invoices?: Invoice[];
  _count?: {
    appointments: number;
    prescriptions: number;
    invoices: number;
  };
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: DoctorProfile;
  appointmentDate: string;
  timeSlot: string;
  tokenNumber: number;
  type: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  clinicId: string;
  appointmentId?: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  doctor: DoctorProfile;
  prescriptionDate: string;
  diagnosis: string;
  symptoms?: string;
  clinicalNotes?: string;
  advice?: string;
  followUpDate?: string;
  items: PrescriptionItem[];
  createdAt: string;
  clinic?: Clinic;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  clinicId: string;
  patientId: string;
  patient: Patient;
  appointmentId?: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED';
  paymentMethod: string;
  notes?: string;
  items: InvoiceItem[];
  clinic?: Clinic;
}

export interface Reminder {
  id: string;
  clinicId: string;
  patientId: string;
  patient: Patient;
  appointmentId?: string;
  appointment?: Appointment;
  channel: 'WHATSAPP' | 'SMS';
  templateType: string;
  recipientPhone: string;
  messageBody: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
}
