import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  Sparkles, 
  Radio,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AutomatedCampaigns({ campaigns, onDispatchCampaign }) {
  const [activeCampId, setActiveCampId] = useState(campaigns[0]?.id);
  const [dispatching, setDispatching] = useState(false);

  const activeCamp = campaigns.find(c => c.id === activeCampId) || campaigns[0];

  const handleDispatch = (campId) => {
    setDispatching(true);
    setTimeout(() => {
      onDispatchCampaign(campId);
      setDispatching(false);
      confetti({ particleCount: 100, spread: 70 });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Megaphone className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  Automated Marketing & Win-Back Hub
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Zero Spam • 100% WhatsApp Verified Opt-In
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Indore Territory Customer Campaign & Drive Engine
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Auto-segments Tata vehicle owners by overdue maintenance, seasonal highway checks, and warranty expiry dates with 1-tap booking triggers.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">Total Active Leads in Pipeline</span>
            <span className="text-2xl font-black text-amber-600 font-mono">617 Owners</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              34.8% Average Campaign Conversion
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">Active Territory Drives</h3>
          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => setActiveCampId(camp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeCampId === camp.id
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{camp.title}</h4>
                    <span className="text-xs text-slate-600 block mt-0.5">{camp.targetAudience}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    {camp.leadsCount} Leads
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold">Conv. Rate: {camp.conversionRate}</span>
                  <span className="text-slate-500 font-medium">WhatsApp Cloud API</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Blast Console (7 Cols) */}
        <div className="lg:col-span-7">
          {activeCamp && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-150">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeCamp.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Audience: <strong className="text-slate-800">{activeCamp.targetAudience}</strong>
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-lg border border-amber-200">
                  {activeCamp.leadsCount} Matched Vehicles
                </span>
              </div>

              {/* Offer & Voucher Details */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    🎁 Exclusive Customer Value Hook & Offer
                  </span>
                  <p className="text-xs text-slate-900 font-medium">
                    {activeCamp.discount}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">
                    WhatsApp Message Broadcast Template
                  </span>
                  <p className="font-mono text-slate-800 leading-relaxed">
                    "🌟 *Exclusive Invitation from Sanghi Brothers Tata Motors, Indore!* We are running the *{activeCamp.title}*. Avail *{activeCamp.discount}*. Tap below to reserve your priority morning slot."
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {activeCamp.deliveredCount ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Campaign Broadcasted to {activeCamp.deliveredCount} Verified WhatsApp Numbers!</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">100% Delivery Rate</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDispatch(activeCamp.id)}
                    disabled={dispatching}
                    className="w-full py-3 px-6 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {dispatching ? 'Dispatching via Meta Cloud API...' : `Broadcast Campaign to ${activeCamp.leadsCount} Verified Customers`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
