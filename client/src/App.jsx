import React, { useState, useEffect } from 'react';
import EnterpriseHeader from './components/EnterpriseHeader';
import EnterpriseSidebar from './components/EnterpriseSidebar';

// Executive Suite Views & Command Center
import DealerCommandCenter from './components/DealerCommandCenter';
import ActionCenter from './components/ActionCenter';
import AuditLedgerConsole from './components/AuditLedgerConsole';
import MDBriefingModal from './components/MDBriefingModal';
import ROIProfitCalculator from './components/ROIProfitCalculator';
import CCMRadar from './components/CCMRadar';
import CSIIntegrityShield from './components/CSIIntegrityShield';
import OEMBatchDefectRadar from './components/OEMBatchDefectRadar';

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

// Spares & AI Warranty Views
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

// Fallback Initial State for zero-latency instant rendering
const DEFAULT_DEALERSHIP = {
  id: "sanghi-indore-01",
  name: "Sanghi Brothers (Tata Motors)",
  cluster: "Indore Central - Bypass & Manorama Ganj",
  phone: "+91 731 4055000",
  verifiedWhatsApp: "+91 98930 11223",
  activeBays: 18,
  totalTechnicians: 24,
  liveThroughputToday: 42
};

const DEFAULT_USER = {
  id: "usr-01",
  name: "Chetan Sanghi",
  email: "chetan@sanghitata.in",
  role: "DEALER_PRINCIPAL",
  title: "Managing Director / Dealer Principal",
  avatar: "👑"
};

export default function App() {
  const [activeRole, setActiveRole] = useState('EXECUTIVE');
  const [activeTab, setActiveTab] = useState('exec_command');
  const [currentUser, setCurrentUser] = useState(DEFAULT_USER);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Enterprise Master Header */}
      <EnterpriseHeader
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        dealership={dealership}
        currentUser={currentUser}
        wsConnected={wsConnected}
        onSelectUser={setCurrentUser}
        onResetDemoData={handleResetDemoData}
        onDataRefresh={fetchData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobCards={jobCards}
        ccmAlerts={ccmAlerts}
        partsPool={partsPool}
      />

      {/* Enterprise Layout: Sidebar + Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <EnterpriseSidebar
          activeRole={activeRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dealership={dealership}
          jobCards={jobCards}
          ccmAlerts={ccmAlerts}
          partsPool={partsPool}
          warrantyClaims={warrantyClaims}
          revenueOpportunities={revenueOpportunities}
          revenueRadar={revenueRadar}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 bg-slate-100/90 text-slate-900 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ========================================================= */}
            {/* 1. EXECUTIVE COMMAND SUITE & REVENUE RADAR */}
            {/* ========================================================= */}
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
              <ServiceAdvisorPortal
                jobCards={jobCards}
                dealership={dealership}
                onJobCardCreated={fetchData}
              />
            )}

            {activeTab === 'sa_insurance' && (
              <TataCareInsuranceModal inline={true} />
            )}

            {activeTab === 'sa_accessories' && (
              <AccessoryCatalogModal inline={true} jobCards={jobCards} onAccessoryAdded={fetchData} />
            )}

            {activeTab === 'sa_invoice' && (
              <GSTInvoiceModal inline={true} jobCards={jobCards} />
            )}

            {activeTab === 'sa_leaderboard' && (
              <StaffLeaderboard leaderboard={leaderboard} />
            )}

            {/* ========================================================= */}
            {/* 3. WORKSHOP FLOOR & BAYS */}
            {/* ========================================================= */}
            {activeTab === 'workshop_grid' && (
              <CSPBayGanttScheduler
                dealership={dealership}
                jobCards={jobCards}
                onAdvanceStage={handleAdvanceStage}
                onDataRefresh={fetchData}
              />
            )}

            {activeTab === 'workshop_diag' && (
              <TechDiagnosticTerminal />
            )}

            {activeTab === 'workshop_roadtest' && (
              <RoadTestModal inline={true} jobCards={jobCards} onRoadTestPassed={fetchData} />
            )}

            {/* ========================================================= */}
            {/* 4. SPARES & AI WARRANTY FORTRESS */}
            {/* ========================================================= */}
            {activeTab === 'spares_swarm' && (
              <InterDealerPartsSwarm
                partsPool={partsPool}
                deadStock={deadStock}
                territoryStats={territoryStats}
                onDispatchRunner={handleDispatchRunner}
                onLiquidateDeadStock={handleLiquidateDeadStock}
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

      {/* Enterprise Bottom Status Bar */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-2.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">NatureXpress Dealership OS</span>
          <span>•</span>
          <span>Sanghi Brothers Indore Cluster Edition</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">18 Bays Active</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Session ID: SANGHI-IND-20261005 • Realtime WebSockets: {wsConnected ? 'Connected' : 'Offline'}
        </div>
      </footer>
    </div>
  );
}
