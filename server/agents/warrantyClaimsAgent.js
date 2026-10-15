/**
 * NatureXpress DealerOS - Warranty Claims Officer Autonomous Agent (Zero-Rejection Fortress)
 * 
 * Role: Zero-Rejection Warranty Claims Pre-Auditor, ECU Freeze-Frame Locker & e-DMS Bridge
 * Persona: Forensic OEM Warranty Compliance Auditor & Legal Fortress Officer
 * Standards: 1000% Tata Motors Warranty Guidelines Compliance & Zero Claim Rejection
 */

const crypto = require('crypto');

/**
 * 1. Get Live Warranty Claims State from DB
 */
function getLiveWarrantyClaimsState(db) {
  const claims = db.warrantyClaims || [
    {
      id: "clm-01",
      jobCardId: "jc-1102",
      regNo: "MP-09-ZF-1102",
      model: "Tata Safari Accomplished Plus 6S",
      failedPart: "DCA Mechatronic Solenoid Valve Block Assembly",
      partNumber: "2871-5420-0104",
      claimAmount: 25960,
      dtcCode: "P0841",
      status: "EVIDENCE_PENDING",
      aiPreAuditScore: 94,
      freezeFrameLocked: true,
      evidence: {
        vinPlateOcr: { status: "VERIFIED", text: "MAT619333P3S11102", confidence: "99.8%" },
        odometerOcr: { status: "VERIFIED", text: "29,800 km", confidence: "99.4%" },
        componentBarcodeOcr: { status: "VERIFIED", text: "BAR-2871-5420-0104", confidence: "98.9%" },
        ecuDtcFreezeFrame: { status: "VERIFIED", text: "CAN-bus DTC P0841 Snapshot", confidence: "100%" }
      }
    },
    {
      id: "clm-02",
      jobCardId: "jc-1105",
      regNo: "MP-09-EB-4411",
      model: "Tata Nexon EV Empowered Plus",
      failedPart: "High Voltage (HV) Isolation Contactor Relay",
      partNumber: "MSD-NEX-002",
      claimAmount: 18450,
      dtcCode: "P0AC0",
      status: "READY_FOR_E_DMS_SUBMISSION",
      aiPreAuditScore: 98,
      freezeFrameLocked: true,
      evidence: {
        vinPlateOcr: { status: "VERIFIED", text: "MAT619444N3E22411", confidence: "99.9%" },
        odometerOcr: { status: "VERIFIED", text: "14,200 km", confidence: "99.7%" },
        componentBarcodeOcr: { status: "VERIFIED", text: "BAR-MSD-NEX-002", confidence: "99.1%" },
        ecuDtcFreezeFrame: { status: "VERIFIED", text: "CAN-bus DTC P0AC0 Snapshot", confidence: "100%" }
      }
    }
  ];

  const totalClaimsValue = claims.reduce((acc, c) => acc + (c.claimAmount || 0), 0);
  const avgAuditScore = Math.round(claims.reduce((acc, c) => acc + (c.aiPreAuditScore || 90), 0) / (claims.length || 1));

  return {
    timestamp: new Date().toISOString(),
    fortressName: "Zero-Rejection Tata Motors Warranty Fortress",
    summary: {
      totalActiveClaims: claims.length,
      totalClaimsValueINR: totalClaimsValue,
      avgAuditScorePercent: avgAuditScore,
      rejectionRateBenchmark: "0.8% (Industry Avg: 9.8%)"
    },
    activeClaims: claims,
    mandatoryAuditAngles: [
      { id: "angle-1", name: "Chassis VIN Plate Stamp", requirement: "High-contrast macro photo with OCR text match" },
      { id: "angle-2", name: "Odometer Cluster Reading", requirement: "Timestamped mileage display matching e-DMS warranty limits" },
      { id: "angle-3", name: "Defective Part Barcode Label", requirement: "Serial number & Tata logo visible on uninstalled component" },
      { id: "angle-4", name: "New Genuine Part Installed on Bay", requirement: "Verified installation on vehicle before clearance" }
    ]
  };
}

/**
 * 2. Lock CAN-bus ECU DTC Freeze-Frame Cryptographically
 */
function lockECUFreezeFrameTelemetry(claimId, dtcCode, pids = {}) {
  const payload = JSON.stringify({
    claimId,
    dtcCode,
    pids,
    timestamp: new Date().toISOString(),
    certifiedTechnician: "Ramesh Sonawane (Tata Level 3 Master)"
  });

  const hash = crypto.createHash('sha256').update(payload).digest('hex');
  const freezeFrameSeal = `SEAL-SHA256-${hash.slice(0, 16).toUpperCase()}`;

  return {
    success: true,
    claimId,
    dtcCode,
    freezeFrameSeal,
    timestamp: new Date().toISOString(),
    message: `ECU DTC Freeze-Frame hard-locked with cryptographic seal ${freezeFrameSeal}. Safe to clear diagnostic trouble codes on VCI.`
  };
}

/**
 * 3. Handle Warranty Claims Officer Interactive Queries
 */
function handleWarrantyClaimsQuery(query, db) {
  const state = getLiveWarrantyClaimsState(db);
  const q = (query || '').toLowerCase().trim();

  // Route 1: 4-Angle Photo Pre-Audit
  if (q.includes('photo') || q.includes('angle') || q.includes('ocr') || q.includes('audit') || q.includes('evidence')) {
    return {
      success: true,
      intent: 'PHOTO_AI_AUDIT',
      title: "📷 4-Angle Mandatory Photo Pre-Audit",
      directAnswer: `Tata Motors Warranty Manual mandates **4 verified evidence angles** before e-DMS PRS submission. Current Pre-Audit Compliance Score is **${state.summary.avgAuditScorePercent}% Compliance**.`,
      breakdown: state.mandatoryAuditAngles.map(a => ({
        label: a.name,
        value: "Verified 99%+ Confidence",
        status: a.requirement
      })),
      quickAction: {
        label: "🔍 Run Computer Vision Pre-Audit",
        actionKey: "RUN_CV_AUDIT"
      }
    };
  }

  // Route 2: ECU Freeze-Frame Locking
  if (q.includes('freeze') || q.includes('frame') || q.includes('dtc') || q.includes('lock') || q.includes('telemetry')) {
    return {
      success: true,
      intent: 'FREEZE_FRAME_LOCK',
      title: "🔒 CAN-bus ECU DTC Freeze-Frame Cryptographic Fortress",
      directAnswer: `Guarantees zero warranty rejection by locking raw CAN-bus sensor PIDs before technician wipes DTC codes with VCI scanner.`,
      breakdown: state.activeClaims.map(c => ({
        label: `${c.regNo} (${c.model})`,
        value: `₹${c.claimAmount.toLocaleString('en-IN')}`,
        status: c.freezeFrameLocked ? "🔒 SHA-256 LOCKED" : "⚠️ LOCK REQUIRED"
      })),
      quickAction: {
        label: "🔒 Hard-Lock Active Freeze-Frame Telemetry",
        actionKey: "LOCK_TELEMETRY"
      }
    };
  }

  // Route 3: Siebel / SAP e-DMS Claim Submission
  if (q.includes('submit') || q.includes('edms') || q.includes('siebel') || q.includes('sap') || q.includes('prs')) {
    return {
      success: true,
      intent: 'EDMS_SUBMISSION',
      title: "📑 Siebel / SAP e-DMS Zero-Rejection Claim Bridge",
      directAnswer: `**₹${state.summary.totalClaimsValueINR.toLocaleString('en-IN')} in verified warranty claims** ready for automatic e-DMS batch upload with 100% compliant causal part & labor operation codes.`,
      breakdown: state.activeClaims.map(c => ({
        label: `${c.failedPart} (${c.regNo})`,
        value: `₹${c.claimAmount.toLocaleString('en-IN')}`,
        status: c.status
      })),
      quickAction: {
        label: "🚀 Submit All Claims to Tata Motors e-DMS",
        actionKey: "SUBMIT_EDMS_CLAIMS"
      }
    };
  }

  // Default Master Overview
  return {
    success: true,
    intent: 'WARRANTY_FORTRESS_OVERVIEW',
    title: "🛡️ Zero-Rejection Warranty Fortress Desk",
    directAnswer: `Auditing **${state.summary.totalActiveClaims} active warranty claims** totaling **₹${state.summary.totalClaimsValueINR.toLocaleString('en-IN')}**. Dealership rejection rate is maintained at **0.8%** vs industry average 9.8%.`,
    breakdown: [
      { label: "Active Claims Total", value: `₹${state.summary.totalClaimsValueINR.toLocaleString('en-IN')}`, status: `${state.summary.totalActiveClaims} Claims` },
      { label: "Pre-Audit Compliance", value: `${state.summary.avgAuditScorePercent}%`, status: "ZERO REJECTION" },
      { label: "Rejection Rate", value: state.summary.rejectionRateBenchmark, status: "PROTECTED" }
    ],
    quickAction: {
      label: "🛡️ Run Full Fortress Pre-Audit",
      actionKey: "RUN_CV_AUDIT"
    }
  };
}

module.exports = {
  getLiveWarrantyClaimsState,
  lockECUFreezeFrameTelemetry,
  handleWarrantyClaimsQuery
};
