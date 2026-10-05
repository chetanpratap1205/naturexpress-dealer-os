import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Zap, 
  Wrench, 
  Droplets, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Car,
  Activity,
  UserCheck,
  ShieldCheck,
  Gauge
} from 'lucide-react';
import RoadTestModal from './RoadTestModal';

export default function WorkshopBayGrid({ jobCards, dealership, onAdvanceStage }) {
  const [selectedJcForRoadTest, setSelectedJcForRoadTest] = useState(null);

  const bays = [
    { id: 'bay-1', name: 'Bay 1 (Express Lube)', type: 'ICE Express', status: 'Occupied', regNo: 'MP-09-TA-5521', model: 'Tata Punch CNG', progress: 100, tech: 'Sunil Rathore', roadTestDone: true },
    { id: 'bay-2', name: 'Bay 2 (Express Mechanical)', type: 'ICE Major', status: 'Occupied', regNo: 'MP-09-CW-4020', model: 'Tata Harrier Dark', progress: 45, tech: 'Deepak Yadav (Master Tech)', alert: 'Awaiting WhatsApp Video Approval', roadTestDone: false },
    { id: 'bay-3', name: 'Bay 3 (Express Lube)', type: 'ICE Express', status: 'Available', regNo: null, model: null, progress: 0, tech: 'Rajesh Soni', roadTestDone: false },
    { id: 'bay-4', name: 'Bay 4 (3D Laser Alignment)', type: 'Alignment', status: 'Occupied', regNo: 'MP-09-JK-8821', model: 'Tata Curvv ICE', progress: 90, tech: 'Kailash P.', roadTestDone: false },
    { id: 'bay-5', name: 'Bay 5 (Dedicated HV EV Lane)', type: 'High Voltage EV', status: 'Occupied', regNo: 'MP-09-EB-8899', model: 'Tata Nexon EV 45kWh', progress: 60, tech: 'Sunil Rathore (Level-3 EV Certified)', isEV: true, roadTestDone: false },
    { id: 'bay-6', name: 'Bay 6 (HV Battery Calibration)', type: 'High Voltage EV', status: 'Available', regNo: null, model: null, progress: 0, tech: 'EV Standby Tech', isEV: true, roadTestDone: false },
    { id: 'bay-7', name: 'Bay 7 (DCA Diagnostics)', type: 'DCA Gearbox Specialist', status: 'Occupied', regNo: 'MP-09-ZF-1102', model: 'Tata Safari DCA', progress: 30, tech: 'Deepak Yadav (Master Diagnostic Tech)', alert: 'Child-Part Solenoid Received', roadTestDone: false },
    { id: 'bay-8', name: 'Bay 8 (Heavy Mechanical)', type: 'Major Overhaul', status: 'Available', regNo: null, model: null, progress: 0, tech: 'Master Tech Standby', roadTestDone: false }
  ];

  const washBays = [
    { id: 'wb-1', name: 'Wash Bay 1 (Pressure Foam)', queue: 2, currentCar: 'Tata Nexon EV (MP-09-EB-8899)', timeRemaining: '8 mins' },
    { id: 'wb-2', name: 'Wash Bay 2 (Dry Wash & Vacuum)', queue: 1, currentCar: 'Tata Harrier Dark (MP-09-CW-4020)', timeRemaining: '12 mins' }
  ];

  const handleOpenRoadTest = (regNo) => {
    const jc = (jobCards || []).find(j => j.regNo === regNo) || jobCards?.[0];
    if (jc) setSelectedJcForRoadTest(jc);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Floor Sequencer Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
              Constraint Satisfaction Sequencer (CSP Engine)
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              Dynamic Bay Utilization: 88.4%
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Indore Central Workshop Floor & Real-Time Bay Orchestrator
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Balances ICE periodic service, high-voltage EV isolation bays, and enforces 5km Road Test QC gates before customer handover.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center shadow-xs">
            <span className="text-slate-500 block font-medium">Mechanical Bays</span>
            <span className="text-lg font-black text-slate-900 font-mono">6 / 8 Active</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center shadow-xs">
            <span className="text-slate-500 block font-medium">EV High-Voltage Lane</span>
            <span className="text-lg font-black text-blue-700 font-mono">1 / 2 Active</span>
          </div>
        </div>
      </div>

      {/* Main Mechanical Bays Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <Wrench className="w-4 h-4 text-blue-600" />
          <span>Active Mechanical & Diagnostic Lift Bays (Technician Skill Matrix Assigned)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bays.map((bay) => (
            <div
              key={bay.id}
              className={`rounded-2xl border p-4 transition-all shadow-xs flex flex-col justify-between ${
                bay.isEV
                  ? 'bg-cyan-50/40 border-cyan-300'
                  : bay.status === 'Available'
                  ? 'bg-slate-50 border-slate-200 border-dashed'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{bay.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                      bay.isEV ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {bay.type}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bay.status === 'Occupied' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {bay.status}
                  </span>
                </div>

                {bay.regNo ? (
                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-sm font-black text-slate-900 font-mono block">{bay.regNo}</span>
                      <span className="text-xs text-slate-600">{bay.model}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{bay.tech}</span>
                    </div>

                    {bay.alert && (
                      <div className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded-md font-medium">
                        ⚠️ {bay.alert}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Work Velocity</span>
                        <span>{bay.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bay.isEV ? 'bg-cyan-500' : 'bg-blue-600'}`}
                          style={{ width: `${bay.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Lift Free • Auto-Scheduler Ready
                  </div>
                )}
              </div>

              {/* Road Test Action Gate */}
              {bay.regNo && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {bay.roadTestDone ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 5km Road Test Passed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenRoadTest(bay.regNo)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <Gauge className="w-3 h-3" /> Log Pre-Delivery Road Test
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Washing Bay Sequencer & Express Load Balancer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Washing Bay 4:30 PM Bottleneck Sequencer</span>
            </h3>
            <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-200 font-bold">
              WOW #6 Load Balancer
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Automatically routes dry wash & vacuuming to parallel stations, cutting 4:30 PM delivery wait times from 90 mins to 14 mins.
          </p>

          <div className="space-y-3">
            {washBays.map(wb => (
              <div key={wb.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{wb.name}</span>
                  <div className="text-xs text-slate-600 mt-0.5">{wb.currentCar}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-700">{wb.timeRemaining} left</span>
                  <span className="text-[10px] text-slate-400 block">Queue: {wb.queue} cars</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Technician Skill & Safety Matrix Auto-Dispatch</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">Sunil Rathore</span>
                <span className="text-[10px] text-slate-500 block">Tata Certified Level-3 EV Champion</span>
              </div>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold border border-cyan-200">
                EV 350V+ Authorized
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">Deepak Yadav</span>
                <span className="text-[10px] text-slate-500 block">Master Diagnostic & DCA Specialist</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                Transmission Master
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Road Test Modal */}
      {selectedJcForRoadTest && (
        <RoadTestModal
          jobCard={selectedJcForRoadTest}
          isOpen={!!selectedJcForRoadTest}
          onClose={() => setSelectedJcForRoadTest(null)}
          onRoadTestPassed={(rec) => {
            alert(`✓ 5km Road Test & QC Passed for ${selectedJcForRoadTest.regNo}! Vehicle can now proceed to handover.`);
          }}
        />
      )}
    </div>
  );
}
