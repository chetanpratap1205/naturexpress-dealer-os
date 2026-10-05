import React from 'react';
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
  Sparkles
} from 'lucide-react';

export default function EnterpriseSidebar({
  activeRole,
  activeTab,
  setActiveTab,
  dealership,
  jobCards = [],
  ccmAlerts = [],
  partsPool = [],
  warrantyClaims = [],
  revenueOpportunities = [],
  revenueRadar = null
}) {
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
        { id: 'exec_command', label: 'Dealer Command Center', icon: Layers, desc: 'Flagship Overview & Leakage', highlight: true },
        { id: 'growth_action_center', label: 'Revenue Action Center', icon: Zap, desc: '1-Tap Quote & Approvals', badgeCount: pendingOppCount, badgeColor: 'bg-rose-500 text-white' },
        { id: 'exec_briefing', label: '8:00 AM MD WhatsApp Briefing', icon: FileText, desc: 'Daily Executive Digest' },
        { id: 'exec_roi', label: 'P&L & Bay Yield Analytics', icon: TrendingUp, desc: '₹/Bay/Hour Margin Math' },
        { id: 'exec_audit', label: 'Cryptographic Audit Ledger', icon: Lock, desc: 'SHA-256 Immutable Compliance' }
      ]
    },
    {
      id: 'REVENUE',
      name: '2. Revenue Recovery',
      badge: 'High-Margin Retainers',
      items: [
        { id: 'sa_insurance', label: 'Tata Care+ Insurance Quotes', icon: Shield, desc: 'Renewal & Commission Engine' },
        { id: 'sa_accessories', label: 'OEM Accessory Bundler', icon: ShoppingBag, desc: 'Model-Specific Upsells' },
        { id: 'growth_ew', label: 'Extended Warranty & EMI', icon: ShieldCheck, desc: 'Razorpay No-Cost Gateway' },
        { id: 'growth_drips', label: 'WhatsApp Drip Sequences', icon: Radio, desc: 'Day 0, 7, 30, 90 Retention' },
        { id: 'growth_valueclub', label: 'Indore Value Club (Yr 4+)', icon: Award, desc: 'Post-Warranty Loyalty' },
        { id: 'growth_telephony', label: 'AI Telephony Win-Back CRM', icon: PhoneCall, desc: 'Outbound Conversion Queue' },
        { id: 'growth_loyalty', label: 'Tata Seva Points Wallet', icon: Gift, desc: 'Customer Loyalty Ledger' }
      ]
    },
    {
      id: 'WORKSHOP',
      name: '3. Workshop Flow',
      badge: 'Throughput & Quality',
      items: [
        { id: 'workshop_grid', label: '18-Bay CSP Dynamic Grid', icon: LayoutGrid, desc: 'Load Balancer & 5:30 PM Gate', badgeCount: jobCards?.filter(j => j.status !== 'delivered')?.length || 0, badgeColor: 'bg-blue-600 text-white' },
        { id: 'sa_intake', label: 'Fast 30s Intake Desk', icon: UserCheck, desc: 'Voice-to-Text & Estimator' },
        { id: 'workshop_diag', label: 'Aarohan Diagnostic Terminal', icon: Wrench, desc: 'Hindi Steps & FFT Acoustic' },
        { id: 'workshop_roadtest', label: 'Pre-Delivery 5km Road Test', icon: CheckSquare, desc: 'Mandatory QC Sign-Off' },
        { id: 'sa_invoice', label: 'GST Tax Invoicing & Print', icon: FileText, desc: 'Official CGST/SGST Invoices' },
        { id: 'sa_leaderboard', label: 'Staff Gamified Commission', icon: Award, desc: 'SA & Tech Incentive Board' }
      ]
    },
    {
      id: 'RISK',
      name: '4. Risk & Integrity',
      badge: 'Defense & Spares',
      items: [
        { id: 'spares_warranty', label: 'AI Zero-Rejection Shield', icon: Lock, desc: 'ECU DTC Freeze-Frame Lock', badgeCount: pendingClaims, badgeColor: 'bg-emerald-600 text-white' },
        { id: 'exec_ccm', label: 'CCM Sentiment Radar', icon: AlertTriangle, desc: 'Legal & Escalation Defense', badgeCount: criticalComplaints, badgeColor: 'bg-rose-600 text-white' },
        { id: 'exec_csi', label: 'CSI Integrity Anti-Tamper', icon: ShieldCheck, desc: 'Direct OEM Survey Dispatcher' },
        { id: 'exec_batch_defect', label: 'OEM Batch Defect Radar', icon: Zap, desc: 'Regional Failure Clustering' },
        { id: 'spares_swarm', label: 'Indore 45-Min Parts Pool', icon: Network, desc: 'Inter-Dealer Swarm Trading', badgeCount: partsCount, badgeColor: 'bg-indigo-600 text-white' },
        { id: 'spares_scanner', label: 'RFID / Barcode Bin Scanner', icon: QrCode, desc: 'Anti-Cannibalization Seal' },
        { id: 'spares_edms', label: 'Tata e-DMS / Siebel Bridge', icon: Database, desc: 'SOAP / REST Live Adapter' }
      ]
    }
  ];

  return (
    <aside className="w-64 xl:w-72 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none min-h-[calc(100vh-80px)]">
      {/* Live Customer Portal Direct Link */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <button
          onClick={() => setActiveTab('customer_cockpit')}
          className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
            activeTab === 'customer_cockpit'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 border border-emerald-500/20'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Customer WhatsApp View</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
            Live
          </span>
        </button>
      </div>

      {/* 4 Pillars Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar">
        {PILLARS.map((pillar) => (
          <div key={pillar.id} className="space-y-1">
            <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>{pillar.name}</span>
              <span className="text-[9px] text-slate-500 font-normal">{pillar.badge}</span>
            </div>

            <div className="space-y-0.5">
              {pillar.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-150 group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : item.highlight
                        ? 'bg-slate-800/90 text-blue-300 hover:bg-slate-800 hover:text-white font-medium'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <div className="truncate">
                        <div className="truncate text-xs">{item.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
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
    </aside>
  );
}
