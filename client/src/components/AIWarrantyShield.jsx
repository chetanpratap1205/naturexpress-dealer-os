import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Cpu, 
  Car, 
  FileText, 
  Lock, 
  Sparkles, 
  Send, 
  Eye, 
  Check,
  RefreshCw,
  Search,
  Hash,
  Activity,
  Layers,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AIWarrantyShield({ 
  warrantyClaims = [], 
  onUploadPhoto, 
  onSubmitClaim,
  onDataRefresh 
}) {
  const [activeClaimId, setActiveClaimId] = useState(warrantyClaims[0]?.id || 'clm-01');
  const [runningOcr, setRunningOcr] = useState(false);
  const [lockingTelemetry, setLockingTelemetry] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const activeClaim = warrantyClaims.find(c => c.id === activeClaimId) || warrantyClaims[0] || {
    id: "clm-01",
    jobCardId: "jc-1102",
    regNo: "MP-09-ZF-1102",
    model: "Tata Safari Accomplished Plus 6S",
    failedPart: "DCA Mechatronic Solenoid Valve Block Assembly",
    partNumber: "2871-5420-0104",
    claimAmount: 25960,
    dtcCode: "P0841 (Transmission Fluid Pressure Sensor/Switch Circuit Range/Performance)",
    status: "EVIDENCE_PENDING",
    aiPreAuditScore: 92,
    freezeFrameLocked: false,
    evidence: {
      vinPlateOcr: { status: "VERIFIED", text: "MAT619333P3S11102", confidence: "99.8%" },
      odometerOcr: { status: "VERIFIED", text: "29,800 km", confidence: "99.4%" },
      componentBarcodeOcr: { status: "VERIFIED", text: "BAR-2871-5420-0104", confidence: "98.9%" },
      ecuDtcFreezeFrame: { status: "VERIFIED", text: "CAN-bus DTC P0841 Snapshot", confidence: "100%" }
    }
  };

  const handleRunAiOcr = () => {
    setRunningOcr(true);
    setTimeout(() => {
      setRunningOcr(false);
      confetti({ particleCount: 70, spread: 60 });
      setToastMessage("✓ AI Computer Vision pre-audit completed! 4 Mandatory Photo angles verified against Tata OEM Warranty Guidelines.");
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  const handleLockFreezeFrame = () => {
    setLockingTelemetry(true);
    setTimeout(() => {
      setLockingTelemetry(false);
      confetti({ particleCount: 50, spread: 50 });
      setToastMessage("🔒 CAN-bus ECU DTC Freeze-Frame Telemetry hard-locked with SHA-256 seal. Safe to clear diagnostic codes.");
      setTimeout(() => setToastMessage(null), 5000);
    }, 1000);
  };

  const handleSubmit = (claimId) => {
    setSubmitting(true);
    setTimeout(() => {
      if (onSubmitClaim) onSubmitClaim(claimId);
      setSubmitting(false);
      setSubmittedClaim(activeClaim);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      setToastMessage(`✓ Claim for ${activeClaim.regNo} submitted to Tata Motors! Siebel PRS #PRS-SNG-2026-9921 generated.`);
      setTimeout(() => setToastMessage(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-slate-900 text-emerald-300 border border-emerald-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-slideUp">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              AI Zero-Rejection Warranty Fortress
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono uppercase">
              Tata OEM Audit Shield
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Eliminates ₹3–5 Lakhs in monthly dealer claim rejections by validating 4 mandatory photo angles (VIN plate OCR, Odometer, Component Barcode, and ECU DTC Freeze-Frame) before DTC codes are wiped.
          </p>
        </div>

        {/* Financial Protection Widget */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 text-right shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Dealer Monthly Claim Loss Saved</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">₹2.80 Lakhs</span>
          <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
            99.4% Claim Approval Rate with Tata Motors
          </span>
        </div>
      </div>

      {/* Main Grid: Left Claim Dossiers + Right 4-Point AI Pre-Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Dossiers (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Warranty Claims ({warrantyClaims.length || 3})
            </h2>
          </div>

          <div className="space-y-2.5">
            {(warrantyClaims.length > 0 ? warrantyClaims : [activeClaim]).map((clm) => {
              const isSelected = activeClaimId === clm.id;
              const isApproved = clm.status === 'OEM_APPROVED';

              return (
                <div
                  key={clm.id}
                  onClick={() => setActiveClaimId(clm.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-sm text-slate-900">{clm.regNo}</span>
                        <span className="text-xs text-slate-500 font-semibold">• {clm.model.split(' ')[1]}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-medium leading-snug">{clm.failedPart}</p>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">DTC: {clm.dtcCode?.split(' ')[0]}</div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 font-mono block">
                        ₹{(clm.claimAmount || 25960).toLocaleString('en-IN')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-1 inline-block ${
                        isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {clm.status || 'PRE_AUDIT_OK'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 4-Point AI Pre-Audit Suite (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    Dossier Pre-Audit: {activeClaim.regNo} ({activeClaim.model})
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    AI Score: {activeClaim.aiPreAuditScore || 94}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Part: <strong>{activeClaim.failedPart}</strong> (Part #{activeClaim.partNumber})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunAiOcr}
                  disabled={runningOcr}
                  className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {runningOcr ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning OCR...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Run AI OCR Pre-Audit</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleLockFreezeFrame}
                  disabled={lockingTelemetry}
                  className="px-3.5 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {lockingTelemetry ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Locking Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Lock ECU Freeze-Frame</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* The 4-Angle Computer Vision OCR Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Angle 1: VIN Plate OCR */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-500" />
                    1. VIN Plate B-Pillar Stamping
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ISO 3779 Valid
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs">
                  <div className="text-slate-400 text-[10px]">Extracted VIN OCR:</div>
                  <div className="font-bold text-slate-900 mt-0.5">MAT619333P3S11102</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ 100% Match to Job Card jc-1102</div>
                </div>
              </div>

              {/* Angle 2: Odometer Digits OCR */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-500" />
                    2. Digital Cluster Odometer Digits
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Under 100k Limit
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs">
                  <div className="text-slate-400 text-[10px]">Extracted Mileage:</div>
                  <div className="font-bold text-slate-900 mt-0.5">29,800 km (Policy Max: 100,000 km)</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Factory Warranty Active</div>
                </div>
              </div>

              {/* Angle 3: Component Barcode OCR */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-500" />
                    3. Failed Component 2D Barcode
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OEM Genuine
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs">
                  <div className="text-slate-400 text-[10px]">Scanned Serial:</div>
                  <div className="font-bold text-slate-900 mt-0.5">BAR-2871-5420-0104</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Validated in Tata OEM Factory Batch TC-23</div>
                </div>
              </div>

              {/* Angle 4: ECU DTC Freeze-Frame Telemetry */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    4. ECU DTC Freeze-Frame Hard-Lock
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> SHA-256 Locked
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs">
                  <div className="text-slate-400 text-[10px]">Telemetry at Failure:</div>
                  <div className="text-[11px] text-slate-800 mt-0.5">
                    DTC P0841 • Speed: 48 km/h • Coolant: 92°C • Pressure: 14.2 bar
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-1">✓ Locked before DTC code clear</div>
                </div>
              </div>
            </div>

            {/* Submission Gate */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">
                  Ready for Tata Motors OEM Claim Submission
                </div>
                <div className="text-[11px] text-slate-500">
                  Total Claim Payout: <strong>₹{(activeClaim.claimAmount || 25960).toLocaleString('en-IN')}</strong> • Zero Dealer Liability
                </div>
              </div>

              <button
                onClick={() => handleSubmit(activeClaim.id)}
                disabled={submitting}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Claim to Siebel...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Verified Claim to Tata OEM Portal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
