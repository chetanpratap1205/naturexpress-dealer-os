import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  DollarSign,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Clock,
  Car,
  ShoppingBag,
  Shield,
  PhoneCall,
  Calendar,
  Sparkles,
  Users,
  Wrench,
  Smartphone,
  ChevronRight,
  RefreshCw,
  Award,
  Video,
  ExternalLink,
  Layers,
  BarChart3,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DealerCommandCenter({
  dealership,
  jobCards = [],
  ccmAlerts = [],
  warrantyClaims = [],
  partsPool = [],
  onNavigateTab,
  onExecuteOpportunity,
  revenueOpportunities = [],
  revenueRadar = null,
  onDataRefresh
}) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [executingId, setExecutingId] = useState(null);
  const [showBriefingPreview, setShowBriefingPreview] = useState(false);
  const [briefingSent, setBriefingSent] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);

  // Dynamic calculations
  const totalLeakage = revenueRadar?.totalLeakageAtRisk || 472500;
  const totalRecovered = revenueRadar?.totalRecoveredToday || 42600;
  const categories = revenueRadar?.categories || {
    insurance: { amount: 142000, recoveredAmount: 18400, count: 12, marginRate: "20-25%" },
    accessories: { amount: 82000, recoveredAmount: 7200, count: 8, marginRate: "35%" },
    overdueService: { amount: 115000, recoveredAmount: 9600, count: 18, marginRate: "45%" },
    extendedWarranty: { amount: 63500, recoveredAmount: 4800, count: 5, marginRate: "15%" },
    unapprovedEstimates: { amount: 70000, recoveredAmount: 2600, count: 6, marginRate: "60%" }
  };

  const openOpps = (revenueOpportunities || []).filter(o => 
    activeCategoryFilter === 'ALL' || o.category === activeCategoryFilter || o.categoryKey === activeCategoryFilter
  );

  const pendingCount = (revenueOpportunities || []).filter(o => o.status !== 'RECOVERED').length;
  const recoveredCount = (revenueOpportunities || []).filter(o => o.status === 'RECOVERED').length;

  const activeVehiclesCount = jobCards.filter(j => j.status !== 'delivered').length;
  const criticalComplaints = ccmAlerts.filter(c => c.sentimentScore > 0.7 || c.severity === 'high');
  const criticalShortages = 2; // Front ceramic brake pads, Solenoid valve

  const handleQuickAction = async (opp) => {
    setExecutingId(opp.id);
    try {
      if (onExecuteOpportunity) {
        await onExecuteOpportunity(opp.id);
      } else {
        const res = await fetch(`/api/revenue-opportunities/${opp.id}/execute-action`, { method: 'POST' });
        if (res.ok && onDataRefresh) onDataRefresh();
      }

      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.7 }
      });

      setActionSuccessToast({
        title: `Action Executed: ${opp.actionLabel}`,
        vehicle: `${opp.vehicle} (${opp.regNo})`,
        margin: `+₹${opp.marginValue.toLocaleString('en-IN')} Margin Locked`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setTimeout(() => setActionSuccessToast(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingId(null);
    }
  };

  const handleSendMDBriefing = async () => {
    try {
      const res = await fetch('/api/briefing/send-to-md', { method: 'POST' });
      if (res.ok) {
        setBriefingSent(true);
        confetti({ particleCount: 70, spread: 60 });
        setTimeout(() => setBriefingSent(false), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-emerald-100 border border-emerald-500/60 p-4 rounded-2xl shadow-2xl flex items-center space-x-3.5 animate-slideUp">
          <div className="p-2 bg-emerald-600 text-white rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              {actionSuccessToast.title}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/40">
                {actionSuccessToast.margin}
              </span>
            </div>
            <div className="text-xs text-emerald-300/80">
              {actionSuccessToast.vehicle} • WhatsApp Dispatched ({actionSuccessToast.time})
            </div>
          </div>
        </div>
      )}

      {/* Top Dealer Principal Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Revenue & Operations Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono">
                08:45 AM Executive Briefing Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dealer Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoring {dealership?.name || "Sanghi Brothers Indore"} (18 Active Bays). 
              Real-time identification of uncaptured workshop revenue, critical customer friction, and technician throughput.
            </p>
          </div>

          {/* Quick MD Briefing WhatsApp Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <div className="text-left px-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                MD / GM WhatsApp Digest
              </div>
              <div className="text-xs font-bold text-slate-200">
                Chetan Sanghi (+91 98260 00001)
              </div>
            </div>
            <button
              onClick={handleSendMDBriefing}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                briefingSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold'
              }`}
            >
              {briefingSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Briefing Sent to WhatsApp!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send 8:00 AM MD Digest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Today Workshop Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today Workshop Revenue</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">₹8.42L</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 114% of Morning Target
            </div>
          </div>
        </div>

        {/* Metric 2: Revenue Leakage Radar (Flagship Metric) */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50/60 p-5 rounded-2xl border-2 border-rose-300/80 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Revenue At Risk
            </span>
            <div className="p-2 bg-rose-500 text-white rounded-xl shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-700 font-mono">
              ₹{(totalLeakage / 100000).toFixed(2)}L
            </div>
            <div className="text-[11px] text-rose-900/80 font-medium mt-1">
              {pendingCount} uncaptured opportunities today
            </div>
          </div>
        </div>

        {/* Metric 3: Recovered Today */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5 rounded-2xl border border-emerald-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Recovered Today</span>
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 font-mono">
              ₹{totalRecovered.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              {recoveredCount} opportunities closed & margin locked
            </div>
          </div>
        </div>

        {/* Metric 4: Workshop Bay Load */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Workshop Bay Load</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {activeVehiclesCount} / 18 <span className="text-sm text-slate-500 font-normal">(78%)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              CSP Balancer Active • 5:30 PM On-Time
            </div>
          </div>
        </div>

        {/* Metric 5: Critical Management Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Management Alerts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 font-mono">
              {criticalComplaints.length + criticalShortages} <span className="text-xs font-normal text-slate-500">Risks</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              1 CCM Case • 2 Parts Shortages
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE KILLER FEATURE: REVENUE LEAKAGE RADAR (CENTERPIECE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Daily Revenue Leakage Radar
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                ₹4.72 Lakhs At Risk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The algorithm continuously scans active job cards, insurance expiry databases, lapsing warranties, and accessories to identify uncaptured profit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab && onNavigateTab('growth_action_center')}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Open Action Center</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Leakage Category Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 1. Insurance */}
          <div 
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'INSURANCE' ? 'ALL' : 'INSURANCE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategoryFilter === 'INSURANCE'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                <Shield className="w-4 h-4 text-emerald-600" />
                Insurance
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {categories.insurance.count} Cases
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              ₹{(categories.insurance.amount / 1000).toFixed(0)}k
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Margin: {categories.insurance.marginRate} (~₹3.2k/car)
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span>Uncontacted: 12</span>
              <span className="text-emerald-600 font-semibold">Filter ➔</span>
            </div>
          </div>

          {/* 2. Accessories */}
          <div 
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'ACCESSORIES' ? 'ALL' : 'ACCESSORIES')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategoryFilter === 'ACCESSORIES'
                ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                OEM Accessories
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                {categories.accessories.count} In Bay
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              ₹{(categories.accessories.amount / 1000).toFixed(0)}k
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-1">
              Margin: {categories.accessories.marginRate} (Dashcam, Mats)
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span>Not offered: 8</span>
              <span className="text-blue-600 font-semibold">Filter ➔</span>
            </div>
          </div>

          {/* 3. Overdue Service */}
          <div 
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'OVERDUE_SERVICE' ? 'ALL' : 'OVERDUE_SERVICE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategoryFilter === 'OVERDUE_SERVICE'
                ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                <Calendar className="w-4 h-4 text-amber-600" />
                Overdue Service
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                18 Lapsed
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              ₹{(categories.overdueService.amount / 1000).toFixed(0)}k
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Retention: 45% Labor Margin
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span>60+ Days lapsed</span>
              <span className="text-amber-600 font-semibold">Filter ➔</span>
            </div>
          </div>

          {/* 4. Extended Warranty */}
          <div 
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'EXTENDED_WARRANTY' ? 'ALL' : 'EXTENDED_WARRANTY')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategoryFilter === 'EXTENDED_WARRANTY'
                ? 'bg-purple-50/80 border-purple-500 shadow-md ring-2 ring-purple-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Extended Warranty
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                5 Expiring
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              ₹{(categories.extendedWarranty.amount / 1000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-1">
              No-Cost EMI: ₹1,575/mo
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span>Year 3 End</span>
              <span className="text-purple-600 font-semibold">Filter ➔</span>
            </div>
          </div>

          {/* 5. Unapproved Estimates */}
          <div 
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'UNAPPROVED_ESTIMATE' ? 'ALL' : 'UNAPPROVED_ESTIMATE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeCategoryFilter === 'UNAPPROVED_ESTIMATE'
                ? 'bg-rose-50/80 border-rose-500 shadow-md ring-2 ring-rose-500/30'
                : 'bg-slate-50/70 border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                <Video className="w-4 h-4 text-rose-600" />
                Video Approvals
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                6 Stalled
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              ₹{(categories.unapprovedEstimates.amount / 1000).toFixed(0)}k
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">
              Pending 15-Sec Approvals
            </div>
            <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span>Brakes, Bushes</span>
              <span className="text-rose-600 font-semibold">Filter ➔</span>
            </div>
          </div>
        </div>

        {/* Velocity Progress Bar: Target vs Recovered */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Monthly Dealership Recovery Goal (Target: ₹8.50 Lakhs)</span>
              <span className="font-mono text-emerald-700 font-bold">
                ₹5.48L Achieved (64.5%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '64.5%' }}></div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <span className="font-bold text-slate-900">₹2.84L identified in active bays right now</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION CENTER: TRIGGER -> ACTION -> REVENUE ATTRIBUTED */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Live Revenue Action Center
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                1-Tap Execution
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Every identified leakage alert connects to a 1-tap WhatsApp authorization or proposal.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
            {[
              { id: 'ALL', label: 'All Opportunities' },
              { id: 'INSURANCE', label: 'Insurance' },
              { id: 'UNAPPROVED_ESTIMATE', label: 'Video Approvals' },
              { id: 'EXTENDED_WARRANTY', label: 'Extended Warranty' },
              { id: 'ACCESSORIES', label: 'Accessories' },
              { id: 'OVERDUE_SERVICE', label: 'Service Drips' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  activeCategoryFilter === tab.id
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-3.5">
          {openOpps.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No pending opportunities in this category. All actions have been executed!
            </div>
          ) : (
            openOpps.map((opp) => {
              const isRecovered = opp.status === 'RECOVERED';
              const isExecuting = executingId === opp.id;

              return (
                <div
                  key={opp.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isRecovered
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  {/* Left: Customer & Vehicle Context */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {opp.customerName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {opp.regNo}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {opp.vehicle}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        opp.category === 'INSURANCE' ? 'bg-emerald-100 text-emerald-800' :
                        opp.category === 'UNAPPROVED_ESTIMATE' ? 'bg-rose-100 text-rose-800' :
                        opp.category === 'EXTENDED_WARRANTY' ? 'bg-purple-100 text-purple-800' :
                        opp.category === 'ACCESSORIES' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {opp.category.replace('_', ' ')}
                      </span>
                      {isRecovered && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Recovered
                        </span>
                      )}
                    </div>

                    <div className="font-semibold text-slate-800 text-sm">
                      {opp.title}
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {opp.detail}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span>Assigned SA: <strong className="text-slate-600">{opp.assignedSA}</strong></span>
                      <span>•</span>
                      <span>{opp.timestamp}</span>
                    </div>
                  </div>

                  {/* Right: Value & 1-Tap Action Button */}
                  <div className="flex sm:items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Gross Opportunity</div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{opp.grossValue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs font-bold text-emerald-600 font-mono">
                        +₹{opp.marginValue.toLocaleString('en-IN')} Margin
                      </div>
                    </div>

                    <div>
                      {isRecovered ? (
                        <div className="px-4 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Margin Locked (+₹{opp.marginValue.toLocaleString('en-IN')})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleQuickAction(opp)}
                          disabled={isExecuting}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                        >
                          {isExecuting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Dispatching...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{opp.actionLabel}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 PILLARS QUICK NAVIGATION MATRIX */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Command */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('exec_briefing')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            1. Executive Command
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            MD WhatsApp briefing, P&L Yield analytics, CCM customer sentiment radar.
          </p>
        </div>

        {/* Pillar 2: Revenue */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('sa_insurance')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            2. Revenue Recovery
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tata Care+ motor insurance, OEM accessories bundler, Extended Warranty EMI.
          </p>
        </div>

        {/* Pillar 3: Workshop */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('workshop_grid')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            3. Workshop Flow
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            18-Bay CSP Dynamic Grid, Aarohan Hindi diagnostics, 5km road test QC.
          </p>
        </div>

        {/* Pillar 4: Risk & Integrity */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('spares_warranty')}
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
            4. Risk & Integrity
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            AI Zero-Rejection warranty fortress, CSI Integrity Shield, 45-min parts pool.
          </p>
        </div>
      </div>
    </div>
  );
}
