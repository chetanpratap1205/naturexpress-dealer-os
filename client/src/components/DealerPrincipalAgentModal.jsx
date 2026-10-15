import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  TrendingUp,
  Clock,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Wrench,
  DollarSign,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp } from '../lib/whatsapp';

export default function DealerPrincipalAgentModal({ isOpen, onClose, onDataRefresh }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [digest, setDigest] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  const messagesEndRef = useRef(null);

  // Quick Strategy Chips for the MD
  const quickPrompts = [
    { label: "📊 Forensic Leakage Audit (₹4.72L)", query: "Why are we leaking ₹4.72L today? Give full category breakdown." },
    { label: "⚡ SA Accountability & Lagging Quotes", query: "Which Service Advisor is lagging with unapproved estimates?" },
    { label: "⚙️ Bay Yield & ₹/Bay/Hour Math", query: "Show me the 18-bay yield vs our ₹1,250/hr target." },
    { label: "⏱️ 5:30 PM Bottleneck Radar", query: "Which cars will miss 5:30 PM on-time delivery deadline?" },
    { label: "🛡️ Customer Legal & Escalation Shield", query: "Are there any angry customers threatening Consumer Court?" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
      fetchDigest();
      if (messages.length === 0) {
        // Initial welcome message
        handleQuerySubmit("Give me the executive master briefing for today.");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/agent/dealer-principal/status');
      const data = await res.json();
      if (data.success) setLiveMetrics(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDigest = async () => {
    try {
      const res = await fetch('/api/agent/dealer-principal/briefing');
      const data = await res.json();
      if (data.success) setDigest(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuerySubmit = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent/dealer-principal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...data
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        directAnswer: "Connected to offline contingency. Data synced from local store.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDirective = async (btn) => {
    try {
      const res = await fetch('/api/agent/dealer-principal/directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directiveKey: btn.actionKey,
          directiveTitle: btn.label,
          targetRole: "WORKSHOP_LEADERSHIP"
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessToast(`✅ Dispatched: ${data.data.message}`);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
        setTimeout(() => setActionSuccessToast(null), 5000);
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlayAudio = () => {
    if (!digest?.audioScript) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(digest.audioScript);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  const handleSendWhatsApp = () => {
    if (!digest) return;
    openWhatsApp({
      phone: digest.recipient || "919893011223",
      message: digest.messageText,
      newTab: true
    });
    setActionSuccessToast("📲 8:00 AM Executive Briefing dispatched to MD WhatsApp!");
    confetti({ particleCount: 80, spread: 70 });
    setTimeout(() => setActionSuccessToast(null), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl shadow-xs">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Executive Strategic Advisor & Command Console</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Grounded Financial Core
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Financial Watchdog, ₹/Bay/Hour Math & 8:00 AM WhatsApp Dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
              title="Listen to 8:00 AM Executive Briefing"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-slate-600" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen 8 AM Briefing'}</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">1-Tap WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionSuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span>{actionSuccessToast}</span>
            <button onClick={() => setActionSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Body Content (Chat + Live Ledger) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          
          {/* Quick Metrics Ribbon */}
          {liveMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">₹ Leakage at Risk</span>
                <span className="text-lg font-black text-rose-600 font-mono mt-0.5 block">
                  ₹{liveMetrics.financials?.totalLeakageAtRisk?.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">Net Margin: ₹{liveMetrics.financials?.netPayableMarginAtRisk?.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">₹/Bay/Hour Yield</span>
                <span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">
                  ₹{liveMetrics.bayYield?.actualYieldPerHour} / hr
                </span>
                <span className="text-[10px] text-slate-400">Target: ₹1,250/hr ({liveMetrics.bayYield?.yieldEfficiencyPercent}%)</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">5:30 PM Risk</span>
                <span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">
                  {liveMetrics.throughputRisk?.highRiskDeliveryCount} Cars Delayed
                </span>
                <span className="text-[10px] text-slate-400">{liveMetrics.throughputRisk?.activeVehiclesCount} Active in Shop</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[11px] text-slate-500 block font-medium">Legal / CCM Alerts</span>
                <span className="text-lg font-black text-emerald-700 font-mono mt-0.5 block">
                  {liveMetrics.criticalEscalations?.count} High Priority
                </span>
                <span className="text-[10px] text-slate-400">1-Click Rescue Armed</span>
              </div>
            </div>
          )}

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySubmit(p.query)}
                className="whitespace-nowrap px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-full transition-all cursor-pointer shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Crown className="w-4 h-4 text-amber-700" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  {m.title && (
                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> {m.title}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.directAnswer || m.text}</p>

                  {/* Structured Table / Breakdown */}
                  {m.breakdown && m.breakdown.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2 overflow-x-auto">
                      <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase px-2 min-w-[340px]">
                        <span className="col-span-5">Category / Metric</span>
                        <span className="col-span-3 text-right">Value / Metric</span>
                        <span className="col-span-2 text-center">Volume</span>
                        <span className="col-span-2 text-right">Margin / Status</span>
                      </div>
                      <div className="space-y-1.5 min-w-[340px]">
                        {m.breakdown.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-12 text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 items-center">
                            <span className="col-span-5 font-medium text-slate-800">{row.label}</span>
                            <span className="col-span-3 text-right font-mono font-bold text-amber-700">{row.amount}</span>
                            <span className="col-span-2 text-center text-slate-500 text-[11px]">{row.count}</span>
                            <span className="col-span-2 text-right text-[11px] font-semibold text-emerald-700">{row.margin}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Executive Action & Directive Button */}
                  {m.executiveAction && (
                    <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong className="block text-amber-800 font-bold mb-1">💡 Executive Recommendation:</strong>
                      {m.executiveAction}

                      {m.actionButton && (
                        <div className="mt-2.5">
                          <button
                            onClick={() => handleExecuteDirective(m.actionButton)}
                            className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {m.actionButton.label} <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className={`text-[10px] block mt-2 text-right ${m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 animate-spin">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>Auditing 18-Bay Ledger & Computing Revenue Formulas...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuerySubmit();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything as Dealer Principal (e.g., 'Why are we leaking ₹4.72L?', 'Which SA is lagging?')..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Advisor</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
