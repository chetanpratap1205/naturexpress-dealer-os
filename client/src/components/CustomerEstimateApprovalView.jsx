import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Car, 
  FileText, 
  Check, 
  X, 
  Play, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Sparkles,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomerEstimateApprovalView({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScratchReport, setShowScratchReport] = useState(false);
  const [decisions, setDecisions] = useState({}); // itemId -> 'APPROVED' | 'DECLINED'
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchEstimate();
  }, [token]);

  const fetchEstimate = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeToken = token || 'demo-token-nexon-9011';
      const res = await fetch(`/api/v2/customer/estimate/${activeToken}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        // Initialize existing approval statuses
        const initial = {};
        (json.data.jobCard.items || []).forEach(it => {
          if (!it.is_mandatory) {
            initial[it.id] = it.approval_status || 'PENDING';
          }
        });
        setDecisions(initial);
      } else {
        setError(json.error || 'Estimate not found or link has expired.');
      }
    } catch (e) {
      setError('Unable to load estimate. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDecision = async (itemId, newStatus) => {
    setDecisions(prev => ({ ...prev, [itemId]: newStatus }));
    
    // Save decision to server
    try {
      const activeToken = token || 'demo-token-nexon-9011';
      await fetch('/api/v2/customer/estimate/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: activeToken,
          itemId,
          approvalStatus: newStatus
        })
      });
      if (newStatus === 'APPROVED') {
        confetti({ particleCount: 50, spread: 45 });
      }
    } catch (e) {
      console.error("Decision save error", e);
    }
  };

  const handleFinalConfirm = () => {
    setConfirmed(true);
    confetti({ particleCount: 80, spread: 60 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-sm font-bold tracking-wider uppercase text-slate-700">
          Loading Official Dealership Estimate...
        </div>
        <div className="text-xs text-slate-500 mt-1">Shyam Automotive • Tata Motors Authorized</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Estimate Not Available</h2>
          <p className="text-xs text-slate-500">{error || 'This link may have expired or is invalid.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { jobCard, branch } = data;
  const items = jobCard.items || [];
  const mandatoryItems = items.filter(it => it.is_mandatory);
  const recommendedItems = items.filter(it => !it.is_mandatory);

  // Compute live totals
  const mandatoryTotal = mandatoryItems.reduce((acc, it) => acc + (it.total_price || 0), 0);
  const approvedRecommendedTotal = recommendedItems.reduce((acc, it) => {
    const status = decisions[it.id] !== undefined ? decisions[it.id] : it.approval_status;
    return status === 'APPROVED' ? acc + (it.total_price || 0) : acc;
  }, 0);
  const grandTotal = mandatoryTotal + approvedRecommendedTotal;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-24">
      {/* Official Dealership Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center font-black text-white text-lg shadow-sm border border-blue-600">
              NX
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                  Tata Motors Authorized Dealership
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Live Transparency
                </span>
              </div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight">
                {branch.name}
              </h1>
              <div className="text-[10px] text-slate-500">
                Scheme 140 Flagship Hub, Indore • Helpline: {branch.phone}
              </div>
            </div>
          </div>

          <a
            href={`tel:${branch.phone}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 shrink-0"
            title="Call Service Advisor"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Vehicle Snapshot Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider">
                Job Card #{jobCard.id}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                {jobCard.model}
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                Reg: <span className="text-slate-900 font-bold">{jobCard.reg_no}</span> • Odometer: <span className="text-slate-900 font-bold">{jobCard.odometer_in?.toLocaleString('en-IN')} KM</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-blue-50 text-blue-800 border border-blue-200">
              {jobCard.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div>
              Service Advisor: <span className="text-slate-900 font-semibold">{jobCard.sa_name}</span>
            </div>
            <div>
              Assigned Bay: <span className="text-emerald-700 font-semibold font-mono">Bay 4 (Express Hoist)</span>
            </div>
          </div>
        </div>

        {/* 360° Scratch & Custody Transparency Accordion */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowScratchReport(!showScratchReport)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Intake 360° Scratch & Custody Audit
                </div>
                <div className="text-[11px] text-slate-500">
                  {jobCard.scratch_markers?.length || 0} pre-existing marks logged at 9:00 AM intake
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>{showScratchReport ? 'Hide' : 'View Report'}</span>
              {showScratchReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showScratchReport && (
            <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(jobCard.scratch_markers || []).map((m) => (
                  <div key={m.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{m.panel}</span>
                      <span className="text-[10px] text-amber-800 font-mono capitalize bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">{m.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{m.severity}</div>
                    {m.notes && <div className="text-[10px] text-slate-700 italic">"{m.notes}"</div>}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 text-center">
                Pre-existing vehicle condition verified with customer stylus signature at intake.
              </div>
            </div>
          )}
        </div>

        {/* SECTION 1: Scheduled Mandatory PMS Maintenance (Locked) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Scheduled Maintenance Package (Approved)
              </h3>
            </div>
            <span className="text-xs font-mono font-black text-emerald-700">
              ₹{Math.round(mandatoryTotal).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3">
            {mandatoryItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between text-xs space-x-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{item.description}</span>
                    <span className="text-[9px] font-mono px-1.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.item_type}
                    </span>
                  </div>
                  {item.inspection_notes && (
                    <div className="text-[10px] text-slate-500">{item.inspection_notes}</div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-900">
                    ₹{Math.round(item.total_price).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">GST {item.gst_rate}% incl.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Recommended Additional Work with 15s Video Proof */}
        {recommendedItems.length > 0 && (
          <div className="bg-white border-2 border-amber-400/80 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Recommended Additional Safety Repairs ({recommendedItems.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                Action Required
              </span>
            </div>

            <div className="space-y-5">
              {recommendedItems.map((item) => {
                const currentStatus = decisions[item.id] !== undefined ? decisions[item.id] : item.approval_status;
                const isApproved = currentStatus === 'APPROVED';
                const isDeclined = currentStatus === 'DECLINED';

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-50 rounded-2xl border p-4 space-y-4 transition-all ${
                      isApproved 
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/30' 
                        : isDeclined 
                        ? 'border-slate-200 opacity-60 bg-slate-100' 
                        : 'border-amber-300 bg-amber-50/20 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {item.description}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            Critical Wear
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.inspection_notes || 'Technician measured brake pad thickness at 2.1mm (OEM limit is 3.0mm). Scoring on brake rotor likely if not replaced.'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-mono font-black text-slate-900">
                          ₹{Math.round(item.total_price).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">All Taxes Incl.</div>
                      </div>
                    </div>

                    {/* 15-Second Video Proof Player */}
                    {item.inspection_video_url && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-blue-700" />
                          <span>15-Sec Inspection Video Proof from Bay 4:</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-300 bg-black aspect-video max-h-56 w-full shadow-xs">
                          <video
                            src={item.inspection_video_url}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            poster="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600"
                          />
                        </div>
                      </div>
                    )}

                    {/* Approve / Decline Switches */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleToggleDecision(item.id, 'APPROVED')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isApproved
                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                            : 'bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-300'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{isApproved ? 'Approved ✓' : `Approve (₹${Math.round(item.total_price)})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleDecision(item.id, 'DECLINED')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isDeclined
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-300'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmation Banner */}
        {confirmed && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-1 animate-in zoom-in-95">
            <div className="text-sm font-black text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Decisions Transmitted to Bay 4
            </div>
            <p className="text-xs text-slate-600">
              Master Tech Amit Verma has been notified to proceed. Estimated completion time: 5:00 PM.
            </p>
          </div>
        )}
      </main>

      {/* Sticky Bottom Total & Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Estimated Total (Tax Incl.)
            </div>
            <div className="text-xl font-mono font-black text-slate-900">
              ₹{Math.round(grandTotal).toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinalConfirm}
            className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Confirm & Authorize</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
