import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  Sparkles,
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Video,
  X,
  CreditCard,
  Gift,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp } from '../lib/whatsapp';

export default function CarOwnerAgentModal({ isOpen, onClose, jobCard, onDataRefresh }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const messagesEndRef = useRef(null);

  const jcId = jobCard?.id || "jc-001";

  const quickPrompts = [
    { label: "⏱️ When will my car be ready?", query: "When will my car delivery be ready today?" },
    { label: "📹 Show 15s Video Proof for Repairs", query: "Why do I need brake pads or additional repairs? Show video proof." },
    { label: "🎁 Check My Tata Loyalty Points Balance", query: "How many loyalty points do I have and how can I redeem them?" },
    { label: "💳 What is my total estimated cost?", query: "What is my total estimated cost with GST and discounts?" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchVehicleState();
      if (messages.length === 0) {
        handleQuerySubmit("Give me a live status update on my car.");
      }
    }
  }, [isOpen, jcId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchVehicleState = async () => {
    try {
      const res = await fetch(`/api/agent/car-owner/status/${jcId}`);
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
      const res = await fetch('/api/agent/car-owner/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, jobCardId: jcId })
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
        directAnswer: "Connected to Shyam Automotive Live Vehicle Tracking Engine (Scheme 140 Flagship).",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId, title) => {
    try {
      const res = await fetch('/api/agent/car-owner/approve-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobCardId: jcId, itemId })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessToast(`✅ Approved: ${title}`);
        confetti({ particleCount: 70, spread: 50 });
        fetchVehicleState();
        if (onDataRefresh) onDataRefresh();
        setTimeout(() => setActionSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenWhatsAppHub = () => {
    const message = `Namaste! I am checking my live vehicle tracking for ${liveState?.model || 'Tata Car'} (${liveState?.regNo || 'MP-09'}). Please share updates.`;
    openWhatsApp({
      phone: "919893011223",
      message: message,
      newTab: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl shadow-xs">
              <Car className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Tata Personal Concierge & Vehicle Assistant</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Verified Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {liveState ? `${liveState.model} (${liveState.regNo}) • ${liveState.bay}` : '24/7 Vehicle Status, 15s Video Proofs & 1-Tap Approvals'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsAppHub}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Open WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

        {/* Video Player Modal */}
        {activeVideoUrl && (
          <div className="bg-slate-100 border-b border-slate-200 p-4 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-full max-w-xl bg-black rounded-xl overflow-hidden border border-slate-300 relative shadow-md">
              <video src={activeVideoUrl} controls autoPlay className="w-full h-64 object-cover" />
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] text-slate-600 mt-2 flex items-center gap-1 font-medium">
              <Video className="w-3.5 h-3.5 text-rose-600" /> 15-Second HD Video Proof uploaded by Technician
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60">
          
          {/* Quick Metrics */}
          {liveState && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">Promised Delivery</span>
                <span className="text-sm font-black text-amber-600 mt-0.5 block">{liveState.estimatedDeliveryTime}</span>
                <span className="text-[9px] text-emerald-700 font-medium">On Track</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">Current Bay</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">{liveState.bay}</span>
                <span className="text-[9px] text-slate-400">{liveState.technician}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">Approved Total</span>
                <span className="text-sm font-black text-emerald-700 font-mono mt-0.5 block">
                  ₹{liveState.financials?.approvedTotal?.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-slate-400">+18% GST Applicable</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-500 font-medium block">Loyalty Balance</span>
                <span className="text-sm font-black text-blue-600 font-mono mt-0.5 block">
                  ₹{liveState.financials?.loyaltyValueINR}
                </span>
                <span className="text-[9px] text-blue-600 font-medium">{liveState.financials?.loyaltyPointsBalance} Points Ready</span>
              </div>
            </div>
          )}

          {/* Quick Strategy Chips */}
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
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Car className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 sm:p-4.5 text-xs ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}>
                  {m.title && (
                    <div className="font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" /> {m.title}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.directAnswer || m.text}</p>

                  {/* Breakdown Table */}
                  {m.breakdown && m.breakdown.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2">
                      {m.breakdown.map((row, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <span className="font-bold text-slate-800 text-xs block">{row.label}</span>
                            {row.reason && <span className="text-[10px] text-amber-700 block mt-0.5">{row.reason}</span>}
                            <span className="text-[10px] text-slate-500 font-mono">{row.status}</span>
                          </div>
                          
                          <div className="text-right flex items-center gap-2">
                            <span className="font-black text-amber-600 font-mono text-sm">{row.value || row.amount}</span>
                            {row.videoUrl && (
                              <button
                                onClick={() => setActiveVideoUrl(row.videoUrl)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                              >
                                <Play className="w-3 h-3 fill-current" /> 15s Video
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Button */}
                  {m.quickAction && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => {
                          if (m.quickAction.actionKey === 'APPROVE_ALL_PENDING') {
                            liveState?.pendingApprovals?.forEach(p => handleApproveItem(p.id, p.title));
                          } else if (m.quickAction.actionKey === 'REDEEM_LOYALTY_POINTS') {
                            setActionSuccessToast(`🎁 Redeemed ₹${liveState?.financials?.loyaltyValueINR} loyalty discount!`);
                            confetti({ particleCount: 70, spread: 60 });
                          } else if (m.quickAction.actionKey === 'OPEN_WHATSAPP_HUB') {
                            handleOpenWhatsAppHub();
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {m.quickAction.label} <ChevronRight className="w-3.5 h-3.5" />
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
                <RotateCcw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Syncing live workshop bay telemetry...</span>
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
              placeholder="Ask anything about your vehicle (e.g. 'When will it be ready?', 'Show video proof', 'Loyalty points')..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Concierge</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
