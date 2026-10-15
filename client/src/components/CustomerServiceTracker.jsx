import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  Camera,
  Fuel,
  Gauge,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import GSTInvoiceModal from './GSTInvoiceModal';

const STAGES = [
  {
    id: 'INTAKE',
    title: 'Vehicle Received',
    desc: 'Intake inspection & digital handover complete',
    estTime: 'Completed at Intake'
  },
  {
    id: 'INSPECTION',
    title: 'Initial Inspection Complete',
    desc: '360° health scan & technical diagnostic run',
    estTime: '~20 mins'
  },
  {
    id: 'ESTIMATE_PENDING',
    title: 'Estimate Shared with You',
    desc: 'Transparent pricing & video recommendations generated',
    estTime: 'Awaiting Your Approval'
  },
  {
    id: 'BAY_WORK',
    title: 'Work in Progress at Bay',
    desc: 'Authorized technicians performing scheduled service',
    estTime: '~90 mins'
  },
  {
    id: 'WASHING',
    title: 'Washing & Final Cleanup',
    desc: 'High-pressure foam wash, vacuum & exterior polish',
    estTime: '~30 mins'
  },
  {
    id: 'ROAD_TEST',
    title: 'Quality Road Test',
    desc: 'Mandatory 5-km road test & 28-point QC check',
    estTime: '~15 mins'
  },
  {
    id: 'BILL_READY',
    title: 'Ready — Billing in Progress',
    desc: 'Tax invoice generated & gate clearance ready',
    estTime: '~10 mins'
  },
  {
    id: 'DELIVERED',
    title: 'Delivered',
    desc: 'Vehicle safely handed over to you. Safe travels!',
    estTime: 'Delivered'
  }
];

function getStageIndex(status) {
  if (!status) return 0;
  switch (status.toUpperCase()) {
    case 'INTAKE':
      return 0;
    case 'INSPECTION':
      return 1;
    case 'ESTIMATE_PENDING':
      return 2;
    case 'BAY_WORK':
    case 'IN_PROGRESS':
      return 3;
    case 'WASHING':
      return 4;
    case 'ROAD_TEST':
      return 5;
    case 'BILL_READY':
      return 6;
    case 'PAID':
    case 'GATE_PASSED':
    case 'DELIVERED':
    case 'COMPLETED':
      return 7;
    default:
      return 0;
  }
}

export default function CustomerServiceTracker({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const refreshTimerRef = useRef(null);
  const secondsTimerRef = useRef(null);

  const activeToken = token || 'demo-token-nexon-9011';

  const fetchServiceStatus = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      // First attempt: /api/v2/service-status/:token
      let res = await fetch(`/api/v2/service-status/${activeToken}`);
      let json = null;

      if (res.ok) {
        json = await res.json();
      }

      // Fallback attempt: /api/v2/customer/estimate/:token if service-status 404s
      if (!json || !json.success || !json.data) {
        const fallbackRes = await fetch(`/api/v2/customer/estimate/${activeToken}`);
        if (fallbackRes.ok) {
          json = await fallbackRes.json();
        }
      }

      if (json && json.success && json.data) {
        setData(json.data);
        setSecondsAgo(0);
      } else {
        // Fallback demo state if link is a test demo token
        if (activeToken.includes('demo')) {
          setData({
            jobCard: {
              id: 'JC-2026-9011',
              token: activeToken,
              model: 'Tata Nexon EV Max',
              reg_no: 'MP 09 CZ 4402',
              customer_name: 'Vikramaditya Sharma',
              customer_phone: '+91 98260 12345',
              sa_name: 'Amit Sharma',
              sa_phone: '+91 88798 97825',
              bay_number: 4,
              status: 'BAY_WORK',
              fuel_type: 'ELECTRIC',
              fuel_level: 82,
              odometer_in: 28410,
              scratch_markers: [
                { id: 'sc-1', panel: 'Rear Bumper Right', type: 'scratch', severity: 'Minor' },
                { id: 'sc-2', panel: 'Left Front Door', type: 'dent', severity: 'Small' }
              ],
              created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
              estimated_amount: 8450
            },
            branch: {
              name: 'Shyam Automotive (Tata Motors)',
              cluster: 'Indore East — Scheme 140 Flagship Hub',
              phone: '+91 88798 97825',
              address: 'Infront of Agarwal Public School, Scheme 140, Indore'
            }
          });
          setSecondsAgo(0);
        } else {
          setError(json?.error || 'Tracking link not found or has expired.');
        }
      }
    } catch (err) {
      // Check if demo fallback applies
      if (activeToken.includes('demo')) {
        setData({
          jobCard: {
            id: 'JC-2026-9011',
            token: activeToken,
            model: 'Tata Nexon EV Max',
            reg_no: 'MP 09 CZ 4402',
            customer_name: 'Vikramaditya Sharma',
            sa_name: 'Amit Sharma',
            bay_number: 4,
            status: 'BAY_WORK',
            fuel_type: 'ELECTRIC',
            fuel_level: 82,
            odometer_in: 28410,
            scratch_markers: [{ id: 'sc-1', panel: 'Rear Bumper Right', type: 'scratch', severity: 'Minor' }],
            created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
          },
          branch: {
            name: 'Shyam Automotive (Tata Motors)',
            phone: '+91 88798 97825'
          }
        });
        setSecondsAgo(0);
      } else {
        setError('Unable to retrieve live service status. Please check your network connection.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServiceStatus(false);

    // Auto-refresh poll every 30 seconds
    refreshTimerRef.current = setInterval(() => {
      fetchServiceStatus(true);
    }, 30000);

    // Second counter for "Last updated X seconds ago"
    secondsTimerRef.current = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      if (secondsTimerRef.current) clearInterval(secondsTimerRef.current);
    };
  }, [activeToken]);

  // Loading Skeleton State
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans">
        <div className="bg-[#0f172a] text-white px-4 py-5 shadow-sm">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center border border-blue-500/40">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <div className="h-4 w-44 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-xl mx-auto w-full p-4 space-y-4">
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1 py-4">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Connecting to Shyam Automotive Live Workshop Telemetry...</span>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans">
        {/* Header */}
        <header className="bg-[#0f172a] text-white px-4 py-4 shadow-sm">
          <div className="max-w-xl mx-auto flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-sm font-bold tracking-tight">Shyam Automotive — Tata Authorized Service</h1>
              <p className="text-[11px] text-slate-400">Indore, MP | 4.9★ 1,237 Reviews</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#0f172a]">Service Tracker Link Expired</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {error || 'The live tracking session for this link could not be located. It may have expired or completed.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fetchServiceStatus(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
              <a
                href="tel:+91-88798-97825"
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-700" />
                <span>Call +91 88798 97825</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const jc = data.jobCard || data;
  const currentStageIndex = getStageIndex(jc.status);
  const isDelivered = currentStageIndex === 7;

  // Safe parse scratch markers
  let scratchMarkersList = [];
  if (Array.isArray(jc.scratch_markers)) {
    scratchMarkersList = jc.scratch_markers;
  } else if (typeof jc.scratch_markers === 'string') {
    try {
      scratchMarkersList = JSON.parse(jc.scratch_markers);
    } catch (e) {
      scratchMarkersList = [];
    }
  }

  // Format intake time
  const intakeFormatted = jc.created_at
    ? new Date(jc.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Today, Recorded at Intake';

  // Fuel level fallback & calculation
  const fuelVal = typeof jc.fuel_level === 'number' ? jc.fuel_level : 65;
  const fuelColorClass =
    fuelVal < 25 ? 'bg-rose-500' : fuelVal < 50 ? 'bg-amber-500' : 'bg-emerald-500';

  const formatStatusBadge = (status) => {
    switch (status) {
      case 'INTAKE':
        return { label: 'Vehicle Received', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
      case 'INSPECTION':
        return { label: 'Under Inspection', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' };
      case 'ESTIMATE_PENDING':
        return { label: 'Estimate Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
      case 'BAY_WORK':
        return { label: 'Work In Progress', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'WASHING':
        return { label: 'Washing & Detailing', bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' };
      case 'ROAD_TEST':
        return { label: 'QC Road Test', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' };
      case 'BILL_READY':
        return { label: 'Ready for Handover', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
      case 'PAID':
      case 'GATE_PASSED':
      case 'DELIVERED':
        return { label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' };
      default:
        return { label: status?.replace('_', ' ') || 'Active', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
    }
  };

  const badgeInfo = formatStatusBadge(jc.status);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0f172a] font-sans selection:bg-blue-600 selection:text-white flex flex-col pb-16">
      {/* 1. HEADER BAR (Dark Navy #0f172a) */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Tata Motors Shield Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center border border-blue-500/40 shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                  Live Service Tracker
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-sm font-black text-white tracking-tight">
                Shyam Automotive — Tata Authorized Service Center
              </h1>
              <p className="text-[11px] text-slate-300">
                Indore, MP | 4.9★ 1,237 Reviews
              </p>
            </div>
          </div>

          <a
            href="tel:+91-88798-97825"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-400 border border-slate-700 shrink-0 transition-colors"
            title="Call Showroom Service Desk"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Subtle Live Sync Indicator */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-1.5 text-[11px] text-slate-600 flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchServiceStatus(true)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-xl mx-auto w-full px-4 pt-4 space-y-4 flex-1">
        {/* Delivered Celebration Notice (if delivered) */}
        {isDelivered && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-sm space-y-2 flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black tracking-tight">Vehicle Successfully Delivered!</h3>
              <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                Thank you for choosing Shyam Automotive. All digital quality checklists, genuine parts warranties, and road test reports are sealed.
              </p>
            </div>
          </div>
        )}

        {/* 2. VEHICLE IDENTITY CARD (White card, slight shadow) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-blue-700 shrink-0" />
                <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
                  {jc.model || 'Tata Passenger Vehicle'}
                </h2>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 tracking-wider shadow-2xs">
                  {jc.reg_no || 'MP 09 REG'}
                </span>
                {jc.customer_name && (
                  <span className="text-xs text-slate-600 font-medium">
                    Owner: <span className="font-bold text-slate-800">{jc.customer_name}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Current Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shrink-0 ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}
            >
              {badgeInfo.label}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="text-slate-600">
              Your Service Advisor:{' '}
              <span className="font-bold text-slate-900">
                {jc.sa_name || 'Senior Advisor'}
              </span>
            </div>
            <div className="text-slate-500 sm:text-right">
              Intake Time: <span className="text-slate-800 font-medium">{intakeFormatted}</span>
            </div>
          </div>
        </div>

        {/* 3. LIVE STAGE TRACKER (Timeline Stepper) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a]">
                Live Stage Progression
              </h3>
              <p className="text-[11px] text-slate-500">
                Real-time status synced with Shyam workshop floor telemetry
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Step {Math.min(currentStageIndex + 1, 8)} of 8
            </span>
          </div>

          {/* Stepper Vertical List */}
          <div className="space-y-4 relative pl-1">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isUpcoming = idx > currentStageIndex;
              const isLast = idx === STAGES.length - 1;

              // Dynamic label for Bay Work
              let stageTitle = stage.title;
              if (stage.id === 'BAY_WORK' && jc.bay_number) {
                stageTitle = `Work in Progress at Bay ${jc.bay_number}`;
              }

              return (
                <div key={stage.id} className="relative flex items-start space-x-3.5 group">
                  {/* Vertical connecting line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[13px] top-[26px] w-[2px] h-[calc(100%+8px)] transition-colors ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Stage Icon Node */}
                  <div className="relative z-10 shrink-0">
                    {isPast && (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}

                    {isCurrent && (
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                        <div className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      </div>
                    )}

                    {isUpcoming && (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center">
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Stage Text & Details */}
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs ${
                            isCurrent
                              ? 'font-black text-[#1D4ED8]'
                              : isPast
                              ? 'font-bold text-emerald-800'
                              : 'font-medium text-slate-400'
                          }`}
                        >
                          {stageTitle}
                        </span>

                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black uppercase bg-[#1D4ED8] text-white tracking-wider animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>

                      {/* Estimated time display */}
                      {isCurrent && stage.estTime && (
                        <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{stage.estTime}</span>
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-[11px] mt-0.5 leading-snug ${
                        isCurrent
                          ? 'text-slate-700 font-medium'
                          : isPast
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.desc}
                    </p>

                    {/* Dedicated Estimate Callout when active on ESTIMATE_PENDING */}
                    {stage.id === 'ESTIMATE_PENDING' && (isCurrent || jc.status === 'ESTIMATE_PENDING') && (
                      <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="space-y-0.5">
                          <span className="font-bold flex items-center space-x-1 text-amber-950">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Detailed Estimate Awaiting Your Review</span>
                          </span>
                          <p className="text-[11px] text-amber-800">
                            Transparent labor & genuine parts breakdown with 15-sec video inspection proof.
                          </p>
                        </div>
                        <a
                          href={`/#/view/estimate/${jc.token || activeToken}`}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 text-center transition-colors shadow-2xs"
                        >
                          Approve Estimate →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. INTAKE EVIDENCE SECTION (Collapsible, Default Collapsed) */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setEvidenceExpanded(!evidenceExpanded)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-[#0f172a] uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Your Vehicle — Intake Condition</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    360° Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {scratchMarkersList.length} pre-existing marks documented at intake
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs font-bold text-slate-500">
              <span>{evidenceExpanded ? 'Collapse' : 'View Proof'}</span>
              {evidenceExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {evidenceExpanded && (
            <div className="p-4 border-t border-slate-200 bg-white space-y-4">
              {/* Odometer and Fuel Telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Odometer Card */}
                <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-slate-200 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Odometer at Intake
                    </div>
                    <div className="text-sm font-black font-mono text-[#0f172a]">
                      {jc.odometer_in ? `${jc.odometer_in.toLocaleString('en-IN')} KM` : 'Recorded at Intake'}
                    </div>
                  </div>
                </div>

                {/* Fuel Level Card */}
                <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-600" />
                      <span>{jc.fuel_type === 'ELECTRIC' ? 'State of Charge (SOC)' : 'Fuel Level'}</span>
                    </span>
                    <span className="font-mono text-slate-800">{fuelVal}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${fuelColorClass}`}
                      style={{ width: `${Math.min(Math.max(fuelVal, 5), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Documented Scratch & Dent Markers */}
              {scratchMarkersList.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Documented Pre-Existing Panel Markers ({scratchMarkersList.length}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scratchMarkersList.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="bg-[#f8fafc] p-2.5 rounded-xl border border-slate-200 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{m.panel || 'Panel'}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                            {m.type || 'mark'}
                          </span>
                        </div>
                        {m.severity && (
                          <div className="text-[11px] text-slate-500">Severity: {m.severity}</div>
                        )}
                        {m.notes && (
                          <div className="text-[11px] text-slate-700 italic">"{m.notes}"</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center">
                  Zero external scratches or dents recorded during 360° intake walkaround.
                </div>
              )}

              {/* Cryptographic Trust Seal */}
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span>This evidence is cryptographically sealed at intake time and cannot be altered.</span>
                  <div className="font-bold text-slate-700 text-[10px]">
                    Protected by NatureXpress AuditLock™
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. QUICK ACTIONS AT BOTTOM */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
            Direct Customer Concierge
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Call Showroom Button */}
            <a
              href="tel:+91-88798-97825"
              className="flex-1 py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Call Showroom (+91 88798 97825)</span>
            </a>

            {/* If status is ESTIMATE_PENDING: Review & Approve Estimate Button */}
            {jc.status === 'ESTIMATE_PENDING' && (
              <a
                href={`/#/view/estimate/${jc.token || activeToken}`}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Review & Approve Estimate</span>
              </a>
            )}

            {/* Download Invoice Button (BILL_READY, PAID, GATE_PASSED) */}
            {['BILL_READY', 'PAID', 'GATE_PASSED', 'DELIVERED'].includes(jc.status) && (
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-xs"
              >
                <FileText className="w-4 h-4 text-emerald-200" />
                <span>View & Print Official GST Invoice</span>
              </button>
            )}
          </div>
        </div>

        {/* 6. FOOTER */}
        <footer className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
          <p>Powered by NatureXpress DealerOS • Shyam Automotive</p>
          <p className="text-[10px] text-slate-400">
            Tata Motors Authorized Service • Scheme 140 Flagship Hub, Indore
          </p>
        </footer>
      </main>

      {/* Customer Tax Invoice Modal */}
      <GSTInvoiceModal
        jobCardId={jc.id}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
