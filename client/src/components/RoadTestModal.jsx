import React, { useState } from 'react';
import { Gauge, ShieldCheck, AlertTriangle, CheckCircle2, X, FileCheck, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadTestModal({ jobCard, jobCards = [], isOpen = true, onClose, inline = false, onRoadTestPassed }) {
  const [selectedJc, setSelectedJc] = useState(jobCard || (jobCards.length > 0 ? jobCards[0] : null));
  const activeCard = jobCard || selectedJc || {
    id: 'jc-8899',
    model: 'Tata Nexon EV Empowered Plus (45 kWh)',
    regNo: 'MP-09-EB-8899',
    customerName: 'Rajesh Verma',
    odometer: 24350
  };

  const initialOdo = activeCard.odometer || 24350;
  const [startOdo, setStartOdo] = useState(initialOdo);
  const [endOdo, setEndOdo] = useState(initialOdo + 6); // 6 km
  const [inspectorName, setInspectorName] = useState("Deepak Yadav (Master Tech / Floor Lead)");
  const [supervisorComments, setSupervisorComments] = useState("5 km mandatory road test verified on Bypass stretch. High speed braking and NVH cleared.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [checklist, setChecklist] = useState({
    steeringAlignment: { passed: true, notes: "Centered, zero pull at 80 km/h" },
    brakeShudder: { passed: true, notes: "Smooth, zero high-speed judder" },
    suspensionNVH: { passed: true, notes: "No thuds or rattles on rumble strips" },
    transmissionShift: { passed: true, notes: "Linear shift response & regen curve" },
    acCoolingEfficiency: { passed: true, notes: "Vent temp 6.2°C" },
    noActiveWarnings: { passed: true, notes: "Instrument cluster clear of DTCs" },
    washingQuality: { passed: true, notes: "Dry wiped, vacuumed, tire dressed" }
  });

  if (!isOpen && !inline) return null;

  const distance = Math.max(0, Number(endOdo) - Number(startOdo));
  const isDistanceValid = distance >= 5.0;

  const toggleCheckItem = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: { ...prev[key], passed: !prev[key].passed }
    }));
  };

  const handleSignOff = async () => {
    if (!isDistanceValid) {
      setError(`Mandatory Road Test Distance is 5.0 km minimum. Current logged distance is ${distance.toFixed(1)} km.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/job-cards/${activeCard.id}/road-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectorName,
          startOdo,
          endOdo,
          checklist,
          supervisorComments
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        confetti({ particleCount: 60, spread: 50 });
        if (onRoadTestPassed) onRoadTestPassed(data.data);
        if (!inline && onClose) {
          setTimeout(onClose, 1500);
        }
      } else {
        setError(data.error || "Failed to sign off road test");
      }
    } catch (err) {
      setError("Network or server error during road test sign-off");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/60 shadow-xs">
            <Gauge className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base">Mandatory 5 km Pre-Delivery Road Test Gate</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold">
                CSI Protection Gate
              </span>
            </div>
            <p className="text-xs text-slate-500">Enforces physical road test log to eliminate 10-minute customer return post-service</p>
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
        {/* Vehicle Selection if inline */}
        {inline && jobCards.length > 0 && (
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Vehicle in QC Inspection:</span>
            <select
              value={activeCard.id}
              onChange={(e) => {
                const found = jobCards.find(j => j.id === e.target.value);
                if (found) {
                  setSelectedJc(found);
                  const o = found.odometer || 24350;
                  setStartOdo(o);
                  setEndOdo(o + 6);
                }
              }}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-medium focus:outline-none"
            >
              {jobCards.map(j => (
                <option key={j.id} value={j.id}>{j.regNumber || j.regNo} — {j.model} ({j.customerName})</option>
              ))}
            </select>
          </div>
        )}

        {/* Target Vehicle Header Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="font-bold text-slate-900 text-sm">{activeCard.model}</span>
            <span className="font-mono text-blue-900 font-bold text-xs ml-2 bg-blue-100 px-2 py-0.5 rounded">
              {activeCard.regNumber || activeCard.regNo}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Owner: <span className="font-medium text-slate-800">{activeCard.customerName}</span> • Job Card: <span className="font-mono">{activeCard.id}</span>
          </div>
        </div>

        {/* Odometer Inputs & Distance Validation Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Start Odometer (km)</label>
            <input
              type="number"
              value={startOdo}
              onChange={(e) => setStartOdo(e.target.value)}
              className="w-full mt-1.5 text-base font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">End Odometer (km)</label>
            <input
              type="number"
              value={endOdo}
              onChange={(e) => setEndOdo(e.target.value)}
              className="w-full mt-1.5 text-base font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-center items-center text-center ${
            isDistanceValid 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Logged Distance</span>
            <span className="text-2xl font-black font-mono mt-0.5">
              {distance.toFixed(1)} km
            </span>
            <span className="text-[10px] font-bold mt-0.5">
              {isDistanceValid ? "✓ Meets 5.0 km Protocol" : "⚠️ Fails Minimum 5 km Requirement"}
            </span>
          </div>
        </div>

        {/* 7-Point Quality Assurance Checklist */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Mandatory Quality Check Audit (Pre-Delivery)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(checklist).map(([key, item]) => (
              <div
                key={key}
                onClick={() => toggleCheckItem(key)}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  item.passed 
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-900' 
                    : 'bg-rose-50/40 border-rose-200 text-rose-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.passed}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-emerald-600 pointer-events-none"
                />
                <div className="text-xs flex-1">
                  <div className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-[11px] text-slate-500">{item.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspector Name & Supervisor Comments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">QC Inspector / Master Tech:</label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Floor Supervisor Comments:</label>
            <input
              type="text"
              value={supervisorComments}
              onChange={(e) => setSupervisorComments(e.target.value)}
              className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">✓ Road Test Verified & Signed Off! Gate Pass generation unlocked.</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={handleSignOff}
            disabled={loading || !isDistanceValid}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            {loading ? "Signing Off..." : "Sign Off Road Test & Unlock Gate Pass"}
          </button>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      {content}
    </div>
  );
}
