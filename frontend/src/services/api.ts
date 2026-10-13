const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('curapulse_token');
  }

  public setToken(token: string) {
    localStorage.setItem('curapulse_token', token);
  }

  public clearToken() {
    localStorage.removeItem('curapulse_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/demo-login')) {
      this.clearToken();
      window.location.reload();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    // Check if response is json or blob
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async demoLogin(role: string, clinicSlug?: string) {
    const res = await this.request('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role, clinicSlug }),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async registerClinic(data: any) {
    const res = await this.request('/auth/register-clinic', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Patients
  async getPatients(search?: string) {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/patients${q}`);
  }

  async getPatient(id: string) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(data: any) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePatient(id: string, data: any) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addPatientVitals(patientId: string, vitals: any) {
    return this.request(`/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitals),
    });
  }

  // Appointments & OPD Queue
  async getAppointments(filters: { date?: string; doctorId?: string; status?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.status) params.append('status', filters.status);
    return this.request(`/appointments?${params.toString()}`);
  }

  async createAppointment(data: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointmentStatus(id: string, status: string, notes?: string) {
    return this.request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getOpdQueue(doctorId?: string) {
    const q = doctorId ? `?doctorId=${doctorId}` : '';
    return this.request(`/appointments/queue/today${q}`);
  }

  // Doctors
  async getDoctors() {
    return this.request('/doctors');
  }

  async createDoctor(data: any) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDoctor(id: string, data: any) {
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Prescriptions
  async getPrescriptions(filters: { patientId?: string; doctorId?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    return this.request(`/prescriptions?${params.toString()}`);
  }

  async getPrescription(id: string) {
    return this.request(`/prescriptions/${id}`);
  }

  async createPrescription(data: any) {
    return this.request('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Billing
  async getInvoices(filters: { status?: string; patientId?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.patientId) params.append('patientId', filters.patientId);
    return this.request(`/billing?${params.toString()}`);
  }

  async getInvoice(id: string) {
    return this.request(`/billing/${id}`);
  }

  async createInvoice(data: any) {
    return this.request('/billing', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recordPayment(invoiceId: string, data: { paymentAmount: number; paymentMethod: string }) {
    return this.request(`/billing/${invoiceId}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reminders
  async getReminders() {
    return this.request('/reminders');
  }

  async sendReminder(data: any) {
    return this.request('/reminders/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWhatsAppLink(appointmentId: string) {
    return this.request(`/reminders/whatsapp-link/${appointmentId}`);
  }

  // Reports
  async getReportsMetrics() {
    return this.request('/reports/metrics');
  }

  // Tenant / Subscriptions
  async getClinicProfile() {
    return this.request('/tenant/profile');
  }

  async updateClinicProfile(data: any) {
    return this.request('/tenant/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSubscription(plan: string) {
    return this.request('/tenant/subscription', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getSuperAdminOverview() {
    return this.request('/tenant/superadmin/overview');
  }
}

export const api = new ApiService();
