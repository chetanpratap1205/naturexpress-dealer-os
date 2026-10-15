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
import { openWhatsApp, buildEWProposalMessage } from '../lib/whatsapp';

const DEFAULT_EW_PACKAGES = {
  "Tata Harrier Fearless Plus Dark Edition": [
    { tier: "Silver Shield (1 Yr / 25k km)", price: 18500, emiMonthly: 1541, coverage: "Engine, Transmission, ECU & Power Steering", durationYears: 1, durationKm: 25000, dealerMargin: 5500, saCommission: 1200 },
    { tier: "Gold Shield (Recommended)", price: 28500, emiMonthly: 2375, coverage: "Complete Mechanical + Electrical + Touchscreen Infotainment", durationYears: 2, durationKm: 50000, dealerMargin: 8500, saCommission: 1800 },
    { tier: "Platinum 5-Year Comprehensive", price: 44500, emiMonthly: 3708, coverage: "Bumper-to-Bumper Comprehensive + Unlimited Roadside Assistance", durationYears: 3, durationKm: 75000, dealerMargin: 14000, saCommission: 2500 }
  ],
  "Tata Nexon EV Empowered Plus (45 kWh)": [
    { tier: "EV Battery Shield (3 Yr Extension)", price: 22000, emiMonthly: 1833, coverage: "High Voltage Battery Pack & Drive Motor Warranty Extension", durationYears: 3, durationKm: 60000, dealerMargin: 6500, saCommission: 1500 },
    { tier: "Gold Shield (Recommended)", price: 31000, emiMonthly: 2583, coverage: "Complete EV Powertrain, Inverter & BMS Control Module", durationYears: 2, durationKm: 50000, dealerMargin: 9200, saCommission: 2000 },
    { tier: "Platinum Unlimited EV Care", price: 48000, emiMonthly: 4000, coverage: "Full Vehicle Electronics, HV System & Zero-Downtime Replacement", durationYears: 3, durationKm: 80000, dealerMargin: 15000, saCommission: 3000 }
  ],
  "Tata Safari Accomplished Plus 6S": [
    { tier: "Silver Shield (1 Yr / 25k km)", price: 19500, emiMonthly: 1625, coverage: "Engine, AT Gearbox & Suspension", durationYears: 1, durationKm: 25000, dealerMargin: 5800, saCommission: 1300 },
    { tier: "Gold Shield (Recommended)", price: 32000, emiMonthly: 2666, coverage: "Full Mechanical + Panoramic Sunroof Motors + ADAS Radar", durationYears: 2, durationKm: 50000, dealerMargin: 9600, saCommission: 2100 },
    { tier: "Platinum 5-Year Comprehensive", price: 49500, emiMonthly: 4125, coverage: "Complete Bumper-to-Bumper + VIP Priority Bay Service", durationYears: 3, durationKm: 75000, dealerMargin: 16000, saCommission: 3200 }
  ]
};

export default function EWConfigurator({ ewPackages = {}, onSendEWProposal, jobCards = [] }) {
  const sourcePackages = (ewPackages && Object.keys(ewPackages).length > 0) ? ewPackages : DEFAULT_EW_PACKAGES;
  const models = Object.keys(sourcePackages);
  const [selectedModel, setSelectedModel] = useState(models[0] || "Tata Harrier Fearless Plus Dark Edition");
  const [activeTier, setActiveTier] = useState("Gold Shield (Recommended)");
  const [proposalSent, setProposalSent] = useState(false);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [selectedPkgForEMI, setSelectedPkgForEMI] = useState(null);

  const packages = sourcePackages[selectedModel] || sourcePackages[models[0]] || [];
  const currentPkg = packages.find(p => p.tier === activeTier) || packages[1] || packages[0] || {
    tier: "Gold Shield",
    price: 28500,
    emiMonthly: 2375,
    coverage: "Comprehensive Mechanical & Electrical Protection",
    durationYears: 2,
    durationKm: 50000,
    dealerMargin: 8500,
    saCommission: 1800
  };

  const targetJobCard = (jobCards || []).find(j => j.model && selectedModel && j.model.toLowerCase().includes(selectedModel.split(' ')[1]?.toLowerCase())) || jobCards?.[0] || {
    id: "jc-8899",
    regNo: "MP-09-EB-8899",
    model: selectedModel,
    customerName: "Rajesh Verma",
    customerPhone: "+91 98260 44551"
  };

  const handleDispatch = () => {
    const msg = buildEWProposalMessage({
      customerName: targetJobCard.customerName || 'Valued Customer',
      vehicleModel: selectedModel,
      regNo: targetJobCard.regNumber || targetJobCard.regNo || 'MP-09-EB-8899',
      planName: currentPkg.tier,
      totalAmount: currentPkg.price,
      noCostEmi: currentPkg.emiMonthly,
      advisorName: 'Shyam Automotive Care Team (Scheme 140)'
    });

    openWhatsApp({
      phone: targetJobCard.customerPhone || '919826012345',
      message: msg,
      newTab: true
    });

    setProposalSent(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    if (onSendEWProposal) onSendEWProposal();
    setTimeout(() => setProposalSent(false), 4000);
  };

  const handleOpenEMI = (pkg) => {
    setSelectedPkgForEMI(pkg);
    setShowEMIModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 shrink-0 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  Extended Warranty (EW) & No-Cost EMI Engine
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Avg Dealer Margin: 40% (₹7,500+ / Policy)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                Predictive Extended Warranty & Financing Gateway
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Configure tiered bumper-to-bumper protection packages, automated Razorpay No-Cost EMI structures, and instant SA gamified commissions.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left sm:text-right shadow-xs shrink-0">
            <span className="text-xs text-slate-500 font-medium block">Monthly EW Margin Target</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">₹4.20 Lakhs</span>
            <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
              42 Policies Projected This Month
            </span>
          </div>
        </div>
      </div>

      {/* Model Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 shrink-0">
          <Car className="w-4 h-4 text-purple-600" />
          <span>Select Tata Vehicle Architecture:</span>
        </span>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
          const pkgPrice = Number(pkg.price || 24500);
          const pkgMargin = Number(pkg.dealerMargin || 7500);
          const pkgComm = Number(pkg.saCommission || 1500);
          const pkgDurationKm = Number(pkg.durationKm || 50000);

          return (
            <div
              key={idx}
              onClick={() => setActiveTier(pkg.tier)}
              className={`rounded-3xl border p-6 transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    pkg.tier.includes('Recommended')
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pkg.tier}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 font-mono">₹{pkgPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 block font-sans">
                      or ₹{pkg.emiMonthly}/mo EMI
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs text-slate-800 font-medium">{pkg.coverage}</div>
                  <div className="text-[11px] text-slate-500">Duration: {pkg.durationYears} Yr / {pkgDurationKm.toLocaleString('en-IN')} km</div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Dealer Net Margin:</span>
                    <span className="text-emerald-600 font-bold">+₹{pkgMargin.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SA Instant Commission:</span>
                    <span className="text-purple-600 font-bold">+₹{pkgComm.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEMI(pkg);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Dealership Counter / Bank EMI (₹{pkg.emiMonthly}/mo)</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDispatch();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Tap WhatsApp Proposal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {proposalSent && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs shadow-xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Extended Warranty Proposal & EMI breakdown sent to customer via WhatsApp!</span>
        </div>
      )}

      {/* Direct Dealership Counter Activation Modal */}
      {showEMIModal && selectedPkgForEMI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
                  Shyam Automotive • Official Settlement Desk
                </span>
                <h3 className="text-xl font-black text-slate-900">Activate Tata Care+ Warranty</h3>
              </div>
              <button
                onClick={() => setShowEMIModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-2">
              <div className="text-xs font-black uppercase text-purple-800">{selectedPkgForEMI.tier}</div>
              <div className="text-sm font-bold text-slate-900">{targetJobCard?.model || 'Tata Vehicle'}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedPkgForEMI.coverage}</p>
              <div className="pt-2 border-t border-purple-200 flex items-center justify-between text-xs">
                <span>Total Policy Premium:</span>
                <span className="font-mono font-black text-base text-purple-900">₹{selectedPkgForEMI.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Bank EMI Structure:</span>
                <span className="font-mono font-bold text-emerald-700">₹{selectedPkgForEMI.emiMonthly.toLocaleString('en-IN')} / month (12 Months)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>SA Gamified Commission:</span>
                <span className="font-mono font-bold text-purple-700">+₹{selectedPkgForEMI.saCommission.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Authorized In-Store Payment Modes:</div>
              <div>• Physical Card EDC Swipe (RRN Stamped)</div>
              <div>• Bank Direct RTGS / NEFT (UTR Verified)</div>
              <div>• Cash Desk Official Receipt #</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEMIModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                  alert(`✓ Extended Warranty Activated! Policy registered to vehicle VIN and credited to Dealership Revenue Ledger.`);
                  setShowEMIModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs uppercase tracking-wider"
              >
                Authorize & Activate Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
