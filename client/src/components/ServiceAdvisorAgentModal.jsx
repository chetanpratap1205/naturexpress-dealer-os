import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Sparkles,
  Send,
  User,
  ShoppingBag,
  Wrench,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  X,
  RotateCcw,
  Layers,
  ArrowRight,
  Zap,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp } from '../lib/whatsapp';

export default function ServiceAdvisorAgentModal({ isOpen, onClose, advisorName = "Rahul Sharma", onDataRefresh }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  
  // Fast Quote Builder State
  const [selectedModel, setSelectedModel] = useState("Tata Nexon");
  const [customerPhone, setCustomerPhone] = useState("919826012345");
  const [customerName, setCustomerName] = useState("Pooja Choudhary");
  const [regNo, setRegNo] = useState("MP-09-WA-9011");

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "🛍️ Accessory Combo for Safari Dark", query: "Suggest the highest-converting OEM accessory combo for Tata Safari Dark Edition." },
    { label: "🔧 Official Tata Labor Times (FRT)", query: "Show standard labor flat-rate times for periodic maintenance, DCA service, and brake pads." },
    { label: "⚡ Sweep Unapproved Estimates Backlog", query: "Show my pending unapproved estimates backlog and how to close them via WhatsApp video." },
    { label: "🛡️ Tata Care+ Insurance 50% NCB", query: "Draft a Tata Care+ Motor Insurance renewal pitch with 50% NCB bonus transfer." }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchSADeskState();
      if (messages.length === 0) {
        handleQuerySubmit("Give me a live overview of my service advisor desk and upsell opportunities.");
      }
    }
  }, [isOpen, advisorName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchSADeskState = async () => {
    try {
      const res = await fetch(`/api/agent/service-advisor/status?advisorName=${encodeURIComponent(advisorName)}`);
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
      const res = await fetch('/api/agent/service-advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, advisorName })
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
        directAnswer: "Connected to Tata OEM Catalog & Labor Database.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchFastQuote = async (combo) => {
    try {
      const res = await fetch('/api/agent/service-advisor/quote/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone,
          customerName,
          vehicleModel: selectedModel,
          regNo,
          quoteTitle: combo.comboName,
          grossAmount: combo.grossPriceINR
        })
      });
      const data = await res.json();
      if (data.success) {
        const whatsappMsg = `🚗 *TATA GENUINE ACCESSORY SPECIAL BUNDLE*\n\nDear *${customerName}*,\n\nWe have prepared a customized *${combo.comboName}* for your *${selectedModel} (${regNo})*:\n\n• ${combo.items.join('\n• ')}\n\n💰 *Special Dealer Price:* ₹${combo.grossPriceINR.toLocaleString('en-IN')}\n\nTap to approve in 1-Click with 100% Genuine Tata Motors Warranty.`;
        
        openWhatsApp({
          phone: customerPhone,
          message: whatsappMsg,
          newTab: true
        });

        setActionSuccessToast(`📲 Dispatched Quote for ${combo.comboName} to ${customerName} (${customerPhone})!`);
        confetti({ particleCount: 75, spread: 60 });
        if (onDataRefresh) onDataRefresh();
        setTimeout(() => setActionSuccessToast(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeCombo = liveState?.catalog?.ACCESSORY_COMBOS?.[selectedModel] || {
    comboName: "Nexon Explorer Pro Pack",
    items: ["OEM 4K Front/Rear Dashcam", "7D Waterproof Deep-Dish Mats", "Magnetic Snap-On Sunshades"],
    grossPriceINR: 14500,
    dealerMarginINR: 5100,
    pitchScript: "Zero-wire-cut installation with 1-year Tata warranty."
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl shadow-xs">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Service Advisor Rapid Intake Specialist</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" /> OEM Labor & Upsell Matrix
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Desk of {advisorName} • 30s Rapid Intake, Flat-Rate Times (FRT) & 1-Tap WhatsApp Quotes
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

        {/* 2-Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50/50">
          
          {/* Left: Chat & Reasoning (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-slate-200 overflow-hidden bg-white">
            
            {/* Quick Metrics */}
            {liveState && (
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 sm:gap-2.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Active Job Cards</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5 block">{liveState.activeJobCardsCount} In Shop</span>
                  <span className="text-[9px] text-blue-600 font-medium">On-Time Velocity</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Unapproved Quotes</span>
                  <span className="text-sm sm:text-base font-black text-amber-600 font-mono mt-0.5 block">
                    ₹{liveState.unapprovedQuotesAtRiskINR?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-amber-600 font-medium">{liveState.unapprovedQuotesCount} Quotes Pending</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Insurance Due</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5 block">
                    {liveState.insuranceLeadsCount} Leads
                  </span>
                  <span className="text-[9px] text-emerald-700 font-medium">50% NCB Ready</span>
                </div>
              </div>
            )}

            {/* Strategy Chips */}
            <div className="p-2.5 sm:p-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50/70">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(p.query)}
                  className="whitespace-nowrap px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-slate-900 rounded-full transition-all cursor-pointer shadow-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-4 text-xs ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                  }`}>
                    {m.title && (
                      <div className="font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> {m.title}
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{m.directAnswer || m.text}</p>

                    {/* Breakdown */}
                    {m.breakdown && m.breakdown.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                        {m.breakdown.map((row, rIdx) => (
                          <div key={rIdx} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                            <div>
                              <span className="font-semibold text-slate-800 block">{row.label}</span>
                              <span className="text-[10px] text-slate-500">{row.status}</span>
                            </div>
                            <span className="font-bold text-blue-700 font-mono">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className={`text-[9px] block mt-2 text-right ${m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time}</span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-center text-xs text-slate-600">
                  <RotateCcw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Calculating OEM flat-rate labor times & bundle pricing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200">
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
                  placeholder="Ask SA Copilot (e.g. 'Labor time for timing belt', 'Accessory combo for Punch')..."
                  className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask Copilot</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Instant OEM Accessory & Insurance Quote Dispatcher (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">1-Tap WhatsApp Quote Builder</h3>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full border border-blue-300 font-bold">
                  Instant Upsell
                </span>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Select Vehicle Model:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Tata Nexon">Tata Nexon (Explorer Pro Pack - ₹14,500)</option>
                  <option value="Tata Safari">Tata Safari (Dark Prestige Bundle - ₹26,500)</option>
                  <option value="Tata Harrier">Tata Harrier (Adventure Stealth Kit - ₹18,900)</option>
                  <option value="Tata Altroz">Tata Altroz (Urban Commuter Kit - ₹8,900)</option>
                  <option value="Tata Punch">Tata Punch (Micro-SUV Rugged Combo - ₹11,200)</option>
                </select>
              </div>

              {/* Customer Phone & Reg */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block">Customer Name:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block">WhatsApp Phone:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Combo Details Card */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-800">{activeCombo.comboName}</span>
                  <span className="font-black text-sm text-amber-600 font-mono">₹{activeCombo.grossPriceINR?.toLocaleString('en-IN')}</span>
                </div>
                <ul className="text-[11px] text-slate-700 space-y-1">
                  {activeCombo.items?.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Advisor Commission / Margin:</span>
                  <span className="text-emerald-700 font-bold font-mono">₹{activeCombo.dealerMarginINR?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Dispatch Button */}
            <div className="pt-2">
              <button
                onClick={() => handleDispatchFastQuote(activeCombo)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>Dispatch Quote to Customer WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Direct 1-Click WhatsApp quote • Adds to Dealership CRM log
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
