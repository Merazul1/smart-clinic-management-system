import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { generateToken, AuthUser } from '../middleware/auth';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        clinic: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const authPayload: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      clinicId: user.clinicId,
      doctorProfileId: user.doctorProfile?.id || null,
    };

    const token = generateToken(authPayload);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        clinic: user.clinic,
        doctorProfile: user.doctorProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function registerClinic(req: Request, res: Response) {
  try {
    const {
      clinicName,
      slug,
      adminName,
      email,
      password,
      phone,
      address,
      currency,
      subscriptionPlan,
    } = req.body;

    if (!clinicName || !email || !password || !adminName) {
      return res.status(400).json({ error: 'Missing required clinic or administrator details' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const generatedSlug = (slug || clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-')) + '-' + Math.floor(1000 + Math.random() * 9000);

    const passwordHash = await bcrypt.hash(password, 10);

    const clinic = await prisma.clinic.create({
      data: {
        name: clinicName,
        slug: generatedSlug,
        phone: phone || '+91 9876543210',
        email: email.toLowerCase(),
        address: address || '123 Medical Enclave',
        currency: currency || '₹',
        subscriptionPlan: subscriptionPlan || 'PRO',
        subscriptionStatus: 'ACTIVE',
        users: {
          create: {
            name: adminName,
            email: email.toLowerCase(),
            passwordHash,
            role: 'CLINIC_ADMIN',
            phone,
          },
        },
      },
      include: {
        users: true,
      },
    });

    const adminUser = clinic.users[0];
    const authPayload: AuthUser = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: 'CLINIC_ADMIN',
      clinicId: clinic.id,
    };

    const token = generateToken(authPayload);

    return res.status(201).json({
      message: 'Clinic registered successfully',
      token,
      clinic,
      user: adminUser,
    });
  } catch (error: any) {
    console.error('Register clinic error:', error);
    return res.status(500).json({ error: error.message || 'Failed to register clinic' });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        clinic: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        clinic: user.clinic,
        doctorProfile: user.doctorProfile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

export async function demoLogin(req: Request, res: Response) {
  try {
    const { role, clinicSlug } = req.body;

    let userQuery: any = { role: role || 'CLINIC_ADMIN' };
    if (clinicSlug) {
      const clinic = await prisma.clinic.findUnique({ where: { slug: clinicSlug } });
      if (clinic) {
        userQuery.clinicId = clinic.id;
      }
    }

    const user = await prisma.user.findFirst({
      where: userQuery,
      include: {
        clinic: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: `Demo user for role ${role} not found` });
    }

    const authPayload: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      clinicId: user.clinicId,
      doctorProfileId: user.doctorProfile?.id || null,
    };

    const token = generateToken(authPayload);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        clinic: user.clinic,
        doctorProfile: user.doctorProfile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Demo switch failed' });
  }
}
