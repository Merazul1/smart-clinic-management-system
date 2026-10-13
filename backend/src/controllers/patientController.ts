import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';

export async function listPatients(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const search = (req.query.search as string) || '';

    const whereClause: any = { clinicId };
    if (search.trim()) {
      whereClause.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { patientIdNumber: { contains: search } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
            invoices: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(patients);
  } catch (error: any) {
    console.error('List patients error:', error);
    return res.status(500).json({ error: 'Failed to list patients' });
  }
}

export async function getPatientById(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;

    const patient = await prisma.patient.findFirst({
      where: { id, clinicId },
      include: {
        appointments: {
          include: {
            doctor: {
              include: { user: true },
            },
          },
          orderBy: { appointmentDate: 'desc' },
        },
        prescriptions: {
          include: {
            doctor: { include: { user: true } },
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          include: { items: true },
          orderBy: { date: 'desc' },
        },
        vitals: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json(patient);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch patient details' });
  }
}

export async function createPatient(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const {
      name,
      phone,
      email,
      dob,
      age,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicConditions,
      medicalNotes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    // Auto-generate patient ID number
    const count = await prisma.patient.count({ where: { clinicId } });
    const currentYear = new Date().getFullYear();
    const patientIdNumber = `PAT-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    const patient = await prisma.patient.create({
      data: {
        clinicId,
        patientIdNumber,
        name,
        phone,
        email: email || null,
        dob: dob || null,
        age: Number(age) || 30,
        gender: gender || 'MALE',
        bloodGroup: bloodGroup || null,
        address: address || null,
        emergencyContact: emergencyContact || null,
        allergies: allergies || null,
        chronicConditions: chronicConditions || null,
        medicalNotes: medicalNotes || null,
      },
    });

    return res.status(201).json(patient);
  } catch (error: any) {
    console.error('Create patient error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create patient' });
  }
}

export async function updatePatient(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;

    const existing = await prisma.patient.findFirst({ where: { id, clinicId } });
    if (!existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updated = await prisma.patient.update({
      where: { id },
      data: req.body,
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update patient' });
  }
}

export async function addPatientVitals(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;
    const { bpSystolic, bpDiastolic, heartRate, temperature, weight, height, bloodSugar, spo2, notes } = req.body;

    const patient = await prisma.patient.findFirst({ where: { id, clinicId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const vital = await prisma.patientVital.create({
      data: {
        clinicId,
        patientId: id,
        bpSystolic: bpSystolic ? Number(bpSystolic) : null,
        bpDiastolic: bpDiastolic ? Number(bpDiastolic) : null,
        heartRate: heartRate ? Number(heartRate) : null,
        temperature: temperature ? Number(temperature) : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        bloodSugar: bloodSugar ? Number(bloodSugar) : null,
        spo2: spo2 ? Number(spo2) : null,
        notes: notes || null,
      },
    });

    return res.status(201).json(vital);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to record vitals' });
  }
}
