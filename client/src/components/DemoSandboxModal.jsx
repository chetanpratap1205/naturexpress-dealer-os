import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Zap, CheckCircle2, X, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DemoSandboxModal({ isOpen, onClose, onScenarioInjected }) {
  const [injecting, setInjecting] = useState(null);
  const [resultMsg, setResultMsg] = useState(null);

  if (!isOpen) return null;

  const handleInject = async (scenarioKey) => {
    setInjecting(scenarioKey);
    setResultMsg(null);

    try {
      const res = await fetch('/api/admin/inject-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioKey })
      });
      const data = await res.json();
      if (data.success) {
        setResultMsg(data.message);
        confetti({ particleCount: 60, spread: 50 });
        if (onScenarioInjected) onScenarioInjected();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInjecting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Sales Pitch Scenario Injector & Sandbox</h2>
              <p className="text-xs text-slate-500">Trigger live WOW moments during meetings with Dealer Principals (Point B10)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-600">
            Click any scenario below to inject a live simulation event into the backend and watch the UI react in real-time:
          </p>

          <div className="space-y-2">
            <div
              onClick={() => handleInject('angry_customer')}
              className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-rose-900 text-sm block">1. Inject Angry Customer (Consumer Court Threat)</span>
                <span className="text-xs text-rose-700">Fires NLP sentiment alert & auto-populates CCM Escalation Radar.</span>
              </div>
              <button
                disabled={injecting === 'angry_customer'}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                {injecting === 'angry_customer' ? "Injecting..." : "Trigger"}
              </button>
            </div>

            <div
              onClick={() => handleInject('ew_sale')}
              className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-purple-900 text-sm block">2. Inject 5-Year Platinum EW Sale (₹24,500)</span>
                <span className="text-xs text-purple-700">Adds ₹1,100 instant commission & updates SA Leaderboard in real-time.</span>
              </div>
              <button
                disabled={injecting === 'ew_sale'}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                {injecting === 'ew_sale' ? "Injecting..." : "Trigger"}
              </button>
            </div>
          </div>

          {resultMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resultMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
