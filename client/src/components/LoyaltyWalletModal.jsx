import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2, Gift, X, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoyaltyWalletModal({ isOpen = true, onClose, inline = false }) {
  const [account, setAccount] = useState(null);
  const [redeemingPerk, setRedeemingPerk] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/loyalty/veh-001')
        .then(res => res.json())
        .then(res => {
          if (res.success) setAccount(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleRedeem = async (perk, cost) => {
    setRedeemingPerk(perk);
    setRedeemSuccess(null);

    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: "veh-001", perkName: perk, pointsCost: cost })
      });
      const data = await res.json();
      if (data.success) {
        setRedeemSuccess(data.data.message);
        setAccount(data.data.account);
        confetti({ particleCount: 60, spread: 50 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRedeemingPerk(null);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-2xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/60 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">Tata Seva Customer Loyalty Wallet</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Retention Program
              </span>
            </div>
            <p className="text-xs text-slate-500">Earn & Burn points for routine servicing and free detailing</p>
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
      <div className="p-6 space-y-5">
        {/* Balance Card */}
        <div className="p-5 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 rounded-2xl text-white shadow-md shadow-amber-500/20 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider block">
                Tata Seva Platinum Balance
              </span>
              <div className="text-3xl font-black font-mono mt-1 flex items-baseline gap-2">
                <span>{account?.pointsBalance || 1450}</span>
                <span className="text-sm font-normal text-amber-100">Points (₹{(account?.pointsBalance || 1450)})</span>
              </div>
            </div>
            <span className="text-xs bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full font-bold border border-white/30">
              {account?.tier || 'Platinum Member'}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs text-amber-100">
            <span>Customer: <strong>{account?.customerName || 'Rajesh Verma'}</strong></span>
            <span>Vehicle: <strong>{account?.regNo || 'MP-09-EB-8899'}</strong></span>
          </div>
        </div>

        {/* Perks & Redeem options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Available Service Perks for 1-Tap Redemption
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Free Interior Foam Deep Clean", cost: 500, desc: "Antibacterial AC & upholstery sterilization" },
              { name: "Free Wheel Alignment & Balancing", cost: 750, desc: "Laser 4-wheel alignment check" },
              { name: "Underbody Anti-Rust Coating", cost: 1200, desc: "3M 5-year rubberized underbody seal" },
              { name: "₹500 Labor Discount Coupon", cost: 500, desc: "Instant deduction on today's service invoice" }
            ].map((perk, i) => {
              const canAfford = (account?.pointsBalance || 1450) >= perk.cost;
              const isRedeeming = redeemingPerk === perk.name;

              return (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    canAfford ? 'border-slate-200 bg-white hover:border-amber-300 shadow-xs' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between font-bold text-xs text-slate-900">
                      <span>{perk.name}</span>
                      <span className="text-amber-700 font-mono">{perk.cost} pts</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{perk.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleRedeem(perk.name, perk.cost)}
                      disabled={!canAfford || isRedeeming}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {isRedeeming ? "Redeeming..." : "Redeem Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {redeemSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{redeemSuccess}</span>
          </div>
        )}
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
