import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  UserCheck, 
  Wrench, 
  PhoneCall, 
  TrendingUp, 
  Star,
  CheckCircle2
} from 'lucide-react';

export default function StaffLeaderboard({ leaderboard }) {
  const [roleFilter, setRoleFilter] = useState('sa'); // 'sa', 'tech', 'cre'

  const { serviceAdvisors = [], technicians = [], creStaff = [] } = leaderboard || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-yellow-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                  Staff Gamification & Incentive Engine
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Daily Payouts Active
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Dealership Staff Performance & Commission Leaderboard
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Drives proactive Extended Warranty sales, zero-defect repairs, and high-converting customer calls through transparent daily commission payouts.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">Total Commission Dispatched Today</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">₹8,190</span>
            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
              Across 8 Top Performers
            </span>
          </div>
        </div>
      </div>

      {/* Role Navigation */}
      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-md">
        <button
          onClick={() => setRoleFilter('sa')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            roleFilter === 'sa' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Service Advisors</span>
        </button>
        <button
          onClick={() => setRoleFilter('tech')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            roleFilter === 'tech' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Master Technicians</span>
        </button>
        <button
          onClick={() => setRoleFilter('cre')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            roleFilter === 'cre' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Calling Staff (CRE)</span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {roleFilter === 'sa' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Service Advisor Commission & FTR Rankings</h3>
            {serviceAdvisors.map((sa, idx) => (
              <div key={sa.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : 'bg-amber-800 text-white'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                      <span>{sa.name}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                        {sa.badge}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">Cars Handled: <strong className="text-slate-700">{sa.carsHandled}</strong> • EW Sold: <strong className="text-blue-600">{sa.ewSold}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-right">
                  <div>
                    <span className="text-slate-500 block font-medium">First Time Right (FTR)</span>
                    <span className="text-emerald-600 font-mono font-bold text-sm">{sa.ftrScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Earned Commission</span>
                    <span className="text-amber-600 font-mono font-black text-base">₹{sa.commissionEarned.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {roleFilter === 'tech' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Master Technician Zero-Defect Efficiency Board</h3>
            {technicians.map((tech, idx) => (
              <div key={tech.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                      <span>{tech.name}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                        {tech.badge}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">Specialization: <strong className="text-slate-700">{tech.role}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-right">
                  <div>
                    <span className="text-slate-500 block font-medium">Zero-Defect Quality</span>
                    <span className="text-emerald-600 font-mono font-bold text-sm">{tech.zeroDefectScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">FRT Labor Efficiency</span>
                    <span className="text-blue-600 font-mono font-black text-base">{tech.efficiency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {roleFilter === 'cre' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Calling Staff (CRE) Booking Conversion Board</h3>
            {creStaff.map((cre, idx) => (
              <div key={cre.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                      <span>{cre.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        {cre.badge}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">Calls: <strong className="text-slate-700">{cre.callsMade}</strong> • Bookings: <strong className="text-emerald-600">{cre.bookingsConfirmed}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-right">
                  <div>
                    <span className="text-slate-500 block font-medium">Conversion Rate</span>
                    <span className="text-emerald-600 font-mono font-bold text-sm">{cre.conversionRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-medium">Earned Incentive</span>
                    <span className="text-amber-600 font-mono font-black text-base">₹{cre.incentiveEarned.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
