import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Building2,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export default function ROIProfitCalculator({ dealership }) {
  const [bayCount, setBayCount] = useState(25);
  const [carsPerDay, setCarsPerDay] = useState(40);
  const [ewIncrease, setEwIncrease] = useState(35); // 35 additional EW policies per month

  // Calculated ROI Metrics
  const monthlyLaborGain = Math.round(carsPerDay * 26 * 450); // Additional labor revenue from 25% faster throughput
  const ewMarginGain = ewIncrease * 8000; // Dealer net margin on Tata EW policies
  const warrantyLossSaved = Math.round(bayCount * 11200); // Saved claim write-offs
  const creWinBackGain = Math.round(carsPerDay * 26 * 0.12 * 3200); // 12% win-back of out-of-warranty cars
  const vasVideoGain = Math.round(carsPerDay * 26 * 0.22 * 1100); // 22% higher VAS approval from video proof

  const totalMonthlyGain = monthlyLaborGain + ewMarginGain + warrantyLossSaved + creWinBackGain + vasVideoGain;
  const saasFee = 150000;
  const netMonthlyProfit = totalMonthlyGain - saasFee;
  const roiMultiplier = (totalMonthlyGain / saasFee).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  The Dealership Owner Pitch Model
                </span>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Guaranteed Positive Unit Economics
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                NatureXpress Dealership P&L & Profit Multiplication Engine
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Real-time financial simulator demonstrating how NatureXpress turns daily workshop friction into a <strong>10x+ Return on Investment (ROI)</strong> every single month.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">Net Dealer Profit Added</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">
              +₹{(netMonthlyProfit / 100000).toFixed(2)} Lakhs / mo
            </span>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
              {roiMultiplier}x Net Return on Subscription
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Live P&L Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dealership Parameters (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Customize Dealership Size & Volume</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>Active Workshop Bays</span>
                <span className="text-blue-600 font-mono text-sm">{bayCount} Bays</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={bayCount}
                onChange={(e) => setBayCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>Daily Vehicle Intake (Throughput)</span>
                <span className="text-blue-600 font-mono text-sm">{carsPerDay} Cars / Day</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={carsPerDay}
                onChange={(e) => setCarsPerDay(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>Monthly Extended Warranty (EW) Targets</span>
                <span className="text-blue-600 font-mono text-sm">+{ewIncrease} Policies / mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={ewIncrease}
                onChange={(e) => setEwIncrease(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="text-slate-700 font-bold block">The NatureXpress Guarantee:</span>
            <p className="text-slate-600 leading-relaxed italic">
              "If your Extended Warranty sales do not increase by at least 30% and your evening delivery delays do not drop by 40% in your first 30 days, your pilot is 100% free."
            </p>
          </div>
        </div>

        {/* Financial Gain Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Itemized Monthly Cash Flow Multipliers</span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              30-Day Cash Impact
            </span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              {
                title: "1. Incremental Extended Warranty (EW) Profits",
                desc: `${ewIncrease} additional policies via 1-click WhatsApp No-Cost EMI`,
                gain: ewMarginGain,
                highlight: true
              },
              {
                title: "2. Higher Bay Throughput (Labor Recovery)",
                desc: "25% faster turnaround via CSP load-balanced bays",
                gain: monthlyLaborGain
              },
              {
                title: "3. Recovered Post-Warranty Churn (CRE CRM)",
                desc: "12% win-back rate of out-of-warranty Nexon/Harrier/Safari owners",
                gain: creWinBackGain
              },
              {
                title: "4. Eliminated OEM Warranty Claim Rejections",
                desc: "Zero claim write-offs via AI freeze-frame pre-audit",
                gain: warrantyLossSaved
              },
              {
                title: "5. High-Margin VAS Video Approvals",
                desc: "Transparent 15-sec video proof converts 22% more customer add-ons",
                gain: vasVideoGain
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-mono font-black text-sm text-emerald-600 block">
                    +₹{item.gain.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">Gross Margin</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total Gross Margin Addition:</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                +₹{totalMonthlyGain.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">NatureXpress SaaS Subscription:</span>
              <span className="text-sm font-mono font-bold text-rose-600">-₹1,50,000 / mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
