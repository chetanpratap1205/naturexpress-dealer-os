import React, { useState, useEffect } from 'react';
import { Clock, Send, CheckCircle2, MessageSquare, ArrowRight, X, Sparkles, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DripCampaignsModal({ isOpen = true, onClose, inline = false }) {
  const [dripSteps, setDripSteps] = useState([]);
  const [triggeringStep, setTriggeringStep] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/drip-campaigns/status')
        .then(res => res.json())
        .then(res => {
          if (res.success) setDripSteps(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleTriggerDrip = async (stepNum) => {
    setTriggeringStep(stepNum);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/drip-campaigns/trigger-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber: stepNum, jobCardId: "jc-4020" })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`✓ Step ${stepNum} Drip Nudge sent to Dr. Vikram Singhal (+91 98931 77220).`);
        confetti({ particleCount: 50, spread: 50 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTriggeringStep(null);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/60 shadow-xs">
            <Radio className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">WhatsApp Automated Drip Sequences</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Post-Service Lifecycle Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">6-Stage lifecycle nurture protecting post-warranty customer retention (Day 0, 7, 30, 60, 90, 120)</p>
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
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {dripSteps.map((step) => {
            const isTriggering = triggeringStep === step.stepNumber;

            return (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Day +{step.dayOffset}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{step.title}</span>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/80">
                    "{step.templatePreview}"
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Target Trigger: <strong className="text-slate-700">{step.targetAudience}</strong></span>
                    <span>•</span>
                    <span>Conversion Rate: <strong className="text-emerald-600 font-bold">{step.avgConversionRate}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerDrip(step.stepNumber)}
                  disabled={isTriggering}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0 w-full sm:w-auto justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isTriggering ? "Sending Nudge..." : "Test Dispatch"}
                </button>
              </div>
            );
          })}
        </div>

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      {!inline && (
        <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      {content}
    </div>
  );
}
