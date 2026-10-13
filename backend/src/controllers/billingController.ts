import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { getTenantClinicId } from '../middleware/auth';
import { sendAndLogReminder } from '../services/notificationService';

export async function listInvoices(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { status, patientId } = req.query;

    const whereClause: any = { clinicId };
    if (status) whereClause.status = String(status);
    if (patientId) whereClause.patientId = String(patientId);

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        patient: true,
        items: true,
        appointment: {
          include: {
            doctor: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(invoices);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to list invoices' });
  }
}

export async function createInvoice(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const {
      patientId,
      appointmentId,
      items,
      discount = 0,
      tax = 0,
      paidAmount = 0,
      paymentMethod = 'CASH',
      notes,
      sendNotification,
    } = req.body;

    if (!patientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Patient ID and at least one line item are required' });
    }

    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });

    // Generate Invoice Number
    const count = await prisma.invoice.count({ where: { clinicId } });
    const currentYear = new Date().getFullYear();
    const invoiceNumber = `INV-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    // Calculate totals
    const calculatedItems = items.map((item: any) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        description: item.description,
        itemType: item.itemType || 'CONSULTATION',
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      };
    });

    const subtotal = calculatedItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
    const discountVal = Number(discount) || 0;
    const taxVal = Number(tax) !== undefined ? Number(tax) : (clinic ? (subtotal * clinic.taxRate) / 100 : 0);
    const total = Math.max(0, subtotal - discountVal + taxVal);
    const paid = Number(paidAmount) || 0;
    const balance = Math.max(0, total - paid);

    let status = 'PENDING';
    if (paid >= total && total > 0) {
      status = 'PAID';
    } else if (paid > 0 && paid < total) {
      status = 'PARTIAL';
    }

    const invoice = await prisma.invoice.create({
      data: {
        clinicId,
        patientId,
        appointmentId: appointmentId || null,
        invoiceNumber,
        subtotal,
        discount: discountVal,
        tax: taxVal,
        total,
        paidAmount: paid,
        balance,
        status,
        paymentMethod,
        notes: notes || null,
        items: {
          create: calculatedItems,
        },
      },
      include: {
        items: true,
        patient: true,
        clinic: true,
      },
    });

    // Send WhatsApp notification
    let notification = null;
    if (sendNotification !== false && invoice.patient.phone) {
      notification = await sendAndLogReminder({
        clinicId,
        patientId,
        appointmentId: appointmentId || undefined,
        channel: 'WHATSAPP',
        templateType: 'INVOICE',
        patientName: invoice.patient.name,
        patientPhone: invoice.patient.phone,
        clinicName: invoice.clinic.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: `${clinic?.currency || '₹'}${total.toFixed(2)}`,
      });
    }

    return res.status(201).json({ invoice, notification });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create invoice' });
  }
}

export async function recordPayment(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;
    const { paymentAmount, paymentMethod } = req.body;

    const invoice = await prisma.invoice.findFirst({
      where: { id, clinicId },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const additionalPaid = Number(paymentAmount) || 0;
    const newPaidAmount = invoice.paidAmount + additionalPaid;
    const newBalance = Math.max(0, invoice.total - newPaidAmount);

    let newStatus = invoice.status;
    if (newBalance <= 0) {
      newStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIAL';
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus,
        paymentMethod: paymentMethod || invoice.paymentMethod,
      },
      include: {
        items: true,
        patient: true,
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to record payment' });
  }
}

export async function getInvoiceById(req: Request, res: Response) {
  try {
    const clinicId = getTenantClinicId(req);
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, clinicId },
      include: {
        items: true,
        patient: true,
        clinic: true,
        appointment: {
          include: {
            doctor: { include: { user: true } },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json(invoice);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch invoice' });
  }
}
