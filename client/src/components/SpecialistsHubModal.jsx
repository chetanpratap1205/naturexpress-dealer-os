import React from 'react';
import { 
  X, 
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
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function SpecialistsHubModal({ 
  isOpen, 
  onClose, 
  onOpenSpecialist, 
  onNavigateTab 
}) {
  if (!isOpen) return null;

  const SPECIALISTS = [
    {
      id: 'dealerPrincipal',
      tabId: 'exec_command',
      title: 'Executive Strategic Advisor',
      roleSubtitle: 'Dealer Principal Command Console',
      persona: 'Owner & General Manager',
      icon: Compass,
      color: 'amber',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      status: 'Live Auditing',
      kpi: '₹71,889 Revenue Leakage Detected',
      description: 'Autonomous financial leakage detection, department yield tracking, and 7:00 PM MD executive briefing generator.',
      actionLabel: 'Launch Advisor Console'
    },
    {
      id: 'worksManager',
      tabId: 'workshop_grid',
      title: 'Workshop Floor Orchestrator',
      roleSubtitle: '18-Bay CSP Dynamic Balancer',
      persona: 'Works Manager & Floor Controller',
      icon: Sliders,
      color: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
      status: 'Balancing 18 Bays',
      kpi: '100% CSP Schedule Constraint Met',
      description: 'Continuous shop-floor load balancing, 5:30 PM delivery rush bottleneck prevention, and automated bay re-allocation.',
      actionLabel: 'Launch Orchestrator'
    },
    {
      id: 'floorTech',
      tabId: 'workshop_diag',
      title: 'Master Diagnostic Specialist',
      roleSubtitle: 'Tata Aarohan Diagnostic Engine',
      persona: 'Master Floor Technician',
      icon: Cpu,
      color: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      status: 'DTC Analyzer Online',
      kpi: '1000% Tata Aarohan Manual Sync',
      description: 'Acoustic EV/ICE diagnosis, bilingual step-by-step repair guides (Hindi & English), and CAN-bus freeze-frame sensor locking.',
      actionLabel: 'Launch Diagnostic Desk'
    },
    {
      id: 'partsStore',
      tabId: 'spares_swarm',
      title: 'Parts Logistics Specialist',
      roleSubtitle: 'Indore Cluster Pool & Swarm Logistics',
      persona: 'Parts Storekeeper & Inventory Lead',
      icon: PackageCheck,
      color: 'cyan',
      badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      iconBg: 'bg-cyan-600 text-white shadow-cyan-500/20',
      status: '420 Bins Monitored',
      kpi: '45-Min Cluster Runner Dispatch',
      description: 'Autonomous inter-dealer inventory pooling across Indore, dead-stock liquidation auctions, and RFID bin location mapper.',
      actionLabel: 'Launch Logistics Desk'
    },
    {
      id: 'warranty',
      tabId: 'spares_warranty',
      title: 'Warranty Compliance Officer',
      roleSubtitle: 'Zero-Rejection Fortress & e-DMS PRS',
      persona: 'Forensic Warranty Claims Officer',
      icon: ShieldCheck,
      color: 'blue',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      status: 'Fortress Locked',
      kpi: '0.8% Rejection Benchmark (vs 9.8% OEM)',
      description: '4-angle computer vision photo verification, SHA-256 sensor cryptographic lock, and zero-rejection PRS upload to Siebel.',
      actionLabel: 'Launch Warranty Officer'
    },
    {
      id: 'ccm',
      tabId: 'exec_ccm',
      title: 'Customer Experience Sentinel',
      roleSubtitle: 'CSI Sentiment Radar & Escalation Shield',
      persona: 'Customer Care Manager (CCM)',
      icon: HeartHandshake,
      color: 'rose',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
      status: 'Sentiment Scanner Live',
      kpi: '1 Critical Threat Defended',
      description: 'Predictive 24-hr post-service escalation alerts, automated grievance resolution workflows, and legal-grade documentation.',
      actionLabel: 'Launch Experience Sentinel'
    },
    {
      id: 'cre',
      tabId: 'growth_telephony',
      title: 'Customer Outreach Coordinator',
      roleSubtitle: 'Dynamic Telephony Prompter & CRM',
      persona: 'Customer Relationship Executive (CRE)',
      icon: PhoneCall,
      color: 'purple',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
      status: 'Queue Active',
      kpi: '24/35 Daily Bookings Secured (69%)',
      description: 'Context-aware vernacular telecalling prompts, periodic service due triggers, and automatic WhatsApp booking link generation.',
      actionLabel: 'Launch Outreach Desk'
    },
    {
      id: 'billing',
      tabId: 'sa_invoice',
      title: 'Billing & Gate Pass Officer',
      roleSubtitle: 'GST Compliance & Zero-Evasion Desk',
      persona: 'Accounts Cashier & Gatekeeper',
      icon: Receipt,
      color: 'teal',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-600 text-white shadow-teal-500/20',
      status: 'Ledger Reconciled',
      kpi: '100% Tax Invoice & E-Way Ready',
      description: 'HSN/SAC 18% GST split calculation, dynamic UPI QR payment generation, and tamper-proof security digital gate passes.',
      actionLabel: 'Launch Billing Officer'
    },
    {
      id: 'serviceAdvisor',
      tabId: 'sa_intake',
      title: 'Rapid Intake Specialist',
      roleSubtitle: '30-Second Drive-In & WhatsApp Upsell',
      persona: 'Service Advisor (Front Intake)',
      icon: ClipboardCheck,
      color: 'sky',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      iconBg: 'bg-sky-600 text-white shadow-sky-500/20',
      status: 'Drive-In Ready',
      kpi: '₹8,500 Upsell Opportunity Active',
      description: 'Voice-to-job-card intake, 3D body scratch pinpointing, and instant WhatsApp video estimate dispatch to customers.',
      actionLabel: 'Launch Intake Specialist'
    },
    {
      id: 'carOwner',
      tabId: 'customer_cockpit',
      title: 'Tata Personal Concierge',
      roleSubtitle: 'Live Customer Vehicle Status & Tracking',
      persona: 'Vehicle Owner & Customer',
      icon: KeyRound,
      color: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      status: 'Live Vehicle Sync',
      kpi: '15-Sec Video Approval Cockpit',
      description: 'Live bay stage tracking, 15-second transparent estimate approvals, valet tracking, and digital maintenance book.',
      actionLabel: 'Launch Concierge Desk'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">Operations Specialists Hub</h2>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  10 Active Specialists
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
                Enterprise Dealership Autonomous Operational Desks • Scheme 140 Flagship Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Specialists Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Sub-banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-semibold text-slate-800">Deterministic Autonomous Architecture:</span>
            <span>Operating 24/7 across workshop, inventory, warranty, and CRM workflows.</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] font-bold text-slate-500">
            <span>Tata Motors Standards</span>
            <span>•</span>
            <span className="text-blue-700">100% Compliance</span>
          </div>
        </div>

        {/* 10 Specialists Master Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPECIALISTS.map((specialist) => {
              const IconComponent = specialist.icon;
              return (
                <div 
                  key={specialist.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Icon, Role Badge, Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${specialist.iconBg}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                            {specialist.title}
                          </h3>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {specialist.roleSubtitle}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${specialist.badgeBg}`}>
                        {specialist.status}
                      </span>
                    </div>

                    {/* KPI Highlight Pill */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 mb-2.5 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px] font-medium">Core Benchmark</span>
                      <span className="font-bold text-slate-800 font-mono text-[11px]">{specialist.kpi}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {specialist.description}
                    </p>
                  </div>

                  {/* Dual Action Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 mt-auto">
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateTab) onNavigateTab(specialist.tabId);
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center space-x-1 transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-100"
                    >
                      <span>Go to Desk</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenSpecialist) onOpenSpecialist(specialist.id);
                      }}
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>{specialist.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">All 10 specialists active and synchronized with live PostgreSQL / SQLite storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
}
