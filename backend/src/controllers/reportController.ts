import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const today = new Date().toISOString().split('T')[0];

    // Counts
    const [
      totalPatients,
      totalDoctors,
      todayAppointments,
      waitingQueueCount,
      allInvoices,
      allAppointments,
      recentRemindersCount,
    ] = await Promise.all([
      prisma.patient.count({ where: { clinicId } }),
      prisma.doctorProfile.count({ where: { clinicId } }),
      prisma.appointment.count({
        where: { clinicId, appointmentDate: today },
      }),
      prisma.appointment.count({
        where: { clinicId, appointmentDate: today, status: { in: ['WAITING', 'SCHEDULED'] } },
      }),
      prisma.invoice.findMany({
        where: { clinicId },
        select: {
          total: true,
          paidAmount: true,
          balance: true,
          status: true,
          paymentMethod: true,
          date: true,
        },
      }),
      prisma.appointment.findMany({
        where: { clinicId },
        select: { appointmentDate: true, status: true },
      }),
      prisma.reminder.count({ where: { clinicId } }),
    ]);

    // Financial calculations
    const totalRevenue = allInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingBalance = allInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const totalBilled = allInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // Payment methods breakdown
    const paymentMethods: Record<string, number> = {};
    for (const inv of allInvoices) {
      paymentMethods[inv.paymentMethod] = (paymentMethods[inv.paymentMethod] || 0) + inv.paidAmount;
    }

    // Daily revenue last 14 days
    const last14Days: { date: string; revenue: number; appointments: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayRevenue = allInvoices
        .filter((inv) => new Date(inv.date).toISOString().split('T')[0] === dateStr)
        .reduce((sum, inv) => sum + inv.paidAmount, 0);

      const dayAppts = allAppointments.filter((a) => a.appointmentDate === dateStr).length;

      last14Days.push({
        date: dateStr,
        revenue: dayRevenue,
        appointments: dayAppts,
      });
    }

    // Doctor performance
    const doctors = await prisma.doctorProfile.findMany({
      where: { clinicId },
      include: {
        user: { select: { name: true } },
        appointments: { select: { id: true, status: true } },
        prescriptions: { select: { id: true } },
      },
    });

    const doctorPerformance = doctors.map((doc) => ({
      id: doc.id,
      name: doc.user.name,
      specialization: doc.specialization,
      consultationFee: doc.consultationFee,
      totalAppointments: doc.appointments.length,
      completedConsultations: doc.appointments.filter((a) => a.status === 'COMPLETED').length,
      prescriptionsIssued: doc.prescriptions.length,
    }));

    return res.json({
      summary: {
        totalPatients,
        totalDoctors,
        todayAppointments,
        waitingQueueCount,
        totalRevenue,
        pendingBalance,
        totalBilled,
        recentRemindersCount,
      },
      paymentMethods,
      dailyTrends: last14Days,
      doctorPerformance,
    });
  } catch (error: any) {
    console.error('Dashboard metrics error:', error);
    return res.status(500).json({ error: 'Failed to generate metrics' });
  }
}

export async function exportCsvReport(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { type = 'invoices' } = req.query;

    if (type === 'invoices') {
      const invoices = await prisma.invoice.findMany({
        where: { clinicId },
        include: { patient: true },
        orderBy: { date: 'desc' },
      });

      let csv = 'Invoice Number,Date,Patient ID,Patient Name,Subtotal,Discount,Tax,Total,Paid,Balance,Status,Payment Method\n';
      for (const inv of invoices) {
        csv += `"${inv.invoiceNumber}","${inv.date.toISOString().split('T')[0]}","${inv.patient.patientIdNumber}","${inv.patient.name}",${inv.subtotal},${inv.discount},${inv.tax},${inv.total},${inv.paidAmount},${inv.balance},"${inv.status}","${inv.paymentMethod}"\n`;
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=clinic_invoices_report.csv');
      return res.send(csv);
    }

    if (type === 'patients') {
      const patients = await prisma.patient.findMany({
        where: { clinicId },
        include: { _count: { select: { appointments: true } } },
        orderBy: { createdAt: 'desc' },
      });

      let csv = 'Patient ID,Name,Phone,Email,Age,Gender,Blood Group,Total Visits,Allergies,Registered Date\n';
      for (const pat of patients) {
        csv += `"${pat.patientIdNumber}","${pat.name}","${pat.phone}","${pat.email || ''}",${pat.age},"${pat.gender}","${pat.bloodGroup || ''}",${pat._count.appointments},"${pat.allergies || ''}","${pat.createdAt.toISOString().split('T')[0]}"\n`;
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=clinic_patients_report.csv');
      return res.send(csv);
    }

    return res.status(400).json({ error: 'Invalid report type' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to export report' });
  }
}
