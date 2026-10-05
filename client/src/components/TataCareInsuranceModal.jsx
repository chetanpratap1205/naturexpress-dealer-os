import React, { useState, useEffect } from 'react';
import { Shield, Send, CheckCircle2, X, Car, Percent, DollarSign, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

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
          if (res.success && res.data.length > 0) {
            setQuotes(res.data);
            setSelectedQuote(res.data[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleDispatchWhatsApp = async () => {
    if (!selectedQuote) return;
    setDispatching(true);
    setDispatchSuccess(null);

    try {
      const res = await fetch('/api/insurance/dispatch-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: selectedQuote.id })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchSuccess(`✓ Tata Care+ Insurance Quote dispatched to ${selectedQuote.customerName}'s WhatsApp (${selectedQuote.customerPhone}).`);
        confetti({ particleCount: 70, spread: 60 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDispatching(false);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-4xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/60 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">Tata Care+ Motor Insurance Renewal Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                15% Dealer Referral Margin
              </span>
            </div>
            <p className="text-xs text-slate-500">Auto-triggers Tata AIG / HDFC Ergo zero-dep renewal quotes with dealer referral commissions</p>
          </div>
        </div>
        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Quote Selection Column */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Vehicles In Workshop Due For Renewal
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
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900 font-mono">{q.regNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                        Expires {q.policyExpiry}
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
            <div className="md:col-span-2 bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedQuote.model} — {selectedQuote.regNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Owner: <span className="font-semibold text-slate-800">{selectedQuote.customerName}</span> ({selectedQuote.customerPhone})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Dealer Commission</span>
                  <span className="text-base font-black text-emerald-600 font-mono">
                    ₹{selectedQuote.dealerCommission.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coverage comparison cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Underwriting Insurer</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedQuote.insurer}</p>
                  <span className="text-[10px] text-blue-600 font-semibold block">Tata Authorized Cashless</span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Insured Declared Value (IDV)</span>
                  <p className="font-bold text-slate-900 text-sm font-mono">
                    ₹{selectedQuote.idv.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 block">Ex-Showroom Market Indexed</span>
                </div>
              </div>

              {/* Add-on benefits */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Included Tata Care+ Add-ons:</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedQuote.addons?.map((addon, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{addon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">1-Year Comprehensive Premium</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    ₹{selectedQuote.premium.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> (incl. 18% GST)</span>
                  </span>
                </div>

                <button
                  onClick={handleDispatchWhatsApp}
                  disabled={dispatching}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {dispatching ? "Dispatching Quote..." : "Dispatch Quote to Customer WhatsApp"}
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
