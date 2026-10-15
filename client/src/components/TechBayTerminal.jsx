import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Video, 
  Camera, 
  Package, 
  Wrench, 
  AlertTriangle, 
  Send, 
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function TechBayTerminal({ currentUser, onDataRefresh }) {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJobCard, setActiveJobCard] = useState('JC-2026-8899');
  const [techNotes, setTechNotes] = useState('');
  const [defectVideoPreview, setDefectVideoPreview] = useState(null);
  const [showPartReqModal, setShowPartReqModal] = useState(false);
  const [selectedSku, setSelectedSku] = useState('542442100108');
  const [inventory, setInventory] = useState([]);
  const [autolinking, setAutolinking] = useState(false);
  const [message, setMessage] = useState('');

  const fetchOperations = async () => {
    try {
      const res = await fetch(`/api/v2/workshop/operations?jcId=${activeJobCard}`);
      const json = await res.json();
      if (json.success) setOperations(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/v2/spares/inventory');
      const json = await res.json();
      if (json.success) setInventory(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOperations();
    fetchInventory();
  }, [activeJobCard]);

  const handleStartOp = async (opId) => {
    await fetch('/api/v2/workshop/operations/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opId })
    });
    fetchOperations();
  };

  const handlePauseOp = async (opId) => {
    await fetch('/api/v2/workshop/operations/pause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opId })
    });
    fetchOperations();
  };

  const handleCompleteOp = async (opId) => {
    await fetch('/api/v2/workshop/operations/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opId,
        techNotes: techNotes || 'Standard torque and inspection completed as per Tata service manual.',
        defectVideoUrl: defectVideoPreview || null
      })
    });
    setTechNotes('');
    setDefectVideoPreview(null);
    fetchOperations();
    if (onDataRefresh) onDataRefresh();
  };

  const handleVideoRecord = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDefectVideoPreview(ev.target.result);
      setMessage('15-Sec Inspection Video Proof Attached ✓');
      setTimeout(() => setMessage(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRequestPart = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v2/spares/requisitions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: activeJobCard,
          bayNumber: 4,
          techId: currentUser?.id || 'usr-tech-1',
          techName: currentUser?.name || 'Amit Verma (Master Tech)',
          sku: selectedSku,
          qty: 1
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowPartReqModal(false);
        setMessage(`Part Requisition Transmitted to Store! Bin: ${json.data.binLocation}`);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAutoLinkConsumables = async () => {
    setAutolinking(true);
    try {
      await fetch('/api/v2/spares/consumables/autolink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobCardId: activeJobCard })
      });
      setMessage('Mandatory Consumables (Brake Cleaner + Caliper Grease) Auto-Linked to Job Card!');
      setTimeout(() => setMessage(''), 5000);
      if (onDataRefresh) onDataRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setAutolinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
              Bay 4 • Master Diagnostic Terminal
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Hoist SRT Timer Active
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Workshop Floor & Technician Efficiency Terminal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operator: <span className="text-slate-800 font-bold">{currentUser?.name || 'Amit Verma (Master Tech)'}</span> • Job Card: <span className="text-blue-700 font-mono font-bold">{activeJobCard}</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleAutoLinkConsumables}
            disabled={autolinking}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto-Link Consumables</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPartReqModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Requisition Parts</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: SRT Timers & Defect Video Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SRT Operations Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Tata Standard Repair Times (SRT) Operations
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Bay Utilization Target: 85%
              </span>
            </div>

            <div className="space-y-3">
              {operations.map((op) => {
                const isInProgress = op.status === 'IN_PROGRESS';
                const isCompleted = op.status === 'COMPLETED';
                const isPaused = op.status === 'PAUSED';

                return (
                  <div
                    key={op.id}
                    className={`bg-slate-50 rounded-xl border p-4 space-y-3 transition-all ${
                      isInProgress 
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500/30 shadow-xs' 
                        : isCompleted 
                        ? 'border-emerald-300 bg-emerald-50/30' 
                        : isPaused 
                        ? 'border-amber-300 bg-amber-50/30' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            [{op.operation_code}]
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isInProgress 
                              ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' 
                              : isCompleted 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : isPaused 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {op.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 font-medium">
                          {op.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-slate-900">
                          SRT: {op.srt_hours} hrs
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isCompleted ? `Took ${op.actual_minutes_spent} min` : 'Standard Tata Unit'}
                        </div>
                      </div>
                    </div>

                    {/* Clock Controls */}
                    {!isCompleted && (
                      <div className="flex items-center space-x-2 pt-1 border-t border-slate-200">
                        {!isInProgress ? (
                          <button
                            type="button"
                            onClick={() => handleStartOp(op.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Clock-In Job</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePauseOp(op.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Pause (Parts Wait)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCompleteOp(op.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Finished</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 15-Sec Video Defect Capture Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-rose-600" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  15-Sec Defect Proof Video Capture
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                Customer Proof
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When inspecting worn brake pads, leaking shock absorbers, or damaged boots, record a 15-second video pointing with a digital caliper. Transmitted directly to customer mobile link.
            </p>

            {/* Video File / Camera Trigger */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-3 bg-slate-50">
              <label className="flex flex-col items-center justify-center cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:bg-blue-600 flex items-center justify-center text-slate-600 group-hover:text-white transition-all mb-2 shadow-2xs">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  {defectVideoPreview ? 'Video Proof Captured ✓ (Tap to Replace)' : 'Tap to Record / Upload 15-Sec Video'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Tablet Camera or MP4/MOV Clip
                </span>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={handleVideoRecord}
                  className="hidden"
                />
              </label>

              {defectVideoPreview && (
                <div className="rounded-lg overflow-hidden border border-slate-300 bg-black aspect-video max-h-48">
                  <video src={defectVideoPreview} controls playsInline className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Diagnostic Measurement Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Technician Physical Measurement Notes
              </label>
              <textarea
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                placeholder="e.g. Vernier caliper reading 2.1mm on front right outer pad. OEM service wear limit is 3.0mm."
                rows={3}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part Requisition Modal */}
      {showPartReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-700" />
                Requisition Part to Bay 4
              </h3>
              <button
                type="button"
                onClick={() => setShowPartReqModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestPart} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select OEM Part / Consumable</label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-blue-600"
                >
                  {inventory.map((inv) => (
                    <option key={inv.sku} value={inv.sku}>
                      {inv.name} (Stock: {inv.stock_qty}) • {inv.bin_location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Transmits directly to Parts Store queue. Store Keeper Rajesh Malviya will locate bin and issue part with anti-cannibalization seal.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPartReqModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  Send Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
