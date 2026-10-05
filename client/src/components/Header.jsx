import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  AlertTriangle, 
  PhoneCall, 
  LayoutGrid, 
  TrendingUp, 
  Zap, 
  Network, 
  Radio, 
  Wrench, 
  Award,
  MessageSquare,
  Shield,
  RotateCcw,
  Menu,
  X,
  FileText,
  Download,
  Sparkles,
  ShoppingBag,
  Clock
} from 'lucide-react';
import AuthModal from './AuthModal';
import WhatsAppGatewayModal from './WhatsAppGatewayModal';
import CSIIntegrityShield from './CSIIntegrityShield';
import GSTInvoiceModal from './GSTInvoiceModal';
import TataCareInsuranceModal from './TataCareInsuranceModal';
import DripCampaignsModal from './DripCampaignsModal';
import MDBriefingModal from './MDBriefingModal';
import LoyaltyWalletModal from './LoyaltyWalletModal';
import DemoSandboxModal from './DemoSandboxModal';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  dealership, 
  wsConnected, 
  currentUser, 
  onSelectUser,
  onResetDemoData,
  onDataRefresh 
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showCsiModal, setShowCsiModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showDripModal, setShowDripModal] = useState(false);
  const [showMDBriefingModal, setShowMDBriefingModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'customer', label: 'Customer Cockpit', icon: Smartphone, badge: 'WhatsApp App' },
    { id: 'sa', label: 'SA Digital Tablet', icon: UserCheck, badge: 'Advisor Desk' },
    { id: 'parts', label: 'Indore Parts Swarm', icon: Network, badge: '90m ETA', highlight: true },
    { id: 'shield', label: 'AI Warranty Shield', icon: ShieldCheck, badge: 'Zero-Reject' },
    { id: 'techdiag', label: 'Tech Guided Terminal', icon: Wrench, badge: 'FTR 95%+' },
    { id: 'ew', label: 'EW Configurator', icon: ShieldCheck, badge: '+₹4.2L/mo' },
    { id: 'campaigns', label: 'Marketing Drives', icon: Radio, badge: 'Win-Back' },
    { id: 'leaderboard', label: 'Staff Leaderboard', icon: TrendingUp, badge: 'Gamified' },
    { id: 'valueclub', label: 'Indore Value Club', icon: Award, badge: 'Post-Yr 3' },
    { id: 'ccm', label: 'CCM Escalation Radar', icon: AlertTriangle, badge: 'OEM Alert' },
    { id: 'cre', label: 'AI Telephony CRM', icon: PhoneCall, badge: 'Calling Desk' },
    { id: 'bays', label: 'Floor & Bay Grid', icon: LayoutGrid, badge: 'Sequencer' },
    { id: 'roi', label: 'Dealer ROI Math', icon: TrendingUp, badge: '+₹16L/mo' }
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Dealership branding */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-blue-950">
                  NatureXpress
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  TATA DEALERSHIP OS • ENTERPRISE EDITION
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                <span className="font-semibold text-slate-800">{dealership?.name || 'Sanghi Brothers Tata Motors'}</span>
                <span>•</span>
                <span>{dealership?.cluster || 'Indore Territory Cluster'}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Hub & Part B Modules */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* MD Morning Briefing */}
            <button
              onClick={() => setShowMDBriefingModal(true)}
              title="Daily 8:45 AM Executive WhatsApp Briefing (Point B4)"
              className="hidden lg:flex items-center space-x-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span>MD Briefing</span>
            </button>

            {/* Tata Care+ Insurance */}
            <button
              onClick={() => setShowInsuranceModal(true)}
              title="Tata Care+ Insurance Renewal Upsell (Point B1)"
              className="hidden lg:flex items-center space-x-1 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Insurance</span>
            </button>

            {/* Drip Campaigns */}
            <button
              onClick={() => setShowDripModal(true)}
              title="Post-Service WhatsApp Drip Sequences (Point B3)"
              className="hidden xl:flex items-center space-x-1 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Drip Nurture</span>
            </button>

            {/* Loyalty Wallet */}
            <button
              onClick={() => setShowLoyaltyModal(true)}
              title="Tata Seva Loyalty Points (Point B5)"
              className="hidden xl:flex items-center space-x-1 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-xl border border-purple-200 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Seva Points</span>
            </button>

            {/* CSV Export Button */}
            <a
              href="/api/reports/export-csv?type=job_cards"
              download="Tata_Sanghi_JobCards.csv"
              title="Export Job Cards to Excel/CSV (Point B9)"
              className="hidden md:flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </a>

            {/* Demo Sandbox Trigger */}
            <button
              onClick={() => setShowSandboxModal(true)}
              title="Pitch Demo Sandbox Scenario Injector (Point B10)"
              className="flex items-center space-x-1 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sandbox</span>
            </button>

            {/* Multi-Tenant Role Switcher Profile */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              <span className="text-base">{currentUser?.avatar || '👑'}</span>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-bold text-slate-900 leading-none">{currentUser?.name?.split(' ')[0] || 'Chetan'}</div>
                <div className="text-[9px] text-blue-700 uppercase font-mono">{currentUser?.role?.replace('_', ' ') || 'DEALER PRINCIPAL'}</div>
              </div>
            </button>

            {/* Demo Reset Button */}
            <button
              onClick={onResetDemoData}
              title="Reset Demo Data to Pristine State"
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl border border-slate-300 hover:border-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Desktop Scrollable) */}
        <div className="hidden md:flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-2 bg-white">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => { setShowMDBriefingModal(true); setMobileMenuOpen(false); }}
                className="p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold text-center"
              >
                📱 MD Briefing
              </button>
              <button
                onClick={() => { setShowInsuranceModal(true); setMobileMenuOpen(false); }}
                className="p-2 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold text-center"
              >
                🛡️ Tata Care+ Insurance
              </button>
              <button
                onClick={() => { setShowDripModal(true); setMobileMenuOpen(false); }}
                className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold text-center"
              >
                📬 Drip Sequences
              </button>
              <button
                onClick={() => { setShowLoyaltyModal(true); setMobileMenuOpen(false); }}
                className="p-2 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold text-center"
              >
                ⭐ Seva Points
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1.5 p-2 rounded-lg text-xs font-semibold text-left ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onSelectUser={onSelectUser}
      />

      <WhatsAppGatewayModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />

      <CSIIntegrityShield
        isOpen={showCsiModal}
        onClose={() => setShowCsiModal(false)}
      />

      <GSTInvoiceModal
        jobCardId="jc-4020"
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />

      <TataCareInsuranceModal
        isOpen={showInsuranceModal}
        onClose={() => setShowInsuranceModal(false)}
      />

      <DripCampaignsModal
        isOpen={showDripModal}
        onClose={() => setShowDripModal(false)}
      />

      <MDBriefingModal
        isOpen={showMDBriefingModal}
        onClose={() => setShowMDBriefingModal(false)}
      />

      <LoyaltyWalletModal
        isOpen={showLoyaltyModal}
        onClose={() => setShowLoyaltyModal(false)}
      />

      <DemoSandboxModal
        isOpen={showSandboxModal}
        onClose={() => setShowSandboxModal(false)}
        onScenarioInjected={onDataRefresh}
      />
    </header>
  );
}
