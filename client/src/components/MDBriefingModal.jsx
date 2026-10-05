import React, { useState, useEffect } from 'react';
import { Smartphone, Send, CheckCircle2, X, TrendingUp, Users, AlertTriangle, Trophy, Sparkles, Clock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MDBriefingModal({ isOpen = true, onClose, inline = false }) {
  const [briefing, setBriefing] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/briefing/morning')
        .then(res => res.json())
        .then(res => {
          if (res.success) setBriefing(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleSendToMD = async () => {
    setSending(true);
    setSendSuccess(null);

    try {
      const res = await fetch('/api/briefing/send-to-md', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(data.data.message);
        confetti({ particleCount: 70, spread: 60 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/60 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">Executive 8:45 AM WhatsApp MD Digest</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Dealer Principal Pulse
              </span>
            </div>
            <p className="text-xs text-slate-500">Automated morning operational briefing dispatched directly to Dealer Principal & GM WhatsApp</p>
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
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Today Appointments</span>
            <span className="text-2xl font-black text-blue-900 font-mono mt-1 block">
              {briefing?.metrics.todayBookedAppointments || 38}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Yesterday Labor Rev</span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
              ₹{((briefing?.metrics.yesterdayLaborRevenue || 242500) / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Active Escalations</span>
            <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
              {briefing?.metrics.activeEscalationAlerts || 1}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-xs">
            <span className="text-[11px] text-slate-400 block font-medium">Inter-Dealer Parts</span>
            <span className="text-2xl font-black text-purple-600 font-mono mt-1 block">
              {briefing?.metrics.interDealerPartsPending || 2}
            </span>
          </div>
        </div>

        {/* WhatsApp Card Mockup View */}
        <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3 font-sans shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-950 border-b border-emerald-200/80 pb-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Official 8:45 AM WhatsApp Digest Preview</span>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
              Sent to: {briefing?.recipient || '+91 98930 11223'}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-xs border border-emerald-200/70 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
            {briefing?.sampleWhatsAppMessage || `🌅 Good morning Chetan Sir!
Sanghi Brothers Tata Daily Executive Digest:
📋 38 Service Bookings Today (14 Nexon EV, 11 Harrier/Safari, 13 Punch/Altroz)
💰 Yesterday Labor Revenue: ₹2,42,500 (+18% vs target)
⚠️ 1 Customer Agitation Alert (Escalation Radar flagged Bay 5)
📦 2 Parts En Route from Sanghi Bypass Store
🏆 Top Advisor: Rahul Sharma (3 Extended Warranties Closed)`}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Dispatches automatically at 08:45 AM every morning via verified Meta Cloud API.</span>
          </div>
          <button
            onClick={handleSendToMD}
            disabled={sending}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            {sending ? "Dispatching Broadcast..." : "Send Live WhatsApp Briefing to MD Now"}
          </button>
        </div>

        {sendSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{sendSuccess}</span>
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
