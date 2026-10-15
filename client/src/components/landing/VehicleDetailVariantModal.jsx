import React, { useState } from 'react';
import {
  X,
  Car,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Sliders,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  Info,
  Calendar,
  PhoneCall,
  Share2,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TATA_VEHICLE_VARIANTS_DB, calculateIndoreOnRoadPrice } from '../../data/tataVehicleVariants';

export default function VehicleDetailVariantModal({
  vehicleId,
  onClose,
  onBookTestDrive,
  onOpenEmi
}) {
  // Look up vehicle in DB with fallback
  const vehicleKey = TATA_VEHICLE_VARIANTS_DB[vehicleId] ? vehicleId : 'nexon-ice';
  const vehicleData = TATA_VEHICLE_VARIANTS_DB[vehicleKey];

  // Active Modal Tab: 'DECIDER' | 'VARIANTS' | 'ONROAD' | 'SPECS' | 'COLORS'
  const [activeTab, setActiveTab] = useState('DECIDER');

  // Selected Variant for On-Road Price Calculator
  const [selectedVariantId, setSelectedVariantId] = useState(
    vehicleData.variants[Math.min(3, vehicleData.variants.length - 1)].id
  );

  // On-Road Calculation Toggles
  const [includeEW, setIncludeEW] = useState(true);
  const [includeAccessories, setIncludeAccessories] = useState(false);
  const [tenureYears, setTenureYears] = useState(5);

  // Decider Quiz State
  const [quizBudget, setQuizBudget] = useState('ALL');
  const [quizTransmission, setQuizTransmission] = useState('ALL');
  const [quizSunroof, setQuizSunroof] = useState(false);
  const [quiz360Cam, setQuiz360Cam] = useState(false);
  const [quizVentilated, setQuizVentilated] = useState(false);

  // Selected Color
  const [selectedColor, setSelectedColor] = useState(vehicleData.colors[0]);

  // Compute On-Road Price for selected variant
  const onRoadData = calculateIndoreOnRoadPrice(vehicleKey, selectedVariantId, {
    includeEW,
    includeAccessories,
    tenureMonths: tenureYears * 12
  });

  const activeVariantObj = vehicleData.variants.find(v => v.id === selectedVariantId) || vehicleData.variants[0];

  // Filter variants based on Quiz / Filters
  const filteredQuizVariants = vehicleData.variants.filter(v => {
    if (quizTransmission === 'MANUAL' && v.transmission.includes('AMT') && !v.transmission.includes('Manual')) return false;
    if (quizTransmission === 'AUTO' && !v.transmission.includes('DCA') && !v.transmission.includes('AMT') && !v.transmission.includes('AT') && !v.transmission.includes('E-Drive')) return false;
    if (quizSunroof && !v.highlights.some(h => h.toLowerCase().includes('sunroof'))) return false;
    if (quiz360Cam && !v.highlights.some(h => h.toLowerCase().includes('360'))) return false;
    if (quizVentilated && !v.highlights.some(h => h.toLowerCase().includes('ventilated'))) return false;
    if (quizBudget === 'UNDER_10L' && v.price > 1000000) return false;
    if (quizBudget === '10L_13L' && (v.price < 1000000 || v.price > 1300000)) return false;
    if (quizBudget === 'ABOVE_13L' && v.price < 1300000) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {vehicleData.segment}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                5-Star BNCAP
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {vehicleData.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {vehicleData.tagline} • Ex-Showroom from ₹{(vehicleData.startingPrice / 100000).toFixed(2)} Lakh*
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-200 bg-white px-3 sm:px-6 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
          {[
            { id: 'DECIDER', label: '🧠 Which Should I Buy?', icon: HelpCircle },
            { id: 'VARIANTS', label: `📋 All Variants (${vehicleData.variants.length})`, icon: Sliders },
            { id: 'ONROAD', label: '💰 Indore On-Road Price', icon: Calculator },
            { id: 'SPECS', label: '⚙️ Full Specifications', icon: Info },
            { id: 'COLORS', label: '🎨 Colors & Stock Status', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
          
          {/* ========================================================================= */}
          {/* TAB 1: VARIANT DECIDER / QUIZ (SOLVING THE PARALYSIS OF CHOICE)            */}
          {/* ========================================================================= */}
          {activeTab === 'DECIDER' && (
            <div className="space-y-6">
              
              {/* Guidance Hook */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 rounded-2xl border border-blue-200 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-blue-800 font-extrabold text-[11px] uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Variant Confusion Eliminator</span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Find Your Perfect {vehicleData.name} Variant in 30 Seconds
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tata offers multiple personas (Smart, Pure, Creative, Fearless) with various transmission and sunroof options. Tell us what matters most to you, and we’ll recommend the best match without pushing unnecessary upgrades.
                </p>
              </div>

              {/* Interactive Preference Filters */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Select Your Requirements:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Budget Filter */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Budget:</label>
                    <select
                      value={quizBudget}
                      onChange={(e) => setQuizBudget(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer focus:outline-hidden focus:border-blue-500 shadow-xs"
                    >
                      <option value="ALL">All Price Ranges</option>
                      <option value="UNDER_10L">Under ₹10 Lakhs (Ex-Showroom)</option>
                      <option value="10L_13L">₹10 Lakhs - ₹13 Lakhs (The VFM Sweet Spot)</option>
                      <option value="ABOVE_13L">Above ₹13 Lakhs (Top Luxury &amp; ADAS)</option>
                    </select>
                  </div>

                  {/* Transmission Filter */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Transmission Preference:</label>
                    <select
                      value={quizTransmission}
                      onChange={(e) => setQuizTransmission(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer focus:outline-hidden focus:border-blue-500 shadow-xs"
                    >
                      <option value="ALL">Any (Manual or Automatic)</option>
                      <option value="MANUAL">Manual Gearbox Only</option>
                      <option value="AUTO">Automatic (DCA Dual Clutch / AMT / AT)</option>
                    </select>
                  </div>

                </div>

                {/* Must-Have Feature Toggles */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block">Must-Have Features:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setQuizSunroof(!quizSunroof)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        quizSunroof
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ☀️ Electric Sunroof
                    </button>

                    <button
                      onClick={() => setQuiz360Cam(!quiz360Cam)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        quiz360Cam
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🎥 360° Surround Camera
                    </button>

                    <button
                      onClick={() => setQuizVentilated(!quizVentilated)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        quizVentilated
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ❄️ Ventilated Front Seats
                    </button>
                  </div>
                </div>

              </div>

              {/* Recommendation Results */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-xs">
                    Recommended Variant Matches ({filteredQuizVariants.length}):
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ranked by Value for Money</span>
                </div>

                {filteredQuizVariants.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
                    <strong className="text-amber-900 block text-xs">No exact variant match for this specific combo</strong>
                    <p className="text-[11px] text-amber-700">Try loosening the budget or transmission filter above to see all matching trims.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredQuizVariants.map((variant) => (
                      <div
                        key={variant.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-4 transition-all shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-slate-900 text-sm sm:text-base">{variant.name}</h5>
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {variant.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {variant.fuel} • {variant.transmission}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block">Ex-Showroom MP</span>
                            <strong className="text-base sm:text-lg font-black text-blue-700 font-mono">
                              ₹{(variant.price / 100000).toFixed(2)} Lakh*
                            </strong>
                          </div>
                        </div>

                        {/* What it adds */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                          <strong className="text-slate-800 font-bold block mb-0.5">Why Choose This:</strong>
                          <span>{variant.addedOverPrevious}</span>
                        </div>

                        {/* Highlights chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {variant.highlights.map((h, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>

                        {/* Card Action Buttons */}
                        <div className="pt-1 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              setSelectedVariantId(variant.id);
                              setActiveTab('ONROAD');
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Calculate Indore On-Road Price</span>
                          </button>

                          <button
                            onClick={() => onBookTestDrive(vehicleData)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span>Test Drive This Variant</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expert Buyer Personas Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
                <span className="font-black text-slate-900 uppercase tracking-wider text-xs block">
                  Shyam Automotive Advisory: 3 Buyer Personas
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {vehicleData.buyerPersonas.map((bp, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {bp.profile}
                      </span>
                      <strong className="text-slate-900 text-xs block font-black">
                        Recommended: {bp.recommendation}
                      </strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {bp.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FULL VARIANTS LADDER & DECODER MATRIX                              */}
          {/* ========================================================================= */}
          {activeTab === 'VARIANTS' && (
            <div className="space-y-6">
              
              {/* Decoder Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
                <strong className="text-xs font-black text-blue-900 block">
                  {vehicleData.decoderInfo.title}
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {vehicleData.decoderInfo.rules.map((rule, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-blue-100 flex items-start gap-1.5">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        {rule.code}
                      </span>
                      <span className="text-slate-700 leading-tight">{rule.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Variant Ladder */}
              <div className="space-y-3">
                <span className="font-black text-slate-900 uppercase tracking-wider text-xs block">
                  Complete {vehicleData.name} Variant Hierarchy (Low to High):
                </span>

                <div className="space-y-3">
                  {vehicleData.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        selectedVariantId === variant.id
                          ? 'bg-blue-50/50 border-blue-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            <h5 className="font-black text-slate-900 text-sm sm:text-base">{variant.name}</h5>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {variant.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                            {variant.fuel} • {variant.transmission}
                          </span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block">Ex-Showroom Price</span>
                          <strong className="text-base font-black text-slate-900 font-mono">
                            ₹{(variant.price / 100000).toFixed(2)} Lakh*
                          </strong>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                        <strong className="text-blue-700 font-bold block mb-0.5">Upgrades over lower variant:</strong>
                        <span>{variant.addedOverPrevious}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Standard Features:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                          {variant.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ready Allocation: 3-5 Business Days
                        </span>
                        <button
                          onClick={() => {
                            setSelectedVariantId(variant.id);
                            setActiveTab('ONROAD');
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Select for On-Road Quote ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INDORE MP09 ON-ROAD PRICE CALCULATOR                               */}
          {/* ========================================================================= */}
          {activeTab === 'ONROAD' && (
            <div className="space-y-6">
              
              {/* Variant Selector Dropdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Variant to Calculate On-Road Breakdown in Indore (MP09):
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 cursor-pointer focus:outline-hidden focus:border-blue-500 shadow-xs"
                >
                  {vehicleData.variants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.fuel} {v.transmission}) - Ex-Showroom ₹{(v.price / 100000).toFixed(2)} Lakh
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Itemized Invoice Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">Official Pro-Forma Invoice</span>
                    <strong className="text-slate-900 text-xs">
                      {vehicleData.name} • {onRoadData.variantName}
                    </strong>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    Indore MP RTO Slabs
                  </span>
                </div>

                <div className="p-4 space-y-2.5 divide-y divide-slate-100 text-xs">
                  
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Ex-Showroom Price (MP):</span>
                    <span className="font-mono font-bold text-slate-900">₹{onRoadData.exShowroom.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <div>
                      <span className="text-slate-600 block">MP09 RTO Registration &amp; Road Tax:</span>
                      <span className="text-[10px] text-slate-400">Includes Smart Card RC &amp; State Cess</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">₹{onRoadData.rtoTax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <div>
                      <span className="text-slate-600 block">Tata Care Comprehensive 1+3 Year Zero-Dep Insurance:</span>
                      <span className="text-[10px] text-slate-400">Bumper-to-Bumper with Engine Protector &amp; Consumables</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">₹{onRoadData.insurance.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Mandatory FASTag + HSRP Number Plates:</span>
                    <span className="font-mono font-bold text-slate-900">₹{onRoadData.fastagHsrp.toLocaleString('en-IN')}</span>
                  </div>

                  {onRoadData.tcs > 0 && (
                    <div className="flex justify-between py-1">
                      <div>
                        <span className="text-slate-600 block">Tax Collected at Source (TCS 1%):</span>
                        <span className="text-[10px] text-slate-400">Refundable / Adjustable in Income Tax Return</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">₹{onRoadData.tcs.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Optional Toggles */}
                  <div className="py-2 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Optional Dealership Protection Packages:</span>
                    
                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={includeEW}
                          onChange={(e) => setIncludeEW(e.target.checked)}
                          className="accent-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Value Care 5-Year Extended Warranty</span>
                          <span className="text-[10px] text-slate-500">Up to 1,25,000 km bumper-to-bumper OEM warranty</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">+₹18,500</span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={includeAccessories}
                          onChange={(e) => setIncludeAccessories(e.target.checked)}
                          className="accent-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Tata Genuine Essential Accessories Pack</span>
                          <span className="text-[10px] text-slate-500">7D Floor Mats, Mudflaps, Body Cover &amp; Fragrance</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">+₹14,999</span>
                    </label>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-3 flex items-center justify-between text-sm sm:text-base">
                    <div>
                      <strong className="text-slate-900 block text-base sm:text-lg">Total Net On-Road Indore:</strong>
                      <span className="text-[10px] text-emerald-700 font-bold">100% Guaranteed Price Lock • No Hidden Charges</span>
                    </div>
                    <strong className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
                      ₹{onRoadData.totalOnRoad.toLocaleString('en-IN')}*
                    </strong>
                  </div>

                </div>

                {/* Monthly EMI Preview */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      Estimated EMI (with 20% Down Payment: ₹{onRoadData.downPayment20Pct.toLocaleString('en-IN')}):
                    </span>
                    <strong className="text-xl font-black text-emerald-700 font-mono">
                      ₹{onRoadData.estimatedMonthlyEmi.toLocaleString('en-IN')} / month
                    </strong>
                    <span className="text-[10px] text-slate-400 block">Calculated at 8.5% interest for {tenureYears} Years</span>
                  </div>

                  <a
                    href={`https://wa.me/918879897825?text=Hi%20Shyam%20Automotive,%20please%20send%20me%20the%20detailed%20pro-forma%20invoice%20for%20Tata%20${encodeURIComponent(vehicleData.name)}%20${encodeURIComponent(onRoadData.variantName)}.%20Estimated%20On-Road%20is%20₹${onRoadData.totalOnRoad}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send Invoice to WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMPLETE TECHNICAL SPECIFICATIONS                                  */}
          {/* ========================================================================= */}
          {activeTab === 'SPECS' && (
            <div className="space-y-4">
              
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100 text-xs">
                
                <div className="grid grid-cols-12 p-3 bg-slate-50 font-bold text-slate-900">
                  <div className="col-span-4 uppercase text-[10px] tracking-wider text-slate-500">Parameter</div>
                  <div className="col-span-8 uppercase text-[10px] tracking-wider text-slate-500">Official Specification</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Powertrain</div>
                  <div className="col-span-8 text-slate-800">{vehicleData.specs.engine}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Power Output</div>
                  <div className="col-span-8 font-bold text-blue-700">{vehicleData.specs.power}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Torque</div>
                  <div className="col-span-8 font-bold text-indigo-700">{vehicleData.specs.torque}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Mileage / Range</div>
                  <div className="col-span-8 font-bold text-emerald-700">{vehicleData.specs.mileage}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Dimensions (L×W×H)</div>
                  <div className="col-span-8 text-slate-800">{vehicleData.specs.lengthWidthHeight}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Wheelbase</div>
                  <div className="col-span-8 text-slate-800">{vehicleData.specs.wheelbase}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Ground Clearance</div>
                  <div className="col-span-8 font-bold text-slate-900">{vehicleData.specs.groundClearance}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Boot Capacity</div>
                  <div className="col-span-8 font-bold text-slate-900">{vehicleData.specs.bootSpace}</div>
                </div>

                <div className="grid grid-cols-12 p-3">
                  <div className="col-span-4 font-bold text-slate-700">Fuel Tank / Battery</div>
                  <div className="col-span-8 text-slate-800">{vehicleData.specs.fuelTank}</div>
                </div>

                <div className="grid grid-cols-12 p-3 bg-emerald-50/40">
                  <div className="col-span-4 font-bold text-emerald-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safety Rating</span>
                  </div>
                  <div className="col-span-8 text-emerald-900 font-semibold">{vehicleData.specs.safety}</div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: OFFICIAL COLORS & READY STOCK IN INDORE                            */}
          {/* ========================================================================= */}
          {activeTab === 'COLORS' && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <span className="font-black text-slate-900 uppercase tracking-wider text-xs block">
                  Official Exterior Color Palette:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicleData.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        selectedColor.name === color.name
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-slate-300 shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{color.name}</strong>
                        <span className="text-[10px] text-slate-500">Tata OEM Paint</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready Stock Status at Scheme 140 Hub */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Real-Time Inventory Status at Scheme 140, Indore:</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                    IN STOCK
                  </span>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed">
                  We maintain over <strong>80+ ready-to-deliver vehicles</strong> across our Scheme 140 Central Stockyard and Rau Logistics Hub. Selected variants in <strong>{selectedColor.name}</strong> can be registered and delivered within <strong>3-5 business days</strong>.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onBookTestDrive(vehicleData)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>Reserve in {selectedColor.name}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Persistent Bottom Modal Action Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-slate-500 block">
              Selected: <strong>{activeVariantObj.name}</strong> • Ex-Showroom:
            </span>
            <strong className="text-lg font-black text-slate-900 font-mono">
              ₹{(activeVariantObj.price / 100000).toFixed(2)} Lakh*
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onBookTestDrive(vehicleData)}
              className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>Book Doorstep Test Drive</span>
            </button>

            <a
              href={`https://wa.me/918879897825?text=Hi%20Shyam%20Automotive,%20I%20am%20interested%20in%20Tata%20${encodeURIComponent(vehicleData.name)}%20${encodeURIComponent(activeVariantObj.name)}.%20Please%20connect%20me%20with%20your%20Scheme%20140%20sales%20desk.`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
