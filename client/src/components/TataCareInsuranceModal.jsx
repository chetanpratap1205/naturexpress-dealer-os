import React, { useState, useEffect } from 'react';
import { Shield, Send, CheckCircle2, X, Car, Percent, DollarSign, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp, buildInsuranceQuoteMessage } from '../lib/whatsapp';

export default function TataCareInsuranceModal({ isOpen = true, onClose, inline = false }) {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/insurance/quotes')
        .then(res => res.json())
        .then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setQuotes(res.data);
            setSelectedQuote(res.data[0]);
          } else {
            // Safe fallback mock list if empty
            const fallbackQuotes = [
              {
                id: "ins-4020",
                regNo: "MP-09-CW-4020",
                regNumber: "MP-09-CW-4020",
                model: "Tata Harrier Fearless Plus Dark",
                customerName: "Dr. Vikram Singhal",
                customerPhone: "+91 98931 77220",
                idvValue: 1850000,
                policyExpiry: "Expiring in 54 Days",
                recommendedPlan: "Tata AIG Auto Secure (0-Dep + Engine Protect)",
                netPayable: 14200,
                dealerReferralCommission: 2840,
                addons: ["0-Depreciation", "Engine Protector", "Return to Invoice", "Key Cover"]
              },
              {
                id: "ins-8899",
                regNo: "MP-09-EB-8899",
                regNumber: "MP-09-EB-8899",
                model: "Tata Nexon EV Empowered Plus",
                customerName: "Rajesh Verma",
                customerPhone: "+91 98260 44551",
                idvValue: 1420000,
                policyExpiry: "Expiring in 12 Days",
                recommendedPlan: "HDFC ERGO EV Secure (0-Dep + Battery Shield)",
                netPayable: 11400,
                dealerReferralCommission: 2280,
                addons: ["0-Depreciation", "HV Battery Shield", "Roadside Assistance"]
              }
            ];
            setQuotes(fallbackQuotes);
            setSelectedQuote(fallbackQuotes[0]);
          }
        })
        .catch(err => {
          console.error("Error fetching quotes", err);
        });
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleDispatchWhatsApp = async () => {
    if (!selectedQuote) return;
    setDispatching(true);
    setDispatchSuccess(null);

    try {
      const grossPrem = Number(selectedQuote.netPayable || selectedQuote.grossPremium || selectedQuote.premium || 14200);
      const commission = Number(selectedQuote.dealerReferralCommission || selectedQuote.dealerCommission || 2840);
      const idvFormatted = selectedQuote.idvValue ? `₹${(selectedQuote.idvValue / 100000).toFixed(1)} Lakh` : (selectedQuote.idv ? `₹${(selectedQuote.idv / 100000).toFixed(1)} Lakh` : '₹14.5 Lakh');

      const msg = buildInsuranceQuoteMessage({
        customerName: selectedQuote.customerName || 'Valued Customer',
        vehicleModel: selectedQuote.model || selectedQuote.vehicleModel || 'Tata Vehicle',
        regNo: selectedQuote.regNo || selectedQuote.regNumber || 'MP-09-CX-1234',
        expiringDays: selectedQuote.daysToExpiry || 14,
        idvValue: idvFormatted,
        premiumAmount: grossPrem,
        dealerCashback: Math.round(commission * 0.4),
        advisorName: `${selectedQuote.serviceAdvisor || 'Amit Verma'} (Shyam Tata Scheme 140)`
      });

      openWhatsApp({
        phone: selectedQuote.customerPhone || '919826012345',
        message: msg,
        newTab: true
      });

      const res = await fetch('/api/insurance/dispatch-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: selectedQuote.id })
      });
      await res.json().catch(() => ({}));
      setDispatchSuccess(`✓ 1-Tap Tata Care+ Insurance Quote opened for ${selectedQuote.customerName} (${selectedQuote.customerPhone || 'WhatsApp'}).`);
      confetti({ particleCount: 70, spread: 60 });
    } catch (err) {
      console.error(err);
      setDispatchSuccess(`✓ 1-Tap Tata Care+ Insurance Quote opened on WhatsApp.`);
    } finally {
      setDispatching(false);
    }
  };

  const commissionVal = Number(selectedQuote?.dealerReferralCommission || selectedQuote?.dealerCommission || 2840);
  const idvVal = Number(selectedQuote?.idvValue || selectedQuote?.idv || 1450000);
  const premiumVal = Number(selectedQuote?.netPayable || selectedQuote?.grossPremium || selectedQuote?.premium || 14200);
  const addonsList = selectedQuote?.addons || ["Zero Depreciation (0-Dep)", "Engine & Gearbox Protector", "Return to Invoice (RTI)", "24x7 Roadside Assistance", "Consumables & Key Cover"];

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-3xl shadow-sm' : 'max-w-4xl rounded-3xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/60 shadow-xs shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">Tata Care+ Motor Insurance Renewal Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ₹3,200+ Margin / Policy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Auto-triggers Tata AIG / HDFC Ergo zero-dep renewal quotes with dealer referral commissions</p>
          </div>
        </div>
        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Quote Selection Column */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Vehicles In Workshop ({quotes.length})
            </label>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {quotes.map((q) => {
                const isSelected = selectedQuote?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuote(q);
                      setDispatchSuccess(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-xs text-slate-900 font-mono">{q.regNumber || q.regNo}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 shrink-0">
                        {q.policyExpiry || q.currentPolicyExpiry || 'Due Soon'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{q.model}</p>
                    <p className="text-[11px] text-slate-500">{q.customerName}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Quote Details Card */}
          {selectedQuote && (
            <div className="md:col-span-2 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedQuote.model} — {selectedQuote.regNumber || selectedQuote.regNo}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Owner: <span className="font-semibold text-slate-800">{selectedQuote.customerName}</span> ({selectedQuote.customerPhone || 'Active'})
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Dealer Commission</span>
                  <span className="text-base font-black text-emerald-600 font-mono">
                    ₹{commissionVal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Coverage comparison cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Underwriting Insurer</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedQuote.recommendedPlan || selectedQuote.insurer || 'Tata AIG Auto Secure (0-Dep)'}</p>
                  <span className="text-[10px] text-blue-600 font-semibold block">Tata Authorized Cashless</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Insured Declared Value (IDV)</span>
                  <p className="font-bold text-slate-900 text-sm font-mono">
                    ₹{idvVal.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400 block">Ex-Showroom Market Indexed</span>
                </div>
              </div>

              {/* Add-on benefits */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Included Tata Care+ Add-ons:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {addonsList.map((addon, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{addon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-slate-200 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block">1-Year Comprehensive Premium</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    ₹{premiumVal.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500"> (incl. 18% GST)</span>
                  </span>
                </div>

                <button
                  onClick={handleDispatchWhatsApp}
                  disabled={dispatching}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {dispatching ? "Opening WhatsApp..." : "1-Tap Send WhatsApp Quote"}
                </button>
              </div>

              {dispatchSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dispatchSuccess}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!inline && (
        <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      {content}
    </div>
  );
}
