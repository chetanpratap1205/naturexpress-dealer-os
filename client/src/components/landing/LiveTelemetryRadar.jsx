import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Wrench,
  Truck,
  ShieldCheck,
  Zap,
  Users,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LiveTelemetryRadar({ onOpenServiceBooking, onOpenValet }) {
  // Live simulated dynamic telemetry with realistic jitter
  const [telemetry, setTelemetry] = useState({
    activeBays: 14,
    totalBays: 18,
    carsInProcess: 14,
    carsCompletedToday: 38,
    avgTurnaroundMins: 72,
    csiScore: 99.2,
    activeValets: 8,
    masterTechsOnDuty: 22,
    lastUpdate: 'Just now'
  });

  const [activeBayTab, setActiveBayTab] = useState('ALL');

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        carsCompletedToday: prev.carsCompletedToday + (Math.random() > 0.8 ? 1 : 0),
        avgTurnaroundMins: 70 + Math.floor(Math.random() * 6),
        lastUpdate: 'Just now'
      }));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const BAYS_DATA = [
    { id: 'BAY-01', type: 'EXPRESS', name: 'Bay 1: 90-Min Express Pit', status: 'OCCUPIED', car: 'Tata Nexon (MP09-CW-4821)', tech: 'Ramesh S. (Gold Certified)', stage: 'Brake & Fluid Service', eta: '18 mins' },
    { id: 'BAY-02', type: 'EXPRESS', name: 'Bay 2: 90-Min Express Pit', status: 'OCCUPIED', car: 'Tata Punch (MP09-ZM-1102)', tech: 'Vikram P. (Master Tech)', stage: 'Wheel Alignment & Balancing', eta: '12 mins' },
    { id: 'BAY-03', type: 'PERIODIC', name: 'Bay 3: Periodic Maintenance', status: 'OCCUPIED', car: 'Tata Harrier (MP09-WD-9944)', tech: 'Sunil K. (Senior Tech)', stage: '30,000 km Major Service', eta: '45 mins' },
    { id: 'BAY-04', type: 'PERIODIC', name: 'Bay 4: Periodic Maintenance', status: 'AVAILABLE', car: 'Ready for Next Intake', tech: 'Deepak M. (Tech Assigner)', stage: 'Sanitized & Cleared', eta: 'Immediate' },
    { id: 'BAY-05', type: 'EV', name: 'Bay 5: Tata.ev High-Voltage Lab', status: 'OCCUPIED', car: 'Tata Curvv.ev (MP09-EV-2024)', tech: 'Amit R. (EV High-Voltage Lead)', stage: 'Battery SoH & Telematics Sync', eta: '25 mins' },
    { id: 'BAY-06', type: 'EV', name: 'Bay 6: Tata.ev High-Voltage Lab', status: 'OCCUPIED', car: 'Tata Nexon.ev (MP09-EV-5511)', tech: 'Prateek S. (EV Specialist)', stage: 'Firmware 4.2 Upgrade', eta: '30 mins' },
    { id: 'BAY-07', type: 'DIAGNOSTIC', name: 'Bay 7: Bosch OBD-II Acoustic Rig', status: 'OCCUPIED', car: 'Tata Safari (MP09-TC-7721)', tech: 'Rajesh V. (Diagnostic Lead)', stage: 'ECU Freeze-Frame Analysis', eta: '35 mins' },
    { id: 'BAY-08', type: 'BODYSHOP', name: 'Bay 8: Celette Laser Chassis Jig', status: 'OCCUPIED', car: 'Tata Altroz (MP09-BJ-3312)', tech: 'Mahesh C. (Bodyshop Master)', stage: 'Cashless Insurance Restoration', eta: 'In Progress' }
  ];

  const filteredBays = activeBayTab === 'ALL'
    ? BAYS_DATA
    : BAYS_DATA.filter(b => b.type === activeBayTab);

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-6 bg-slate-50/60 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE WORKSHOP TELEMETRY • SCHEME 140 FLAGSHIP</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              18 State-of-the-Art Robotic CSP Bays in Active Service
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero black-box servicing. Watch live technician assignments, bay turnover rates, and real-time completion speeds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenServiceBooking}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Book Express Slot</span>
            </button>
            <button
              onClick={onOpenValet}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Valet Pickup</span>
            </button>
          </div>
        </div>

        {/* 4 Real-Time Operational KPI Meters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-[11px]">Active Bay Load</span>
              <Activity className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{telemetry.activeBays}/{telemetry.totalBays}</span>
              <span className="text-[11px] font-bold text-emerald-600">77% Capacity</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '77%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">4 Fast Express Bays Available Now</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-[11px]">Avg Express Turnaround</span>
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{telemetry.avgTurnaroundMins}</span>
              <span className="text-xs font-bold text-slate-500">mins</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">Guaranteed under 90 minutes</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-[11px]">Cars Serviced Today</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{telemetry.carsCompletedToday}</span>
              <span className="text-[11px] font-bold text-indigo-600">Passed QC</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">100% Digital Job Card QC Sign-off</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-[11px]">Customer Trust Index</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{telemetry.csiScore}%</span>
              <span className="text-[11px] font-bold text-amber-600">4.9★ Google</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '99%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">1,237 Verified Reviews in Indore</span>
          </div>

        </div>

        {/* Live Bays Status Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Bay Radar Monitor</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Realtime Sync</span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'ALL', label: 'All Bays (8 Sampled)' },
                { id: 'EXPRESS', label: '90-Min Express' },
                { id: 'EV', label: 'Tata.ev Lab' },
                { id: 'PERIODIC', label: 'Periodic Maint.' },
                { id: 'BODYSHOP', label: 'Bodyshop' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBayTab(tab.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeBayTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {filteredBays.map(bay => (
              <div
                key={bay.id}
                className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  bay.status === 'AVAILABLE'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[10px] text-slate-500">{bay.id}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        bay.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {bay.status}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-[12px] truncate">{bay.name}</h5>
                  <p className="text-[11px] font-medium text-slate-700 mt-1 truncate">{bay.car}</p>
                  
                  <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-semibold text-slate-600">Task:</span>
                      <span className="truncate">{bay.stage}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-semibold text-slate-600">Tech:</span>
                      <span className="truncate">{bay.tech}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">ETA to Completion</span>
                  <span className={`font-bold font-mono ${bay.status === 'AVAILABLE' ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {bay.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>All bays equipped with automated Castrol oil dispensers &amp; calibrated torque wrenches.</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Live Feed from Scheme 140 Workshop Terminal
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
