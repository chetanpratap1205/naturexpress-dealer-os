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
  Sparkles,
  RefreshCw,
  Lock,
  Send,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BillingCashierAgentModal({ isOpen, onClose, onDataRefresh }) {
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState(null);
  const [selectedJcId, setSelectedJcId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI_DYNAMIC_QR');
  const [guardPin, setGuardPin] = useState('9901');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchDossier();
    }
  }, [isOpen]);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/billing-cashier/dossier');
      const data = await res.json();
      if (data.success) {
        setDossier(data.data);
        if (data.data.invoices?.length > 0 && !selectedJcId) {
          setSelectedJcId(data.data.invoices[0].jobCardId);
        }
      }
    } catch (err) {
      console.error("Error fetching billing dossier:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeInvoice = dossier?.invoices?.find(inv => inv.jobCardId === selectedJcId) || dossier?.invoices?.[0];

  const handleRecordPayment = async (jcId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/billing-cashier/record-payment/${jcId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          referenceNo: `UPI-${Date.now().toString().substring(6)}`,
          amountPaid: activeInvoice?.summary?.netPayable
        })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 90, spread: 70 });
        setToastMessage(`✓ Payment of ₹${(data.data.amount || 0).toLocaleString()} settled via ${paymentMethod}!`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleReleaseGatePass = async (jcId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/billing-cashier/release-gatepass/${jcId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardPin })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setToastMessage(`🔒 Digital Gate Pass ${data.data.gatePassId} released! Barrier gate open.`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleDispatchWhatsApp = async (jcId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/billing-cashier/dispatch-whatsapp/${jcId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 60, spread: 50 });
        setToastMessage(`✓ GST Tax Invoice PDF & Gate Pass QR sent to customer's WhatsApp!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-6xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl shadow-xs">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 tracking-wider">
                  Role #10 • Billing & Cashier Compliance Officer
                </span>
                <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% GST & NIC Compliant
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                Instant GST Tax Invoice & Cryptographic Gate Pass Releases
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchDossier}
              disabled={loading}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Refresh Invoices"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-slideDown">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Cashier KPI Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Today Settled Collections</span>
            <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
              ₹{(dossier?.kpis?.totalSettledToday || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 block font-semibold mt-0.5">100% Reconciled</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Pending Customer Settlement</span>
            <span className="text-base sm:text-lg font-black text-amber-600 font-mono">
              ₹{(dossier?.kpis?.totalPendingAmount || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-amber-600 block font-semibold mt-0.5">
              {dossier?.kpis?.pendingBillingCount || 0} Vehicles Awaiting
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Digital Gate Passes Released</span>
            <span className="text-base sm:text-lg font-black text-blue-600 font-mono">
              {dossier?.kpis?.digitalGatePassesIssued || 0} Released
            </span>
            <span className="text-[10px] text-blue-600 block font-semibold mt-0.5">SHA-256 Anti-Theft Guard Pin</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">GSTIN Registered Dealer</span>
            <span className="text-xs font-mono font-bold text-slate-800 mt-1 block truncate">
              {dossier?.dealership?.gstin || "23AABCS1429B1Z8"}
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold">Madhya Pradesh (Code 23)</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/40">
          
          {/* Left Column: Invoice Ledger List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Active Job Card Invoices ({dossier?.invoices?.length || 0})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
              {(dossier?.invoices || []).map((inv) => {
                const isSelected = selectedJcId === inv.jobCardId;
                const isPaid = inv.paymentStatus === 'PAID';

                return (
                  <div
                    key={inv.jobCardId}
                    onClick={() => setSelectedJcId(inv.jobCardId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-black text-slate-900 text-sm block">{inv.customerName}</span>
                        <span className="text-xs text-slate-500 font-mono">{inv.regNo}</span>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isPaid ? '✓ Paid' : 'Pending'}
                        </span>
                        <span className="text-xs font-black text-slate-900 font-mono block mt-1">
                          ₹{(inv.summary?.netPayable || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[140px]">{inv.model}</span>
                      <span className="font-mono text-emerald-700 font-bold">{inv.invoiceNumber}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Official GST Tax Invoice (8 Cols) */}
          {activeInvoice && (
            <div className="lg:col-span-8 space-y-4">
              
              {/* Printable Tax Invoice Container */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                
                {/* Dealership Header */}
                <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-black text-slate-900">{activeInvoice.dealership?.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{activeInvoice.dealership?.address}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1 font-mono">
                      <span>GSTIN: <strong className="text-slate-800">{activeInvoice.dealership?.gstin}</strong></span>
                      <span>CIN: <strong className="text-slate-800">{activeInvoice.dealership?.cin}</strong></span>
                      <span>State: <strong className="text-slate-800">{activeInvoice.dealership?.state}</strong></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-emerald-700 block">TAX INVOICE</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{activeInvoice.invoiceNumber}</span>
                    <span className="text-[11px] text-slate-500 block">Date: {activeInvoice.invoiceDate}</span>
                  </div>
                </div>

                {/* Customer & Vehicle Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Billed To</span>
                    <span className="font-bold text-slate-900 block truncate">{activeInvoice.customerName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{activeInvoice.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Vehicle & Reg No</span>
                    <span className="font-bold text-emerald-700 font-mono block">{activeInvoice.regNo}</span>
                    <span className="text-slate-600 text-[11px] truncate block">{activeInvoice.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">VIN & Odometer</span>
                    <span className="font-mono text-slate-700 text-[11px] block">{activeInvoice.vin}</span>
                    <span className="text-slate-500 text-[11px] font-mono">{activeInvoice.odometer?.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Service Advisor</span>
                    <span className="font-bold text-slate-900 block">{activeInvoice.advisorName}</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">Fast-Track Passed</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5 text-center">HSN/SAC</th>
                        <th className="p-2.5 text-right">Taxable (₹)</th>
                        <th className="p-2.5 text-center">GST %</th>
                        <th className="p-2.5 text-right">CGST (₹)</th>
                        <th className="p-2.5 text-right">SGST (₹)</th>
                        <th className="p-2.5 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {(activeInvoice.lines || []).map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-medium text-slate-800">
                            {line.description}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500 text-[11px]">{line.hsnSac}</td>
                          <td className="p-2.5 text-right font-mono text-slate-700">₹{line.taxableValue?.toLocaleString()}</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">{line.gstRate}%</td>
                          <td className="p-2.5 text-right font-mono text-slate-500">₹{line.cgstAmount?.toLocaleString()}</td>
                          <td className="p-2.5 text-right font-mono text-slate-500">₹{line.sgstAmount?.toLocaleString()}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{line.totalAmount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Net Payable Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Parts Taxable Value (HSN 8708):</span>
                      <span className="font-mono text-slate-900 font-bold">₹{(activeInvoice.summary?.partsTaxable || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Parts GST (14% CGST + 14% SGST):</span>
                      <span className="font-mono text-slate-900 font-bold">₹{(activeInvoice.summary?.partsTotalGst || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Labor Taxable Value (SAC 998714):</span>
                      <span className="font-mono text-slate-900 font-bold">₹{(activeInvoice.summary?.laborTaxable || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Labor GST (9% CGST + 9% SGST):</span>
                      <span className="font-mono text-slate-900 font-bold">₹{(activeInvoice.summary?.laborTotalGst || 0).toLocaleString()}</span>
                    </div>
                    {activeInvoice.summary?.loyaltyDiscount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                        <span>Tata Seva Loyalty Points Discount:</span>
                        <span className="font-mono">- ₹{activeInvoice.summary.loyaltyDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                        Net Amount Payable (Incl. 100% GST)
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-1">
                        ₹{(activeInvoice.summary?.netPayable || 0).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1 truncate">
                        SHA-256 Seal: {activeInvoice.invoiceHash}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-xs">
                      <span className="text-emerald-800 font-semibold">Payment Status:</span>
                      <span className={`font-black uppercase px-2 py-0.5 rounded-full text-[10px] ${
                        activeInvoice.paymentStatus === 'PAID'
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                          : 'bg-amber-200 text-amber-900 border border-amber-400'
                      }`}>
                        {activeInvoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Digital Gate Pass Section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900">Cryptographic Digital Gate Pass</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          activeInvoice.gatePassStatus === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {activeInvoice.gatePassStatus}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono block mt-0.5">
                        Token: {activeInvoice.gatePassToken} • Gate: Exit #1 Bypass Main Road
                      </span>
                    </div>
                  </div>

                  {activeInvoice.gatePassStatus !== 'RELEASED' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength="4"
                        value={guardPin}
                        onChange={(e) => setGuardPin(e.target.value)}
                        placeholder="Guard PIN"
                        className="w-24 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-center font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        onClick={() => handleReleaseGatePass(activeInvoice.jobCardId)}
                        disabled={actionLoading}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" /> Release Pass
                      </button>
                    </div>
                  )}
                </div>

                {/* Cashier Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span>Print Tax Invoice</span>
                    </button>

                    <button
                      onClick={() => handleDispatchWhatsApp(activeInvoice.jobCardId)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                    >
                      <Send className="w-4 h-4 text-emerald-600" />
                      <span>Send WhatsApp Invoice PDF</span>
                    </button>
                  </div>

                  {activeInvoice.paymentStatus !== 'PAID' && (
                    <button
                      onClick={() => handleRecordPayment(activeInvoice.jobCardId)}
                      disabled={actionLoading}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settle Payment & Issue Receipt</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
