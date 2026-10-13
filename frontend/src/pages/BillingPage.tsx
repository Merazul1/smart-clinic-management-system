import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CreditCard,
  Printer,
  Trash2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  ArrowDownLeft,
} from 'lucide-react';
import { Invoice, Patient, Clinic, InvoiceItem } from '../types';

interface BillingPageProps {
  invoices: Invoice[];
  patients: Patient[];
  clinic?: Clinic;
  onCreateInvoice: (data: any) => void;
  onRecordPayment: (invoiceId: string, paymentData: any) => void;
}

const COMMON_SERVICES = [
  { desc: 'General Doctor Consultation', type: 'CONSULTATION', price: 500 },
  { desc: 'Specialist Cardiology Consultation', type: 'CONSULTATION', price: 800 },
  { desc: '12-Lead Electrocardiogram (ECG)', type: 'PROCEDURE', price: 400 },
  { desc: 'Random Blood Glucose Test (Glucometer)', type: 'LAB_TEST', price: 150 },
  { desc: 'Complete Blood Count (CBC Profile)', type: 'LAB_TEST', price: 450 },
  { desc: 'Nebulization Therapy Session', type: 'PROCEDURE', price: 250 },
  { desc: 'Wound Dressing & Antiseptic Bandage', type: 'PROCEDURE', price: 300 },
];

export const BillingPage: React.FC<BillingPageProps> = ({
  invoices,
  patients,
  clinic,
  onCreateInvoice,
  onRecordPayment,
}) => {
  const currency = clinic?.currency || '₹';

  const [isCreating, setIsCreating] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');
  const [paymentMethodInput, setPaymentMethodInput] = useState<string>('UPI');

  // New Invoice Form State
  const [patientId, setPatientId] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'General Consultation', itemType: 'CONSULTATION', quantity: 1, unitPrice: 500, total: 500 },
  ]);

  // Financial summary
  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  const handleAddItem = (preset?: any) => {
    if (preset) {
      setItems([
        ...items,
        {
          description: preset.desc,
          itemType: preset.type,
          quantity: 1,
          unitPrice: preset.price,
          total: preset.price,
        },
      ]);
    } else {
      setItems([
        ...items,
        { description: '', itemType: 'PROCEDURE', quantity: 1, unitPrice: 0, total: 0 },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : updated[index].quantity;
      const p = field === 'unitPrice' ? Number(value) : updated[index].unitPrice;
      updated[index].total = q * p;
    }
    setItems(updated);
  };

  const subtotal = items.reduce((acc, it) => acc + (it.total || 0), 0);
  const taxRate = clinic?.taxRate || 5.0;
  const tax = (subtotal * taxRate) / 100;
  const calculatedTotal = Math.max(0, subtotal - discount + tax);

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Please select a patient.');
      return;
    }

    onCreateInvoice({
      patientId,
      items: items.filter((it) => it.description.trim() !== ''),
      discount,
      tax,
      paidAmount,
      paymentMethod,
      notes,
      sendNotification: true,
    });

    setIsCreating(false);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToPay) return;
    onRecordPayment(invoiceToPay.id, {
      paymentAmount: Number(paymentAmountInput),
      paymentMethod: paymentMethodInput,
    });
    setInvoiceToPay(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Billing, Invoicing & Payment Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Itemized invoices, automatic GST/taxes, multi-channel payment reconciliation, and instant receipts
          </p>
        </div>

        <button
          onClick={() => {
            setPaidAmount(calculatedTotal);
            setIsCreating(true);
          }}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Invoiced</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{currency}{totalBilled.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Across all consultations & diagnostics</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Received / Collected</p>
          <h3 className="text-xl font-bold text-emerald-700 mt-1">{currency}{totalCollected.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-600 mt-1">Cash, UPI, Cards, Netbanking</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 uppercase">Outstanding Dues</p>
          <h3 className="text-xl font-bold text-rose-600 mt-1">{currency}{totalOutstanding.toLocaleString()}</h3>
          <p className="text-[11px] text-rose-500 mt-1">Pending balance from patients</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Invoice # & Date</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Items Summary</th>
                <th className="px-5 py-3.5">Total & Paid</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span className="block text-[11px] text-slate-400">
                      {new Date(inv.date).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{inv.patient?.name}</div>
                    <div className="text-[11px] text-slate-500">{inv.patient?.phone}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="text-slate-700 font-medium">{inv.items?.length || 0} service items</span>
                    <span className="block text-[11px] text-slate-400 truncate max-w-xs">
                      {inv.items?.map((it) => it.description).join(', ')}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{currency}{inv.total}</div>
                    <div className="text-[11px] text-slate-500">
                      Paid: {currency}{inv.paidAmount} • Mode: {inv.paymentMethod}
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'PARTIAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                    {inv.balance > 0 && (
                      <span className="block text-[10px] text-rose-600 font-semibold mt-0.5">
                        Due: {currency}{inv.balance}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.balance > 0 && (
                        <button
                          onClick={() => {
                            setInvoiceToPay(inv);
                            setPaymentAmountInput(String(inv.balance));
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg text-xs transition"
                        >
                          Collect
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Itemized Bill / Invoice</h3>
                  <p className="text-xs text-slate-500">Calculate fees, diagnostic charges, discounts, and payments</p>
                </div>
              </div>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="mt-4 space-y-4">
              {/* Patient */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientIdNumber} - {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Preset Service Buttons */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Add Clinical Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SERVICES.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddItem(s)}
                      className="text-[11px] bg-white border border-slate-200 hover:border-teal-400 text-slate-700 px-2 py-1 rounded-lg transition"
                    >
                      + {s.desc} ({currency}{s.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Billable Line Items
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Custom Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                      <div className="col-span-6">
                        <input
                          type="text"
                          placeholder="Service description"
                          value={it.description}
                          onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Price"
                          value={it.unitPrice}
                          onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length === 1}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals & Calculations */}
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Discount ({currency}):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 text-right p-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-semibold text-slate-800">{currency}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-teal-200">
                  <span>Net Amount Payable:</span>
                  <span className="text-teal-700">{currency}{calculatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Receipt Collection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Paid Now ({currency})
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="INSURANCE">Insurance TPA</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
                >
                  Issue Invoice & Send WhatsApp Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {invoiceToPay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn no-print">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">Collect Outstanding Due</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invoice #{invoiceToPay.invoiceNumber} • Remaining: {currency}{invoiceToPay.balance}
            </p>

            <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount ({currency})</label>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  max={invoiceToPay.balance}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethodInput}
                  onChange={(e) => setPaymentMethodInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="UPI">UPI / QR</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="INSURANCE">Insurance</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceToPay(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl shadow-xs"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Receipt View */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-6">
            
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Bill Receipt View
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print / PDF Receipt
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT CONTENT */}
            <div id="printable-document" className="text-slate-900 text-xs space-y-5">
              
              <div className="border-b-2 border-teal-700 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-teal-800">
                    {clinic?.name || 'Apex Multi-Specialty Clinic & Diagnostics'}
                  </h2>
                  <p className="text-slate-600 text-[11px]">{clinic?.address || 'Metro Health Tower, Bengaluru'}</p>
                  <p className="text-slate-500 text-[10px]">Phone: {clinic?.phone} • Email: {clinic?.email}</p>
                </div>

                <div className="text-right">
                  <h3 className="text-sm font-bold text-slate-900">PAYMENT RECEIPT</h3>
                  <p className="font-mono text-xs font-bold text-teal-700">{selectedInvoiceForPrint.invoiceNumber}</p>
                  <p className="text-slate-500 text-[10px]">
                    Date: {new Date(selectedInvoiceForPrint.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Patient */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Billed To Patient</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedInvoiceForPrint.patient?.name}</p>
                  <p className="text-slate-500 text-[11px] font-mono">
                    ID: {selectedInvoiceForPrint.patient?.patientIdNumber} • Phone: {selectedInvoiceForPrint.patient?.phone}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    selectedInvoiceForPrint.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoiceForPrint.status}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-200 p-2 text-left">Description</th>
                    <th className="border border-slate-200 p-2 text-center">Qty</th>
                    <th className="border border-slate-200 p-2 text-right">Unit Price</th>
                    <th className="border border-slate-200 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceForPrint.items?.map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="border border-slate-200 p-2 font-medium">{it.description}</td>
                      <td className="border border-slate-200 p-2 text-center">{it.quantity}</td>
                      <td className="border border-slate-200 p-2 text-right">{currency}{it.unitPrice}</td>
                      <td className="border border-slate-200 p-2 text-right font-bold">{currency}{it.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{currency}{selectedInvoiceForPrint.subtotal}</span>
                  </div>
                  {selectedInvoiceForPrint.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>-{currency}{selectedInvoiceForPrint.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes / GST:</span>
                    <span>{currency}{selectedInvoiceForPrint.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1">
                    <span>Total Amount:</span>
                    <span>{currency}{selectedInvoiceForPrint.total}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Paid Amount ({selectedInvoiceForPrint.paymentMethod}):</span>
                    <span>{currency}{selectedInvoiceForPrint.paidAmount}</span>
                  </div>
                  {selectedInvoiceForPrint.balance > 0 && (
                    <div className="flex justify-between font-bold text-rose-600 border-t border-dashed border-rose-200 pt-1">
                      <span>Balance Due:</span>
                      <span>{currency}{selectedInvoiceForPrint.balance}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                <p>Thank you for trusting us with your health. Get well soon!</p>
                <p className="font-semibold text-slate-600">Authorized Accounts Desk</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
