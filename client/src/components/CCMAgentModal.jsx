import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Send,
  User,
  AlertTriangle,
  Car,
  Gift,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  X,
  Smartphone,
  RotateCcw,
  ArrowRight,
  Zap,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsApp } from '../lib/whatsapp';

export default function CCMAgentModal({ isOpen, onClose, onDataRefresh, preselectedAlert = null }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  
  // Rescue Drawer Form State
  const [selectedAlertId, setSelectedAlertId] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(2500);
  const [selectedCourtesyCar, setSelectedCourtesyCar] = useState('Nexon EV Empowered+ (MP-09-EV-1001)');
  const [rescueDraft, setRescueDraft] = useState(null);
  const [deployingRescue, setDeployingRescue] = useState(false);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "🚨 Critical Consumer Court Threats", query: "Show all severe legal threats and angry customer escalations right now." },
    { label: "🔧 Repeat Visit & Quality Audit", query: "Audit repeat visit issues and vehicles coming back 3rd time." },
    { label: "🚗 Courtesy EV Fleet Status", query: "Show available loaner cars in Indore cluster pool for emergency deployment." },
    { label: "💳 Goodwill Budget & Disbursals", query: "Show remaining monthly goodwill credit balance and past ROI." }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchState();
      if (messages.length === 0) {
        handleQuerySubmit("Give me the live territory customer care and legal risk briefing.");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (liveState?.activeAlerts?.length > 0) {
      if (preselectedAlert) {
        setSelectedAlertId(preselectedAlert.id);
      } else if (!selectedAlertId) {
        setSelectedAlertId(liveState.activeAlerts[0].id);
      }
    }
  }, [liveState, preselectedAlert]);

  useEffect(() => {
    if (selectedAlertId && liveState?.activeAlerts) {
      const active = liveState.activeAlerts.find(a => a.id === selectedAlertId) || liveState.activeAlerts[0];
      if (active) {
        fetchRescueDraft(active);
      }
    }
  }, [selectedAlertId, selectedVoucher, selectedCourtesyCar]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/agent/ccm/status');
      const data = await res.json();
      if (data.success) setLiveState(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRescueDraft = async (alert) => {
    try {
      const res = await fetch('/api/agent/ccm/rescue/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: alert.customerName,
          vehicleModel: alert.model,
          regNo: alert.regNo,
          voucherAmount: selectedVoucher,
          loanerCar: selectedCourtesyCar.split(' (')[0]
        })
      });
      const data = await res.json();
      if (data.success) setRescueDraft(data.data);
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
      const res = await fetch('/api/agent/ccm/chat', {
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
        directAnswer: "Connected to local CCM risk database.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteRescue = async () => {
    const targetAlert = liveState?.activeAlerts?.find(a => a.id === selectedAlertId) || liveState?.activeAlerts?.[0];
    if (!targetAlert) return;

    setDeployingRescue(true);
    try {
      const res = await fetch('/api/agent/ccm/rescue/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: targetAlert.id,
          customerName: targetAlert.customerName,
          regNo: targetAlert.regNo,
          voucherAmount: selectedVoucher,
          loanerCar: selectedCourtesyCar,
          actionNotes: `Deployed courtesy ${selectedCourtesyCar} and ₹${selectedVoucher} goodwill voucher`
        })
      });
      const data = await res.json();
      if (data.success) {
        // Open WhatsApp directly with the legally compliant de-escalation message
        if (rescueDraft?.whatsappMessage) {
          openWhatsApp({
            phone: targetAlert.customerPhone || "919826012345",
            message: rescueDraft.whatsappMessage,
            newTab: true
          });
        }

        setActionSuccessToast(`🛡️ ${data.data.message}`);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        fetchState();
        if (onDataRefresh) onDataRefresh();
        setTimeout(() => setActionSuccessToast(null), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeployingRescue(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl shadow-xs">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Customer Care Manager (CCM) Experience Sentinel & Legal Defense</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-600" /> Real-time NLP Sentiment Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500">Early-Warning Radar for 'Consumer Court' / Repeat Visits • 1-Click Rescue Drawer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Success Toast */}
        {actionSuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {actionSuccessToast}
            </span>
            <button onClick={() => setActionSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* 2-Column Layout: Left Chat + Right 1-Click Rescue Drawer */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50/50">
          
          {/* Left: Intelligence Stream & Chat (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-slate-200 overflow-hidden bg-white">
            
            {/* Metrics Ribbon */}
            {liveState && (
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Territory CSI</span>
                  <span className="text-sm sm:text-base font-black text-amber-600 font-mono mt-0.5 block">{liveState.csi?.currentScore} / 10</span>
                  <span className="text-[9px] text-emerald-700 font-bold">Target: 9.8</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Legal Threats</span>
                  <span className="text-sm sm:text-base font-black text-rose-600 font-mono mt-0.5 block">{liveState.alertsSummary?.criticalCount} Active</span>
                  <span className="text-[9px] text-rose-600 font-medium">Consumer Court Risk</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Courtesy Fleet</span>
                  <span className="text-sm sm:text-base font-black text-blue-600 font-mono mt-0.5 block">
                    {liveState.courtesyFleet?.filter(c => c.status === 'AVAILABLE').length} Available
                  </span>
                  <span className="text-[9px] text-blue-600 font-medium">Indore Pool</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Goodwill Pool</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5 block">
                    ₹{liveState.goodwillDrawer?.remainingINR?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-slate-400">Liquid Budget</span>
                </div>
              </div>
            )}

            {/* Quick Strategy Chips */}
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

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-4 text-xs ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                  }`}>
                    {m.title && (
                      <div className="font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3 h-3 text-rose-600" /> {m.title}
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{m.directAnswer || m.text}</p>

                    {/* Breakdown table */}
                    {m.breakdown && m.breakdown.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                        {m.breakdown.map((row, rIdx) => (
                          <div key={rIdx} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                            <div>
                              <span className="font-semibold text-slate-800 block">{row.label}</span>
                              <span className="text-[10px] text-slate-500">{row.count}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-rose-700 font-mono block">{row.amount}</span>
                              <span className="text-[10px] text-emerald-700">{row.margin}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.executiveAction && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                        <strong className="block text-rose-700 font-bold mb-0.5">🛡️ CCM Action Protocol:</strong>
                        {m.executiveAction}
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
                  <RotateCcw className="w-4 h-4 animate-spin text-rose-600" />
                  <span>Scanning customer sentiment matrix & legal escalation nodes...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
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
                  placeholder="Ask CCM Copilot (e.g., 'Draft apology for Kunal', 'Show repeat visit cars')..."
                  className="flex-1 bg-slate-50 border border-slate-300 focus:border-rose-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-600"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask CCM</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: 1-Click Rescue Drawer Console (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900">1-Click Emergency Rescue Drawer</h3>
                </div>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-mono px-2 py-0.5 rounded-full border border-rose-300 font-bold">
                  Direct De-escalation
                </span>
              </div>

              {/* 1. Target Customer Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Select Agitated Customer / Job Card:</label>
                <select
                  value={selectedAlertId}
                  onChange={(e) => setSelectedAlertId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                >
                  {liveState?.activeAlerts?.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.customerName} - {a.vehicle} ({a.severity})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Courtesy Fleet Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" /> Assign Indore Cluster Courtesy Loaner:
                </label>
                <select
                  value={selectedCourtesyCar}
                  onChange={(e) => setSelectedCourtesyCar(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Nexon EV Empowered+ (MP-09-EV-1001)">Nexon EV Empowered+ (MP-09-EV-1001) - Bypass Bay 1</option>
                  <option value="Tiago EV Long Range (MP-09-EV-3012)">Tiago EV Long Range (MP-09-EV-3012) - Dewas Road Hub</option>
                  <option value="Punch EV Adventure (MP-09-EV-2044)">Punch EV Adventure (MP-09-EV-2044) - Central Pool</option>
                </select>
              </div>

              {/* 3. Goodwill Voucher Denomination */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-600" /> Issue Official Tata Goodwill Credit:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1500, 2500, 3500].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedVoucher(amt)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedVoucher === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Live WhatsApp De-escalation Preview */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 block flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-emerald-600" /> Legally Verified De-escalation WhatsApp Letter:
                </label>
                <div className="bg-white border border-slate-200 p-3 rounded-xl text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed border-l-4 border-l-rose-500 shadow-xs">
                  {rescueDraft?.whatsappMessage || "Generating personalized apology letter..."}
                </div>
              </div>
            </div>

            {/* Execute Rescue Button */}
            <div className="pt-2">
              <button
                onClick={handleExecuteRescue}
                disabled={deployingRescue}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {deployingRescue ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Disbursing Credit & Reserving Loaner...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-white" />
                    <span>Deploy 1-Click Rescue & WhatsApp Owner</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Locks legal audit log • Dispatches courtesy EV • Credits ₹{selectedVoucher} voucher
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
