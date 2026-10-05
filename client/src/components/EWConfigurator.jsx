import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Check, 
  Car, 
  Percent, 
  Zap, 
  Send, 
  Clock, 
  Award,
  Layers,
  HelpCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RazorpayEMIModal from './RazorpayEMIModal';

export default function EWConfigurator({ ewPackages, onSendEWProposal, jobCards }) {
  const models = Object.keys(ewPackages || {});
  const [selectedModel, setSelectedModel] = useState(models[0] || "Tata Harrier Fearless Plus Dark Edition");
  const [activeTier, setActiveTier] = useState("Gold Shield (Recommended)");
  const [proposalSent, setProposalSent] = useState(false);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [selectedPkgForEMI, setSelectedPkgForEMI] = useState(null);

  const packages = ewPackages?.[selectedModel] || [];
  const currentPkg = packages.find(p => p.tier === activeTier) || packages[1] || packages[0];
  const targetJobCard = (jobCards || []).find(j => j.model?.includes(selectedModel.split(' ')[1])) || jobCards?.[0];

  const handleDispatch = () => {
    setProposalSent(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setProposalSent(false), 4000);
  };

  const handleOpenEMI = (pkg) => {
    setSelectedPkgForEMI(pkg);
    setShowEMIModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  Extended Warranty (EW) & No-Cost EMI Engine
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Avg Dealer Margin: 40% (₹7,500+ / Policy)
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Predictive Extended Warranty & Financing Gateway
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Configure tiered bumper-to-bumper protection packages, automated Razorpay No-Cost EMI structures, and instant SA gamified commissions.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">Monthly EW Margin Target</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">₹4.20 Lakhs</span>
            <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
              42 Policies Projected This Month
            </span>
          </div>
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <Car className="w-4 h-4 text-purple-600" />
          <span>Select Tata Vehicle Architecture:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedModel === m
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Tiered Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => {
          const isSelected = activeTier === pkg.tier;
          return (
            <div
              key={idx}
              onClick={() => setActiveTier(pkg.tier)}
              className={`rounded-2xl border p-6 transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                isSelected
                  ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    pkg.tier.includes('Recommended')
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pkg.tier}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 font-mono">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block font-sans">
                      or ₹{pkg.emiMonthly}/mo EMI
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs text-slate-800 font-medium">{pkg.coverage}</div>
                  <div className="text-[11px] text-slate-500">Duration: {pkg.durationYears} Yr / {pkg.durationKm.toLocaleString()} km</div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Dealer Net Margin:</span>
                    <span className="text-emerald-600 font-bold">+₹{pkg.dealerMargin.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SA Instant Commission:</span>
                    <span className="text-purple-600 font-bold">+₹{pkg.saCommission.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEMI(pkg);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Razorpay No-Cost EMI (₹{pkg.emiMonthly}/mo)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMI Modal */}
      {showEMIModal && selectedPkgForEMI && (
        <RazorpayEMIModal
          jobCard={targetJobCard}
          selectedPackage={selectedPkgForEMI}
          isOpen={showEMIModal}
          onClose={() => setShowEMIModal(false)}
          onPaymentComplete={(data) => {
            alert(`🎉 Extended Warranty Payment Authorized via Razorpay! Certificate sent to customer WhatsApp.`);
          }}
        />
      )}
    </div>
  );
}
