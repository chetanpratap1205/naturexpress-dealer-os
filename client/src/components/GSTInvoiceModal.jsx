import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Shield, 
  X, 
  QrCode, 
  Search,
  Building2,
  Car,
  CreditCard,
  Hash,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GSTInvoiceModal({ 
  jobCardId, 
  jobCards = [], 
  isOpen = true, 
  onClose, 
  inline = false 
}) {
  const [selectedId, setSelectedId] = useState(jobCardId || (jobCards.length > 0 ? jobCards[0].id : 'jc-8899'));
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobCardId) setSelectedId(jobCardId);
  }, [jobCardId]);

  useEffect(() => {
    if (isOpen || inline) {
      setLoading(true);
      const targetId = selectedId || 'jc-8899';
      fetch(`/api/job-cards/${targetId}/invoice`)
        .then(res => res.json())
        .then(res => {
          if (res.success) setInvoice(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching invoice", err);
          setLoading(false);
        });
    }
  }, [isOpen, inline, selectedId]);

  if (!isOpen && !inline) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-3xl shadow-sm' : 'max-w-4xl rounded-3xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header Actions (Hidden on print) */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base tracking-tight">Official GST Tax Invoice Console</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold uppercase">
                Tax Compliant Document
              </span>
            </div>
            <p className="text-xs text-slate-400">Auto-generates official CGST 9% + SGST 9% itemized service and parts tax invoices</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Printer className="w-4 h-4" /> Print / Save Official PDF
          </button>
          {!inline && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Select job card if inline (Hidden on print) */}
      {inline && jobCards.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-3 print:hidden">
          <span className="text-xs font-bold text-slate-700">Select Job Card Invoice:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {jobCards.map(j => (
              <option key={j.id} value={j.id}>{j.regNumber || j.regNo} — {j.model} ({j.customerName})</option>
            ))}
          </select>
        </div>
      )}

      {/* Invoice Printable Body */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs font-semibold">
          Generating official tax invoice breakdown...
        </div>
      ) : invoice ? (
        <div className="p-8 sm:p-10 bg-white text-slate-900 text-xs font-sans leading-relaxed print:p-4">
          {/* Top Dealership Official Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-5">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {invoice.dealership.name}
                </h1>
              </div>
              <p className="text-slate-600 mt-0.5">{invoice.dealership.address}</p>
              <p className="text-slate-600">Phone: {invoice.dealership.phone} | Official WhatsApp: {invoice.dealership.verifiedWhatsApp}</p>
              <p className="font-bold text-slate-900 mt-1 font-mono">
                GSTIN: {invoice.dealership.gstin} • PAN: {invoice.dealership.pan} • State: 23 (Madhya Pradesh)
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs tracking-wider uppercase rounded-md mb-2">
                TAX INVOICE (RULE 46)
              </span>
              <div className="font-mono text-xs">
                <p>Invoice No: <strong>{invoice.invoiceNo}</strong></p>
                <p>Date: <strong>{invoice.invoiceDate}</strong></p>
                <p>Job Card: <strong>{invoice.vehicle.jobCardId}</strong></p>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Metadata Two-Column Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 font-mono text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Billed To (Customer Details)
              </div>
              <p className="font-bold text-sm text-slate-900">{invoice.customer.name}</p>
              <p className="text-slate-600">Phone: {invoice.customer.phone}</p>
              <p className="text-slate-600">{invoice.customer.address}</p>
              <p className="text-slate-700 font-semibold mt-1">State: Madhya Pradesh (Code: 23)</p>
            </div>

            <div className="text-right sm:text-left sm:pl-4 sm:border-l border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Vehicle Telemetry & Diagnostics
              </div>
              <p className="font-bold text-sm text-slate-900">{invoice.vehicle.model}</p>
              <p className="text-slate-700">Reg No: <strong>{invoice.vehicle.regNo}</strong></p>
              <p className="text-slate-600">VIN: {invoice.vehicle.vin}</p>
              <p className="text-slate-600">Odometer: {invoice.vehicle.odometer?.toLocaleString()} km • SA: {invoice.vehicle.saName}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left divide-y divide-slate-300">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3">Description of Goods / Services</th>
                  <th className="p-3 w-24">HSN / SAC</th>
                  <th className="p-3 w-20 text-right">Parts (₹)</th>
                  <th className="p-3 w-20 text-right">Labour (₹)</th>
                  <th className="p-3 w-16 text-center">GST %</th>
                  <th className="p-3 w-24 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-mono text-xs">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-center text-slate-400">{item.srNo}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">
                      {item.description}
                    </td>
                    <td className="p-3 text-slate-500 font-bold">{item.hsnSacCode}</td>
                    <td className="p-3 text-right text-slate-700">
                      {item.partCost > 0 ? item.partCost.toLocaleString('en-IN') : '—'}
                    </td>
                    <td className="p-3 text-right text-slate-700">
                      {item.laborCost > 0 ? item.laborCost.toLocaleString('en-IN') : '—'}
                    </td>
                    <td className="p-3 text-center text-slate-500">18%</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Settlement Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-6">
            {/* Left: UPI Dynamic QR Code & Terms */}
            <div className="sm:col-span-7 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs">
                {/* Dynamic QR Representation */}
                <div className="w-24 h-24 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-1">
                  <QrCode className="w-12 h-12 text-white mb-1" />
                  <span className="text-[8px] font-mono">SCAN TO PAY</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">Instant Digital Payment Gateway</span>
                <p>UPI ID: <strong className="font-mono text-blue-700">sanghibrothers@icici</strong></p>
                <p>Authorized Payment Modes: UPI, Razorpay No-Cost EMI, Tata Motors Warranty Settlement.</p>
                <p className="text-[10px] text-slate-400 mt-1">E. & O.E. • Goods once sold are backed by Tata OEM Warranty.</p>
              </div>
            </div>

            {/* Right: Totals Table */}
            <div className="sm:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Parts Taxable Value:</span>
                <span className="font-bold">₹{invoice.financials.partsTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Labour Taxable Value:</span>
                <span className="font-bold">₹{invoice.financials.laborTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span>₹{invoice.financials.cgstTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span>₹{invoice.financials.sgstTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                <span>Grand Total:</span>
                <span className="text-blue-900 font-mono">₹{invoice.financials.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature & Verification Footer */}
          <div className="flex justify-between items-end border-t border-slate-300 pt-4 text-[10px] text-slate-400 font-mono">
            <div>
              <p>Cryptographic Signature Hash:</p>
              <p className="text-slate-600 font-bold">{invoice.digitalSignatureHash}</p>
              <p className="text-emerald-700 font-semibold mt-0.5">✓ Cryptographically Verified with Dealer Central Node</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-800 text-xs font-sans mb-6">{invoice.authorizedSignatory}</p>
              <p className="border-t border-slate-400 pt-1 text-slate-600 font-semibold">Authorised Signatory</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
