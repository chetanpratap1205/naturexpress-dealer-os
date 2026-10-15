import React, { useState, useEffect } from 'react';
import EnterpriseHeader from './components/EnterpriseHeader';
import EnterpriseSidebar from './components/EnterpriseSidebar';
import { Layers, Zap, UserCheck, LayoutGrid, Smartphone, Menu } from 'lucide-react';

// Phase 2: Valet Identity & Customer Trust Layer
import CustomerServiceTracker from './components/CustomerServiceTracker';
import ValetIdentityCard from './components/ValetIdentityCard';
import PickupSchedulerDesk from './components/PickupSchedulerDesk';

// Phase 3: Public Dealership Showroom & Customer Portal
import ShyamAutomotivePortal from './components/ShyamAutomotivePortal';

// Executive Suite Views & Command Center
import DealerCommandCenter from './components/DealerCommandCenter';
import ActionCenter from './components/ActionCenter';
import AuditLedgerConsole from './components/AuditLedgerConsole';
import MDBriefingModal from './components/MDBriefingModal';
import ROIProfitCalculator from './components/ROIProfitCalculator';
import CCMRadar from './components/CCMRadar';
import CSIIntegrityShield from './components/CSIIntegrityShield';
import OEMBatchDefectRadar from './components/OEMBatchDefectRadar';

// Enterprise V2 Production Views
import EnterpriseAuthScreen from './components/EnterpriseAuthScreen';
import ServiceAdvisorIntakeDesk from './components/ServiceAdvisorIntakeDesk';
import CustomerEstimateApprovalView from './components/CustomerEstimateApprovalView';
import TechBayTerminal from './components/TechBayTerminal';
import PartsStoreDesk from './components/PartsStoreDesk';
import BillingGatePassDesk from './components/BillingGatePassDesk';
import WarrantyFortressDesk from './components/WarrantyFortressDesk';
import ExecutivePnLDesk from './components/ExecutivePnLDesk';

// Service Advisor Desk Views
import ServiceAdvisorPortal from './components/ServiceAdvisorPortal';
import TataCareInsuranceModal from './components/TataCareInsuranceModal';
import AccessoryCatalogModal from './components/AccessoryCatalogModal';
import GSTInvoiceModal from './components/GSTInvoiceModal';
import StaffLeaderboard from './components/StaffLeaderboard';

// Workshop Floor & Bay Views
import CSPBayGanttScheduler from './components/CSPBayGanttScheduler';
import WorkshopBayGrid from './components/WorkshopBayGrid';
import TechDiagnosticTerminal from './components/TechDiagnosticTerminal';
import RoadTestModal from './components/RoadTestModal';

// Spares & Warranty Fortress Views
import InterDealerPartsSwarm from './components/InterDealerPartsSwarm';
import PartsBinScannerModal from './components/PartsBinScannerModal';
import AIWarrantyShield from './components/AIWarrantyShield';
import EDmsBridgeConsole from './components/EDmsBridgeConsole';

// Revenue & Growth Views
import EWConfigurator from './components/EWConfigurator';
import CRETelephonyCRM from './components/CRETelephonyCRM';
import DripCampaignsModal from './components/DripCampaignsModal';
import IndoreValueClub from './components/IndoreValueClub';
import LoyaltyWalletModal from './components/LoyaltyWalletModal';
import AutomatedCampaigns from './components/AutomatedCampaigns';

// Customer Live Experience
import CustomerCockpit from './components/CustomerCockpit';
import CustomerSuperApp from './components/CustomerSuperApp';

// Operations Specialists Command Hub & Desks
import SpecialistsHubModal from './components/SpecialistsHubModal';
import FloatingSpecialistDock from './components/FloatingSpecialistDock';
import DealerPrincipalAgentModal from './components/DealerPrincipalAgentModal';
import WorksManagerAgentModal from './components/WorksManagerAgentModal';
import TechAgentModal from './components/TechAgentModal';
import PartsStoreAgentModal from './components/PartsStoreAgentModal';
import WarrantyAgentModal from './components/WarrantyAgentModal';
import CCMAgentModal from './components/CCMAgentModal';
import CREAgentModal from './components/CREAgentModal';
import BillingCashierAgentModal from './components/BillingCashierAgentModal';
import ServiceAdvisorAgentModal from './components/ServiceAdvisorAgentModal';
import CarOwnerAgentModal from './components/CarOwnerAgentModal';

// Fallback Initial State for zero-latency instant rendering
const DEFAULT_DEALERSHIP = {
  id: "shyam-scheme-140",
  name: "Shyam Automotive (Tata Motors)",
  cluster: "Indore East - Scheme 140 & Bicholi Mardana (Opp Agarwal Public School)",
  address: "Infront of Agarwal Public School, Khasra No.15/3/4, Scheme No 140 Main Rd, Bicholi Mardana Rd, Indore, MP 452016",
  phone: "+91 88798 97825",
  verifiedWhatsApp: "+91 88798 97825",
  activeBays: 18,
  totalTechnicians: 22,
  liveThroughputToday: 42,
  googleRating: 4.9,
  googleReviews: 1237,
  website: "https://automotive.naturexpress.in",
  mdName: "Shyam Singhal",
  mdPhone: "+91 88798 97825"
};

const DEFAULT_USER = {
  id: "usr-01",
  name: "Shyam Singhal",
  email: "md@shyamautomotive.com",
  role: "DEALER_PRINCIPAL",
  title: "Managing Director / Dealer Principal",
  avatar: "👑"
};

export default function App() {
  // 1. Zero-Install Customer Deep Link Interceptors
  // Handles: /#/view/estimate/:token, /#/track/:token, /#/pickup/:token
  const [customerToken, setCustomerToken] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/view/estimate/')) {
      return hash.replace('#/view/estimate/', '').split('?')[0];
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || null;
  });

  const [serviceTrackToken, setServiceTrackToken] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/track/')) return hash.replace('#/track/', '').split('?')[0];
    return null;
  });

  const [pickupTrackToken, setPickupTrackToken] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#/pickup/')) return hash.replace('#/pickup/', '').split('?')[0];
    return null;
  });

  // Phase 3: Public Showroom vs Internal Dealer OS Portal Toggle
  const [showStaffPortal, setShowStaffPortal] = useState(() => {
    const hash = window.location.hash || '';
    return hash.startsWith('#/portal') || hash.startsWith('#/staff');
  });

  // Customer Mobile Super-App & Garage Hub Toggle
  const [showCustomerSuperApp, setShowCustomerSuperApp] = useState(() => {
    const hash = window.location.hash || '';
    return hash.startsWith('#/app') || hash.startsWith('#/garage') || hash.startsWith('#/customer');
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#/view/estimate/')) {
        setCustomerToken(hash.replace('#/view/estimate/', '').split('?')[0]);
        setServiceTrackToken(null); setPickupTrackToken(null);
      } else if (hash.startsWith('#/track/')) {
        setServiceTrackToken(hash.replace('#/track/', '').split('?')[0]);
        setCustomerToken(null); setPickupTrackToken(null);
      } else if (hash.startsWith('#/pickup/')) {
        setPickupTrackToken(hash.replace('#/pickup/', '').split('?')[0]);
        setCustomerToken(null); setServiceTrackToken(null);
      } else if (hash.startsWith('#/app') || hash.startsWith('#/garage') || hash.startsWith('#/customer')) {
        setShowCustomerSuperApp(true);
        setShowStaffPortal(false);
        setCustomerToken(null); setServiceTrackToken(null); setPickupTrackToken(null);
      } else if (hash.startsWith('#/portal') || hash.startsWith('#/staff')) {
        setShowStaffPortal(true);
        setShowCustomerSuperApp(false);
        setCustomerToken(null); setServiceTrackToken(null); setPickupTrackToken(null);
      } else if (hash === '' || hash === '#/' || hash.startsWith('#/home') || hash.startsWith('#/showroom')) {
        setShowStaffPortal(false);
        setShowCustomerSuperApp(false);
        setCustomerToken(null); setServiceTrackToken(null); setPickupTrackToken(null);
      } else {
        const params = new URLSearchParams(window.location.search);
        setCustomerToken(params.get('token') || null);
        setServiceTrackToken(null); setPickupTrackToken(null);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // 2. Strict Role-Based Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('nx_token');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nx_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  });

  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('nx_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'SERVICE_ADVISOR') return 'WORKSHOP';
        if (u.role === 'FLOOR_TECHNICIAN') return 'WORKSHOP';
        if (u.role === 'PARTS_MANAGER') return 'SPARES';
        if (u.role === 'BILLING_CASHIER') return 'GROWTH';
      }
    } catch (e) {}
    return 'EXECUTIVE';
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('nx_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'SERVICE_ADVISOR') return 'sa_intake';
        if (u.role === 'FLOOR_TECHNICIAN') return 'workshop_grid';
        if (u.role === 'PARTS_MANAGER') return 'spares_swarm';
        if (u.role === 'BILLING_CASHIER') return 'sa_invoice';
      }
    } catch (e) {}
    return 'exec_command';
  });

  const handleLoginSuccess = (user, token, branch) => {
    localStorage.setItem('nx_user', JSON.stringify(user));
    localStorage.setItem('nx_token', token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (branch) setDealership(branch);

    if (user.role === 'SERVICE_ADVISOR') {
      setActiveRole('WORKSHOP');
      setActiveTab('sa_intake');
    } else if (user.role === 'FLOOR_TECHNICIAN') {
      setActiveRole('WORKSHOP');
      setActiveTab('workshop_grid');
    } else if (user.role === 'PARTS_MANAGER') {
      setActiveRole('SPARES');
      setActiveTab('spares_swarm');
    } else if (user.role === 'BILLING_CASHIER') {
      setActiveRole('GROWTH');
      setActiveTab('sa_invoice');
    } else {
      setActiveRole('EXECUTIVE');
      setActiveTab('exec_command');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nx_user');
    localStorage.removeItem('nx_token');
    setIsAuthenticated(false);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dealership, setDealership] = useState(DEFAULT_DEALERSHIP);
  const [jobCards, setJobCards] = useState([]);
  const [selectedJcId, setSelectedJcId] = useState('jc-8899');
  const [ccmAlerts, setCcmAlerts] = useState([]);
  const [creLeads, setCreLeads] = useState([]);
  const [ewPackages, setEwPackages] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [valueClubMembers, setValueClubMembers] = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [partsPool, setPartsPool] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [territoryStats, setTerritoryStats] = useState(null);
  const [revenueOpportunities, setRevenueOpportunities] = useState([]);
  const [revenueRadar, setRevenueRadar] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [showSpecialistsHub, setShowSpecialistsHub] = useState(false);
  const [activeSpecialistModal, setActiveSpecialistModal] = useState(null);

  // Resilient master data fetcher
  const fetchData = async () => {
    try {
      const fetchSafe = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          return await res.json();
        } catch (e) {
          return null;
        }
      };

      const [
        dealerRes, jcRes, ccmRes, creRes, ewRes, campRes, 
        leadRes, vcRes, claimRes, partsRes, dsRes, terrRes,
        oppsRes, radarRes
      ] = await Promise.all([
        fetchSafe('/api/dealership'),
        fetchSafe('/api/job-cards'),
        fetchSafe('/api/ccm-radar'),
        fetchSafe('/api/cre-queue'),
        fetchSafe('/api/ew-packages'),
        fetchSafe('/api/campaigns'),
        fetchSafe('/api/leaderboard'),
        fetchSafe('/api/value-club'),
        fetchSafe('/api/warranty-claims'),
        fetchSafe('/api/inter-dealer-parts'),
        fetchSafe('/api/dead-stock'),
        fetchSafe('/api/territory-stats'),
        fetchSafe('/api/revenue-opportunities'),
        fetchSafe('/api/revenue-leakage')
      ]);

      if (dealerRes?.success) setDealership(dealerRes.data);
      if (jcRes?.success && Array.isArray(jcRes.data) && jcRes.data.length > 0) {
        setJobCards(jcRes.data);
        if (!selectedJcId) setSelectedJcId(jcRes.data[0].id);
      }
      if (ccmRes?.success) setCcmAlerts(ccmRes.data);
      if (creRes?.success) setCreLeads(creRes.data);
      if (ewRes?.success) setEwPackages(ewRes.data);
      if (campRes?.success) setCampaigns(campRes.data);
      if (leadRes?.success) setLeaderboard(leadRes.data);
      if (vcRes?.success) setValueClubMembers(vcRes.data);
      if (claimRes?.success) setWarrantyClaims(claimRes.data);
      if (partsRes?.success) setPartsPool(partsRes.data);
      if (dsRes?.success) setDeadStock(dsRes.data);
      if (terrRes?.success) setTerritoryStats(terrRes.data);
      if (oppsRes?.success) setRevenueOpportunities(oppsRes.data);
      if (radarRes?.success) setRevenueRadar(radarRes.data);
    } catch (err) {
      console.error("Error in fetchData", err);
    }
  };

  useEffect(() => {
    fetchData();

    // WebSocket real-time event listener
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'JOB_CARD_UPDATED' || data.event === 'JOB_CARD_CREATED') {
            fetchData();
          } else if (data.event === 'WHATSAPP_UPDATE') {
            fetchData();
          } else if (data.event === 'CCM_ALERT_CREATED' || data.event === 'CCM_ALERT_RESOLVED') {
            fetchData();
          } else if (data.event === 'REVENUE_OPPORTUNITY_RECOVERED' || data.event === 'REVENUE_LEAKAGE_UPDATED') {
            fetchData();
          } else if (data.event === 'DEAD_STOCK_LIQUIDATED' || data.event === 'BIN_CHECKED_OUT' || data.event === 'DATA_RESET' || data.event === 'SCENARIO_INJECTED') {
            fetchData();
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      ws.onclose = () => setWsConnected(false);
    } catch (e) {
      console.warn("WebSocket could not connect", e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Action Handlers
  const handleExecuteOpportunity = async (oppId) => {
    try {
      const res = await fetch(`/api/revenue-opportunities/${oppId}/execute-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };
  const handleApproveItem = async (jobCardId, videoItemId) => {
    try {
      const res = await fetch(`/api/job-cards/${jobCardId}/approve-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoItemId })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeclineItem = async (jobCardId, videoItemId) => {
    try {
      const res = await fetch(`/api/job-cards/${jobCardId}/decline-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoItemId })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveEW = async (jobCardId, tenure, amount, label) => {
    try {
      const res = await fetch(`/api/job-cards/${jobCardId}/approve-ew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenureYears: tenure, packageAmount: amount, packageLabel: label })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdvanceStage = async (jobCardId) => {
    try {
      const res = await fetch(`/api/job-cards/${jobCardId}/advance-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to advance stage");
      } else {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (jobCardId, message) => {
    try {
      const res = await fetch('/api/whatsapp/send-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId,
          content: message.content,
          sender: message.sender,
          senderName: message.senderName
        })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchRunner = async (partId, fromDealer, toDealer, jobCardId) => {
    try {
      const res = await fetch('/api/inter-dealer-parts/dispatch-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partId, fromDealer, toDealer, jobCardId })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLiquidateDeadStock = async (stockId) => {
    try {
      const res = await fetch(`/api/dead-stock/${stockId}/liquidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadWarrantyPhoto = async (claimId, photoType) => {
    try {
      const res = await fetch(`/api/warranty-claims/${claimId}/upload-evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoType, status: "VERIFIED" })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitWarrantyClaim = async (claimId) => {
    try {
      const res = await fetch(`/api/warranty-claims/${claimId}/submit-oem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnrollValueClubMember = async (memberData) => {
    try {
      const res = await fetch('/api/value-club/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchCampaign = async (campaignId) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const res = await fetch(`/api/ccm-radar/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleInterveneAlert = async (alertId, text) => {
    try {
      const res = await fetch(`/api/ccm-radar/${alertId}/intervene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interventionNote: text })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDemoData = async () => {
    if (window.confirm("Restore all seed data to pristine factory state?")) {
      try {
        const res = await fetch('/api/admin/reset-demo-data', { method: 'POST' });
        if (res.ok) {
          fetchData();
          alert("✓ Demo data cleanly restored to initial pristine state!");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (!user) return;
    switch (user.role) {
      case 'DEALER_PRINCIPAL':
        setActiveRole('EXECUTIVE');
        setActiveTab('exec_command');
        break;
      case 'SERVICE_ADVISOR':
        setActiveRole('WORKSHOP');
        setActiveTab('sa_intake');
        break;
      case 'MASTER_TECHNICIAN':
        setActiveRole('WORKSHOP');
        setActiveTab('workshop_diag');
        break;
      case 'WORKS_MANAGER':
        setActiveRole('WORKSHOP');
        setActiveTab('workshop_grid');
        break;
      case 'PARTS_MANAGER':
        setActiveRole('SPARES');
        setActiveTab('spares_swarm');
        break;
      case 'WARRANTY_OFFICER':
        setActiveRole('SPARES');
        setActiveTab('spares_warranty');
        break;
      case 'OEM_CCM':
        setActiveRole('SPARES');
        setActiveTab('exec_ccm');
        break;
      case 'CRE_SPECIALIST':
        setActiveRole('GROWTH');
        setActiveTab('growth_telephony');
        break;
      case 'BILLING_CASHIER':
        setActiveRole('WORKSHOP');
        setActiveTab('sa_invoice');
        break;
      case 'CAR_OWNER':
        setActiveRole('CUSTOMER');
        setActiveTab('customer_cockpit');
        break;
      default:
        setActiveRole('EXECUTIVE');
        setActiveTab('exec_command');
    }
  };

  // 1. Zero-Install Customer Estimate Deep Link View (No staff UI, no login)
  if (customerToken) {
    return <CustomerEstimateApprovalView token={customerToken} />;
  }

  // Phase 2A: Customer Service Tracker (No login — public link shared by SA)
  if (serviceTrackToken) {
    return <CustomerServiceTracker token={serviceTrackToken} />;
  }

  // Phase 2B: Valet Identity Card (No login — customer verifies valet before handing keys)
  if (pickupTrackToken) {
    return <ValetIdentityCard token={pickupTrackToken} />;
  }

  // Customer Mobile Super-App & Garage Hub (Google OAuth 2.0)
  if (showCustomerSuperApp) {
    return (
      <CustomerSuperApp
        onBackToShowroom={() => {
          window.location.hash = '';
          setShowCustomerSuperApp(false);
        }}
        onOpenStaffPortal={() => {
          window.location.hash = '#/portal';
          setShowCustomerSuperApp(false);
          setShowStaffPortal(true);
        }}
      />
    );
  }

  // Phase 3: Public Dealership Showroom & Customer Portal
  // If not explicitly navigating to the staff portal, show the public showroom portal
  if (!showStaffPortal) {
    return (
      <ShyamAutomotivePortal
        onOpenStaffPortal={() => {
          window.location.hash = '#/portal';
          setShowStaffPortal(true);
        }}
        onOpenCustomerApp={() => {
          window.location.hash = '#/app';
          setShowCustomerSuperApp(true);
        }}
        currentUser={isAuthenticated ? currentUser : null}
      />
    );
  }

  // 2. Strict Staff Floor Terminal PIN Login Gate (when accessing staff portal)
  if (!isAuthenticated) {
    return (
      <EnterpriseAuthScreen
        onLoginSuccess={handleLoginSuccess}
        onBackToShowroom={() => {
          window.location.hash = '';
          setShowStaffPortal(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Enterprise Master Header */}
      <EnterpriseHeader
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        dealership={dealership}
        currentUser={currentUser}
        wsConnected={wsConnected}
        onSelectUser={handleSelectUser}
        onResetDemoData={handleResetDemoData}
        onDataRefresh={fetchData}
        onLogout={handleLogout}
        onOpenShowroom={() => {
          window.location.hash = '';
          setShowStaffPortal(false);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobCards={jobCards}
        ccmAlerts={ccmAlerts}
        partsPool={partsPool}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        onOpenSpecialistsHub={() => setShowSpecialistsHub(true)}
      />

      {/* Enterprise Layout: Sidebar + Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <EnterpriseSidebar
          activeRole={activeRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dealership={dealership}
          currentUser={currentUser}
          jobCards={jobCards}
          ccmAlerts={ccmAlerts}
          partsPool={partsPool}
          warrantyClaims={warrantyClaims}
          revenueOpportunities={revenueOpportunities}
          revenueRadar={revenueRadar}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 bg-slate-100/90 text-slate-900 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ========================================================= */}
            {/* 1. EXECUTIVE COMMAND SUITE & REVENUE RADAR */}
            {/* ========================================================= */}
            {activeTab === 'executive_pnl' && (
              <ExecutivePnLDesk
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'exec_command' && (
              <DealerCommandCenter
                dealership={dealership}
                jobCards={jobCards}
                ccmAlerts={ccmAlerts}
                warrantyClaims={warrantyClaims}
                partsPool={partsPool}
                onNavigateTab={setActiveTab}
                onExecuteOpportunity={handleExecuteOpportunity}
                revenueOpportunities={revenueOpportunities}
                revenueRadar={revenueRadar}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'growth_action_center' && (
              <ActionCenter
                dealership={dealership}
                revenueOpportunities={revenueOpportunities}
                revenueRadar={revenueRadar}
                onExecuteOpportunity={handleExecuteOpportunity}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'exec_briefing' && (
              <MDBriefingModal inline={true} />
            )}

            {activeTab === 'exec_roi' && (
              <ROIProfitCalculator dealership={dealership} />
            )}

            {activeTab === 'exec_audit' && (
              <AuditLedgerConsole dealership={dealership} onDataRefresh={fetchData} />
            )}

            {activeTab === 'exec_ccm' && (
              <CCMRadar
                alerts={ccmAlerts}
                onIntervene={handleInterveneAlert}
                onResolveAlert={handleResolveAlert}
              />
            )}

            {activeTab === 'exec_csi' && (
              <CSIIntegrityShield inline={true} />
            )}

            {activeTab === 'exec_batch_defect' && (
              <OEMBatchDefectRadar inline={true} />
            )}

            {/* ========================================================= */}
            {/* 2. SERVICE ADVISOR DESK */}
            {/* ========================================================= */}
            {activeTab === 'sa_intake' && (
              <ServiceAdvisorIntakeDesk
                currentUser={currentUser}
                onJobCardCreated={fetchData}
              />
            )}

            {/* Phase 2: Valet Pickup Scheduler */}
            {activeTab === 'pickup_scheduler' && (
              <PickupSchedulerDesk
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'sa_insurance' && (
              <TataCareInsuranceModal inline={true} />
            )}

            {activeTab === 'sa_accessories' && (
              <AccessoryCatalogModal inline={true} jobCards={jobCards} onAccessoryAdded={fetchData} />
            )}

            {activeTab === 'sa_invoice' && (
              <GSTInvoiceModal inline={true} jobCards={jobCards} onDataRefresh={fetchData} />
            )}

            {activeTab === 'sa_leaderboard' && (
              <StaffLeaderboard leaderboard={leaderboard} />
            )}

            {/* ========================================================= */}
            {/* 3. WORKSHOP FLOOR & BAYS */}
            {/* ========================================================= */}
            {activeTab === 'workshop_terminal' && (
              <TechBayTerminal
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'billing_gatepass' && (
              <BillingGatePassDesk
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'workshop_grid' && (
              <CSPBayGanttScheduler
                dealership={dealership}
                jobCards={jobCards}
                onAdvanceStage={handleAdvanceStage}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'workshop_diag' && (
              <TechDiagnosticTerminal onDataRefresh={fetchData} />
            )}

            {activeTab === 'workshop_roadtest' && (
              <RoadTestModal inline={true} jobCards={jobCards} onRoadTestPassed={fetchData} />
            )}

            {/* ========================================================= */}
            {/* 4. SPARES & WARRANTY FORTRESS */}
            {/* ========================================================= */}
            {activeTab === 'parts_store' && (
              <PartsStoreDesk
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'warranty_fortress' && (
              <WarrantyFortressDesk
                currentUser={currentUser}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'spares_swarm' && (
              <InterDealerPartsSwarm
                partsPool={partsPool}
                deadStock={deadStock}
                territoryStats={territoryStats}
                onDispatchRunner={handleDispatchRunner}
                onLiquidateDeadStock={handleLiquidateDeadStock}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'spares_scanner' && (
              <PartsBinScannerModal inline={true} jobCards={jobCards} onPartCheckedOut={fetchData} />
            )}

            {activeTab === 'spares_warranty' && (
              <AIWarrantyShield
                warrantyClaims={warrantyClaims}
                onUploadPhoto={handleUploadWarrantyPhoto}
                onSubmitClaim={handleSubmitWarrantyClaim}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'spares_edms' && (
              <EDmsBridgeConsole inline={true} />
            )}

            {/* ========================================================= */}
            {/* 5. REVENUE & GROWTH ENGINES */}
            {/* ========================================================= */}
            {activeTab === 'growth_ew' && (
              <EWConfigurator
                ewPackages={ewPackages}
                jobCards={jobCards}
                onSendEWProposal={fetchData}
              />
            )}

            {activeTab === 'growth_telephony' && (
              <CRETelephonyCRM
                creQueue={creLeads}
                onNudge={fetchData}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'growth_drips' && (
              <DripCampaignsModal inline={true} />
            )}

            {activeTab === 'growth_valueclub' && (
              <IndoreValueClub
                members={valueClubMembers}
                onEnrollMember={handleEnrollValueClubMember}
              />
            )}

            {activeTab === 'growth_loyalty' && (
              <LoyaltyWalletModal inline={true} />
            )}

            {/* ========================================================= */}
            {/* 6. LIVE TATA CUSTOMER EXPERIENCE */}
            {/* ========================================================= */}
            {activeTab === 'customer_cockpit' && (
              <CustomerCockpit
                jobCards={jobCards}
                selectedJcId={selectedJcId}
                setSelectedJcId={setSelectedJcId}
                onApproveItem={handleApproveItem}
                onDeclineItem={handleDeclineItem}
                onApproveEW={handleApproveEW}
                onSendMessage={handleSendMessage}
                onAdvanceStage={handleAdvanceStage}
              />
            )}

          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Action Bar (visible only on mobile/tablet) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-slate-500 shadow-lg">
        <button
          onClick={() => setActiveTab('exec_command')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'exec_command' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Command</span>
        </button>

        <button
          onClick={() => setActiveTab('growth_action_center')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
            activeTab === 'growth_action_center' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Actions</span>
          {revenueOpportunities.filter(o => o.status !== 'RECOVERED').length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sa_intake')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'sa_intake' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Intake</span>
        </button>

        <button
          onClick={() => setActiveTab('workshop_grid')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'workshop_grid' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">18-Bays</span>
        </button>

        <button
          onClick={() => setActiveTab('customer_cockpit')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'customer_cockpit' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Customer</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5 text-slate-600" />
          <span className="text-[10px] mt-0.5">All Menu</span>
        </button>
      </nav>

      {/* Enterprise Bottom Status Bar (Desktop) */}
      <footer className="hidden lg:flex border-t border-slate-200 bg-white px-6 py-2.5 text-xs text-slate-500 items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-800">Shyam Automotive • Tata Motors Dealership OS</span>
          <span>•</span>
          <span>Scheme 140 Flagship Hub (Indore)</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">18 Bays Active</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Session ID: SHYAM-SCHEME140 • Realtime WebSockets: {wsConnected ? 'Connected' : 'Offline'}
        </div>
      </footer>
      {/* Floating Operations Specialist Quick-Action Dock */}
      <FloatingSpecialistDock
        activeTab={activeTab}
        onOpenSpecialist={(id) => setActiveSpecialistModal(id)}
        onOpenHub={() => setShowSpecialistsHub(true)}
      />

      {/* Operations Specialists Hub Master Command Modal */}
      <SpecialistsHubModal
        isOpen={showSpecialistsHub}
        onClose={() => setShowSpecialistsHub(false)}
        onOpenSpecialist={(id) => setActiveSpecialistModal(id)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (['exec_command', 'executive_pnl', 'exec_briefing', 'exec_roi', 'exec_audit'].includes(tab)) setActiveRole('EXECUTIVE');
          else if (['growth_action_center', 'growth_ew', 'growth_telephony', 'growth_drips', 'growth_valueclub', 'growth_loyalty'].includes(tab)) setActiveRole('GROWTH');
          else if (['workshop_grid', 'workshop_diag', 'sa_intake', 'sa_invoice', 'pickup_scheduler'].includes(tab)) setActiveRole('WORKSHOP');
          else if (['spares_swarm', 'spares_scanner', 'spares_warranty', 'spares_edms', 'exec_ccm', 'exec_csi'].includes(tab)) setActiveRole('SPARES');
          else if (['customer_cockpit'].includes(tab)) setActiveRole('CUSTOMER');
        }}
      />

      {/* Global Specialist Desks Modals (Accessible from Hub and Floating Dock) */}
      <DealerPrincipalAgentModal
        isOpen={activeSpecialistModal === 'dealerPrincipal'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <WorksManagerAgentModal
        isOpen={activeSpecialistModal === 'worksManager'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <TechAgentModal
        isOpen={activeSpecialistModal === 'floorTech'}
        onClose={() => setActiveSpecialistModal(null)}
        technicianName={currentUser?.name || "Ramesh Sonawane"}
        onDataRefresh={fetchData}
      />
      <PartsStoreAgentModal
        isOpen={activeSpecialistModal === 'partsStore'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <WarrantyAgentModal
        isOpen={activeSpecialistModal === 'warranty'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <CCMAgentModal
        isOpen={activeSpecialistModal === 'ccm'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <CREAgentModal
        isOpen={activeSpecialistModal === 'cre'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <BillingCashierAgentModal
        isOpen={activeSpecialistModal === 'billing'}
        onClose={() => setActiveSpecialistModal(null)}
        onDataRefresh={fetchData}
      />
      <ServiceAdvisorAgentModal
        isOpen={activeSpecialistModal === 'serviceAdvisor'}
        onClose={() => setActiveSpecialistModal(null)}
        advisorName={currentUser?.name || "Rahul Sharma"}
        onDataRefresh={fetchData}
      />
      <CarOwnerAgentModal
        isOpen={activeSpecialistModal === 'carOwner'}
        onClose={() => setActiveSpecialistModal(null)}
        jobCard={jobCards?.find(j => j.id === selectedJcId) || jobCards?.[0]}
        onDataRefresh={fetchData}
      />
    </div>
  );
}
