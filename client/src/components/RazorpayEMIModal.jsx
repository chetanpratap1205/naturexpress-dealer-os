import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, X, Zap, Sparkles, Send, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RazorpayEMIModal({ jobCard, selectedPackage, isOpen, onClose, onPaymentComplete }) {
  const [tenure, setTenure] = useState(12); // 3, 6, 9, 12 months
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !selectedPackage) return null;

  const amount = selectedPackage.price || 18900;
  const monthlyEmi = Math.round(amount / tenure);
  const dailyCost = Math.round(amount / (tenure * 30));

  const handlePay = async () => {
    setProcessing(true);

    try {
      const res = await fetch('/api/payments/verify-instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: jobCard.id,
          packageTier: selectedPackage.tier,
          amount,
          tenureMonths: tenure,
          commission: selectedPackage.saCommission || 650
        })
      });

      const data = await res.json();
      if (data.success) {
        setProcessing(false);
        setSuccess(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onPaymentComplete(data.data);
          onClose();
          setSuccess(false);
        }, 2200);
      }
    } catch (err) {
      console.error("Payment error", err);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">Razorpay & Pine Labs No-Cost EMI</h2>
              <p className="text-xs text-slate-500">Tata Motors Extended Warranty Financing Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-700 text-sm">
          {/* Selected Package Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                  {selectedPackage.tier}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-1">{jobCard.model}</h3>
                <p className="text-xs text-slate-600">{selectedPackage.coverage}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total Price</span>
                <div className="text-2xl font-black text-slate-900">₹{amount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* EMI Tenure Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Select No-Cost EMI Duration (0% Interest)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setTenure(m)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${tenure === m ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                >
                  <div className="text-xs font-bold">{m} Months</div>
                  <div className="text-sm font-black mt-1">₹{Math.round(amount / m).toLocaleString()}</div>
                  <div className="text-[9px] opacity-75">/ month</div>
                </button>
              ))}
            </div>
          </div>

          {/* Impact Comparison Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Daily Protection Cost:</span>
              <div className="text-emerald-700 font-bold text-sm">Just ₹{dailyCost} / day</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Out-of-Pocket Risk Covered:</span>
              <div className="text-rose-600 font-bold text-sm">₹62,000+ Shielded</div>
            </div>
          </div>

          {/* Bank Cards supported */}
          <div className="text-center text-[11px] text-slate-500">
            <span>Powered by Razorpay & Pine Labs • Supports HDFC, ICICI, SBI, Axis & Tata Capital EMI</span>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Payment Confirmed & Verified!</p>
                <p className="text-xs opacity-90">Official Tata EW Certificate dispatched to WhatsApp.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-600">
            SA Commission: <span className="text-emerald-700 font-bold">+₹{selectedPackage.saCommission || 650}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={processing || success}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {processing ? (
              <span>Authorizing EMI...</span>
            ) : success ? (
              <span>Activated!</span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Authorize ₹{monthlyEmi}/mo EMI Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
