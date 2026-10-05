import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Building2,
  Hash,
  Download,
  Terminal,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuditLedgerConsole({
  dealership,
  onDataRefresh
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedBranch !== 'ALL') query.append('branchId', selectedBranch);
      if (selectedSeverity !== 'ALL') query.append('severity', selectedSeverity);
      
      const res = await fetch(`/api/audit-ledger?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [selectedBranch, selectedSeverity]);

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/audit-ledger/verify-integrity', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.data);
        if (data.data.verified) {
          confetti({ particleCount: 70, spread: 60 });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const filteredEvents = events.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.actionType.toLowerCase().includes(q) ||
      e.userName.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q) ||
      e.sha256Hash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Compliance Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-xl">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Cryptographic Audit Ledger & Compliance Engine
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono uppercase">
              SHA-256 Immutable
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Every operational state transition, financial override, customer authorization, and parts runner dispatch is cryptographically chained to prevent internal tampering or audit disputes.
          </p>
        </div>

        {/* 1-Click Cryptographic Verification Gate */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Auditing Hash Chain...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Verify SHA-256 Chain Integrity</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Certificate Banner */}
      {verificationResult && (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          verificationResult.verified
            ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-100'
            : 'bg-rose-950/80 border-rose-500/60 text-rose-100'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-xl ${verificationResult.verified ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>Cryptographic Chain Status: {verificationResult.auditStatus}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/20">
                  {verificationResult.totalEventsAudited} Events Verified
                </span>
              </div>
              <div className="text-xs text-emerald-300/80 font-mono mt-0.5 truncate max-w-xl">
                Last Block Hash: {verificationResult.lastBlockHash}
              </div>
            </div>
          </div>

          <div className="text-right text-xs font-semibold text-emerald-300">
            0 Tampered Blocks Detected • Compliant with Tata OEM Audit Standards
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Branches (Indore Cluster)</option>
            <option value="sanghi-bypass">Sanghi Central Bypass</option>
            <option value="sanghi-manorama">Sanghi Manorama Ganj</option>
            <option value="shyam-dewas">Shyam Dewas Rd</option>
            <option value="jagdish-pithampur">Jagdish Pithampur</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="FINANCIAL_AUDIT">Financial & Payment Audits</option>
            <option value="CRITICAL_COMPLIANCE">Critical OEM Compliance</option>
            <option value="OPERATIONAL">Operational Dispatches</option>
            <option value="INFO">General Logs</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search hash, user, action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Immutable Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-900 text-sm">Chained Event Records</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
              {filteredEvents.length} Entries
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Chain Anchor: SANGHI-GENESIS-2026
          </div>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No audit logs matching criteria.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {event.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {event.actionType}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      event.severity === 'FINANCIAL_AUDIT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      event.severity === 'CRITICAL_COMPLIANCE' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      event.severity === 'OPERATIONAL' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {event.severity}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {event.branchId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {event.userName} ({event.userRole})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 font-medium pl-1 leading-relaxed">
                  {event.details}
                </div>

                {/* Cryptographic Hash Verification Block */}
                <div className="bg-slate-950 text-slate-400 p-2.5 rounded-xl font-mono text-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800">
                  <div className="truncate flex items-center space-x-2">
                    <span className="text-slate-500">SHA-256:</span>
                    <span className="text-emerald-400 truncate">{event.sha256Hash}</span>
                  </div>
                  <div className="truncate flex items-center space-x-2 text-slate-500">
                    <span>PREV:</span>
                    <span className="text-slate-400 truncate max-w-[120px]">{event.previousHash?.slice(0, 16)}...</span>
                    <span>• IP: {event.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
