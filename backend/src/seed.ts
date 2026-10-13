import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

async function main() {
  console.log('🌱 Starting Smart Clinic Database Seeding...');

  // Clean existing data
  await prisma.reminder.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientVital.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Clinic@123', 10);

  // 1. Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@curapulse.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. System Administrator',
      role: 'SUPERADMIN',
      phone: '+91 9999900000',
    },
  });

  // 2. Create Primary Clinic: Apex Polyclinic & Diagnostic Center
  const apexClinic = await prisma.clinic.create({
    data: {
      name: 'Apex Multi-Specialty Clinic & Diagnostics',
      slug: 'apex-clinic',
      phone: '+91 9820123456',
      email: 'contact@apexclinic.com',
      address: 'Suite 401, Metro Health Tower, MG Road',
      city: 'Bengaluru',
      country: 'India',
      currency: '₹',
      taxRate: 5.0,
      subscriptionPlan: 'PRO',
      subscriptionStatus: 'ACTIVE',
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150',
    },
  });

  // 3. Create Clinic 1 Admin & Receptionist
  const apexAdmin = await prisma.user.create({
    data: {
      clinicId: apexClinic.id,
      email: 'admin@apexclinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Suresh Menon (Clinic Manager)',
      role: 'CLINIC_ADMIN',
      phone: '+91 9820123450',
    },
  });

  const apexReceptionist = await prisma.user.create({
    data: {
      clinicId: apexClinic.id,
      email: 'reception@apexclinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Neha Verma',
      role: 'RECEPTIONIST',
      phone: '+91 9820123451',
    },
  });

  // 4. Create Doctors for Apex Clinic
  const drSharmaUser = await prisma.user.create({
    data: {
      clinicId: apexClinic.id,
      email: 'dr.sharma@apexclinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Rajesh Sharma',
      role: 'DOCTOR',
      phone: '+91 9820123452',
    },
  });

  const drSharma = await prisma.doctorProfile.create({
    data: {
      userId: drSharmaUser.id,
      clinicId: apexClinic.id,
      specialization: 'Senior Cardiologist',
      qualifications: 'MBBS, MD, DM (Cardiology), FACC',
      licenseNumber: 'KMC-847291',
      consultationFee: 800.0,
      roomNumber: 'Cabin 101',
      bio: '15+ years experience in preventive cardiology, hypertension, and coronary care.',
      scheduleDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      startTime: '09:00',
      endTime: '15:00',
      slotDurationMinutes: 15,
    },
  });

  const drAnanyaUser = await prisma.user.create({
    data: {
      clinicId: apexClinic.id,
      email: 'dr.ananya@apexclinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Ananya Roy',
      role: 'DOCTOR',
      phone: '+91 9820123453',
    },
  });

  const drAnanya = await prisma.doctorProfile.create({
    data: {
      userId: drAnanyaUser.id,
      clinicId: apexClinic.id,
      specialization: 'Consultant Physician & Diabetologist',
      qualifications: 'MBBS, MD (General Medicine)',
      licenseNumber: 'KMC-592817',
      consultationFee: 500.0,
      roomNumber: 'Cabin 102',
      bio: 'Specialist in metabolic health, diabetes management, and chronic illness care.',
      scheduleDays: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      startTime: '10:00',
      endTime: '17:00',
      slotDurationMinutes: 15,
    },
  });

  const drVikramUser = await prisma.user.create({
    data: {
      clinicId: apexClinic.id,
      email: 'dr.vikram@apexclinic.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Vikram Malhotra',
      role: 'DOCTOR',
      phone: '+91 9820123454',
    },
  });

  const drVikram = await prisma.doctorProfile.create({
    data: {
      userId: drVikramUser.id,
      clinicId: apexClinic.id,
      specialization: 'Pediatrician & Child Health',
      qualifications: 'MBBS, DCH, DNB (Pediatrics)',
      licenseNumber: 'KMC-381049',
      consultationFee: 600.0,
      roomNumber: 'Cabin 103',
      bio: 'Caring specialist in pediatric wellness, newborn immunizations, and asthma.',
      scheduleDays: 'Monday,Wednesday,Friday,Saturday',
      startTime: '11:00',
      endTime: '19:00',
      slotDurationMinutes: 20,
    },
  });

  // 5. Create Patients for Apex Clinic
  const patientsData = [
    {
      patientIdNumber: 'PAT-2026-0001',
      name: 'Ramesh Sundaram',
      phone: '+91 9845112233',
      email: 'ramesh.sundaram@gmail.com',
      age: 54,
      gender: 'MALE',
      bloodGroup: 'B+',
      address: '42 Indiranagar, 100ft Road, Bengaluru',
      emergencyContact: 'Mrs. Geeta Sundaram (+91 9845112234)',
      allergies: 'Penicillin, Sulfa drugs',
      chronicConditions: 'Type 2 Diabetes, Hypertension',
      medicalNotes: 'Regular patient since 2024. Monitoring cholesterol and HbA1c quarterly.',
    },
    {
      patientIdNumber: 'PAT-2026-0002',
      name: 'Priyanka Sen',
      phone: '+91 9811223344',
      email: 'priyanka.sen@outlook.com',
      age: 32,
      gender: 'FEMALE',
      bloodGroup: 'O+',
      address: '77 Koramangala 4th Block, Bengaluru',
      emergencyContact: 'Arjun Sen (+91 9811223345)',
      allergies: 'None known',
      chronicConditions: 'Mild Asthmatic Bronchitis',
      medicalNotes: 'Complains of seasonal cough and wheezing during monsoon.',
    },
    {
      patientIdNumber: 'PAT-2026-0003',
      name: 'Master Aarav Patel',
      phone: '+91 9722334455',
      email: 'kunal.patel@yahoo.com',
      age: 7,
      gender: 'MALE',
      bloodGroup: 'A+',
      address: '15 Whitefield Main Road, Bengaluru',
      emergencyContact: 'Kunal Patel (Father, +91 9722334455)',
      allergies: 'Peanuts',
      chronicConditions: 'None',
      medicalNotes: 'Routine pediatric wellness and vaccination visit.',
    },
    {
      patientIdNumber: 'PAT-2026-0004',
      name: 'Sunita Kulkarni',
      phone: '+91 9900112233',
      email: 'sunita.kulkarni@gmail.com',
      age: 62,
      gender: 'FEMALE',
      bloodGroup: 'AB+',
      address: '204 Jayanagar 9th Block, Bengaluru',
      emergencyContact: 'Mahesh Kulkarni (+91 9900112234)',
      allergies: 'Aspirin',
      chronicConditions: 'Osteoarthritis, High Cholesterol',
      medicalNotes: 'Follow-up for joint stiffness and cardiovascular screening.',
    },
    {
      patientIdNumber: 'PAT-2026-0005',
      name: 'Mohammed Farhan',
      phone: '+91 9611224455',
      email: 'farhan.m@gmail.com',
      age: 41,
      gender: 'MALE',
      bloodGroup: 'O-',
      address: '12 HSR Layout Sector 2, Bengaluru',
      emergencyContact: 'Ayesha Farhan (+91 9611224456)',
      allergies: 'None',
      chronicConditions: 'Hypertension',
      medicalNotes: 'Complains of frequent tension headaches and elevated evening BP.',
    },
  ];

  const createdPatients = [];
  for (const p of patientsData) {
    const pat = await prisma.patient.create({
      data: {
        ...p,
        clinicId: apexClinic.id,
      },
    });
    createdPatients.push(pat);

    // Add vitals
    await prisma.patientVital.create({
      data: {
        clinicId: apexClinic.id,
        patientId: pat.id,
        bpSystolic: p.chronicConditions?.includes('Hypertension') ? 142 : 120,
        bpDiastolic: p.chronicConditions?.includes('Hypertension') ? 88 : 80,
        heartRate: 74,
        temperature: 98.6,
        weight: p.age > 40 ? 76.5 : 58.0,
        height: 172.0,
        bloodSugar: p.chronicConditions?.includes('Diabetes') ? 148.0 : 96.0,
        spo2: 98,
        notes: 'Initial checkup at triage desk.',
      },
    });
  }

  // 6. Create Appointments for Today
  const today = new Date().toISOString().split('T')[0];

  // Appointment 1: In Consultation
  const appt1 = await prisma.appointment.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[0].id,
      doctorId: drSharma.id,
      appointmentDate: today,
      timeSlot: '09:30 AM',
      tokenNumber: 1,
      status: 'IN_CONSULTATION',
      reason: 'Routine ECG and blood pressure checkup',
    },
  });

  // Appointment 2: Waiting in OPD
  const appt2 = await prisma.appointment.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[1].id,
      doctorId: drAnanya.id,
      appointmentDate: today,
      timeSlot: '10:00 AM',
      tokenNumber: 2,
      status: 'WAITING',
      reason: 'Recurrent dry cough and chest tightness',
    },
  });

  // Appointment 3: Scheduled later today
  const appt3 = await prisma.appointment.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[2].id,
      doctorId: drVikram.id,
      appointmentDate: today,
      timeSlot: '11:15 AM',
      tokenNumber: 3,
      status: 'SCHEDULED',
      reason: 'MMR booster vaccine & growth assessment',
    },
  });

  // Appointment 4: Completed
  const appt4 = await prisma.appointment.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[3].id,
      doctorId: drSharma.id,
      appointmentDate: today,
      timeSlot: '09:00 AM',
      tokenNumber: 4,
      status: 'COMPLETED',
      reason: 'Evaluation of palpitations and fatigue',
    },
  });

  // 7. Create Prescriptions
  const rx1 = await prisma.prescription.create({
    data: {
      clinicId: apexClinic.id,
      appointmentId: appt4.id,
      patientId: createdPatients[3].id,
      doctorId: drSharma.id,
      diagnosis: 'Stage 1 Essential Hypertension with Dyslipidemia',
      symptoms: 'Occasional lightheadedness and exertional fatigue.',
      clinicalNotes: 'ECG normal sinus rhythm. S1/S2 normal, no murmurs. Advised 30 mins brisk walking daily.',
      advice: 'Reduce dietary salt intake (< 5g/day). Avoid heavy lifting. Maintain BP chart for 14 days.',
      followUpDate: '2026-11-15',
      items: {
        create: [
          {
            medicineName: 'Telmisartan 40mg (Telma 40)',
            dosage: '1 Tablet',
            frequency: '1-0-0 (Morning)',
            timing: 'AFTER_FOOD',
            duration: '30 days',
            instructions: 'Take daily after breakfast.',
          },
          {
            medicineName: 'Atorvastatin 10mg (Atorva 10)',
            dosage: '1 Tablet',
            frequency: '0-0-1 (Night)',
            timing: 'AFTER_FOOD',
            duration: '30 days',
            instructions: 'Take before sleeping.',
          },
          {
            medicineName: 'Vitamin D3 60,000 IU',
            dosage: '1 Capsule',
            frequency: 'Once weekly',
            timing: 'AFTER_FOOD',
            duration: '8 weeks',
            instructions: 'Take every Sunday with warm milk.',
          },
        ],
      },
    },
  });

  // 8. Create Invoices and Line Items
  const inv1 = await prisma.invoice.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[3].id,
      appointmentId: appt4.id,
      invoiceNumber: 'INV-2026-0001',
      subtotal: 1400.0,
      discount: 100.0,
      tax: 65.0,
      total: 1365.0,
      paidAmount: 1365.0,
      balance: 0.0,
      status: 'PAID',
      paymentMethod: 'UPI',
      notes: 'Paid via GPay. Receipt issued.',
      items: {
        create: [
          {
            description: 'Cardiology Specialist Consultation (Dr. Rajesh Sharma)',
            itemType: 'CONSULTATION',
            quantity: 1,
            unitPrice: 800.0,
            total: 800.0,
          },
          {
            description: '12-Lead Resting Electrocardiogram (ECG)',
            itemType: 'PROCEDURE',
            quantity: 1,
            unitPrice: 400.0,
            total: 400.0,
          },
          {
            description: 'Random Blood Sugar (Glucometer)',
            itemType: 'LAB_TEST',
            quantity: 1,
            unitPrice: 200.0,
            total: 200.0,
          },
        ],
      },
    },
  });

  const inv2 = await prisma.invoice.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[0].id,
      appointmentId: appt1.id,
      invoiceNumber: 'INV-2026-0002',
      subtotal: 800.0,
      discount: 0.0,
      tax: 40.0,
      total: 840.0,
      paidAmount: 500.0,
      balance: 340.0,
      status: 'PARTIAL',
      paymentMethod: 'CASH',
      notes: 'Partial payment received at reception desk.',
      items: {
        create: [
          {
            description: 'Cardiology Specialist Consultation',
            itemType: 'CONSULTATION',
            quantity: 1,
            unitPrice: 800.0,
            total: 800.0,
          },
        ],
      },
    },
  });

  // 9. Create WhatsApp Reminders
  await prisma.reminder.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[0].id,
      appointmentId: appt1.id,
      channel: 'WHATSAPP',
      templateType: 'CONFIRMATION',
      recipientPhone: createdPatients[0].phone,
      messageBody: `🩺 *Apex Multi-Specialty Clinic - Appointment Confirmed*\n\nDear *Ramesh Sundaram*,\nYour appointment with *Dr. Rajesh Sharma* has been confirmed.\n\n📅 Date: ${today}\n⏰ Time: 09:30 AM\n🎟️ Token Number: *#1*`,
      status: 'DELIVERED',
      externalMessageId: 'wa_msg_9828104812',
    },
  });

  await prisma.reminder.create({
    data: {
      clinicId: apexClinic.id,
      patientId: createdPatients[1].id,
      appointmentId: appt2.id,
      channel: 'WHATSAPP',
      templateType: 'CONFIRMATION',
      recipientPhone: createdPatients[1].phone,
      messageBody: `🩺 *Apex Multi-Specialty Clinic - Appointment Confirmed*\n\nDear *Priyanka Sen*,\nYour appointment with *Dr. Ananya Roy* has been confirmed.\n\n📅 Date: ${today}\n⏰ Time: 10:00 AM\n🎟️ Token Number: *#2*`,
      status: 'DELIVERED',
      externalMessageId: 'wa_msg_9828104813',
    },
  });

  // 10. Create Second Clinic to showcase Multi-Tenancy SaaS
  const healWellClinic = await prisma.clinic.create({
    data: {
      name: 'HealWell Family Health Clinic',
      slug: 'healwell-clinic',
      phone: '+91 9711002233',
      email: 'hello@healwellclinic.com',
      address: 'Shop 12, Sunrise Plaza, Sector 15',
      city: 'Gurugram',
      country: 'India',
      currency: '₹',
      taxRate: 0.0,
      subscriptionPlan: 'STARTER',
      subscriptionStatus: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      clinicId: healWellClinic.id,
      email: 'admin@healwell.com',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Priya Desai (Founder)',
      role: 'CLINIC_ADMIN',
      phone: '+91 9711002234',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('---------------------------------------------------------');
  console.log('Accounts ready for immediate login:');
  console.log('1. Super Admin:   superadmin@curapulse.com / Clinic@123');
  console.log('2. Clinic Admin:  admin@apexclinic.com    / Clinic@123');
  console.log('3. Receptionist:  reception@apexclinic.com / Clinic@123');
  console.log('4. Doctor:        dr.sharma@apexclinic.com / Clinic@123');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
