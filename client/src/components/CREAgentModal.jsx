import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Car, 
  Wrench, 
  Calendar, 
  Percent, 
  Zap, 
  Award,
  PhoneForwarded,
  MessageSquare,
  X,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Check,
  Volume2,
  PhoneOff,
  Flame,
  Radio,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CREAgentModal({ isOpen, onClose, onDataRefresh }) {
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'HIGH_CONVERSION', 'VALUE_CLUB'
  const [activeScriptTab, setActiveScriptTab] = useState('HINDI'); // 'HINDI', 'MALWI', 'OBJECTIONS'
  const [dialingState, setDialingState] = useState('IDLE'); // 'IDLE', 'RINGING', 'CONNECTED', 'LOGGED'
  const [callNotes, setCallNotes] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDossier();
    }
  }, [isOpen]);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/cre-telecaller/dossier');
      const data = await res.json();
      if (data.success) {
        setDossier(data.data);
        if (data.data.leads?.length > 0 && !selectedLeadId) {
          setSelectedLeadId(data.data.leads[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching CRE dossier:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeLead = dossier?.leads?.find(l => l.id === selectedLeadId) || dossier?.leads?.[0];

  const filteredLeads = (dossier?.leads || []).filter(lead => {
    if (filterTab === 'HIGH_CONVERSION') return lead.conversionScore >= 80;
    if (filterTab === 'VALUE_CLUB') return lead.isValueClubEligible;
    return true;
  });

  const handleWarmNudge = async (leadId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/cre-telecaller/warm-nudge/${leadId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 60, spread: 50 });
        setToastMessage(`✓ WhatsApp Pre-Nudge delivered to ${data.data.customerName}!`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleTriggerDrip = async (leadId, stepNum) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/cre-telecaller/trigger-drip/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber: stepNum })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 50, spread: 45 });
        setToastMessage(`✓ Drip Step #${stepNum} dispatched via WhatsApp!`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleIssueVoucher = async (leadId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/cre-telecaller/issue-voucher/${leadId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 90, spread: 70 });
        setToastMessage(`🏆 Indore Value Club Voucher ${data.data.voucherCode} issued with 15% discount!`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleBookSlot = async (leadId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/agents/cre-telecaller/book-slot/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredTime: "Tomorrow 9:30 AM Fast-Track" })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setToastMessage(`⚡ Priority Bay reserved for ${data.data.customerName}! SMS Confirmation sent.`);
        fetchDossier();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleSimulateCall = () => {
    setDialingState('RINGING');
    setTimeout(() => {
      setDialingState('CONNECTED');
    }, 1500);
  };

  const handleEndCall = async (outcome) => {
    setDialingState('LOGGED');
    try {
      await fetch(`/api/agents/cre-telecaller/call-outcome/${activeLead.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome, notes: callNotes || "Customer agreed to morning slot." })
      });
      confetti({ particleCount: 70, spread: 60 });
      setToastMessage(`✓ Call logged as '${outcome}'. CRM updated.`);
      fetchDossier();
      if (onDataRefresh) onDataRefresh();
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setDialingState('IDLE');
      setCallNotes('');
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl shadow-xs">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 tracking-wider">
                  Role #9 • CRE Telephony & WhatsApp Swarm
                </span>
                <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-orange-500" /> 34.8% Win-Back vs 8.2% Baseline
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                Customer Outreach Coordinator & Vernacular Tele-prompter
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchDossier}
              disabled={loading}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-slideDown">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
          </div>
        )}

        {/* Executive KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Today Calling Target</span>
            <span className="text-base sm:text-lg font-black text-blue-600 font-mono">
              {dossier?.summary?.todayBooked || 24} / {dossier?.summary?.targetBookings || 35} Booked
            </span>
            <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">
              {dossier?.summary?.bookingPacePercent || 68}% Target Pace
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Projected Labor Recovery</span>
            <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
              ₹{((dossier?.summary?.totalProjectedLaborRevenue || 342000) / 100000).toFixed(2)} Lakhs
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">From Active Queue</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">High Conversion Index (80%+)</span>
            <span className="text-base sm:text-lg font-black text-amber-600 font-mono">
              {dossier?.summary?.highPriorityCount || 3} Leads
            </span>
            <span className="text-[10px] text-amber-600 block font-semibold mt-0.5">Safety / Brake Triggers</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Indore Value Club Eligible</span>
            <span className="text-base sm:text-lg font-black text-purple-600 font-mono">
              {dossier?.summary?.valueClubEligibleCount || 2} Vehicles
            </span>
            <span className="text-[10px] text-purple-600 block font-semibold mt-0.5">Year 4+ (FNG Attrition Defense)</span>
          </div>
        </div>

        {/* Main Content Area: Left Queue + Right Dialing & Drip Desk */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/40">
          
          {/* Left Column: Lead Queue (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Filter Sub-Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setFilterTab('ALL')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterTab === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Leads ({dossier?.leads?.length || 0})
              </button>
              <button
                onClick={() => setFilterTab('HIGH_CONVERSION')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterTab === 'HIGH_CONVERSION' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔥 High (80%+)
              </button>
              <button
                onClick={() => setFilterTab('VALUE_CLUB')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterTab === 'VALUE_CLUB' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏆 Yr 4+ Club
              </button>
            </div>

            {/* Leads List */}
            <div className="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadId === lead.id;
                const isBooked = lead.callStatus === 'BOOKED' || lead.callStatus === 'SLOT_CONFIRMED';
                const isNudged = lead.callStatus === 'WARM_NUDGE_SENT';

                return (
                  <div
                    key={lead.id}
                    onClick={() => { setSelectedLeadId(lead.id); setDialingState('IDLE'); }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 text-sm">{lead.customerName}</span>
                          {lead.isValueClubEligible && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                              Yr 4+
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">{lead.phone} • {lead.regNo}</span>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isBooked 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : isNudged
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {isBooked ? '✓ Booked' : isNudged ? 'Nudge Sent' : 'Ready'}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold block mt-1">
                          {lead.conversionScore}% Score
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{lead.model}</span>
                      <span className="font-mono text-emerald-700 font-bold">~{lead.predictedOdometer?.toLocaleString()} km</span>
                    </div>

                    {lead.pendingAdvisory && (
                      <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 truncate">
                        ⚠️ Advisory: {lead.pendingAdvisory}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Dialing Context & Dynamic Tele-Prompter (7 Cols) */}
          {activeLead && (
            <div className="lg:col-span-7 space-y-4">
              
              {/* Context Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                    Live Telephony Context Card
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{activeLead.customerName}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>{activeLead.phone}</span>
                    <span>•</span>
                    <span className="text-slate-800 font-bold">{activeLead.regNo}</span>
                    <span>•</span>
                    <span className="text-blue-700">{activeLead.model}</span>
                  </div>
                </div>

                <div className="text-right bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Predicted Mileage & Cadence</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {activeLead.predictedOdometer?.toLocaleString()} km
                  </span>
                  <span className="text-[10px] text-slate-400 block">{activeLead.dailyCadenceKm} km/day</span>
                </div>
              </div>

              {/* Script & Objection Navigation Tabs */}
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveScriptTab('HINDI')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeScriptTab === 'HINDI' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇮🇳 Vernacular Hindi Script
                </button>
                <button
                  onClick={() => setActiveScriptTab('MALWI')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeScriptTab === 'MALWI' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📍 Malwi Local Dialect
                </button>
                <button
                  onClick={() => setActiveScriptTab('OBJECTIONS')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeScriptTab === 'OBJECTIONS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛡️ Objection Matrix ({activeLead.objectionResponses?.length || 3})
                </button>
              </div>

              {/* Script Box */}
              {activeScriptTab === 'HINDI' && (
                <div className="bg-white p-4 rounded-2xl border border-blue-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" /> Dynamic Hindi Tele-prompter Script
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">94% Adherence Conversion Target</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                    "{activeLead.hindiHook}"
                  </p>
                </div>
              )}

              {activeScriptTab === 'MALWI' && (
                <div className="bg-white p-4 rounded-2xl border border-blue-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" /> Malwi Regional Tele-prompter
                    </span>
                    <span className="text-[10px] text-blue-600 font-mono">Indore Bypass Persona</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-medium">
                    "{activeLead.malwiHook}"
                  </p>
                </div>
              )}

              {activeScriptTab === 'OBJECTIONS' && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(activeLead.objectionResponses || []).map((obj, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                      <span className="text-xs font-black text-rose-600 block">🛑 If Customer: "{obj.objection}"</span>
                      <p className="text-xs text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        👉 <strong>Reply:</strong> "{obj.hindiResponse}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 6-Step WhatsApp Drip Visualizer */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-blue-600" /> 6-Step WhatsApp Drip Automation Sequence
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">Tata Retention Engine</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(activeLead.dripCampaign || []).map((step) => (
                    <div
                      key={step.step}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                        step.status === 'SENT' || step.status === 'DELIVERED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase block text-slate-400">Step #{step.step}</span>
                        <span className="font-bold text-[11px] block mt-0.5 line-clamp-1">{step.name}</span>
                      </div>

                      <button
                        onClick={() => handleTriggerDrip(activeLead.id, step.step)}
                        disabled={actionLoading}
                        className="mt-2 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-blue-200"
                      >
                        <Send className="w-3 h-3" /> Trigger
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar & Call Simulator */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                {dialingState === 'IDLE' && (
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <button
                      onClick={() => handleWarmNudge(activeLead.id)}
                      disabled={actionLoading}
                      className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span>Send WhatsApp Pre-Nudge</span>
                    </button>

                    {activeLead.isValueClubEligible && (
                      <button
                        onClick={() => handleIssueVoucher(activeLead.id)}
                        disabled={actionLoading}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Issue 15% Value Club Voucher</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleBookSlot(activeLead.id)}
                      disabled={actionLoading}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>⚡ Reserve 9:00 AM Slot</span>
                    </button>

                    <button
                      onClick={handleSimulateCall}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Launch Context Dialer</span>
                    </button>
                  </div>
                )}

                {dialingState === 'RINGING' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-3">
                      <PhoneCall className="w-6 h-6 text-blue-600 animate-spin" />
                      <div>
                        <span className="text-xs font-bold text-blue-800 block">Dialing via CRM Cloud Bridge...</span>
                        <span className="text-sm font-black text-slate-900">{activeLead.phone} ({activeLead.customerName})</span>
                      </div>
                    </div>
                  </div>
                )}

                {dialingState === 'CONNECTED' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping"></span>
                        <span className="text-xs font-black text-emerald-800 uppercase">Call Connected • Live Tele-prompter Active</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-700 font-bold">00:42</span>
                    </div>

                    <input
                      type="text"
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Type call notes or customer feedback..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEndCall('APPOINTMENT_BOOKED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Booked Slot
                      </button>
                      <button
                        onClick={() => handleEndCall('CALLBACK_REQUESTED')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Clock className="w-3.5 h-3.5" /> Callback Later
                      </button>
                      <button
                        onClick={() => handleEndCall('DECLINED')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <PhoneOff className="w-3.5 h-3.5" /> End / Declined
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
