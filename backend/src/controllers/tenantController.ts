import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';

export async function getClinicProfile(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            doctorProfiles: true,
            appointments: true,
            invoices: true,
          },
        },
      },
    });

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    return res.json(clinic);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch clinic profile' });
  }
}

export async function updateClinicProfile(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { name, phone, email, address, city, currency, taxRate, logo } = req.body;

    const updated = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
        ...(city ? { city } : {}),
        ...(currency ? { currency } : {}),
        ...(taxRate !== undefined ? { taxRate: Number(taxRate) } : {}),
        ...(logo ? { logo } : {}),
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update clinic profile' });
  }
}

export async function updateSubscription(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { plan } = req.body; // STARTER, PRO, ENTERPRISE

    if (!['STARTER', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: 'ACTIVE',
      },
    });

    return res.json({
      message: `Subscription successfully upgraded to ${plan}`,
      clinic: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update subscription' });
  }
}

export async function getSuperAdminOverview(req: Request, res: Response) {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            appointments: true,
            invoices: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalClinics = clinics.length;
    const activeClinics = clinics.filter((c) => c.subscriptionStatus === 'ACTIVE').length;
    const totalPatients = clinics.reduce((sum, c) => sum + c._count.patients, 0);
    const totalAppointments = clinics.reduce((sum, c) => sum + c._count.appointments, 0);

    // Calculate simulated MRR ($49 for Starter, $99 for Pro, $199 for Enterprise)
    const mrr = clinics.reduce((sum, c) => {
      if (c.subscriptionPlan === 'ENTERPRISE') return sum + 199;
      if (c.subscriptionPlan === 'PRO') return sum + 99;
      return sum + 49;
    }, 0);

    return res.json({
      platformStats: {
        totalClinics,
        activeClinics,
        totalPatients,
        totalAppointments,
        estimatedMRR: mrr,
      },
      clinics,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to load superadmin overview' });
  }
}
