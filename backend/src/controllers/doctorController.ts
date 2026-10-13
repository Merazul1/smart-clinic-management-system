import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';

export async function listDoctors(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);

    const doctors = await prisma.doctorProfile.findMany({
      where: { clinicId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
          },
        },
      },
    });

    return res.json(doctors);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to list doctors' });
  }
}

export async function createDoctor(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualifications,
      licenseNumber,
      consultationFee,
      roomNumber,
      scheduleDays,
      startTime,
      endTime,
      slotDurationMinutes,
    } = req.body;

    if (!name || !email || !specialization) {
      return res.status(400).json({ error: 'Name, email, and specialization are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password || 'Doctor@123', 10);

    const doctorUser = await prisma.user.create({
      data: {
        clinicId,
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: 'DOCTOR',
        phone: phone || null,
        doctorProfile: {
          create: {
            clinicId,
            specialization,
            qualifications: qualifications || 'MBBS, MD',
            licenseNumber: licenseNumber || `MED-${Math.floor(10000 + Math.random() * 90000)}`,
            consultationFee: consultationFee ? Number(consultationFee) : 500,
            roomNumber: roomNumber || 'Room 101',
            scheduleDays: scheduleDays || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            startTime: startTime || '09:00',
            endTime: endTime || '18:00',
            slotDurationMinutes: slotDurationMinutes ? Number(slotDurationMinutes) : 15,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    return res.status(201).json(doctorUser);
  } catch (error: any) {
    console.error('Create doctor error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create doctor' });
  }
}

export async function updateDoctorProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      consultationFee,
      roomNumber,
      scheduleDays,
      startTime,
      endTime,
      slotDurationMinutes,
      qualifications,
      specialization,
      name,
      phone,
    } = req.body;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const updated = await prisma.doctorProfile.update({
      where: { id },
      data: {
        consultationFee: consultationFee !== undefined ? Number(consultationFee) : undefined,
        roomNumber,
        scheduleDays,
        startTime,
        endTime,
        slotDurationMinutes: slotDurationMinutes !== undefined ? Number(slotDurationMinutes) : undefined,
        qualifications,
        specialization,
      },
    });

    if (name || phone) {
      await prisma.user.update({
        where: { id: doctorProfile.userId },
        data: {
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
        },
      });
    }

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update doctor profile' });
  }
}
