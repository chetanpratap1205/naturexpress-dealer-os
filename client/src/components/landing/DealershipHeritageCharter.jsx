import React from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Users,
  Sparkles,
  PhoneCall,
  HeartHandshake,
  CheckCheck
} from 'lucide-react';

export default function DealershipHeritageCharter({ onOpenAboutModal }) {
  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            <span>THE SHYAM AUTOMOTIVE HERITAGE &amp; COMMITMENT</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Central India’s Most Trusted Tata Family Since 2018
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Founded with a singular mission: To remove every friction point, eliminate mistrust, and deliver world-class automotive engineering to Malwa.
          </p>
        </div>

        {/* Founder Letter & Facility Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Managing Director Personal Note */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                  A Personal Word from Our Dealer Principal
                </span>
              </div>

              <h4 className="text-xl font-black text-slate-900 leading-snug">
                "Buying or servicing a car shouldn’t feel like a negotiation. It should feel like joining an honest family."
              </h4>

              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  When we inaugurated Shyam Automotive on 14th February 2018, we observed that car buyers in Indore were weary of traditional dealership tactics—opaque billing, delay in deliveries, and indifference after the sale.
                </p>
                <p>
                  We built our entire Scheme 140 flagship infrastructure around total transparency: open glass viewing lounges where you can watch technicians work, real-time digital stage trackers, and the <strong>Doorstep Valet TrustPass™</strong> so no customer ever worries about handing over their vehicle.
                </p>
                <p>
                  Today, with over 28,400+ satisfied Tata car owners and 1,237 verified 4.9★ reviews, our promise remains unwavering: If anything is ever less than exceptional, my personal office is only a call away.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-sm font-black text-slate-900 block">Shyam Singhal</strong>
                <span className="text-[11px] text-slate-500 block">Managing Director &amp; Dealer Principal • Shyam Automotive</span>
              </div>
              <a
                href="https://wa.me/918879897825?text=Hi%20Shyam%20Singhal%20Ji,%20I%20am%20a%20customer%20at%20Shyam%20Automotive%20and%20would%20like%20to%20connect%20with%20your%20office."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-slate-200"
              >
                <span>Direct Executive Desk</span>
              </a>
            </div>
          </div>

          {/* 5-Point Customer Bill of Rights */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 rounded-2xl border border-blue-200 p-6 space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-blue-800 tracking-wider">
                  The Shyam Automotive Charter
                </span>
                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  GUARANTEED
                </span>
              </div>

              <h4 className="text-base font-black text-slate-900 mb-3">
                Our 5-Point Customer Bill of Rights
              </h4>

              <div className="space-y-2.5 text-xs">
                
                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-[11px]">1. Zero Hidden Fees Guarantee</strong>
                    <span className="text-slate-600 text-[10px]">What is quoted on your digital estimate is what you pay. No secret charges.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-[11px]">2. 100% Holographic OEM Parts</strong>
                    <span className="text-slate-600 text-[10px]">Only genuine Tata Motors spares with verifiable anti-counterfeit QR codes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-[11px]">3. 90-Min Express Service Promise</strong>
                    <span className="text-slate-600 text-[10px]">Periodic service completed within 90 minutes in our express pits or labor is on us.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-[11px]">4. 15-Minute Cashless Claim Intimation</strong>
                    <span className="text-slate-600 text-[10px]">Direct tie-ups with 14 insurance companies with on-site surveyor approvals.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-[11px]">5. Doorstep Test Drive in 60 Mins</strong>
                    <span className="text-slate-600 text-[10px]">We bring the vehicle to your residence anywhere in Indore at your convenience.</span>
                  </div>
                </div>

              </div>
            </div>

            <button
              onClick={onOpenAboutModal}
              className="w-full bg-white hover:bg-slate-50 text-blue-700 font-bold py-2.5 rounded-xl text-xs transition-colors border border-blue-200 shadow-xs cursor-pointer"
            >
              Learn More About Our Journey &amp; Infrastructure
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
