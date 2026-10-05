import React, { useState } from 'react';
import { 
  PhoneCall, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Car, 
  Wrench, 
  Calendar, 
  Percent, 
  Zap, 
  Award,
  PhoneForwarded,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CRETelephonyCRM({ creQueue, onNudge }) {
  const [activeLead, setActiveLead] = useState(creQueue?.[0]);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callLogged, setCallLogged] = useState(null);

  const handleWarmNudge = (leadId) => {
    onNudge(leadId);
    confetti({ particleCount: 50, spread: 40 });
  };

  const handleSimulateCall = () => {
    setCallInProgress(true);
    setTimeout(() => {
      setCallInProgress(false);
      setCallLogged({
        status: "Slot Booked - Morning 10:00 AM",
        notes: "Customer delighted with brake inspection hook. Slot reserved in Bay 2."
      });
      confetti({ particleCount: 80, spread: 60 });
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
              Smart Telephony Win-Back CRM
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              Avg Conversion: 34.8% (vs 8% Industry Baseline)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            CRE Dynamic Tele-Calling Desk & Predictive Context Engine
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Empowers calling staff with predictive odometer algorithms, past service advisories, and pre-call WhatsApp warm nudges.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-right shrink-0 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Today Calling Target</span>
          <span className="text-2xl font-black text-blue-700 font-mono">24 / 35 Booked</span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            +₹3.42L Projected Labor
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Priority Telephony Win-Back Queue ({creQueue?.length || 0})
          </h3>

          <div className="space-y-2">
            {(creQueue || []).map((lead) => (
              <div
                key={lead.id}
                onClick={() => { setActiveLead(lead); setCallLogged(null); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeLead?.id === lead.id
                    ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{lead.customerName}</span>
                    <span className="text-xs text-slate-500 block font-mono">{lead.phone}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lead.callStatus === 'WARM_NUDGE_SENT'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {lead.callStatus === 'WARM_NUDGE_SENT' ? '✓ Nudge Sent' : 'Ready to Dial'}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{lead.model}</span>
                  <span className="font-mono font-bold text-slate-700">~{lead.predictedOdometer?.toLocaleString()} km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Dialing Context Card (7 Cols) */}
        {activeLead && (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Live Dialing Context Card
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{activeLead.customerName}</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5 font-mono">
                  <span>{activeLead.phone}</span>
                  <span>•</span>
                  <span className="text-slate-800 font-bold">{activeLead.regNo}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Predicted Mileage (Point #15)</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {activeLead.predictedOdometer?.toLocaleString()} km
                </span>
                <span className="text-[10px] text-slate-500 block">Cadence: {activeLead.dailyCadenceKm} km/day</span>
              </div>
            </div>

            {/* Smart Advisory & Hook Box */}
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block">⚠️ Past Unresolved Advisory:</span>
                <p className="text-xs text-slate-700 mt-0.5">{activeLead.pendingAdvisory}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block">🎯 Personalized Value Hook:</span>
                <p className="text-xs text-slate-700 mt-0.5">{activeLead.recommendedHook}</p>
              </div>
            </div>

            {/* AI Call Script */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI-Generated Vernacular Hindi Script
                </span>
                <span className="text-[10px] text-purple-700 font-mono">92% Adherence Target</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-200">
                "{activeLead.aiScriptPrompt}"
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleWarmNudge(activeLead.id)}
                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Send WhatsApp Pre-Nudge (Warm Up)</span>
              </button>

              <button
                onClick={handleSimulateCall}
                disabled={callInProgress}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <PhoneCall className={`w-4 h-4 ${callInProgress ? 'animate-bounce' : ''}`} />
                <span>{callInProgress ? "Connecting via CRM Dialer..." : "Launch Context Dialer"}</span>
              </button>
            </div>

            {callLogged && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">{callLogged.status}</span> — {callLogged.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
