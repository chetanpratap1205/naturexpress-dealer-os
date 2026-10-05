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
  AlertTriangle
} from 'lucide-react';
import AuthModal from './AuthModal';
import WhatsAppGatewayModal from './WhatsAppGatewayModal';
import DemoSandboxModal from './DemoSandboxModal';

export default function EnterpriseHeader({
  activeRole,
  setActiveRole,
  dealership,
  currentUser,
  wsConnected,
  onSelectUser,
  onResetDemoData,
  onDataRefresh,
  activeTab,
  setActiveTab,
  jobCards = [],
  ccmAlerts = [],
  partsPool = []
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Role personas configuration
  const ROLES = [
    { id: 'EXECUTIVE', label: '1. Executive Command (MD / GM)', icon: '👑', defaultTab: 'exec_command', subtitle: 'Command Center, Leakage Radar, MD Briefing' },
    { id: 'GROWTH', label: '2. Revenue Recovery Engine', icon: '💰', defaultTab: 'growth_action_center', subtitle: 'Live Opportunities, Insurance, Accessories, EW' },
    { id: 'WORKSHOP', label: '3. Workshop & Bay Floor', icon: '🔧', defaultTab: 'workshop_grid', subtitle: '18-Bay CSP Balancer, Diagnostics, QC' },
    { id: 'SPARES', label: '4. Risk & Integrity Fortress', icon: '🛡️', defaultTab: 'spares_warranty', subtitle: 'AI Warranty Lock, CCM Radar, Parts Swarm' },
    { id: 'CUSTOMER', label: 'Customer Live Cockpit', icon: '📱', defaultTab: 'customer_cockpit', subtitle: '15-Sec Video Approvals & Live Link' }
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
      <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 select-none shadow-md">
        {/* Top Operational Telemetry Bar */}
        <div className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-300">TATA e-DMS Siebel SOAP:</span>
              <span className="text-emerald-400 font-mono">Sync Active (0.4s)</span>
            </div>
            <div className="hidden md:flex items-center space-x-1.5 border-l border-slate-800 pl-4">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                Daily Revenue Leakage Radar:
              </span>
              <span className="text-rose-300 font-mono font-bold">₹4.72L at Risk</span>
            </div>
            <div className="hidden lg:flex items-center space-x-1.5 border-l border-slate-800 pl-4">
              <span className="text-slate-400">Indore Virtual Pool:</span>
              <span className="text-blue-400 font-mono font-medium">4 Dealers Linked</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowWhatsAppModal(true)}
              className="text-[11px] font-medium text-slate-300 hover:text-emerald-400 flex items-center space-x-1 transition-colors bg-slate-800/60 px-2.5 py-0.5 rounded border border-slate-700/60"
            >
              <span>WhatsApp API</span>
            </button>
            <button 
              onClick={() => setShowSandboxModal(true)}
              className="text-[11px] font-bold text-amber-200 hover:text-amber-100 flex items-center space-x-1 transition-colors bg-gradient-to-r from-amber-600/80 to-orange-600/80 hover:from-amber-600 hover:to-orange-600 px-3 py-0.5 rounded-lg border border-amber-400/50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1 animate-pulse" />
              <span>⚡ Live Sales Simulation</span>
            </button>
            <button 
              onClick={onResetDemoData}
              title="Reset state to pristine factory seed"
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        </div>

        {/* Main Enterprise Navigation Header */}
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Dealership Identity with Multi-Branch Switcher */}
          <div className="flex items-center space-x-3 min-w-[280px]">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  NatureXpress
                </span>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  TATA DEALERSHIP OS
                </span>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                {/* Branch Switcher Select */}
                <select
                  value={dealership?.id || 'sanghi-bypass'}
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
                  className="bg-slate-950/90 text-xs font-semibold text-slate-200 border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="sanghi-bypass">Sanghi Bypass Flagship (18 Bays)</option>
                  <option value="sanghi-manorama">Sanghi Manorama Ganj (12 Bays)</option>
                  <option value="shyam-dewas">Shyam Dewas Rd Hub (14 Bays)</option>
                  <option value="jagdish-pithampur">Jagdish Pithampur Commercial (16 Bays)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role & Persona Workspace Switcher (The Core Enterprise Anchor) */}
          <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/90 shadow-inner">
            {ROLES.map((role) => {
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                  title={role.subtitle}
                >
                  <span className="text-sm">{role.icon}</span>
                  <span>{role.label.split('(')[0].trim()}</span>
                  {role.id === 'EXECUTIVE' && criticalAlertCount > 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {criticalAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Global Search */}
            <div className="relative hidden md:block w-56 xl:w-64">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search VIN, Reg, Name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Search dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(jc => (
                      <div 
                        key={jc.id}
                        onClick={() => {
                          setActiveTab('customer_cockpit');
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                        className="p-2 border-b border-slate-800/60 hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{jc.regNumber}</span>
                          <span className="text-[10px] text-blue-400 font-mono">{jc.model}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between mt-0.5">
                          <span>{jc.customerName}</span>
                          <span className="text-emerald-400 capitalize">{jc.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">No vehicle or customer found</div>
                  )}
                </div>
              )}
            </div>

            {/* Role Switcher for Mobile / Small Screens */}
            <div className="lg:hidden">
              <select
                value={activeRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.icon} {r.label}</option>
                ))}
              </select>
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 p-1.5 pr-2.5 rounded-lg text-xs transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.avatar || '👑'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-200 text-[11px] leading-tight">
                    {currentUser?.name || 'Chetan Sanghi'}
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                    {currentUser?.role?.replace('_', ' ') || 'Dealer Principal'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 text-slate-400">
                    <p className="font-semibold text-white">{currentUser?.name}</p>
                    <p className="text-[11px]">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Switch Role / User</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowWhatsAppModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Meta Cloud API Config</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSandboxModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-indigo-300 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pitch Demo Sandbox</span>
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      onResetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Factory Reset Demo Data</span>
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
      <WhatsAppGatewayModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
      <DemoSandboxModal
        isOpen={showSandboxModal}
        onClose={() => setShowSandboxModal(false)}
        onDataRefresh={onDataRefresh}
      />
    </>
  );
}
