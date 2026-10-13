# 🩺 CuraPulse - Smart Clinic Management Platform (Multi-Tenant SaaS)

A complete, production-grade clinic management SaaS platform designed for healthcare clinics, polyclinics, diagnostic centers, and freelance software clients.

---

## 🌟 Key Features

### 1. 🏢 Multi-Tenant Clinic Subscription Architecture
- Clinics can subscribe to tiers (**Starter**, **Professional**, **Enterprise**).
- Full tenant data isolation (patients, appointments, staff, billing, prescriptions, and reports).
- **Super-Administrator Console** monitoring all platform clinics, total visits, and Monthly Recurring Revenue (MRR).

### 2. 👥 Patient Registration & Electronic Health Records (EHR)
- Walk-in patient registration with unique Patient IDs (`PAT-2026-XXXX`).
- Demographic records, blood group, emergency contacts, known drug allergies, and chronic condition flags.
- Comprehensive EHR Drawer: Vitals history (BP, Heart Rate, SpO2, Temperature, Blood Sugar, Weight), past prescriptions, invoices, and visit history.

### 3. ⏱️ OPD Live Queue & Digital Token Board
- Real-time token sequencer for outpatient department (OPD).
- 3-stage triage Kanban: **Waiting in Lobby** ➔ **In Cabin Consultation** ➔ **Completed**.
- Audio announcement broadcaster simulation (e.g., *"Now calling Token #2 to Cabin 102"*).
- Instant cabin call & queue management.

### 4. ℞ Digital E-Prescription Studio & Official Letterhead
- Standardized medical e-prescriptions.
- Quick diagnosis selectors (Hypertension, Diabetes, Bronchitis, GERD, etc.).
- Medication regimen builder: Drug name, strength, dosage, frequency (`1-0-1`, `1-0-0`, etc.), timing (Before/After Food), duration, and instructions.
- **Print / PDF-Ready Clinic Letterhead**: Official letterhead with doctor qualifications, license number, Rx symbol, items table, and signature block.

### 5. 💳 Billing, Invoices & Payment Tracking
- Itemized invoicing: Doctor Consultation, Lab tests (CBC, Blood Sugar), Procedures (ECG, Dressing), Medicines.
- Automatic tax / GST calculation from clinic settings + discount management.
- Multi-channel payment recording: **Cash, UPI/QR Code, Credit/Debit Cards, Insurance TPA**.
- Outstanding balance tracking (Paid, Partial, Pending).
- **Printable Official Payment Receipts**.

### 6. 💬 WhatsApp & SMS Automated Reminders
- Reduces clinic no-shows by up to 40%.
- Automated triggers:
  - Appointment Booking Confirmation with Token #.
  - 24-Hour Advance Reminder.
  - Live Lobby Queue Call Alert.
  - E-Prescription Ready Alert.
  - Invoice & Payment Receipt Alert.
- One-click direct **`wa.me` WhatsApp Web link** for instant receptionist dispatch without third-party fees.
- Real-time message audit & delivery log.

### 7. 📊 Clinic Intelligence & Reports
- Real-time KPI summaries: Total Patients, Inflow, Today's Queue, Gross Billing, Reconciled Cashflow, Outstanding Dues.
- 14-day daily revenue & patient inflow visual analytics.
- **Doctor Productivity & Completion Rate Analytics**.
- One-click **Export to CSV** for invoices and patient registers.

---

## 🛠️ Tech Stack & Database Compatibility

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT, bcryptjs.
- **Database**:
  - **SQLite** (Default zero-configuration setup, runs instantly without installing database servers).
  - **Microsoft SQL Server / Azure SQL** (Production ready):
    Simply change `provider = "sqlserver"` in `prisma/schema.prisma` and set your connection string in `.env`:
    ```env
    DATABASE_URL="sqlserver://localhost:1433;database=CuraPulseDb;user=sa;password=YourStrongPassword;encrypt=true"
    ```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer)
- npm

### 2. Installation & Database Setup
```bash
# Clone or navigate to the project directory
cd smart-clinic

# Install backend dependencies
cd backend
npm install

# Initialize database schema & seed realistic demo data
npx prisma db push
npm run seed

# Start backend server (runs at http://localhost:5000)
npm run dev
```

### 3. Start Frontend
Open a new terminal:
```bash
cd smart-clinic/frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

The system includes a **Quick Demo Switcher** bar at the top of the screen to switch roles with a single click, or you can log in manually:

| Role | Email | Password | Scope |
|---|---|---|---|
| **Clinic Admin** | `admin@apexclinic.com` | `Clinic@123` | Full clinic management, staff, billing, settings |
| **Doctor (Cardiology)** | `dr.sharma@apexclinic.com` | `Clinic@123` | Doctor consultations, appointments, Rx Studio |
| **Receptionist** | `reception@apexclinic.com` | `Clinic@123` | OPD Queue, walk-ins, billing, WhatsApp alerts |
| **Platform SuperAdmin**| `superadmin@curapulse.com` | `Clinic@123` | Global SaaS overview, all clinic tenants, MRR |

---

## 💼 Commercial & Freelance Value

This software is architected to be immediately pitchable and sellable to:
1. **Local General Physicians & Specialist Clinics**: Pitch modernizing paper prescriptions with WhatsApp confirmations and digital letterheads.
2. **Polyclinics & Diagnostic Centers**: Multi-doctor scheduling, token calling display, and diagnostic test billing.
3. **White-Label SaaS Business**: Host this as your own monthly subscription business charging ₹3,999 to ₹14,999 ($49–$199/mo) per clinic.
