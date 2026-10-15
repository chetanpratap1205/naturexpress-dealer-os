import React, { useState } from 'react';
import {
  RefreshCw,
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  ArrowRight,
  Car,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TradeInValuationWizard({ onBookExchange }) {
  const [make, setMake] = useState('MARUTI');
  const [year, setYear] = useState('2019');
  const [modelName, setModelName] = useState('Swift / Baleno');
  const [odometer, setOdometer] = useState('45000');
  const [calculated, setCalculated] = useState(false);

  // Approximate fair market valuation engine
  const BASE_VALUES = {
    'MARUTI': { '2023': 680000, '2022': 600000, '2021': 530000, '2020': 470000, '2019': 410000, '2018': 360000, '2017': 310000 },
    'HYUNDAI': { '2023': 710000, '2022': 630000, '2021': 550000, '2020': 480000, '2019': 420000, '2018': 370000, '2017': 320000 },
    'TATA': { '2023': 740000, '2022': 650000, '2021': 570000, '2020': 500000, '2019': 440000, '2018': 380000, '2017': 330000 },
    'HONDA': { '2023': 760000, '2022': 670000, '2021': 590000, '2020': 520000, '2019': 460000, '2018': 400000, '2017': 350000 },
    'MAHINDRA': { '2023': 820000, '2022': 730000, '2021': 640000, '2020': 560000, '2019': 490000, '2018': 420000, '2017': 360000 }
  };

  const basePrice = (BASE_VALUES[make] && BASE_VALUES[make][year]) || 420000;
  const odoNum = Number(odometer) || 45000;
  const odoDeduction = Math.min(60000, Math.floor((odoNum / 10000) * 8000));
  const estimatedMin = Math.round((basePrice - odoDeduction) * 0.94);
  const estimatedMax = Math.round((basePrice - odoDeduction) * 1.06);
  const exchangeBonus = 35000;

  const handleEvaluate = (e) => {
    e.preventDefault();
    setCalculated(true);
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            <span>TATA MOTORS ASSURED (TMA) SCIENTIFIC EXCHANGE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Exchange Any Car with Zero Legal Risk &amp; Best Market Value
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            125-Point scientific digital appraisal, instant Form 29/30 RC transfer indemnity, and an additional <strong>₹35,000 Shyam Automotive Exchange Bonus</strong>.
          </p>
        </div>

        {/* 3 Core Assurances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 text-xs block">Immediate RTO RC Indemnity</strong>
              <span className="text-[11px] text-slate-500">
                Official legal handover receipt on company letterhead protects you from any liability post key handover.
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 text-xs block">Best Price Match + ₹15,000</strong>
              <span className="text-[11px] text-slate-500">
                Bring any valid quote from digital platforms. Shyam Automotive beats it on the spot.
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 text-xs block">Instant Down-Payment Offset</strong>
              <span className="text-[11px] text-slate-500">
                Full valuation directly adjusted against your new Tata Curvv, Harrier or Nexon down payment.
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Estimator Form */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Form Inputs Left */}
            <form onSubmit={handleEvaluate} className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Enter Details of Your Current Car:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Make / Brand:</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    <option value="MARUTI">Maruti Suzuki</option>
                    <option value="HYUNDAI">Hyundai</option>
                    <option value="TATA">Tata Motors</option>
                    <option value="HONDA">Honda</option>
                    <option value="MAHINDRA">Mahindra</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Manufacturing Year:</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Model / Variant:</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. Swift VXi / i20 Asta"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Odometer Reading (km):</label>
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Scientific Market Valuation</span>
              </button>
            </form>

            {/* Results Right */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs space-y-4">
                
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block">
                      Estimated Trade-In Band
                    </span>
                    <strong className="text-slate-900 text-xs">
                      {year} {make} {modelName || 'Vehicle'}
                    </strong>
                  </div>
                  <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    TMA VERIFIED
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 block">Estimated Market Payout Range:</span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ₹{estimatedMin.toLocaleString('en-IN')} - ₹{estimatedMax.toLocaleString('en-IN')}*
                  </div>
                </div>

                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900 block">+ Shyam Automotive Bonus:</span>
                    <span className="text-[10px] text-amber-800">Festive Exchange Voucher</span>
                  </div>
                  <strong className="text-amber-800 font-mono text-sm">+₹{exchangeBonus.toLocaleString('en-IN')}</strong>
                </div>

                <div className="pt-1 space-y-2">
                  <button
                    onClick={onBookExchange}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Book 15-Min Doorstep Evaluation</span>
                  </button>

                  <a
                    href={`https://wa.me/918879897825?text=Hi%20Shyam%20Automotive,%20I%20want%20to%20exchange%20my%20${year}%20${make}%20${encodeURIComponent(modelName)}%20(Odo:%20${odometer}%20km)%20for%20a%20new%20Tata%20car.%20Please%20arrange%20inspection.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Send Details to WhatsApp Desk</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
