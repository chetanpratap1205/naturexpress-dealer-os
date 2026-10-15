import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Bell, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  ChevronDown, 
  User, 
  Database,
  Smartphone,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  KeyRound
} from 'lucide-react';
import AuthModal from './AuthModal';
import DemoSandboxModal from './DemoSandboxModal';
import RapidPinSwitchModal from './RapidPinSwitchModal';
import WhatsAppGatewayModal from './WhatsAppGatewayModal';

export default function EnterpriseHeader({
  activeRole,
  setActiveRole,
  dealership,
  currentUser,
  wsConnected,
  onSelectUser,
  onResetDemoData,
  onDataRefresh,
  onLogout,
  onOpenShowroom,
  activeTab,
  setActiveTab,
  jobCards = [],
  ccmAlerts = [],
  partsPool = [],
  onToggleMobileMenu,
  mobileMenuOpen,
  onOpenSpecialistsHub
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRapidPinModal, setShowRapidPinModal] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Role personas configuration
  const ROLES = [
    { id: 'EXECUTIVE', label: '1. Executive Command', icon: '👑', defaultTab: 'exec_command', subtitle: 'Command Center, Leakage Radar, MD Briefing' },
    { id: 'GROWTH', label: '2. Revenue Recovery', icon: '💰', defaultTab: 'growth_action_center', subtitle: 'Live Opportunities, Insurance, Accessories, EW' },
    { id: 'WORKSHOP', label: '3. Workshop Floor', icon: '🔧', defaultTab: 'workshop_grid', subtitle: '18-Bay CSP Balancer, Diagnostics, QC' },
    { id: 'SPARES', label: '4. Risk & Integrity', icon: '🛡️', defaultTab: 'spares_warranty', subtitle: 'Warranty Fortress Lock, CCM Radar, Parts Swarm' },
    { id: 'CUSTOMER', label: 'Customer Cockpit', icon: '📱', defaultTab: 'customer_cockpit', subtitle: '15-Sec Video Approvals & Live Link' }
  ];

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    const target = ROLES.find(r => r.id === roleId);
    if (target) {
      setActiveTab(target.defaultTab);
    }
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const cleanQ = q.toLowerCase();
    const matches = jobCards.filter(jc => 
      jc.regNumber?.toLowerCase().includes(cleanQ) ||
      jc.regNo?.toLowerCase().includes(cleanQ) ||
      jc.customerName?.toLowerCase().includes(cleanQ) ||
      jc.model?.toLowerCase().includes(cleanQ) ||
      jc.id?.toLowerCase().includes(cleanQ) ||
      jc.vin?.toLowerCase().includes(cleanQ)
    ).slice(0, 5);
    
    setSearchResults(matches);
    setShowSearchDropdown(true);
  };

  const criticalAlertCount = (ccmAlerts || []).filter(a => a.sentimentScore > 0.7 || a.severity === 'high').length;

  return (
    <>
      <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">
        {/* Top Operational Telemetry Bar */}
        <div className="border-b border-slate-200 bg-slate-50/90 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-700">TATA e-DMS Siebel:</span>
              <span className="text-emerald-700 font-mono font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Live Sync (0.4s)</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 border-l border-slate-300 pl-3 shrink-0">
              <span className="text-blue-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Active Workshop Floor:
              </span>
              <span className="text-slate-800 font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                {jobCards?.length || 0} Job Cards In-Progress
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-1.5 border-l border-slate-300 pl-3 shrink-0 text-slate-500">
              <span className="font-semibold text-slate-700">Flagship Hub:</span>
              <span>Scheme 140, Bicholi Mardana Rd, Indore</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button 
              onClick={() => setShowWhatsAppModal(true)}
              className="text-[10px] sm:text-[11px] font-semibold text-slate-700 hover:text-emerald-700 flex items-center space-x-1 transition-colors bg-white hover:bg-slate-50 px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs cursor-pointer"
            >
              <span>WhatsApp API</span>
            </button>
            <button 
              onClick={() => setShowSandboxModal(true)}
              className="text-[10px] sm:text-[11px] font-bold text-amber-900 hover:text-amber-950 flex items-center space-x-1 transition-colors bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600 mr-1 animate-pulse" />
              <span className="hidden sm:inline">⚡ Live Simulation</span>
              <span className="sm:hidden">⚡ Demo</span>
            </button>
            <button 
              onClick={onResetDemoData}
              title="Reset state to pristine factory seed"
              className="text-[10px] sm:text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center space-x-1 transition-colors cursor-pointer px-1 py-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Main Enterprise Navigation Header */}
        <div className="px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Section: Mobile Hamburger + Shyam Automotive Tata Motors Logo + Branch Switcher */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dealership Logo & TATA Badge */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex flex-col items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/40 shrink-0 text-white">
              <span className="text-[10px] font-black tracking-widest leading-none">TATA</span>
              <span className="text-[9px] font-extrabold opacity-90 leading-none mt-0.5">MOTORS</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans">
                  Shyam Automotive
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  TATA DEALER OS
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  ★ 4.9 (1,237 reviews)
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[10px] text-slate-500 hidden md:inline">Branch:</span>
                <select
                  value={dealership?.id || 'shyam-scheme-140'}
                  onChange={async (e) => {
                    const newBranchId = e.target.value;
                    try {
                      const res = await fetch('/api/branches/switch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ branchId: newBranchId })
                      });
                      if (res.ok && onDataRefresh) onDataRefresh();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="bg-white text-[11px] sm:text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg px-2 py-0.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[150px] sm:max-w-none truncate shadow-2xs"
                >
                  <option value="shyam-scheme-140">Scheme 140 Hub (18 Bays) • Flagship</option>
                  <option value="shyam-dewas">Dewas Road Branch (14 Bays)</option>
                  <option value="shyam-rau">Rau Express Workshop (12 Bays)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Role & Persona Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            {ROLES.map((role) => {
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title={role.subtitle}
                >
                  <span className="text-sm">{role.icon}</span>
                  <span>{role.label}</span>
                  {role.id === 'EXECUTIVE' && criticalAlertCount > 0 && (
                    <span className="ml-1 bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {criticalAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search (Desktop) */}
            <div className="relative hidden md:block w-48 xl:w-60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search VIN, Reg, Name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-2xs"
                />
              </div>

              {/* Search dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(jc => (
                      <div 
                        key={jc.id}
                        onClick={() => {
                          setActiveTab('customer_cockpit');
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                        className="p-2 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{jc.regNumber || jc.regNo}</span>
                          <span className="text-[10px] text-blue-600 font-mono font-semibold">{jc.model}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                          <span>{jc.customerName}</span>
                          <span className="text-emerald-600 font-semibold capitalize">{jc.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">No vehicle found</div>
                  )}
                </div>
              )}
            </div>

            {/* View Public Showroom Button */}
            {onOpenShowroom && (
              <button
                onClick={onOpenShowroom}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="View Public Showroom & Booking Portal"
              >
                <span>🌐 Showroom Website</span>
              </button>
            )}

            {/* Customer Super-App Preview Button */}
            <button
              onClick={() => { window.location.hash = '#/app'; }}
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Preview My Tata Customer Super-App"
            >
              <span>🚗 Customer App</span>
            </button>

            {/* Operations Specialists Hub Launcher */}
            {onOpenSpecialistsHub && (
              <button
                onClick={onOpenSpecialistsHub}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg border border-blue-400/30 shrink-0"
                title="Operations Specialists Command Hub (10 Active Desks)"
              >
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                </div>
                <span className="hidden sm:inline">Specialists Hub</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-md font-mono">10</span>
              </button>
            )}

            {/* Phase 6: Workshop Floor Rapid PIN Switcher Pill */}
            <button
              onClick={() => setShowRapidPinModal(true)}
              className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="2-Second Tablet User PIN Handoff"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-700" />
              <span className="hidden sm:inline">Fast PIN</span>
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.avatar || '👑'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-800 text-[11px] leading-tight">
                    {currentUser?.name || 'Shyam Singhal'}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                    {currentUser?.role?.replace('_', ' ') || 'Dealer Principal'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 text-slate-600 bg-slate-50/50">
                    <p className="font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                  </div>
                  {onOpenShowroom && (
                    <button
                      onClick={() => {
                        onOpenShowroom();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-blue-700 hover:bg-blue-50 flex items-center space-x-2 cursor-pointer font-bold border-b border-slate-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Public Showroom Website</span>
                    </button>
                  )}
                  {onOpenSpecialistsHub && (
                    <button
                      onClick={() => {
                        onOpenSpecialistsHub();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-indigo-700 hover:bg-indigo-50 flex items-center space-x-2 cursor-pointer font-bold border-b border-slate-100"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Operations Specialists Hub (10)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Switch Role / User</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSandboxModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-indigo-700 hover:bg-indigo-50 flex items-center space-x-2 cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pitch Demo Sandbox</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      onResetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Factory Reset Demo Data</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-amber-700 hover:bg-amber-50 flex items-center space-x-2 cursor-pointer font-bold"
                  >
                    <span>🔒 Lock Terminal (Floor PIN Login)</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Global Context Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onSelectUser={onSelectUser}
      />
      <RapidPinSwitchModal
        isOpen={showRapidPinModal}
        onClose={() => setShowRapidPinModal(false)}
        currentUser={currentUser}
        onSwitchSuccess={(user, token, branch) => {
          if (onSelectUser) onSelectUser(user);
        }}
      />
      <DemoSandboxModal
        isOpen={showSandboxModal}
        onClose={() => setShowSandboxModal(false)}
        onDataRefresh={onDataRefresh}
      />
      <WhatsAppGatewayModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onWebhookSimulated={onDataRefresh}
      />
    </>
  );
}
