import React, { useState } from 'react';
import {
  Layers,
  Zap,
  FileText,
  TrendingUp,
  Shield,
  ShoppingBag,
  ShieldCheck,
  Radio,
  Award,
  PhoneCall,
  Gift,
  LayoutGrid,
  UserCheck,
  Wrench,
  CheckSquare,
  Lock,
  AlertTriangle,
  Network,
  QrCode,
  Database,
  Smartphone,
  ChevronRight,
  Sparkles,
  Truck,
  Receipt,
  Scan,
  Cpu,
  X
} from 'lucide-react';

export default function EnterpriseSidebar({
  activeRole,
  activeTab,
  setActiveTab,
  dealership,
  currentUser,
  jobCards = [],
  ccmAlerts = [],
  partsPool = [],
  warrantyClaims = [],
  revenueOpportunities = [],
  revenueRadar = null,
  mobileOpen = false,
  onCloseMobile
}) {
  const [viewMode, setViewMode] = useState('ROLE_PRIORITY'); // 'ROLE_PRIORITY' | 'ALL_PILLARS'
  const pendingOppCount = (revenueOpportunities || []).filter(o => o.status !== 'RECOVERED').length;
  const criticalComplaints = (ccmAlerts || []).filter(c => c.sentimentScore > 0.7 || c.severity === 'high').length;
  const pendingClaims = (warrantyClaims || []).filter(w => w.status !== 'OEM_APPROVED').length;
  const partsCount = partsPool?.length || 0;

  // The 4 Core Pillars of NatureXpress DealerOS
  const PILLARS = [
    {
      id: 'COMMAND',
      name: '1. Executive Command',
      badge: 'MD & GM Level',
      items: [
        { id: 'executive_pnl', label: 'DP Gross Profit & Repeat Radar', icon: TrendingUp, desc: 'Real Margins, Bay Yield & Repeat Alert', highlight: true },
        { id: 'exec_command', label: 'Dealer Command Center', icon: Layers, desc: 'Flagship Overview & Leakage' },
        { id: 'growth_action_center', label: 'Revenue Action Center', icon: Zap, desc: '1-Tap Quote & Approvals', badgeCount: pendingOppCount, badgeColor: 'bg-rose-500 text-white' },
        { id: 'exec_briefing', label: '8:45 AM MD WhatsApp Briefing', icon: FileText, desc: 'Daily Executive Digest' },
        { id: 'exec_roi', label: 'P&L & Bay Yield Analytics', icon: TrendingUp, desc: '₹/Bay/Hour Margin Math' },
        { id: 'exec_audit', label: 'Cryptographic Audit Ledger', icon: Lock, desc: 'SHA-256 Immutable Audit' },
        { id: 'exec_ccm', label: 'CCM Sentiment Radar', icon: AlertTriangle, desc: 'Legal & Escalation Defense', badgeCount: criticalComplaints, badgeColor: 'bg-rose-600 text-white' }
      ]
    },
    {
      id: 'WORKSHOP',
      name: '2. Workshop Floor & Intake',
      badge: 'Throughput & Quality',
      items: [
        { id: 'sa_intake', label: 'SA 360° Scratch & Intake Desk', icon: UserCheck, desc: '90-Sec Intake & wa.me Intent', highlight: true },
        { id: 'pickup_scheduler', label: 'Valet Pickup & Drop Scheduler', icon: Truck, desc: 'Identity Card & Customer Tracker', highlight: true },
        { id: 'workshop_terminal', label: 'Technician Bay SRT Terminal', icon: Wrench, desc: 'Flat-Rate Timers & 15s Defect Video', highlight: true },
        { id: 'billing_gatepass', label: 'GST Billing & Gate Pass Desk', icon: Lock, desc: 'SAC/HSN & Exit QR Clearance', highlight: true },
        { id: 'sa_invoice', label: 'Official GST Tax Invoice Console', icon: Receipt, desc: 'Rule 46 CGST/SGST Breakdown' },
        { id: 'workshop_grid', label: '18-Bay CSP Dynamic Grid', icon: LayoutGrid, desc: 'Load Balancer & 5:30 PM Gate', badgeCount: jobCards?.filter(j => j.status !== 'delivered')?.length || 0, badgeColor: 'bg-blue-600 text-white' },
        { id: 'workshop_diag', label: 'Master Diagnostic Terminal', icon: Cpu, desc: 'Hindi Vernacular OBD-II Guides' },
        { id: 'workshop_roadtest', label: 'Pre-Delivery 5km Road Test', icon: CheckSquare, desc: 'Mandatory QC Sign-Off' }
      ]
    },
    {
      id: 'REVENUE',
      name: '3. Revenue & Retainers',
      badge: 'High-Margin Retainers',
      items: [
        { id: 'sa_insurance', label: 'Tata Care+ Insurance Quotes', icon: Shield, desc: 'Renewal & Commission Engine' },
        { id: 'sa_accessories', label: 'OEM Accessory Bundler', icon: ShoppingBag, desc: 'Model-Specific Upsells' },
        { id: 'growth_ew', label: 'Extended Warranty & EMI', icon: ShieldCheck, desc: 'Tata Care+ Direct Settlement' },
        { id: 'growth_telephony', label: 'CRE Telephony CRM & Win-Back', icon: PhoneCall, desc: 'Outbound Booking Conversions' },
        { id: 'growth_drips', label: 'WhatsApp Drip Sequences', icon: Radio, desc: 'Day 0, 7, 30, 90 Retention' },
        { id: 'growth_valueclub', label: 'Indore Value Club (Yr 4+)', icon: Award, desc: 'Post-Warranty Loyalty' },
        { id: 'sa_leaderboard', label: 'Staff Commission Leaderboard', icon: Award, desc: 'Gamified Incentive Payouts' }
      ]
    },
    {
      id: 'RISK',
      name: '4. Spares & Warranty Fortress',
      badge: 'Defense & Inventory',
      items: [
        { id: 'parts_store', label: 'Parts Store Bin Locator', icon: QrCode, desc: 'Aisle-Rack-Bin & Stock Deduct', highlight: true },
        { id: 'warranty_fortress', label: 'Warranty Zero-Rejection Fortress', icon: ShieldCheck, desc: '4-Angle Audit & ECU Freeze-Frame', highlight: true },
        { id: 'spares_swarm', label: 'Indore 45-Min Parts Pool', icon: Network, desc: 'Inter-Dealer Swarm Trading', badgeCount: partsCount, badgeColor: 'bg-indigo-600 text-white' },
        { id: 'spares_warranty', label: 'Warranty Shield Console', icon: ShieldCheck, desc: 'Automated OEM Claims', badgeCount: pendingClaims, badgeColor: 'bg-purple-600 text-white' }
      ]
    }
  ];

  // Intelligently configure visible pillars based on role and viewMode toggle
  const getFilteredPillars = () => {
    // If user explicitly toggled "All Pillars", show all 4 pillars
    if (viewMode === 'ALL_PILLARS' || activeRole === 'EXECUTIVE' || currentUser?.role === 'DEALER_PRINCIPAL') {
      return PILLARS;
    }

    if (activeRole === 'WORKSHOP') {
      return [
        {
          id: 'WORKSHOP',
          name: 'Workshop Floor & Intake',
          badge: 'Operations Post',
          items: PILLARS.find(p => p.id === 'WORKSHOP')?.items || []
        },
        {
          id: 'REVENUE',
          name: 'Retainers & Incentives',
          badge: 'Accessories & Commissions',
          items: (PILLARS.find(p => p.id === 'REVENUE')?.items || []).filter(i => 
            ['sa_accessories', 'sa_insurance', 'sa_leaderboard'].includes(i.id)
          )
        }
      ];
    }

    if (activeRole === 'SPARES') {
      return [
        {
          id: 'RISK',
          name: 'Spares & Warranty Fortress',
          badge: 'Inventory & Claims',
          items: PILLARS.find(p => p.id === 'RISK')?.items || []
        },
        {
          id: 'WORKSHOP_REQ',
          name: 'Floor Support',
          badge: 'Workshop Requests',
          items: (PILLARS.find(p => p.id === 'WORKSHOP')?.items || []).filter(i => 
            ['workshop_terminal', 'workshop_grid'].includes(i.id)
          )
        }
      ];
    }

    if (activeRole === 'GROWTH') {
      return [
        {
          id: 'BILLING',
          name: 'Cashier & Settlement',
          badge: 'Statutory GST',
          items: (PILLARS.find(p => p.id === 'WORKSHOP')?.items || []).filter(i => 
            ['billing_gatepass', 'sa_invoice'].includes(i.id)
          )
        },
        {
          id: 'REVENUE',
          name: 'Revenue & Retainers',
          badge: 'High-Margin Retainers',
          items: PILLARS.find(p => p.id === 'REVENUE')?.items || []
        }
      ];
    }

    return PILLARS;
  };

  const visiblePillars = getFilteredPillars();

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full select-none bg-white">
      {/* Mobile Drawer Header */}
      <div className="lg:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-700 flex flex-col items-center justify-center text-white font-black text-[9px] leading-tight">
            <span>TATA</span>
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 block leading-tight">Shyam Automotive</span>
            <span className="text-[10px] text-slate-500 font-medium">Scheme 140 Hub • 4.9 ★</span>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Live Customer Portal Direct Link & View Mode Toggle */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-2">
        <button
          onClick={() => handleItemClick('customer_cockpit')}
          className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
            activeTab === 'customer_cockpit'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-300/80'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Customer WhatsApp View</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
            Live
          </span>
        </button>

        {/* View Mode Toggle: Role Desks vs All 4 Pillars */}
        <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-slate-200 text-center shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('ROLE_PRIORITY')}
            className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'ROLE_PRIORITY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            My Role Desks
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ALL_PILLARS')}
            className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'ALL_PILLARS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All 4 Pillars
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar pb-16 lg:pb-6">
        {visiblePillars.map((pillar) => (
          <div key={pillar.id} className="space-y-1">
            <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>{pillar.name}</span>
              <span className="text-[9px] text-slate-400 font-medium">{pillar.badge}</span>
            </div>

            <div className="space-y-0.5">
              {pillar.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all duration-150 group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                        : item.highlight
                        ? 'bg-blue-50 text-blue-900 hover:bg-blue-100 hover:text-blue-950 font-semibold border border-blue-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <div className="truncate">
                        <div className="truncate text-xs">{item.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                          {item.badgeCount}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'opacity-100 text-white' : 'text-slate-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-200 flex-col flex-shrink-0 min-h-[calc(100vh-80px)] shadow-xs">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white border-r border-slate-200 h-full z-10 shadow-2xl animate-slideRight">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
