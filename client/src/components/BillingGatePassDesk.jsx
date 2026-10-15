import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  CreditCard, 
  Building, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Printer, 
  Lock, 
  Clock, 
  Search,
  ExternalLink,
  Shield,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GSTInvoiceModal from './GSTInvoiceModal';

export default function BillingGatePassDesk({ currentUser, onDataRefresh }) {
  const [activeJobCardId, setActiveJobCardId] = useState('JC-2026-8899');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [gstSummary, setGstSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState('CARD_EDC'); // 'CARD_EDC', 'BANK_RTGS_NEFT', 'CASH', 'FLEET_CREDIT'
  const [paymentRef, setPaymentRef] = useState('RRN-99214402');
  const [settledResult, setSettledResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Guard Mode State
  const [gatePassCodeInput, setGatePassCodeInput] = useState('');
  const [guardVerificationResult, setGuardVerificationResult] = useState(null);
  const [activeTab, setActiveTab] = useState(currentUser?.role === 'SECURITY_GUARD' ? 'guard_scanner' : 'cashier_desk');

  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/v2/billing/gst-summary/${activeJobCardId}`);
      const json = await res.json();
      if (json.success) setGstSummary(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [activeJobCardId]);

  const handleSettleBill = async (e) => {
    e.preventDefault();
    if (!paymentRef.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v2/billing/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: activeJobCardId,
          paymentMode,
          paymentRef: paymentRef.trim(),
          cashierId: currentUser?.id || 'usr-cashier-1',
          cashierName: currentUser?.name || 'Sunita Chouhan'
        })
      });
      const json = await res.json();
      if (json.success) {
        setSettledResult(json.data);
        setGatePassCodeInput(json.data.passCode);
        confetti({ particleCount: 70, spread: 50 });
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyGatePass = async (codeToVerify) => {
    const code = codeToVerify || gatePassCodeInput;
    if (!code.trim()) return;
    try {
      const res = await fetch('/api/v2/gate-pass/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passCode: code.trim(),
          guardId: currentUser?.id || 'usr-guard-1',
          guardName: currentUser?.name || 'Ram Singh (Gate 1)',
          guardNotes: 'Vehicle physical exit cleared with printed invoice copy.'
        })
      });
      const json = await res.json();
      setGuardVerificationResult(json.data);
      if (json.success) {
        confetti({ particleCount: 60, spread: 40 });
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
              Statutory Billing & Gate Pass Desk
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Indian GST Rules Active (SAC 9987 & HSN 8708)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Cashier Settlement Audit & Security Gate Pass
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operator: <span className="text-slate-800 font-bold">{currentUser?.name || 'Sunita Chouhan'}</span> • Zero Money Interception • Pure Payment Audit & Clearance
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('cashier_desk')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'cashier_desk'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Cashier Invoicing Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guard_scanner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'guard_scanner'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Gate Guard Scanner</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cashier Invoicing & Settlement */}
      {activeTab === 'cashier_desk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Official GST Tax Computation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-blue-700" />
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Statutory Tax Invoice Breakdown (Job Card: {activeJobCardId})
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  GSTIN: 23AABCS8899K1Z4
                </span>
              </div>

              {gstSummary && (
                <div className="space-y-4 text-xs">
                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2">Description</th>
                          <th className="p-2">SAC/HSN</th>
                          <th className="p-2 text-right">Taxable</th>
                          <th className="p-2 text-right">GST Rate</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {gstSummary.items.map(it => (
                          <tr key={it.id}>
                            <td className="p-2 text-slate-900 font-bold">{it.description}</td>
                            <td className="p-2 font-mono text-slate-500">{it.code}</td>
                            <td className="p-2 text-right font-mono text-slate-700">₹{it.qty * it.unit_price}</td>
                            <td className="p-2 text-right font-mono text-amber-700 font-bold">{it.gst_rate}%</td>
                            <td className="p-2 text-right font-mono font-bold text-slate-900">₹{Math.round(it.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Indian GST Computation Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Labor (SAC 9987):</span>
                      <span>₹{gstSummary.taxableLabor}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] pl-4">
                      <span>• CGST @ 9%:</span>
                      <span>₹{gstSummary.laborCgst}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] pl-4">
                      <span>• SGST @ 9%:</span>
                      <span>₹{gstSummary.laborSgst}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                      <span>Taxable Spares (HSN 8708):</span>
                      <span>₹{gstSummary.taxableSpares}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] pl-4">
                      <span>• CGST @ 14%:</span>
                      <span>₹{gstSummary.sparesCgst}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] pl-4">
                      <span>• SGST @ 14%:</span>
                      <span>₹{gstSummary.sparesSgst}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total (All Taxes Incl.):</span>
                      <span className="text-emerald-700">₹{gstSummary.grandTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Multi-Mode Payment Reference Auditor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Payment Mode & Reference Audit
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Zero Interception
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Dealer collects directly via EDC terminal, bank RTGS, or cash drawer. Enter payment reference code below to reconcile ledger and release Gate Pass.
              </p>

              {/* Payment Mode Selector */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'CARD_EDC', label: 'EDC Card POS', icon: CreditCard },
                  { id: 'BANK_RTGS_NEFT', label: 'Bank RTGS/NEFT', icon: Building },
                  { id: 'CASH', label: 'Cash Drawer', icon: Banknote },
                  { id: 'FLEET_CREDIT', label: 'Fleet Credit PO', icon: Receipt },
                ].map(pm => {
                  const isSelected = paymentMode === pm.id;
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => {
                        setPaymentMode(pm.id);
                        if (pm.id === 'CARD_EDC') setPaymentRef('RRN-99214402');
                        else if (pm.id === 'BANK_RTGS_NEFT') setPaymentRef('PUNB242890123');
                        else if (pm.id === 'CASH') setPaymentRef('CASH-REC-8819');
                        else setPaymentRef('FLEET-PO-2026-99');
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Reference Form */}
              <form onSubmit={handleSettleBill} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {paymentMode === 'CARD_EDC' ? 'Bank Terminal RRN / Auth Code *' :
                     paymentMode === 'BANK_RTGS_NEFT' ? 'Bank UTR Reference Number *' :
                     paymentMode === 'CASH' ? 'Cash Register Receipt Serial # *' :
                     'Corporate Purchase Order (PO) Number *'}
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Enter transaction reference..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600 uppercase"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Settle Bill & Release Gate Pass</span>
                </button>
              </form>
            </div>

            {/* Generated Gate Pass Card */}
            {settledResult && (
              <div className="bg-white border-2 border-emerald-400 rounded-2xl p-5 shadow-md space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Security Gate Pass Released
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{settledResult.invoiceNo}</span>
                </div>

                <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Gate Pass Code:</div>
                    <div className="text-sm font-mono font-black text-emerald-800">{settledResult.passCode}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Scanned by Security Guard at gate exit</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print GST Tax Invoice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('guard_scanner');
                      setGatePassCodeInput(settledResult.passCode);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Test Security Gate Scan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Security Gate Guard QR Scanner */}
      {activeTab === 'guard_scanner' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
              <Shield className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">Workshop Exit Gate 1 (Security Terminal)</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Scan vehicle Gate Pass QR code or enter code to verify paid settlement before physical gate boom barrier is lifted.
              </p>
            </div>

            {/* Quick Test Codes */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Code:</span>
              <button
                type="button"
                onClick={() => setGatePassCodeInput('GP-MP09WA9011-8899')}
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-700 text-slate-700 hover:text-white border border-slate-300 cursor-pointer transition-all"
              >
                GP-MP09WA9011-8899
              </button>
            </div>

            <div className="flex space-x-2 max-w-md mx-auto">
              <input
                type="text"
                value={gatePassCodeInput}
                onChange={(e) => setGatePassCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter Gate Pass Code (e.g. GP-MP09WA9011-8899)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono font-black text-slate-900 text-center uppercase focus:outline-hidden focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => handleVerifyGatePass(gatePassCodeInput)}
                className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-xs uppercase shrink-0 cursor-pointer shadow-xs"
              >
                Scan & Verify
              </button>
            </div>
          </div>

          {/* Verification Result Card */}
          {guardVerificationResult && (
            <div className={`p-6 rounded-2xl border shadow-md space-y-3 transition-all ${
              guardVerificationResult.valid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center space-x-3">
                {guardVerificationResult.valid ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {guardVerificationResult.valid ? 'GATE CLEARANCE GRANTED — VEHICLE ALLOWED TO EXIT' : 'GATE CLEARANCE BLOCKED!'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {guardVerificationResult.message}
                  </p>
                </div>
              </div>

              {guardVerificationResult.pass && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2 text-slate-700 shadow-2xs">
                    <div>Vehicle: <span className="text-slate-900 font-bold">{guardVerificationResult.pass.reg_no}</span></div>
                    <div>Customer: <span className="text-slate-900 font-bold">{guardVerificationResult.pass.customer_name}</span></div>
                    <div>Invoice: <span className="text-slate-900 font-bold">{guardVerificationResult.pass.invoice_no}</span></div>
                    <div>Exit Timestamp: <span className="text-emerald-700 font-bold">{guardVerificationResult.pass.exited_at?.slice(11, 19)}</span></div>
                  </div>

                  {/* Phase 7: 80mm ESC/POS Thermal Security Gate Slip */}
                  <div className="bg-white p-4 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-900 max-w-sm mx-auto shadow-xs text-center space-y-1 printable-document">
                    <div className="font-black text-xs uppercase border-b border-dashed border-slate-400 pb-1">
                      *** SHYAM AUTOMOTIVE (TATA) ***<br/>
                      SECURITY GATE EXIT CLEARANCE SLIP
                    </div>
                    <div className="text-left pt-1 space-y-0.5">
                      <div>GATE PASS: <strong>{guardVerificationResult.pass.pass_code}</strong></div>
                      <div>VEHICLE: <strong>{guardVerificationResult.pass.reg_no}</strong></div>
                      <div>MODEL: <strong>{guardVerificationResult.pass.model || 'Tata Motors PV'}</strong></div>
                      <div>CUSTOMER: <strong>{guardVerificationResult.pass.customer_name}</strong></div>
                      <div>INVOICE: <strong>{guardVerificationResult.pass.invoice_no}</strong></div>
                      <div>SETTLEMENT: <strong>CLEARED / PAID</strong></div>
                      <div>EXIT TIME: <strong>{new Date().toLocaleTimeString('en-IN')}</strong></div>
                      <div>GUARD: <strong>{currentUser?.name || 'Ram Singh (Gate 1)'}</strong></div>
                    </div>
                    <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
                      BARRIER LIFTED • HAVE A SAFE DRIVE
                    </div>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors print:hidden"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print 80mm Thermal Slip (ESC/POS)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official Printable GST Tax Invoice Modal */}
      <GSTInvoiceModal
        jobCardId={activeJobCardId}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
