import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Camera,
  MapPin,
  CheckCircle2,
  Key,
  Truck,
  Smartphone,
  Eye,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ValetTrustPassDeepDive({ onBookValet }) {
  const [demoPlate, setDemoPlate] = useState('MP09CW4821');
  const [showDemoBadge, setShowDemoBadge] = useState(false);

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title & Psychological Hook */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DOORSTEP VALET TRUSTPASS™ PROTOCOL</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hand Over Your Keys with 100% Peace of Mind
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We understand your car is your pride. That’s why Shyam Automotive engineered Central India’s first <strong>4-Layer Anti-Scam Security Handover</strong>. Zero unknown drivers, zero mystery scratches, zero anxiety.
          </p>
        </div>

        {/* 4 Pillars of Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 relative overflow-hidden group hover:border-emerald-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Verified Driver Photo ID</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every valet is an official payroll employee with verified Aadhaar, police background verification, and commercial driver certification. View his photo and badge before opening your gate.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Police Verified
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 relative overflow-hidden group hover:border-blue-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Secret 4-Digit Handover OTP</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our driver cannot initiate vehicle transit without entering the secure 4-digit Handover OTP sent directly to your registered WhatsApp. You only share the OTP once you inspect the badge.
            </p>
            <div className="pt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Cryptographic Key Release
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 relative overflow-hidden group hover:border-indigo-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">360° Scratch &amp; Fuel Lock</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              At your doorstep, the valet takes timestamped photos of all 4 body panels, windshield, odometer, and fuel gauge using our mobile intake terminal. You receive a digital receipt instantly.
            </p>
            <div className="pt-2 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> Stylus Signature Sign-off
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 relative overflow-hidden group hover:border-amber-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Live GPS Workshop Transit</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Follow your vehicle in real-time as it travels from your residence along approved speed-limited arterial corridors directly into the Scheme 140 bay. Auto-alert on bay intake.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Geo-Fenced Safe Corridors
            </div>
          </div>

        </div>

        {/* Interactive TrustPass Preview Widget */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-slate-50 to-blue-50/50 rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>TRY LIVE TRUSTPASS BADGE SIMULATION</span>
              </div>
              <h4 className="text-xl font-black text-slate-900">
                Experience How Your Valet Badge Renders
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you schedule a pickup, our system assigns an authorized valet and texts you a tamper-proof web badge with his driver license details, emergency contact, and your secret OTP.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter Your Car Plate (e.g. MP09CW4821)"
                  value={demoPlate}
                  onChange={(e) => setDemoPlate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-xs max-w-xs"
                />
                <button
                  onClick={() => setShowDemoBadge(!showDemoBadge)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showDemoBadge ? 'Hide Sample Badge' : 'Preview Live TrustPass'}</span>
                </button>
              </div>
            </div>

            {/* Sample Badge Preview Box */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">T</div>
                    <span className="font-bold text-xs text-slate-900">Shyam Automotive TrustPass™</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    AUTHENTICATED
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-emerald-500 overflow-hidden flex items-center justify-center text-2xl shrink-0">
                    👨‍✈️
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 block text-sm">Sunil Verma</strong>
                    <span className="text-[10px] text-slate-500 block">Senior Valet • Emp ID: SHYAM-VAL-042</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Commercial DL: MP09-2019-004812</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[10px]">Assigned Vehicle:</span>
                    <span className="font-mono font-bold text-slate-900 text-[11px] uppercase">{demoPlate || 'MP09CW4821'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">Your Secret Handover OTP:</span>
                    <span className="font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                      5 8 9 2
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={onBookValet}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors text-center cursor-pointer shadow-xs"
                  >
                    Schedule Free Valet Pickup
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
