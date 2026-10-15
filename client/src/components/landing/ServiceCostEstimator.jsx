import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Share2,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ServiceCostEstimator({ onBookService }) {
  const [selectedModel, setSelectedModel] = useState('nexon-ice');
  const [selectedMilestone, setSelectedMilestone] = useState('30000');
  const [lockedSuccess, setLockedSuccess] = useState(false);

  // Maintenance cost matrix based on official Tata Motors service schedules
  const SERVICE_MATRIX = {
    'curvv-ice': {
      name: 'Tata Curvv (Petrol / Diesel)',
      milestones: {
        '1500': { label: '1st Free Service (1,500 km)', labor: 0, parts: [{ name: '50-Point General Health & Torquing Check', cost: 0 }, { name: 'Windshield Washer Fluid Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '7500': { label: '2nd Free Service (7,500 km)', labor: 0, parts: [{ name: 'Comprehensive OBD-II Diagnostic Scan', cost: 0 }, { name: 'Underbody & Suspension Fastener Torquing', cost: 0 }, { name: 'Windshield Washer Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '15000': { label: '3rd Free Service (15,000 km / 1 Yr)', labor: 0, parts: [{ name: 'Castrol Magnatec Pro 0W-20 Engine Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Spin-On Oil Filter', cost: 380 }, { name: 'Engine Air Filter Element Clean/Inspect', cost: 0 }, { name: 'AC Pollen Filter Replacement', cost: 420 }, { name: 'Consumables & Brake Cleaning Spray', cost: 250 }], totalParts: 2900, totalLabor: 0 },
        '30000': { label: '30,000 km (2 Years Periodic)', labor: 1450, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Engine Air Filter Element', cost: 460 }, { name: 'AC Pollen Filter (PM 2.5)', cost: 420 }, { name: 'Brake Fluid DOT 4 Bleed & Replacement', cost: 390 }, { name: 'Computerized 4-Wheel Alignment & Balancing', cost: 750 }], totalParts: 4250, totalLabor: 1450 },
        '45000': { label: '45,000 km (3 Years Periodic)', labor: 1450, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Engine Spark Plugs (Set of 3 - Petrol)', cost: 720 }, { name: 'AC Pollen Filter Replacement', cost: 420 }, { name: 'Coolant Glysantin G30 Flush & Top-up', cost: 650 }], totalParts: 4020, totalLabor: 1450 },
        '60000': { label: '60,000 km (4 Years Major Overhaul)', labor: 2200, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Fuel Filter Cartridge', cost: 890 }, { name: 'Engine Air Filter Element', cost: 460 }, { name: 'Transmission Gearbox Oil Replacement', cost: 980 }, { name: 'Brake Fluid DOT 4 & Coolant Flush', cost: 950 }, { name: '4-Wheel Brake Disc De-glazing & Service', cost: 600 }], totalParts: 6110, totalLabor: 2200 }
      }
    },
    'nexon-ice': {
      name: 'Tata Nexon (1.2L Revotron / 1.5L Diesel)',
      milestones: {
        '1500': { label: '1st Free Service (1,500 km)', labor: 0, parts: [{ name: 'General Safety & ECU Diagnostic Scan', cost: 0 }, { name: 'Windshield Washer Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '7500': { label: '2nd Free Service (7,500 km)', labor: 0, parts: [{ name: 'General Inspection & Battery Health Check', cost: 0 }, { name: 'Windshield Washer Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '15000': { label: '3rd Free Service (15,000 km / 1 Yr)', labor: 0, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'AC Cabin Filter Replacement', cost: 420 }, { name: 'Consumables & Wheel Balancing Weights', cost: 240 }], totalParts: 2890, totalLabor: 0 },
        '30000': { label: '30,000 km (2 Years Periodic)', labor: 1450, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Engine Air Filter Element', cost: 450 }, { name: 'AC Cabin Pollen Filter', cost: 420 }, { name: 'Brake Fluid DOT 4 Flush', cost: 380 }, { name: '4-Wheel Alignment & Wheel Balancing', cost: 750 }], totalParts: 4230, totalLabor: 1450 },
        '45000': { label: '45,000 km (3 Years Periodic)', labor: 1450, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Spark Plugs (Set of 3)', cost: 690 }, { name: 'AC Cabin Filter', cost: 420 }, { name: 'Coolant Top-up & Health Check', cost: 350 }], totalParts: 3690, totalLabor: 1450 },
        '60000': { label: '60,000 km (4 Years Major Overhaul)', labor: 2200, parts: [{ name: 'Castrol Magnatec Pro Synthetic Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 380 }, { name: 'Fuel Filter & Air Filter Kit', cost: 1350 }, { name: 'Transmission Fluid Replacement', cost: 920 }, { name: 'Brake Fluid & Coolant Flush', cost: 890 }, { name: 'Brake Caliper Greasing & Rotor De-glaze', cost: 550 }], totalParts: 5940, totalLabor: 2200 }
      }
    },
    'harrier': {
      name: 'Tata Harrier / Safari (2.0L Kryotec Diesel)',
      milestones: {
        '1500': { label: '1st Free Service (1,500 km)', labor: 0, parts: [{ name: '50-Point Kryotec Torque & Systems Scan', cost: 0 }, { name: 'Windshield Washer Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '7500': { label: '2nd Free Service (7,500 km)', labor: 0, parts: [{ name: 'Underbody Armor & AdBlue DEF Level Scan', cost: 0 }, { name: 'Windshield Washer Fluid Top-up', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '15000': { label: '3rd Free Service (15,000 km / 1 Yr)', labor: 0, parts: [{ name: 'Castrol Edge Professional 0W-30 (5.0L)', cost: 3100 }, { name: 'Harrier Genuine Spin-On Oil Filter', cost: 580 }, { name: 'AC Pollen Filter PM 2.5', cost: 550 }, { name: 'AdBlue DEF Fluid (10L Tank Top-up)', cost: 650 }, { name: 'Consumables & Wheel Alignment', cost: 680 }], totalParts: 5560, totalLabor: 0 },
        '30000': { label: '30,000 km (2 Years Periodic)', labor: 1950, parts: [{ name: 'Castrol Edge Professional 0W-30 (5.0L)', cost: 3100 }, { name: 'Harrier Genuine Oil Filter', cost: 580 }, { name: 'Engine Heavy Duty Air Filter Element', cost: 720 }, { name: 'Fuel Filter Water Separator Assembly', cost: 1650 }, { name: 'Brake Fluid DOT 4 Bleed', cost: 480 }, { name: 'AdBlue DEF Fluid (10L)', cost: 650 }, { name: '4-Wheel Dynamic Balancing & Alignment', cost: 950 }], totalParts: 8130, totalLabor: 1950 },
        '45000': { label: '45,000 km (3 Years Periodic)', labor: 1950, parts: [{ name: 'Castrol Edge Professional 0W-30 (5.0L)', cost: 3100 }, { name: 'Harrier Genuine Oil Filter', cost: 580 }, { name: 'AC Cabin Filter', cost: 550 }, { name: 'Coolant Replacement (5L)', cost: 950 }, { name: 'AdBlue DEF Fluid', cost: 650 }], totalParts: 5830, totalLabor: 1950 },
        '60000': { label: '60,000 km (4 Years Comprehensive)', labor: 2850, parts: [{ name: 'Castrol Edge Pro Diesel Oil (5.0L)', cost: 3100 }, { name: 'Harrier Genuine Oil Filter', cost: 580 }, { name: 'Air Filter & Fuel Filter System', cost: 2370 }, { name: 'AT Automatic Transmission Fluid', cost: 2400 }, { name: 'Complete Brake Fluid Flush & Coolant', cost: 1350 }, { name: 'AdBlue DEF Tank Flush & Refill', cost: 850 }, { name: 'Suspension Bushing & Strut Greasing', cost: 750 }], totalParts: 11400, totalLabor: 2850 }
      }
    },
    'punch-ice': {
      name: 'Tata Punch (1.2L Revotron / iCNG)',
      milestones: {
        '1500': { label: '1st Free Service (1,500 km)', labor: 0, parts: [{ name: 'Free Inspection & Bolt Torquing', cost: 0 }, { name: 'Screen Washer Fluid', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '7500': { label: '2nd Free Service (7,500 km)', labor: 0, parts: [{ name: 'ECU Scan & Fluid Check', cost: 0 }, { name: 'Screen Washer Fluid', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '15000': { label: '3rd Free Service (15,000 km / 1 Yr)', labor: 0, parts: [{ name: 'Castrol Magnatec Pro Engine Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 360 }, { name: 'AC Cabin Filter', cost: 380 }, { name: 'Consumables', cost: 200 }], totalParts: 2790, totalLabor: 0 },
        '30000': { label: '30,000 km (2 Years Periodic)', labor: 1350, parts: [{ name: 'Castrol Magnatec Pro Engine Oil (3.5L)', cost: 1850 }, { name: 'Tata Genuine Oil Filter', cost: 360 }, { name: 'Air Filter Element', cost: 410 }, { name: 'AC Filter', cost: 380 }, { name: 'Brake Fluid Bleed', cost: 360 }, { name: 'Wheel Alignment & Balancing', cost: 650 }], totalParts: 4010, totalLabor: 1350 },
        '45000': { label: '45,000 km (3 Years Periodic)', labor: 1350, parts: [{ name: 'Engine Oil & Filter', cost: 2210 }, { name: 'Spark Plugs (Set of 3)', cost: 690 }, { name: 'AC Filter & Brake Clean', cost: 580 }], totalParts: 3480, totalLabor: 1350 },
        '60000': { label: '60,000 km (4 Years Major)', labor: 1950, parts: [{ name: 'Engine Oil & Filter Kit', cost: 2210 }, { name: 'Fuel Filter & Air Filter', cost: 1180 }, { name: 'Transmission Fluid', cost: 750 }, { name: 'Coolant & Brake Fluid', cost: 820 }, { name: 'Brake Inspection', cost: 450 }], totalParts: 5410, totalLabor: 1950 }
      }
    },
    'ev-lineup': {
      name: 'Tata.ev Lineup (Curvv.ev / Nexon.ev / Punch.ev / Tiago.ev)',
      milestones: {
        '1500': { label: '1st Free Service (1,500 km)', labor: 0, parts: [{ name: 'High-Voltage Insulation Scan & Telematics Sync', cost: 0 }, { name: 'Coolant Level & Battery Health Telemetry', cost: 0 }, { name: 'Screen Washer Fluid', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '7500': { label: '2nd Free Service (7,500 km)', labor: 0, parts: [{ name: 'Battery State of Health (SoH) 100% Verification', cost: 0 }, { name: 'Firmware & BMS Update check', cost: 0 }, { name: 'Screen Washer Fluid', cost: 95 }], totalParts: 95, totalLabor: 0 },
        '15000': { label: '3rd Free Service (15,000 km / 1 Yr)', labor: 0, parts: [{ name: 'AC Cabin HEPA Filter Replacement', cost: 450 }, { name: 'Brake Caliper Slider Lubrication', cost: 320 }, { name: 'Wheel Alignment & High-Speed Balancing', cost: 650 }], totalParts: 1420, totalLabor: 0 },
        '30000': { label: '30,000 km (2 Years EV Maintenance)', labor: 950, parts: [{ name: 'Single-Speed Transaxle Reduction Gear Oil', cost: 780 }, { name: 'AC Cabin HEPA Pollen Filter', cost: 450 }, { name: 'Brake Fluid DOT 4 Bleed', cost: 380 }, { name: '4-Wheel Dynamic Alignment & Balancing', cost: 650 }], totalParts: 2260, totalLabor: 950 },
        '45000': { label: '45,000 km (3 Years EV Maintenance)', labor: 950, parts: [{ name: 'AC Cabin Filter', cost: 450 }, { name: 'Battery Thermal Management Coolant Test', cost: 350 }, { name: 'Brake Slider Service', cost: 320 }], totalParts: 1120, totalLabor: 950 },
        '60000': { label: '60,000 km (4 Years Major EV Service)', labor: 1450, parts: [{ name: 'Battery Thermal Dielectric Coolant Replacement', cost: 1850 }, { name: 'Transaxle Reduction Gear Oil', cost: 780 }, { name: 'Brake Fluid DOT 4 Complete Flush', cost: 450 }, { name: 'AC Cabin Pollen Filter', cost: 450 }, { name: 'Suspension Fastener Torquing', cost: 350 }], totalParts: 3880, totalLabor: 1450 }
      }
    }
  };

  const currentVehicleData = SERVICE_MATRIX[selectedModel] || SERVICE_MATRIX['nexon-ice'];
  const currentMilestoneData = currentVehicleData.milestones[selectedMilestone] || currentVehicleData.milestones['30000'];

  const partsTotal = currentMilestoneData.totalParts;
  const laborTotal = currentMilestoneData.totalLabor;
  const subtotal = partsTotal + laborTotal;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handleLockEstimate = () => {
    setLockedSuccess(true);
    confetti({ particleCount: 60, spread: 50 });
  };

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>100% TRANSPARENT SERVICE PRICING</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Know Your Exact Service Bill Before Stepping In
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            No surprise add-ons. No inflated labor charges. Official Tata Motors spare part prices backed by the <strong>Shyam Automotive Price Lock Promise</strong>.
          </p>
        </div>

        {/* Interactive Selector Controls */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Model Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Your Tata Vehicle:
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-xs cursor-pointer"
              >
                <option value="curvv-ice">Tata Curvv (ICE Petrol/Diesel)</option>
                <option value="nexon-ice">Tata Nexon (Petrol/Diesel)</option>
                <option value="harrier">Tata Harrier &amp; Safari (2.0L Kryotec)</option>
                <option value="punch-ice">Tata Punch (Revotron/iCNG)</option>
                <option value="ev-lineup">⚡ Tata.ev (Curvv.ev, Nexon.ev, Punch.ev, Tiago.ev)</option>
              </select>
            </div>

            {/* Milestone Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Odometer / Maintenance Interval:
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 shadow-xs cursor-pointer"
              >
                <option value="1500">1st Free Service (1,500 - 2,000 km / 2 Months)</option>
                <option value="7500">2nd Free Service (7,500 km / 6 Months)</option>
                <option value="15000">3rd Free Service (15,000 km / 1 Year)</option>
                <option value="30000">30,000 km (2 Years Periodic Maintenance)</option>
                <option value="45000">45,000 km (3 Years Periodic Maintenance)</option>
                <option value="60000">60,000 km (4 Years Comprehensive Overhaul)</option>
              </select>
            </div>

          </div>

          {/* Itemized Calculation Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 block">Itemized Service Scope</span>
                <h4 className="font-bold text-slate-900 text-sm">{currentMilestoneData.label}</h4>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                Estimated Duration: <strong>~75-90 Mins</strong>
              </span>
            </div>

            {/* Parts List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Genuine Tata Motors Parts &amp; Consumables:
              </span>
              <div className="space-y-1.5">
                {currentMilestoneData.parts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <span className="text-slate-800 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.cost === 0 ? <span className="text-emerald-600 font-bold">FREE / INCLUDED</span> : `₹${item.cost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary Rows */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Parts &amp; Oils:</span>
                <span className="font-mono font-semibold">₹{partsTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Labor Charges:</span>
                <span className="font-mono font-semibold">
                  {laborTotal === 0 ? <span className="text-emerald-600 font-bold">₹0 (Free Service Coupon)</span> : `₹${laborTotal.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (18%):</span>
                <span className="font-mono font-semibold">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base">
                <div>
                  <span className="font-black text-slate-900 block">Total Estimated Bill:</span>
                  <span className="text-[10px] text-slate-400">Includes all fluids, OEM parts, labor &amp; taxes</span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}*
                  </span>
                </div>
              </div>
            </div>

            {/* Price Lock Guarantee Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900 block">Shyam Automotive Price Lock Promise:</strong>
                  <span className="text-emerald-800 text-[11px]">
                    If your final invoice exceeds this figure without your explicit prior video-approval in writing, Shyam Automotive pays the difference. Zero surprise charges.
                  </span>
                </div>
              </div>

              {!lockedSuccess ? (
                <button
                  onClick={handleLockEstimate}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" /> Lock Price
                </button>
              ) : (
                <div className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Locked for 30 Days
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onBookService}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service at Scheme 140 or With Valet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/918879897825?text=Hi%20Shyam%20Automotive,%20I%20used%20your%20Online%20Estimator%20for%20my%20Tata%20${encodeURIComponent(currentVehicleData.name)}%20for%20${encodeURIComponent(currentMilestoneData.label)}.%20Estimated%20total%20is%20₹${grandTotal}.%20Please%20confirm%20my%20slot.`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Send to WhatsApp (Save Quote)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
