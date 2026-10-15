import React, { useState } from 'react';
import {
  Zap,
  TrendingDown,
  DollarSign,
  Leaf,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  BatteryCharging
} from 'lucide-react';

export default function EvSavingsCalculator({ onExploreEVs }) {
  const [dailyKm, setDailyKm] = useState(45);
  const [petrolPrice, setPetrolPrice] = useState(108.5);
  const [petrolMileage, setPetrolMileage] = useState(14.0);

  // Calculations
  const monthlyKm = dailyKm * 30;
  const annualKm = dailyKm * 365;

  // ICE Fuel Cost
  const monthlyPetrolLiters = monthlyKm / petrolMileage;
  const monthlyPetrolCost = Math.round(monthlyPetrolLiters * petrolPrice);
  const annualPetrolCost = Math.round((annualKm / petrolMileage) * petrolPrice);
  const fiveYearPetrolCost = annualPetrolCost * 5;

  // Tata EV Charging Cost (approx 0.13 kWh per km @ ₹7.5 per unit domestic or solar)
  const evCostPerKm = 1.15;
  const monthlyEvCost = Math.round(monthlyKm * evCostPerKm);
  const annualEvCost = Math.round(annualKm * evCostPerKm);
  const fiveYearEvCost = annualEvCost * 5;

  // Savings
  const monthlySavings = monthlyPetrolCost - monthlyEvCost;
  const annualSavings = annualPetrolCost - annualEvCost;
  const fiveYearSavings = fiveYearPetrolCost - fiveYearEvCost;
  const co2SavingsTons = ((annualKm * 0.16) / 1000 * 5).toFixed(1);

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>TATA.EV FINANCIAL ROI &amp; CLEAN ENERGY ENGINE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Calculate Your Real Fuel Savings with Tata.ev
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            See how much you put back in your bank every single month by switching to pure electric mobility in Indore.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Left Column */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Daily Distance Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Your Average Daily Commute:</span>
                  <span className="font-black text-blue-600 text-base font-mono">{dailyKm} km / day</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={dailyKm}
                  onChange={(e) => setDailyKm(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>15 km (City Run)</span>
                  <span>60 km (Indore-Pithampur/Bypass)</span>
                  <span>120 km (Daily Highway)</span>
                </div>
              </div>

              {/* Petrol Price & Mileage Adjusters */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Petrol Price in Indore:
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      value={petrolPrice}
                      onChange={(e) => setPetrolPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 font-mono"
                    />
                    <span className="text-[10px] text-slate-400">/L</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Current Car Mileage:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={petrolMileage}
                      onChange={(e) => setPetrolMileage(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">km/L</span>
                  </div>
                </div>
              </div>

              {/* Running Cost Comparison Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Cost Per Kilometer Comparison:
                </span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">Standard Petrol Car:</span>
                      <strong className="text-rose-600 font-mono">₹{(petrolPrice / petrolMileage).toFixed(2)} / km</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 font-bold text-emerald-800">Tata.ev (Pure Electric):</span>
                      <strong className="text-emerald-700 font-mono">₹1.15 / km</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Savings Result Card Right Column */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-blue-50/40 rounded-2xl border border-emerald-200 p-5 space-y-4">
                
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Projected Direct Cash In Hand
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                    <span className="text-[11px] text-slate-500 block">Monthly Savings</span>
                    <strong className="text-2xl font-black text-emerald-700 font-mono block mt-0.5">
                      ₹{monthlySavings.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-slate-400">Net fuel cash saved / month</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                    <span className="text-[11px] text-slate-500 block">Annual Savings</span>
                    <strong className="text-2xl font-black text-blue-700 font-mono block mt-0.5">
                      ₹{annualSavings.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-slate-400">Directly funds your family vacation</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">5-Year Cumulative Savings:</span>
                    <span className="text-[11px] text-slate-500">Equivalent to 40% of the car's initial cost</span>
                  </div>
                  <strong className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                    ₹{fiveYearSavings.toLocaleString('en-IN')}*
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-100/60 p-2.5 rounded-xl">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Plus, you prevent <strong>{co2SavingsTons} metric tons</strong> of tailpipe carbon emissions from entering Indore's air.
                  </span>
                </div>

              </div>

              {/* Scheme 140 Charging Hub Announcement */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3 text-xs">
                <BatteryCharging className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-slate-900 block font-bold">
                    Shyam Automotive 60kW DC Fast Charger @ Scheme 140
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Zero charging anxiety. Charge from 10% to 80% in 45 minutes at our 24x7 customer lounge with high-speed Wi-Fi, air conditioning, and complimentary coffee.
                  </p>
                </div>
              </div>

              <button
                onClick={onExploreEVs}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Explore Tata.ev Lineup (Curvv.ev, Nexon.ev, Punch.ev)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
