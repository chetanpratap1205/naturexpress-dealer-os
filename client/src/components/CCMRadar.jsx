import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Car, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  Radio, 
  Sparkles,
  ExternalLink,
  MessageSquareWarning,
  Building2
} from 'lucide-react';

export default function CCMRadar({ alerts, onIntervene }) {
  const [interveningId, setInterveningId] = useState(null);
  const [interventionNote, setInterventionNote] = useState('');

  const handleAction = (alertId) => {
    onIntervene(alertId, interventionNote || "CCM called customer directly. Courtesy Nexon EV arranged from Indore central pool + part expedited from Dewas Road store.");
    setInterveningId(null);
    setInterventionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-amber-50 border border-red-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-red-100 text-red-600 border border-red-200 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                  OEM Early-Warning Radar
                </span>
                <span className="text-xs text-amber-700 font-bold flex items-center space-x-1">
                  <Radio className="w-3.5 h-3.5 text-amber-600" />
                  <span>Scanning Indore Territory Dealerships</span>
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Tata Motors Customer Care Manager (CCM) Command Console
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Automatically catches customer frustration, repeat visit flags, and 36h+ workshop delays <strong>BEFORE</strong> complaints hit Twitter, Team-BHP, or Google Reviews.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-right shrink-0 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Territory Escalation Risk</span>
            <span className="text-2xl font-black text-amber-600 font-mono">1 Critical Alert</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              98.6% Public Rating Protected
            </span>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {(alerts || []).map((alert) => (
          <div
            key={alert.id}
            className={`rounded-2xl border p-6 transition-all shadow-sm ${
              alert.status === 'Resolved by CCM Intervention' || alert.status === 'Intervened by CCM'
                ? 'bg-emerald-50/50 border-emerald-200'
                : alert.severity === 'CRITICAL'
                ? 'bg-white border-red-300 ring-1 ring-red-100'
                : 'bg-white border-amber-300'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-amber-500 text-slate-950 font-black'
                  }`}>
                    {alert.severity} DELAY FLAG
                  </span>
                  <span className="font-mono text-sm font-black text-slate-900">{alert.regNo}</span>
                  <span className="text-xs text-slate-700 font-bold">• {alert.model}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Customer: <strong className="text-slate-900">{alert.customerName}</strong> ({alert.customerPhone})</span>
                    <span className="text-rose-600 font-bold font-mono">Escalation Score: {(alert.sentimentScore * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong className="text-amber-800">Trigger Reason:</strong> {alert.triggerReason}
                  </p>
                  <p className="text-xs text-slate-700">
                    <strong className="text-blue-800">Root Cause:</strong> {alert.rootCause}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span>Assigned OEM CCM: <strong className="text-slate-800">{alert.assignedCCM}</strong></span>
                  <span>•</span>
                  <span>Dealership GM: <strong className="text-slate-800">{alert.assignedGM}</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end space-y-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  alert.status === 'Resolved by CCM Intervention' || alert.status === 'Intervened by CCM'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {alert.status}
                </span>

                {alert.status !== 'Resolved by CCM Intervention' && alert.status !== 'Intervened by CCM' && (
                  <button
                    onClick={() => setInterveningId(alert.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>CCM One-Click Rescue</span>
                  </button>
                )}
              </div>
            </div>

            {/* Intervention Drawer */}
            {interveningId === alert.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-in fade-in">
                <label className="text-xs font-bold text-slate-700 block">
                  CCM Pre-Emptive Action Plan (Customer Call Protocol):
                </label>
                <textarea
                  value={interventionNote}
                  onChange={(e) => setInterventionNote(e.target.value)}
                  placeholder="e.g., Called Dr. Singhal. Approved 100% goodwill warranty on DCA mechatronic valve + dispatched runner from Dewas Rd store + courtesy car provided."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setInterveningId(null)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(alert.id)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Execute Intervention & Resolve Alert
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
