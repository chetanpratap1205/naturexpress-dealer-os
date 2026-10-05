import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Send,
  Shield,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Video,
  DollarSign,
  TrendingUp,
  Filter,
  RefreshCw,
  Search,
  ArrowUpRight,
  Sparkles,
  Phone,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActionCenter({
  revenueOpportunities = [],
  revenueRadar = null,
  onExecuteOpportunity,
  onDataRefresh
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSA, setSelectedSA] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [executingId, setExecutingId] = useState(null);
  const [previewOpp, setPreviewOpp] = useState(null);

  const totalRecovered = revenueRadar?.totalRecoveredToday || 42600;
  const totalLeakage = revenueRadar?.totalLeakageAtRisk || 472500;

  const filteredOpps = (revenueOpportunities || []).filter(opp => {
    const matchesCategory = selectedCategory === 'ALL' || opp.category === selectedCategory || opp.categoryKey === selectedCategory;
    const matchesSA = selectedSA === 'ALL' || opp.assignedSA === selectedSA;
    const matchesSearch = !searchQuery || 
      opp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSA && matchesSearch;
  });

  const pendingList = filteredOpps.filter(o => o.status !== 'RECOVERED');
  const recoveredList = filteredOpps.filter(o => o.status === 'RECOVERED');

  const handleAction = async (opp) => {
    setExecutingId(opp.id);
    try {
      if (onExecuteOpportunity) {
        await onExecuteOpportunity(opp.id);
      } else {
        await fetch(`/api/revenue-opportunities/${opp.id}/execute-action`, { method: 'POST' });
        if (onDataRefresh) onDataRefresh();
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Revenue Opportunity Action Center
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Convert identified revenue leakage into booked margin with 1-tap WhatsApp quotes, video authorizations, and EMI links.
          </p>
        </div>

        {/* Live Recovery Totals */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-right">
            <span className="text-[11px] font-semibold text-emerald-800 block">Recovered Today</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ₹{totalRecovered.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-right">
            <span className="text-[11px] font-semibold text-rose-800 block">Remaining at Risk</span>
            <span className="text-2xl font-black text-rose-700 font-mono">
              ₹{(totalLeakage / 100000).toFixed(2)}L
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({revenueOpportunities.length})
          </button>
          <button
            onClick={() => setSelectedCategory('INSURANCE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'INSURANCE' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🛡️ Insurance (2)
          </button>
          <button
            onClick={() => setSelectedCategory('UNAPPROVED_ESTIMATE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'UNAPPROVED_ESTIMATE' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📹 Video Approvals (1)
          </button>
          <button
            onClick={() => setSelectedCategory('EXTENDED_WARRANTY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'EXTENDED_WARRANTY' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💳 Extended Warranty (1)
          </button>
          <button
            onClick={() => setSelectedCategory('ACCESSORIES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'ACCESSORIES' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🛍️ Accessories (1)
          </button>
          <button
            onClick={() => setSelectedCategory('OVERDUE_SERVICE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'OVERDUE_SERVICE' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📅 Service Drips (1)
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle, customer, SA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Pending Actionable Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Pending Action Queue</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              {pendingList.length} Opportunities
            </span>
          </h2>
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-700">All opportunities in this category are active or recovered!</div>
            <p className="text-xs text-slate-400 mt-1">Check back as new vehicles enter the workshop bays.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingList.map((opp) => {
              const isExecuting = executingId === opp.id;
              return (
                <div
                  key={opp.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                        {opp.regNo}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        opp.category === 'INSURANCE' ? 'bg-emerald-100 text-emerald-800' :
                        opp.category === 'UNAPPROVED_ESTIMATE' ? 'bg-rose-100 text-rose-800' :
                        opp.category === 'EXTENDED_WARRANTY' ? 'bg-purple-100 text-purple-800' :
                        opp.category === 'ACCESSORIES' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {opp.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-base">
                        {opp.customerName}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {opp.vehicle}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="font-semibold text-xs text-slate-800">
                        {opp.title}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {opp.detail}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Recoverable Margin</div>
                      <div className="text-lg font-black text-emerald-600 font-mono">
                        +₹{opp.marginValue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Gross: ₹{opp.grossValue.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAction(opp)}
                      disabled={isExecuting}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{opp.actionLabel}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recovered Ledger */}
      {recoveredList.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Recovered & Margin Locked Today</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {recoveredList.length} Actions Completed
            </span>
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {recoveredList.map((opp) => (
                <div key={opp.id} className="p-4 flex items-center justify-between bg-emerald-50/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                        {opp.customerName} ({opp.regNo})
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded font-semibold">
                          {opp.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Assigned SA: {opp.assignedSA} • Action: {opp.actionLabel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-700 text-sm">
                      +₹{opp.marginValue.toLocaleString('en-IN')} Margin
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gross ₹{opp.grossValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
