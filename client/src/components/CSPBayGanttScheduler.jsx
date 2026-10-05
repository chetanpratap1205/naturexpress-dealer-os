import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Clock,
  Car,
  Wrench,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  User,
  Sliders,
  ChevronRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CSPBayGanttScheduler({
  dealership,
  jobCards = [],
  onAdvanceStage,
  onDataRefresh
}) {
  const [ganttData, setGanttData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solving, setSolving] = useState(false);
  const [solveSuccess, setSolveSuccess] = useState(null);
  const [selectedBay, setSelectedBay] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showReallocateModal, setShowReallocateModal] = useState(false);
  const [reallocateTargetBay, setReallocateTargetBay] = useState('');
  const [reallocating, setReallocating] = useState(false);
  const [reallocateError, setReallocateError] = useState(null);

  const fetchGantt = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/csp-bay-balancer/gantt');
      const data = await res.json();
      if (data.success) {
        setGanttData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGantt();
  }, []);

  const handleRunCSPSolver = async () => {
    setSolving(true);
    setSolveSuccess(null);
    try {
      const res = await fetch('/api/csp-bay-balancer/auto-balance', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGanttData(data.data);
        setSolveSuccess(data.message);
        confetti({ particleCount: 70, spread: 60 });
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSolving(false);
    }
  };

  const handleReallocate = async (fromBayId, toBayId, jobCardId) => {
    setReallocating(true);
    setReallocateError(null);
    try {
      const res = await fetch('/api/csp-bay-balancer/reallocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromBayId, toBayId, jobCardId })
      });
      const data = await res.json();
      if (!res.ok) {
        setReallocateError(data.error || "Failed to reallocate");
      } else {
        setGanttData(data.data);
        setShowReallocateModal(false);
        confetti({ particleCount: 50, spread: 50 });
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      setReallocateError("Network error during reallocation");
    } finally {
      setReallocating(false);
    }
  };

  const bays = ganttData?.bays || [];
  const metrics = ganttData?.metrics || {
    totalBays: 18,
    occupiedBays: 4,
    idleBays: 13,
    reservedBays: 1,
    utilizationPercent: 78,
    currentHourlyYield: 31400,
    totalYieldCapacity: 38500,
    avgOnTimeProbability: 94
  };

  const filteredBays = bays.filter(bay => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'EV') return bay.type === 'EV_HV';
    if (selectedFilter === 'MECHANICAL') return bay.type === 'MECHANICAL_2POST';
    if (selectedFilter === 'DCA') return bay.type === 'DCA_CLEANROOM';
    if (selectedFilter === 'EXPRESS') return bay.type === 'EXPRESS_LUBE';
    if (selectedFilter === 'WASHING') return bay.type === 'WASHING_DETAILING';
    if (selectedFilter === 'OCCUPIED') return bay.status === 'OCCUPIED';
    return true;
  });

  const timeSlots = ganttData?.timeSlots || [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00"
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top CSP Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl">
              <LayoutGrid className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              18-Bay CSP Dynamic Grid & Gantt Balancer
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono uppercase">
              5:30 PM Guarantee Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Mathematical Constraint Satisfaction Problem (CSP) solver balancing 18 physical bays, technician skill certifications (EV Level-3, DCA Master), and parts availability to eliminate evening delivery bottlenecks.
          </p>
        </div>

        {/* 1-Click CSP Solver Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleRunCSPSolver}
            disabled={solving}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50"
          >
            {solving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running CSP Matrix Solver...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run CSP Constraint Satisfaction Solver</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solver Result Feedback */}
      {solveSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 text-emerald-100 rounded-2xl flex items-center justify-between text-xs animate-slideUp">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">{solveSuccess}</span>
          </div>
          <span className="font-mono text-emerald-300 font-semibold">
            On-Time Handover Probability: 98.4%
          </span>
        </div>
      )}

      {/* 4 Workshop Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Bay Load */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Bay Utilization</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {metrics.occupiedBays} / {metrics.totalBays} <span className="text-sm font-semibold text-slate-500">({metrics.utilizationPercent}%)</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Floor Velocity
            </div>
          </div>
        </div>

        {/* Metric 2: 5:30 PM Delivery Probability */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">5:30 PM On-Time Delivery</span>
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {metrics.avgOnTimeProbability}%
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              Zero Evening Overhang Risk
            </div>
          </div>
        </div>

        {/* Metric 3: Hourly Bay Yield */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Current Hourly Yield</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{(metrics.currentHourlyYield || 31400).toLocaleString('en-IN')}<span className="text-xs text-slate-500">/hr</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Target: ₹{(metrics.totalYieldCapacity / 9).toFixed(0)}/hr
            </div>
          </div>
        </div>

        {/* Metric 4: Technician Certifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Technician Roster</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              24 Techs <span className="text-xs font-semibold text-purple-600">(100% Active)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              2 Level-3 EV • 3 Master Techs
            </div>
          </div>
        </div>
      </div>

      {/* Filter Category Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All 18 Bays' },
            { id: 'OCCUPIED', label: 'Active Jobs (4)' },
            { id: 'EV', label: '⚡ EV High-Voltage (2)' },
            { id: 'MECHANICAL', label: '🔧 Mechanical Lifts (6)' },
            { id: 'DCA', label: '⚙️ DCA Cleanroom (2)' },
            { id: 'EXPRESS', label: '⏱️ Express Lube (3)' },
            { id: 'WASHING', label: '🚿 Washing & Detailing (3)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Schedule: 08:30 AM – 06:30 PM (20 Half-Hour Slots)
        </div>
      </div>

      {/* 18-Bay Live Gantt Grid Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Workshop Bay Execution Gantt Timeline
            </h2>
            <p className="text-xs text-slate-500">
              Live progression of vehicle repair stages mapped against physical bay constraints and technician certifications.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Diagnostics</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Mechanical/EV Repair</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Handover Ready</span>
          </div>
        </div>

        {/* Bays List */}
        <div className="space-y-3">
          {filteredBays.map((bay) => {
            const isOccupied = bay.status === 'OCCUPIED';
            const job = bay.jobDetails;

            return (
              <div
                key={bay.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isOccupied
                    ? 'bg-slate-50 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Bay Specs & Technician */}
                  <div className="w-full lg:w-72 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {bay.name.split('(')[0].trim()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isOccupied ? 'bg-blue-100 text-blue-800' :
                        bay.status === 'RESERVED' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {bay.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium truncate">
                      {bay.category}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center space-x-1 pt-0.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{bay.assignedTech}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1 pt-1">
                      {bay.restrictions?.map((r, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-mono">
                          {r.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Active Job / Gantt Bar */}
                  <div className="flex-1 space-y-2">
                    {isOccupied && job ? (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200">
                              {job.jobCardId}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {job.model}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({job.customerName})
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono text-slate-400">
                              Delivery: <strong>{job.promisedDeliveryTime}</strong>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {job.onTimeDeliveryProbability}% On-Time
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600">
                            <span className="font-medium">{job.activeTask}</span>
                            <span className="font-mono font-bold">{job.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                job.progressPercent === 100 ? 'bg-emerald-500' :
                                job.progressPercent > 60 ? 'bg-amber-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${job.progressPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                          <span>Parts: <strong className="text-slate-600 font-mono">{job.partsStatus}</strong></span>
                          {onAdvanceStage && (
                            <button
                              onClick={() => onAdvanceStage(job.jobCardId)}
                              className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                            >
                              Advance Stage ➔
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                        <span>Bay Idle • Ready for scheduled intake allocation</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Bay Action */}
                  <div className="w-full lg:w-36 flex lg:flex-col justify-end lg:justify-center items-end lg:items-center gap-2">
                    <div className="text-[11px] font-mono text-slate-500 text-right lg:text-center">
                      Yield: ₹{bay.hourlyYieldTarget}/hr
                    </div>
                    {isOccupied && (
                      <button
                        onClick={() => {
                          setSelectedBay(bay);
                          setShowReallocateModal(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border border-slate-200"
                      >
                        Reallocate Bay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reallocation Modal */}
      {showReallocateModal && selectedBay && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Reallocate {selectedBay.name}
              </h3>
              <button
                onClick={() => setShowReallocateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>Vehicle: <strong>{selectedBay.jobDetails?.model} ({selectedBay.jobDetails?.jobCardId})</strong></p>
              <p>Select target destination bay (CSP solver will validate physical constraints):</p>
            </div>

            {reallocateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                {reallocateError}
              </div>
            )}

            <select
              value={reallocateTargetBay}
              onChange={(e) => setReallocateTargetBay(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="">Select target bay...</option>
              {bays
                .filter(b => b.id !== selectedBay.id && b.status === 'IDLE')
                .map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.category})
                  </option>
                ))}
            </select>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowReallocateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReallocate(selectedBay.id, reallocateTargetBay, selectedBay.currentJobCardId)}
                disabled={!reallocateTargetBay || reallocating}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer disabled:opacity-50"
              >
                {reallocating ? 'Validating CSP...' : 'Confirm Reallocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
