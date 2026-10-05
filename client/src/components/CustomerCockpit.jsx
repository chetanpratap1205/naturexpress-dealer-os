import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  Wrench, 
  Check, 
  X, 
  Sparkles, 
  ChevronRight, 
  Send, 
  Car, 
  Zap, 
  Award,
  Video,
  ExternalLink,
  FileText,
  Smile,
  Meh,
  Frown,
  ShoppingBag,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GSTInvoiceModal from './GSTInvoiceModal';
import RazorpayEMIModal from './RazorpayEMIModal';
import AccessoryCatalogModal from './AccessoryCatalogModal';
import LoyaltyWalletModal from './LoyaltyWalletModal';

export default function CustomerCockpit({ 
  jobCards, 
  selectedJcId, 
  setSelectedJcId, 
  onApproveItem, 
  onDeclineItem, 
  onApproveEW, 
  onSendMessage,
  onAdvanceStage,
  onDataRefresh
}) {
  const currentJc = (jobCards || []).find(j => j.id === selectedJcId) || jobCards?.[0];
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [showAccessoryModal, setShowAccessoryModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [pulseFeedback, setPulseFeedback] = useState(null);

  if (!currentJc) return <div className="p-8 text-center text-slate-500">Loading Job Card...</div>;

  const stages = [
    { id: 'intake', label: 'Intake & Triage', done: currentJc.stageIndex >= 0 },
    { id: 'inspection', label: 'Multi-Point Scan', done: currentJc.stageIndex >= 1 },
    { id: 'diagnostics', label: 'OBD & Acoustic Scan', done: currentJc.stageIndex >= 2, active: currentJc.stageIndex === 2 },
    { id: 'mechanical_repair', label: 'Bay Work', done: currentJc.stageIndex >= 3, active: currentJc.stageIndex === 3 },
    { id: 'washing', label: 'Wash & Detailing', done: currentJc.stageIndex >= 4, active: currentJc.stageIndex === 4 },
    { id: 'quality_check', label: '5km Road Test', done: currentJc.stageIndex >= 5, active: currentJc.stageIndex === 5 },
    { id: 'delivered', label: 'Gate Pass Ready', done: currentJc.stageIndex >= 6, active: currentJc.stageIndex === 6 }
  ];

  const handlePulseClick = async (sentimentType, text) => {
    setPulseFeedback(sentimentType);
    try {
      await fetch('/api/webhook/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: currentJc.id,
          text: `[Mid-Day Pulse]: ${sentimentType} - "${text}"`
        })
      });
      if (sentimentType === 'Delighted') {
        confetti({ particleCount: 70, spread: 50 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(currentJc.id, {
      sender: 'customer',
      senderName: currentJc.customerName,
      content: chatInput,
      type: 'text'
    });
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Vehicle Switcher Bar for Demo */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Car className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Simulate Customer WhatsApp WebApp Link:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(jobCards || []).map((jc) => (
            <button
              key={jc.id}
              onClick={() => { setSelectedJcId(jc.id); setPulseFeedback(null); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedJcId === jc.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {jc.regNo} ({jc.model?.split(' ')[1] || jc.model})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccessoryModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer flex items-center space-x-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>OEM Accessories</span>
          </button>
          <button
            onClick={() => setShowLoyaltyModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Seva Points</span>
          </button>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View GST Invoice</span>
          </button>
          <button
            onClick={() => onAdvanceStage(currentJc.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>Advance Stage ➔</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Mobile Cockpit Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Vehicle Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Live Workshop Cockpit
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Direct WhatsApp Link Verified</span>
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  {currentJc.model}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {currentJc.regNo}
                  </span>
                  <span>Owner: <strong className="text-slate-800">{currentJc.customerName}</strong></span>
                  <span>•</span>
                  <span>Bay: <strong className="text-blue-700">{currentJc.bay}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Estimated Handover</span>
                <span className="text-lg font-black text-emerald-600 font-mono">04:45 PM Today</span>
                <span className="text-[10px] text-slate-400 block">SLA Guaranteed Delivery</span>
              </div>
            </div>

            {/* Live Visual Progress Tracker */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="grid grid-cols-7 gap-1 relative">
                {stages.map((stg, idx) => (
                  <div key={stg.id} className="text-center relative">
                    <div className="flex items-center justify-center mb-1.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                        stg.done
                          ? 'bg-emerald-600 text-white font-black'
                          : stg.active
                          ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {stg.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold block leading-tight ${
                      stg.active ? 'text-blue-700' : stg.done ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {stg.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Point #23: Mid-Day 1:00 PM Customer Satisfaction Pulse Check */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Mid-Day Service Pulse Check (1:00 PM WhatsApp Prompt)
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                Point #23 Early Escalation
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              How has your service experience at Sanghi Tata been today so far?
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePulseClick('Delighted', 'Very satisfied with video transparency')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${pulseFeedback === 'Delighted' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500'}`}
              >
                <Smile className={`w-4 h-4 ${pulseFeedback === 'Delighted' ? 'text-white' : 'text-emerald-600'}`} />
                <span className="text-xs font-bold">😊 Delighted</span>
              </button>
              <button
                onClick={() => handlePulseClick('Neutral', 'Service ongoing, waiting for final bill')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${pulseFeedback === 'Neutral' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500'}`}
              >
                <Meh className={`w-4 h-4 ${pulseFeedback === 'Neutral' ? 'text-white' : 'text-blue-600'}`} />
                <span className="text-xs font-bold">😐 Neutral</span>
              </button>
              <button
                onClick={() => handlePulseClick('Concerned', 'Delivery delay concern - taking too long')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${pulseFeedback === 'Concerned' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-500'}`}
              >
                <Frown className={`w-4 h-4 ${pulseFeedback === 'Concerned' ? 'text-white' : 'text-rose-600'}`} />
                <span className="text-xs font-bold">😞 Concerned</span>
              </button>
            </div>
          </div>

          {/* 15-Second Video Inspection Cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <span>15-Second Video Diagnostic Inspections</span>
                    <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                      {currentJc.videoItems?.filter(v => v.status === 'pending_approval').length || 0} Awaiting Decision
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recorded live from Bay by Master Diagnostic Tech {currentJc.techName}
                  </p>
                </div>
              </div>
            </div>

            {(!currentJc.videoItems || currentJc.videoItems.length === 0) ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">All Diagnostic Inspections Approved</p>
                <p className="text-xs text-slate-500 mt-1">No pending unverified part replacements on this vehicle.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentJc.videoItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      item.status === 'approved'
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div 
                        onClick={() => setActiveVideoModal(item)}
                        className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer group border border-slate-200 shadow-xs"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80" 
                          alt={item.partName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {item.partName}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                          <div className="font-mono text-sm font-black text-slate-900">
                            ₹{item.total.toLocaleString()} <span className="text-[10px] font-sans text-slate-500 font-normal">incl. GST</span>
                          </div>

                          {item.status === 'approved' ? (
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => onApproveItem(currentJc.id, item.id)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>1-Tap Approve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Permanent WhatsApp Multi-Agent VIN Thread (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* WhatsApp Header */}
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
                  💬
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sanghi Tata Official WhatsApp Desk</h3>
                  <p className="text-[10px] text-emerald-800 font-medium">Zero-Group Cloud API • VIN: MAT619333P3S</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                Verified
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {(currentJc.whatsappThread || []).map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'customer'
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                        : msg.type === 'escalation'
                        ? 'bg-rose-50 border border-rose-300 text-rose-900'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-bold">
                      <span>{msg.senderName}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                    {msg.sentiment?.isUrgentEscalation && (
                      <div className="mt-2 text-[10px] bg-rose-100 text-rose-900 p-1.5 rounded border border-rose-200 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" /> Sentiment Alert: Escalated to CCM Radar
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send message to customer WhatsApp..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GSTInvoiceModal
        jobCardId={currentJc.id}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />

      <AccessoryCatalogModal
        jobCard={currentJc}
        isOpen={showAccessoryModal}
        onClose={() => setShowAccessoryModal(false)}
        onAccessoryAdded={onDataRefresh}
      />

      <LoyaltyWalletModal
        isOpen={showLoyaltyModal}
        onClose={() => setShowLoyaltyModal(false)}
      />

      <RazorpayEMIModal
        jobCard={currentJc}
        selectedPackage={{
          tier: "Gold Shield (2-Year Comprehensive)",
          price: 18900,
          coverage: "Complete Drivetrain, Electrical & DCA/EV Controls",
          saCommission: 650
        }}
        isOpen={showEMIModal}
        onClose={() => setShowEMIModal(false)}
        onPaymentComplete={() => {
          alert("✓ Extended Warranty Activated!");
        }}
      />
    </div>
  );
}
