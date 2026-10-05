import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  Server,
  Shield,
  ArrowUpRight,
  Cpu,
  Layers,
  X,
  Code,
  AlertTriangle,
  Play,
  Send,
  FileCode,
  Terminal,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EDmsBridgeConsole({ isOpen = true, onClose, inline = false }) {
  const [status, setStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [simulatingLag, setSimulatingLag] = useState(false);
  const [activePacketTab, setActivePacketTab] = useState('REQUEST');
  const [selectedDocId, setSelectedDocId] = useState('SR-IND-2026-9921');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/edms/status');
      const data = await res.json();
      if (data.success) setStatus(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen || inline) fetchStatus();
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/edms/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 60, spread: 50 });
        setStatus(prev => ({
          ...prev,
          lastSuccessfulSync: data.data.syncedAt,
          morningPeakLagBypassedCount: (prev?.morningPeakLagBypassedCount || 0) + 1,
          pendingPackets: []
        }));
        setToastMessage("✓ All buffered Siebel SOAP packets synchronized successfully!");
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleLag = () => {
    setSimulatingLag(prev => !prev);
    setToastMessage(!simulatingLag 
      ? "⚠️ Simulated 9:30 AM Morning Peak Latency Spike (2400ms). Offline Resilient Buffer activated!"
      : "✓ e-DMS Latency normalized to 0.4s."
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sample Authentic Tata Motors Siebel SOAP XML Envelopes
  const sampleSoapRequestXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:sieb="http://siebel.com/CustomUI"
                  xmlns:tata="http://www.tatamotors.com/edms/service/v2">
  <soapenv:Header>
    <tata:AuthenticationToken>
      <tata:DealerCode>SNG-IND-01</tata:DealerCode>
      <tata:ClusterID>INDORE_CENTRAL_BYPASS</tata:ClusterID>
      <tata:SessionKey>SNG_TATA_SEC_9941_2026</tata:SessionKey>
    </tata:AuthenticationToken>
  </soapenv:Header>
  <soapenv:Body>
    <sieb:CreateOrUpdateJobCard_Input>
      <sieb:RepairOrderNumber>RO-SNG-2026-8899</sieb:RepairOrderNumber>
      <sieb:VIN>MAT621459P1N08899</sieb:VIN>
      <sieb:ChassisNumber>MAT621459P1N08899</sieb:ChassisNumber>
      <sieb:VehicleModel>Tata Nexon EV Empowered Plus (45 kWh)</sieb:VehicleModel>
      <sieb:OdometerReadingKm>24350</sieb:OdometerReadingKm>
      <sieb:CustomerDetails>
        <sieb:Name>Rajesh Verma</sieb:Name>
        <sieb:ContactMobile>+91 98260 44551</sieb:ContactMobile>
        <sieb:GSTIN>23AAAPV1420K1Z4</sieb:GSTIN>
      </sieb:CustomerDetails>
      <sieb:LabourOperationList>
        <sieb:LabourOp>
          <sieb:OpCode>08-010-001</sieb:OpCode>
          <sieb:Description>20,000 km EV Scheduled Inspection & BMS Flash</sieb:Description>
          <sieb:SacCode>998729</sieb:SacCode>
          <sieb:LabourRate>2200.00</sieb:LabourRate>
        </sieb:LabourOp>
      </sieb:LabourOperationList>
      <sieb:PartsRequisitionList>
        <sieb:PartItem>
          <sieb:PartNumber>2872-9901-0021</sieb:PartNumber>
          <sieb:Description>Cabin Air Micro-Filter & Evaporator Foam</sieb:Description>
          <sieb:HsnCode>87082900</sieb:HsnCode>
          <sieb:Quantity>1</sieb:Quantity>
          <sieb:UnitPrice>1450.00</sieb:UnitPrice>
          <sieb:ClientDigitalAuthorizationToken>AUTH_WA_OTP_VERIFIED_vi-01</sieb:ClientDigitalAuthorizationToken>
        </sieb:PartItem>
      </sieb:PartsRequisitionList>
    </sieb:CreateOrUpdateJobCard_Input>
  </soapenv:Body>
</soapenv:Envelope>`;

  const sampleSoapResponseXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:sieb="http://siebel.com/CustomUI">
  <soapenv:Body>
    <sieb:CreateOrUpdateJobCard_Output>
      <sieb:ResponseStatus>SUCCESS_ACK_200</sieb:ResponseStatus>
      <sieb:SiebelDocNumber>SR-IND-2026-9921</sieb:SiebelDocNumber>
      <sieb:TransactionID>TXN-SIEB-2026-992144-OK</sieb:TransactionID>
      <sieb:ServerTimestamp>2026-10-06T09:30:14.240+05:30</sieb:ServerTimestamp>
      <sieb:PRSNumber>PRS-SNG-8891</sieb:PRSNumber>
      <sieb:CreditMemoStatus>APPROVED</sieb:CreditMemoStatus>
      <sieb:ExecutionLatencyMs>340ms</sieb:ExecutionLatencyMs>
    </sieb:CreateOrUpdateJobCard_Output>
  </soapenv:Body>
</soapenv:Envelope>`;

  return (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-3xl shadow-sm' : 'max-w-4xl rounded-3xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Toast */}
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-slate-800 animate-fadeIn">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-white text-base tracking-tight">
                Tata e-DMS (Oracle Siebel 8.1 / SAP) SOAP Bridge
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono font-bold">
                Zero-Crash Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Offline-resilient asynchronous XML bridge buffering floor job cards and parts requisitions during morning DMS traffic spikes.
            </p>
          </div>
        </div>

        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Architecture Telemetry Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              SOAP Gateway Status
            </span>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${simulatingLag ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-sm font-black text-slate-900 font-mono">
                {simulatingLag ? 'DEGRADED (2.4s)' : 'CONNECTED (0.3s)'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              Endpoint: /siebel/v2/service
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Buffered Packets
            </span>
            <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
              {simulatingLag ? (status?.pendingPackets?.length || 1) + 2 : status?.pendingPackets?.length || 0}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Local Floor SQLite Queue
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Morning Lag Bypassed
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
              {status?.morningPeakLagBypassedCount || 28}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              0 SA Intake Stalls
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Siebel PRS Generated
            </span>
            <span className="text-2xl font-black text-purple-600 font-mono mt-1 block">
              PRS-SNG-8891
            </span>
            <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
              Auto Credit Memo Approved
            </span>
          </div>
        </div>

        {/* Action Controls & Simulation Buttons */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 block">
              e-DMS Resilience & Sync Controls
            </span>
            <span className="text-[11px] text-slate-500">
              Test resilience against morning 9:30 AM network lag or flush pending queues manually.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleLag}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                simulatingLag
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {simulatingLag ? '⚠️ Stop Lag Simulation' : '⚡ Simulate 9:30 AM Siebel Lag'}
            </button>

            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Flushing SOAP Queue...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Force Re-Sync & Flush</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Raw SOAP Packet Inspector Console */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">
                Siebel SOAP XML Inspector
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Doc: SR-IND-2026-9921
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono font-bold">
              <button
                onClick={() => setActivePacketTab('REQUEST')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activePacketTab === 'REQUEST'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SOAP Request (XML)
              </button>
              <button
                onClick={() => setActivePacketTab('RESPONSE')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activePacketTab === 'RESPONSE'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SOAP Response (ACK 200)
              </button>
            </div>
          </div>

          <div className="p-4 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed custom-scrollbar selection:bg-blue-600">
            <pre className="text-emerald-400/90 whitespace-pre-wrap">
              {activePacketTab === 'REQUEST' ? sampleSoapRequestXml : sampleSoapResponseXml}
            </pre>
          </div>
        </div>

        {/* Field Mapping Verification Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-900 block">
            Tata Motors e-DMS Field-Level Mappings
          </span>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="p-2.5">NatureXpress Entity</th>
                  <th className="p-2.5">e-DMS Siebel Field</th>
                  <th className="p-2.5">Data Type / Format</th>
                  <th className="p-2.5">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-slate-900">jc-8899 (Job Card)</td>
                  <td className="p-2.5 font-mono text-blue-600">sieb:RepairOrderNumber</td>
                  <td className="p-2.5 font-mono">String (RO-SNG-2026-8899)</td>
                  <td className="p-2.5 text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-slate-900">vi-01 (Video Approval)</td>
                  <td className="p-2.5 font-mono text-blue-600">sieb:PRSNumber</td>
                  <td className="p-2.5 font-mono">PRS-SNG-8891 (Hsn: 87082900)</td>
                  <td className="p-2.5 text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-semibold text-slate-900">BMS 20k Inspection</td>
                  <td className="p-2.5 font-mono text-blue-600">sieb:OpCode</td>
                  <td className="p-2.5 font-mono">Labour Op: 08-010-001 (Sac: 998729)</td>
                  <td className="p-2.5 text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mapped
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
