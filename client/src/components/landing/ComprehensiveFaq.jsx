import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  Share2
} from 'lucide-react';

export default function ComprehensiveFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const FAQS = [
    {
      q: "How does Shyam Automotive's pricing differ from other Tata dealerships in Indore?",
      a: "We operate on a strict Zero-Hidden-Markup mandate. Many dealerships inflate on-road quotes with non-essential dealer logistics or bundled accessories. At Shyam Automotive, your quote itemizes exact Ex-showroom, RTO registration, GST, and Insurance (which you can customize or compare freely). What we commit on day one is the exact rupee amount you pay."
    },
    {
      q: "Is doorstep valet pickup safe? Who is legally responsible during transit?",
      a: "Your vehicle is covered under 100% comprehensive dealership transit insurance the moment our valet enters your secure 4-digit Handover OTP. Every valet is an authorized payroll employee with commercial background checks. A 360° photo walkaround is recorded at your doorstep before moving an inch, protecting you from any mystery scratch disputes."
    },
    {
      q: "Can I watch the technicians work on my car?",
      a: "Absolutely. At our Scheme 140 flagship facility, we engineered a panoramic glass-walled executive lounge overlooking all 18 robotic bays. If you are at home or work, you receive 15-second mobile video inspection clips on WhatsApp whenever a technician identifies a worn component (like brake pads or belts). You tap 'Approve' or 'Decline' directly on your phone."
    },
    {
      q: "What is your 90-Minute Express Service Guarantee?",
      a: "For periodic scheduled maintenance, two gold-certified technicians service your vehicle simultaneously using specialized pit-stop workflows (oil drainage, multi-point electronic diagnostics, torque checks, and vacuuming). If your periodic service takes more than 90 minutes in our Express bay, your service labor charges are waived."
    },
    {
      q: "How does the cashless accidental claim process work?",
      a: "We maintain on-site cashless desks and dedicated surveyor lounges for 14 leading insurers (including ICICI Lombard, HDFC ERGO, Tata AIG, Bajaj Allianz, and New India Assurance). In 95% of cases, digital survey intimation is completed within 15 minutes of intake. Our Celette laser chassis jig and PPG paint booth restore vehicles to 100% factory specifications."
    },
    {
      q: "How does Tata Motors Assured (TMA) old car exchange work?",
      a: "Bring any car (Maruti, Hyundai, Honda, Tata, Mahindra) or request a 15-minute doorstep appraisal. We conduct a scientific 125-point OBD diagnostic and digital paint depth inspection. You receive a guaranteed price match quote, instant Form 29/30 RTO legal indemnity, and an additional ₹35,000 Shyam Automotive Exchange Bonus Voucher."
    },
    {
      q: "How long does a Tata EV battery last and where can I charge in Indore?",
      a: "All Tata passenger EVs (Curvv.ev, Nexon.ev, Punch.ev, Tiago.ev) feature liquid-cooled IP67 high-density battery packs backed by an official 8-Year / 1,60,000 km warranty. For charging, Shyam Automotive operates a 60kW DC Dual-Gun Fast Charger right at our Scheme 140 hub, open 24x7 with complimentary lounge access."
    },
    {
      q: "Can I get a doorstep test drive of the new Tata Curvv or Harrier in Indore?",
      a: "Yes. Our mobile test drive fleet covers all residential and corporate areas in Indore—including Scheme 140, Vijay Nagar, Palasia, Silicon City, Rau Bypass, and Super Corridor. You can book online and our executive arrives with the vehicle at your requested time."
    }
  ];

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>TRANSPARENCY FIRST • FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Got Questions? We Have Complete Answers.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about purchasing, servicing, exchanging, and doorstep valet care.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <strong className="text-xs font-bold text-slate-900 block">
              Still have a specific query or custom requirement?
            </strong>
            <span className="text-[11px] text-slate-500 block">
              Our Senior Customer Relationship Team in Scheme 140 is available 24x7.
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:+918879897825"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call Hotline
            </a>
            <a
              href="https://wa.me/918879897825?text=Hi%20Shyam%20Automotive,%20I%20have%20a%20question%20regarding%20Tata%20Cars."
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp Desk
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
