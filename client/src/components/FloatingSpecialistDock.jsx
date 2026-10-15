import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Sliders, 
  Cpu, 
  PackageCheck, 
  ShieldCheck, 
  HeartHandshake, 
  PhoneCall, 
  Receipt, 
  ClipboardCheck, 
  KeyRound,
  X,
  ChevronUp,
  Layers
} from 'lucide-react';

export default function FloatingSpecialistDock({
  activeTab,
  onOpenSpecialist,
  onOpenHub
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Map active tab to current contextual specialist
  const getContextualSpecialist = () => {
    switch (activeTab) {
      case 'exec_command':
      case 'executive_pnl':
      case 'exec_briefing':
      case 'exec_roi':
      case 'exec_audit':
        return {
          id: 'dealerPrincipal',
          title: 'Executive Advisor',
          fullTitle: 'Executive Strategic Advisor',
          icon: Compass,
          color: 'bg-amber-500'
        };
      case 'workshop_grid':
        return {
          id: 'worksManager',
          title: 'Floor Orchestrator',
          fullTitle: 'Workshop Floor Orchestrator',
          icon: Sliders,
          color: 'bg-indigo-600'
        };
      case 'workshop_diag':
        return {
          id: 'floorTech',
          title: 'Diagnostic Specialist',
          fullTitle: 'Master Diagnostic Specialist',
          icon: Cpu,
          color: 'bg-emerald-600'
        };
      case 'spares_swarm':
      case 'spares_scanner':
        return {
          id: 'partsStore',
          title: 'Parts Logistics',
          fullTitle: 'Parts Logistics Specialist',
          icon: PackageCheck,
          color: 'bg-cyan-600'
        };
      case 'spares_warranty':
      case 'spares_edms':
        return {
          id: 'warranty',
          title: 'Warranty Officer',
          fullTitle: 'Warranty Compliance Officer',
          icon: ShieldCheck,
          color: 'bg-blue-600'
        };
      case 'exec_ccm':
      case 'exec_csi':
        return {
          id: 'ccm',
          title: 'Experience Sentinel',
          fullTitle: 'Customer Experience Sentinel',
          icon: HeartHandshake,
          color: 'bg-rose-600'
        };
      case 'growth_telephony':
      case 'growth_drips':
      case 'growth_action_center':
        return {
          id: 'cre',
          title: 'Outreach Desk',
          fullTitle: 'Customer Outreach Coordinator',
          icon: PhoneCall,
          color: 'bg-purple-600'
        };
      case 'sa_invoice':
        return {
          id: 'billing',
          title: 'Billing Officer',
          fullTitle: 'Billing & Gate Pass Officer',
          icon: Receipt,
          color: 'bg-teal-600'
        };
      case 'sa_intake':
      case 'pickup_scheduler':
        return {
          id: 'serviceAdvisor',
          title: 'Intake Specialist',
          fullTitle: 'Rapid Intake Specialist',
          icon: ClipboardCheck,
          color: 'bg-sky-600'
        };
      case 'customer_cockpit':
        return {
          id: 'carOwner',
          title: 'Personal Concierge',
          fullTitle: 'Tata Personal Concierge',
          icon: KeyRound,
          color: 'bg-emerald-600'
        };
      default:
        return {
          id: 'dealerPrincipal',
          title: 'Operations Hub',
          fullTitle: 'Executive Strategic Advisor',
          icon: Sparkles,
          color: 'bg-blue-600'
        };
    }
  };

  const current = getContextualSpecialist();
  const IconComponent = current.icon;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-3 sm:right-6 z-40 select-none">
      
      {/* Speed dial popup options */}
      {isOpen && (
        <div className="mb-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 w-64 space-y-1.5 animate-in slide-in-from-bottom-2 duration-150">
          <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Specialists Quick-Launch</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Launch Desk Specialist */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSpecialist(current.id);
            }}
            className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-2.5 cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${current.color} shrink-0`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">
                {current.fullTitle}
              </div>
              <div className="text-[10px] text-blue-600 font-semibold">
                Launch Active Desk Specialist
              </div>
            </div>
          </button>

          {/* View All 10 Specialists Hub */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenHub();
            }}
            className="w-full text-left p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100 transition-colors flex items-center space-x-2.5 cursor-pointer border border-blue-200"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-blue-700 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950">
                10 Specialists Hub
              </div>
              <div className="text-[10px] text-blue-700 font-medium">
                View All Operational Desks
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Main Catchy Floating Action Button */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white pl-3.5 pr-4 py-2.5 rounded-2xl shadow-xl shadow-blue-900/25 border border-blue-400/30 hover:shadow-2xl hover:scale-102 active:scale-98 transition-all cursor-pointer font-sans`}
          title={`Active: ${current.fullTitle}`}
        >
          <div className="relative">
            <div className={`w-6 h-6 rounded-lg ${current.color} flex items-center justify-center text-white shadow-xs`}>
              <IconComponent className="w-3.5 h-3.5" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
            </span>
          </div>
          
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-blue-200 leading-none uppercase tracking-wider font-bold">
              Specialist Desk
            </div>
            <div className="text-xs font-black text-white leading-tight">
              {current.title}
            </div>
          </div>

          <div className="sm:hidden font-black text-xs">
            {current.title}
          </div>

          {isOpen ? (
            <X className="w-3.5 h-3.5 text-blue-200 ml-1" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-blue-200 ml-1" />
          )}
        </button>
      </div>

    </div>
  );
}
