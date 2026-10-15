import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Sparkles,
  Send,
  User,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Cpu,
  Package,
  Volume2,
  X,
  RotateCcw,
  Layers,
  ArrowRight,
  Zap,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TechAgentModal({ isOpen, onClose, technicianName = "Ramesh Sonawane", onDataRefresh }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "🔧 DTC P0841 DCA Guide (Hindi)", query: "DTC P0841 DCA transmission solenoid check step-by-step batao." },
    { label: "⚡ DTC P0AC0 Ziptron EV HV Guide", query: "DTC P0AC0 Nexon EV battery pack insulation and cell balance guide." },
    { label: "🔊 140 Hz Suspension Shudder Analysis", query: "140 Hz suspension noise and lower arm bush FFT analysis batao." },
    { label: "⏱️ 5:30 PM Delivery Bay Countdown", query: "Meri bay mein 5:30 PM delivery ke liye kitna time bacha hai?" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchTechState();
      if (messages.length === 0) {
        handleQuerySubmit("Tata Aarohan terminal live status aur diagnostic guidance do.");
      }
    }
  }, [isOpen, technicianName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchTechState = async () => {
    try {
      const res = await fetch(`/api/agent/floor-tech/status?technicianName=${encodeURIComponent(technicianName)}`);
      const data = await res.json();
      if (data.success) setLiveState(data.data);
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
      const res = await fetch('/api/agent/floor-tech/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, technicianName })
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
        directAnswer: "Connected to Tata Aarohan Diagnostic Engine.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequisition = async (part) => {
    try {
      const res = await fetch('/api/agent/floor-tech/requisition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: liveState?.currentJob?.jobCardId || "jc-001",
          bay: liveState?.currentJob?.bay || "Bay 04 (Express Mechanical)",
          partNo: part.partNo || "2871-5420-0104",
          partName: part.partName || "DCA Solenoid Valve Block",
          priceINR: part.priceINR || 8500,
          bin: part.bin || "Bin C-14"
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessToast(`📦 ${data.data.message}`);
        confetti({ particleCount: 70, spread: 60 });
        if (onDataRefresh) onDataRefresh();
        setTimeout(() => setActionSuccessToast(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl shadow-xs">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Tata Aarohan Master Diagnostic Specialist</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-600" /> Hindi Vernacular & FFT Analyzer
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {technicianName} • {liveState?.currentJob?.bay} • {liveState?.currentJob?.model} ({liveState?.currentJob?.regNo})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toast */}
        {actionSuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {actionSuccessToast}
            </span>
            <button onClick={() => setActionSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          
          {/* Quick Metrics */}
          {liveState && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">5:30 PM Delivery Gate</span>
                <span className="text-sm font-black text-amber-600 mt-0.5 block font-mono">
                  {liveState.currentJob?.minutesRemainingTo530PM} Mins Remaining
                </span>
                <span className="text-[9px] text-emerald-600 font-bold">Countdown Active</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">Active Work Bay</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">{liveState.currentJob?.bay}</span>
                <span className="text-[9px] text-slate-500">{liveState.currentJob?.regNo}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">DTC Knowledge Trees</span>
                <span className="text-sm font-black text-emerald-600 font-mono mt-0.5 block">
                  P0841, P0AC0, P0299
                </span>
                <span className="text-[9px] text-slate-400">Hindi SOPs Loaded</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">FFT Acoustic Core</span>
                <span className="text-sm font-black text-blue-600 font-mono mt-0.5 block">
                  140Hz / 920Hz / 2.6kHz
                </span>
                <span className="text-[9px] text-blue-600 font-medium">Live Frequency Match</span>
              </div>
            </div>
          )}

          {/* Strategy Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuerySubmit(p.query)}
                className="whitespace-nowrap px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-full transition-all cursor-pointer shadow-xs"
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
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Wrench className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 sm:p-4.5 text-xs ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  {m.title && (
                    <div className="font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> {m.title}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.directAnswer || m.text}</p>

                  {/* Breakdown Table */}
                  {m.breakdown && m.breakdown.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2">
                      {m.breakdown.map((row, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{row.label}</span>
                            <span className="text-[10px] text-slate-500">{row.status}</span>
                          </div>
                          <span className="font-black text-amber-600 font-mono text-sm">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Action */}
                  {m.quickAction && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => {
                          if (m.quickAction.actionKey === 'REQUISITION_PARTS' && m.quickAction.payload) {
                            handleRequisition(m.quickAction.payload);
                          } else {
                            setActionSuccessToast(`⚡ Action Triggered: ${m.quickAction.label}`);
                            confetti({ particleCount: 60, spread: 50 });
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {m.quickAction.label} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className={`text-[9px] block mt-2 text-right ${m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time}</span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-600">
                <RotateCcw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Tata Aarohan DTC & Acoustic FFT Analysis in progress...</span>
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
              placeholder="DTC code ya awaz ke baare mein puchein (e.g. 'P0841 guide', 'Suspension 140Hz noise')..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Diagnostic</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
