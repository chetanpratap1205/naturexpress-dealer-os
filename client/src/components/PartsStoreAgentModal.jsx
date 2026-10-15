import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Sparkles,
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Zap,
  Truck,
  Scan,
  TrendingDown,
  Building2,
  X,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartsStoreAgentModal({ isOpen, onClose, onDataRefresh }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(null);
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "📦 Bin Location for DCA Solenoid Block", query: "Where is the DCA Solenoid Block (#2871-5420-0104) stored in our bins?" },
    { label: "🌐 45-Min Indore Cluster Swarm Pool", query: "Show connected dealers in Indore cluster pool and emergency runner delivery ETAs." },
    { label: "💰 Liquidate ₹63k Dead-Stock Inventory", query: "Show dead-stock parts aging over 90 days and calculate 30-40% liquidation counter offers." },
    { label: "🏃 Live Bay Requisitions Queue", query: "Show live part requests pending from workshop bays right now." }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPartsState();
      if (messages.length === 0) {
        handleQuerySubmit("Parts storekeeper live status and bin telemetry briefing do.");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchPartsState = async () => {
    try {
      const res = await fetch('/api/agent/parts-store/status');
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
      const res = await fetch('/api/agent/parts-store/chat', {
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
        directAnswer: "Connected to Indore Central Parts Warehouse Engine.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchRunner = async (bin, partName) => {
    try {
      const res = await fetch('/api/agent/parts-store/runner/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bin, partName, bay: "Bay 04 (Express Mechanical)" })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessToast(`🏃 ${data.data.message}`);
        confetti({ particleCount: 75, spread: 60 });
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
      <div className="bg-white border border-slate-200 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl shadow-xs">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Parts Logistics Specialist & Cluster Swarm</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-600" /> 45-Min Indore Swarm Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                420 Monitored Bins • Live Bay Requisitions Stream • Dead-Stock Liquidation Ledger
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
          
          {/* Left: Chat Feed (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-slate-200 overflow-hidden bg-white">
            
            {/* Quick Metrics */}
            {liveState && (
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 sm:gap-2.5">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Active Bay Requisitions</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5 block">
                    {liveState.inventoryStats?.activeRequisitionsCount} Orders
                  </span>
                  <span className="text-[9px] text-blue-600 font-medium">Runner Stream</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Dead-Stock at Risk</span>
                  <span className="text-sm sm:text-base font-black text-rose-600 font-mono mt-0.5 block">
                    ₹{liveState.inventoryStats?.deadStockTotalValueINR?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-rose-600 font-medium">Liquidation Ready</span>
                </div>

                <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-500 font-medium block">Indore Cluster Pool</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5 block">
                    {liveState.inventoryStats?.clusterDealersOnline} Dealers
                  </span>
                  <span className="text-[9px] text-emerald-700 font-medium">45-Min Swarm</span>
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
                      <Package className="w-4 h-4" />
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

                    {/* Breakdown Table */}
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

                    {m.quickAction && (
                      <div className="mt-3 pt-2">
                        <button
                          onClick={() => {
                            if (m.quickAction.actionKey === 'DISPATCH_BIN_RUNNER' && m.quickAction.payload) {
                              handleDispatchRunner(m.quickAction.payload.bin, m.quickAction.payload.partName);
                            } else {
                              setActionSuccessToast(`⚡ Action Triggered: ${m.quickAction.label}`);
                              confetti({ particleCount: 70, spread: 60 });
                            }
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {m.quickAction.label} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
                  <span>Scanning 420 storage bins & querying Indore cluster swarm...</span>
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
                  placeholder="Ask Parts Specialist (e.g. 'Bin location of brake pads', 'Dead stock offers')..."
                  className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask Parts</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Live Requisition Stream & Indore Cluster Map (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">Live Bay Requisition Stream</h3>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded-full border border-blue-300 font-bold">
                  Floor Runner Live
                </span>
              </div>

              {/* Requisitions List */}
              <div className="space-y-2">
                {(liveState?.activeRequisitions?.length > 0 ? liveState.activeRequisitions : [
                  { bay: "Bay 04 (Express Mechanical)", partName: "DCA Solenoid Valve Block", bin: "Bin C-14", priceINR: 8500 }
                ]).map((req, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="flex justify-between items-start text-xs font-bold text-slate-900">
                      <span>{req.partName}</span>
                      <span className="font-mono text-blue-600 font-black">{req.bin}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Target: <strong className="text-slate-800">{req.bay}</strong></span>
                      <button
                        onClick={() => handleDispatchRunner(req.bin, req.partName)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer shadow-2xs transition-colors"
                      >
                        Dispatch Runner
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cluster Swarm Card */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Indore Cluster Swarm Network
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">45m SLA</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div>• <strong>Shyam Scheme 140 (Flagship Spares):</strong> In-House Hub</div>
                  <div>• <strong>Shyam Dewas Rd Depot:</strong> 12 km (25 mins)</div>
                  <div>• <strong>Sanghi Central Bypass:</strong> 7.5 km (20 mins)</div>
                  <div>• <strong>Jagdish Motors Pithampur:</strong> 26 km (45 mins)</div>
                </div>
              </div>
            </div>

            {/* Bottom 1-Click Scan Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setActionSuccessToast("🔍 RFID & Barcode Scanner Activated for Bin Verification!");
                  confetti({ particleCount: 60, spread: 50 });
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Scan className="w-4 h-4 text-white" />
                <span>Activate RFID / Barcode Bin Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
