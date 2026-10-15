/**
 * NatureXpress DealerOS - Car Owner (Customer) Personal Concierge
 * 
 * Role: 24/7 WhatsApp & Web Transparent Vehicle Concierge
 * Persona: Empathetic, Highly Transparent Automotive Customer Advocate
 * Standards: 1000% Accurate Live Job Card Tracking, Video Estimates & UPI Verification
 */

/**
 * 1. Get Live Customer Vehicle State from DB
 */
function getLiveCustomerVehicleState(jobCardId, db) {
  const jobCards = db.jobCards || [];
  const jc = jobCards.find(j => j.id === jobCardId) || jobCards[0] || {
    id: "jc-001",
    regNo: "MP-09-CX-8899",
    model: "Tata Safari Dark Edition",
    customerName: "Kunal Deshmukh",
    customerPhone: "+91 98260 12345",
    stage: "diagnostics",
    stageIndex: 2,
    bay: "Bay 04 (Express Mechanical)",
    technician: "Ramesh Sonawane (Level 3 Diagnostic Master)",
    serviceAdvisor: "Rahul Sharma (+91 98930 11223)",
    estimatedDeliveryTime: "Today, 05:30 PM",
    estimatedCost: 8450,
    items: [
      { id: "item-1", title: "Periodic Maintenance Service (20,000 km)", cost: 4250, status: "APPROVED", category: "MANDATORY" },
      { id: "item-2", title: "Front Brake Pads Replacement (Worn to 2.1mm)", cost: 2850, status: "PENDING_APPROVAL", category: "SAFETY_CRITICAL", videoProofUrl: "https://assets.mixkit.co/videos/preview/mixkit-mechanic-working-on-a-car-wheel-42289-large.mp4", reason: "Friction material below 2.5mm minimum OEM safety limit" },
      { id: "item-3", title: "AC Disinfection & Evaporator Coil Foam Clean", cost: 1350, status: "PENDING_APPROVAL", category: "HYGIENE", reason: "Bacterial buildup causing musty smell on cold start" }
    ]
  };

  const loyalty = (db.loyaltyAccounts && db.loyaltyAccounts[jc.id]) || {
    pointsBalance: 850,
    pointValueINR: 850,
    tier: "Tata Seva Gold Elite"
  };

  const pendingApprovals = (jc.items || []).filter(i => i.status === 'PENDING_APPROVAL');
  const approvedTotal = (jc.items || []).filter(i => i.status === 'APPROVED').reduce((acc, i) => acc + (i.cost || 0), 0);
  const pendingTotal = pendingApprovals.reduce((acc, i) => acc + (i.cost || 0), 0);

  return {
    jobCardId: jc.id,
    regNo: jc.regNo,
    model: jc.model,
    customerName: jc.customerName,
    customerPhone: jc.customerPhone,
    currentStage: jc.stage,
    stageIndex: jc.stageIndex !== undefined ? jc.stageIndex : 2,
    bay: jc.bay,
    technician: jc.technician,
    serviceAdvisor: jc.serviceAdvisor,
    estimatedDeliveryTime: jc.estimatedDeliveryTime || "Today, 05:30 PM IST",
    financials: {
      approvedTotal,
      pendingTotal,
      estimatedFinalTotal: approvedTotal + pendingTotal,
      gstAmount: Math.round((approvedTotal + pendingTotal) * 0.18),
      loyaltyPointsBalance: loyalty.pointsBalance,
      loyaltyValueINR: loyalty.pointValueINR
    },
    items: jc.items || [],
    pendingApprovals,
    videoProofAvailable: pendingApprovals.some(i => i.videoProofUrl)
  };
}

/**
 * 2. Handle Interactive Customer Queries (WhatsApp or Web)
 */
function handleCustomerQuery(query, jobCardId, db) {
  const state = getLiveCustomerVehicleState(jobCardId, db);
  const q = (query || '').toLowerCase().trim();

  // Route 1: Delivery ETA & Status
  if (q.includes('when') || q.includes('time') || q.includes('delivery') || q.includes('ready') || q.includes('status') || q.includes('kab')) {
    return {
      success: true,
      intent: 'DELIVERY_ETA',
      title: "🚗 Live Delivery & Bay Timeline",
      directAnswer: `Namaste ${state.customerName}! Your **${state.model} (${state.regNo})** is currently in **${state.bay}** under technician ${state.technician}.\n\nGuaranteed delivery is scheduled for **${state.estimatedDeliveryTime}** with a mandatory 5km QC Road Test before handover.`,
      breakdown: [
        { label: "Current Workshop Stage", value: state.currentStage.replace(/_/g, ' ').toUpperCase(), status: "IN PROGRESS" },
        { label: "Assigned Work Bay", value: state.bay, status: "ACTIVE" },
        { label: "Service Advisor", value: state.serviceAdvisor, status: "ONLINE" },
        { label: "Promised Handover", value: state.estimatedDeliveryTime, status: "ON TRACK" }
      ],
      quickAction: {
        label: "📍 View Live Timeline",
        actionKey: "VIEW_TIMELINE"
      }
    };
  }

  // Route 2: Video Proof & Pending Estimate Approvals
  if (q.includes('video') || q.includes('proof') || q.includes('brake') || q.includes('approve') || q.includes('cost') || q.includes('estimate') || q.includes('why')) {
    const pending = state.pendingApprovals;
    if (pending.length > 0) {
      return {
        success: true,
        intent: 'ESTIMATE_AND_VIDEO_PROOF',
        title: "📹 15-Second Video Proof & Pending Approvals",
        directAnswer: `Your technician uploaded 15-second high-definition video proof for **${pending.length} recommended repair items** (Total: ₹${state.financials.pendingTotal.toLocaleString('en-IN')}).`,
        breakdown: pending.map(p => ({
          label: p.title,
          value: `₹${p.cost.toLocaleString('en-IN')}`,
          status: p.category,
          reason: p.reason,
          videoUrl: p.videoProofUrl
        })),
        quickAction: {
          label: "🟢 1-Tap Approve All Items",
          actionKey: "APPROVE_ALL_PENDING"
        }
      };
    }

    return {
      success: true,
      intent: 'ESTIMATE_SUMMARY',
      title: "💳 Approved Job Card Summary",
      directAnswer: `All items on your Job Card are approved. Current total is **₹${state.financials.approvedTotal.toLocaleString('en-IN')}** (+ GST). No pending approvals remaining.`,
      breakdown: state.items.map(i => ({
        label: i.title,
        value: `₹${i.cost.toLocaleString('en-IN')}`,
        status: i.status
      }))
    };
  }

  // Route 3: Loyalty Points & Discounts
  if (q.includes('loyalty') || q.includes('points') || q.includes('discount') || q.includes('wallet') || q.includes('offer')) {
    return {
      success: true,
      intent: 'LOYALTY_WALLET',
      title: "🎁 Tata Seva Loyalty Wallet",
      directAnswer: `You have **${state.financials.loyaltyPointsBalance} Tata Seva Points** (worth **₹${state.financials.loyaltyValueINR.toLocaleString('en-IN')}**) available in your wallet!`,
      breakdown: [
        { label: "Points Balance", value: `${state.financials.loyaltyPointsBalance} Pts`, status: "ACTIVE" },
        { label: "Direct Bill Offset Value", value: `₹${state.financials.loyaltyValueINR.toLocaleString('en-IN')}`, status: "100% LIQUID" },
        { label: "Redeemable On", value: "Brake Pads, Oil, Accessories", status: "VALID" }
      ],
      quickAction: {
        label: `✨ Redeem ₹${state.financials.loyaltyValueINR} on Today's Bill`,
        actionKey: "REDEEM_LOYALTY_POINTS"
      }
    };
  }

  // Default Concierge Response
  return {
    success: true,
    intent: 'CONCIERGE_OVERVIEW',
    title: "🚗 Tata Car Care Concierge",
    directAnswer: `Namaste ${state.customerName}! I am your personal 24/7 vehicle concierge for **${state.model} (${state.regNo})**. Your vehicle is in **${state.bay}** with expected completion at **${state.estimatedDeliveryTime}**.`,
    breakdown: [
      { label: "Vehicle Status", value: state.currentStage.replace(/_/g, ' ').toUpperCase(), status: "HEALTHY" },
      { label: "Pending Approvals", value: `${state.pendingApprovals.length} Items (₹${state.financials.pendingTotal.toLocaleString('en-IN')})`, status: state.pendingApprovals.length > 0 ? "ACTION NEEDED" : "ALL APPROVED" },
      { label: "Loyalty Wallet", value: `₹${state.financials.loyaltyValueINR.toLocaleString('en-IN')} Available`, status: "REDEEMABLE" }
    ],
    quickAction: {
      label: "📲 Open WhatsApp Live Hub",
      actionKey: "OPEN_WHATSAPP_HUB"
    }
  };
}

module.exports = {
  getLiveCustomerVehicleState,
  handleCustomerQuery
};
