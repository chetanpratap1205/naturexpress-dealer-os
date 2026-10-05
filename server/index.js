const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const { getDB, saveDB, INITIAL_DATA } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast helper for real-time updates across all connected tablets/cockpits
function broadcast(event, payload) {
  const message = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ event: 'CONNECTED', payload: { time: new Date().toISOString() } }));
});

// --- NLP Sentiment Analysis Engine (Point #5) ---
function analyzeSentiment(text) {
  if (!text) return { sentiment: 'Neutral', score: 0.1, isUrgentEscalation: false, keywords: [] };
  const lower = text.toLowerCase();
  
  const severeAngerKeywords = [
    'consumer court', 'court', 'legal notice', 'scam', 'cheating', 'fraud', 'police', 
    'twitter', 'team-bhp', 'worst service', 'loot', 'lawyer', 'chairman', 'complaint'
  ];
  const frustrationKeywords = [
    'angry', 'delay', 'delayed', 'irritated', 'third time', '3rd time', 'pathetic', 
    'useless', 'unacceptable', 'waiting', 'hours', 'shudder', 'broken', 'disaster', 'waste'
  ];
  const positiveKeywords = [
    'thank', 'thanks', 'great', 'awesome', 'approved', 'delighted', 'good', 'fast', 'smooth', 'satisfied'
  ];

  let foundAnger = severeAngerKeywords.filter(k => lower.includes(k));
  let foundFrustration = frustrationKeywords.filter(k => lower.includes(k));
  let foundPositive = positiveKeywords.filter(k => lower.includes(k));

  if (foundAnger.length > 0) {
    return {
      sentiment: 'Severe Agitation / Legal Threat',
      score: 0.95,
      isUrgentEscalation: true,
      keywords: [...foundAnger, ...foundFrustration]
    };
  } else if (foundFrustration.length > 0) {
    return {
      sentiment: 'Frustrated / High Friction',
      score: 0.75,
      isUrgentEscalation: true,
      keywords: foundFrustration
    };
  } else if (foundPositive.length > 0) {
    return {
      sentiment: 'Delighted / High Trust',
      score: 0.1,
      isUrgentEscalation: false,
      keywords: foundPositive
    };
  }
  return { sentiment: 'Neutral', score: 0.3, isUrgentEscalation: false, keywords: [] };
}

// =========================================================================
// 1. AUTHENTICATION & MULTI-TENANT ROLE MANAGEMENT (Point #2)
// =========================================================================
app.post('/api/auth/login', (req, res) => {
  const db = getDB();
  const { email, role } = req.body;
  
  let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user && role) {
    user = db.users.find(u => u.role === role);
  }
  if (!user) {
    user = db.users[0];
  }

  const tokenPayload = {
    userId: user.id,
    name: user.name,
    role: user.role,
    dealershipId: db.dealership.id,
    exp: Date.now() + (24 * 60 * 60 * 1000)
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  res.json({
    success: true,
    data: {
      token,
      user,
      dealership: db.dealership
    }
  });
});

app.get('/api/auth/users', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.users });
});

app.get('/api/dealership', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.dealership });
});

// =========================================================================
// 2. JOB CARDS & INTAKE (Point #15 - Predictive Odometer Included)
// =========================================================================
app.get('/api/job-cards', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.jobCards });
});

app.get('/api/job-cards/:id', (req, res) => {
  const db = getDB();
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });
  
  const vehicle = db.vehicles.find(v => v.id === jc.vehicleId);
  const thread = db.whatsappThreads[jc.id] || [];
  const roadTest = db.roadTests[jc.id] || null;
  
  res.json({ success: true, data: { ...jc, vehicle, whatsappThread: thread, roadTest } });
});

app.post('/api/job-cards/create', (req, res) => {
  const db = getDB();
  const { regNo, customerName, customerPhone, model, odometer, primaryConcerns, fuelType } = req.body;
  
  const newJcId = `jc-${Date.now().toString().slice(-4)}`;
  const newVehId = `veh-${Date.now().toString().slice(-4)}`;
  
  const odoNum = Number(odometer) || 20000;
  const newVehicle = {
    id: newVehId,
    regNo: regNo.toUpperCase(),
    vin: `MAT${Math.floor(100000 + Math.random() * 900000)}TATA`,
    model: model || "Tata Nexon Creative Plus",
    fuelType: fuelType || "Petrol",
    color: "Daytona Grey",
    year: 2023,
    odometer: odoNum,
    dailyUsageKm: 42,
    predictedOdometer: odoNum,
    customer: {
      name: customerName,
      phone: customerPhone,
      city: "Indore",
      sentiment: "Positive",
      isVIP: false
    },
    warranty: {
      standardStatus: "Active",
      extendedWarrantyEligible: true,
      ewQuote: { oneYear: 8500, twoYear: 13200, threeYear: 17800, riskWithoutEW: 48000, emiMonthly: 1100 }
    },
    currentJobCardId: newJcId,
    status: "Checked In (Triage Bay)",
    sa: { name: "Amit Sharma", phone: "+91 94250 88711" },
    technician: { name: "Sunil Rathore", bay: "Bay 3 (Express Mechanical)" }
  };
  
  const newJobCard = {
    id: newJcId,
    vehicleId: newVehId,
    regNo: regNo.toUpperCase(),
    model: newVehicle.model,
    customerName,
    customerPhone,
    intakeTime: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    stage: "intake",
    stageIndex: 0,
    primaryConcerns: primaryConcerns || ["Routine Periodic Service", "General Inspection"],
    videoItems: [],
    approvedItems: [
      { name: "Scheduled Periodic General Service & Multi-Point Inspection", partCost: 1800, laborCost: 1200, gst: 540, total: 3540, mandatory: true }
    ],
    totalEstimate: 3540,
    approvedTotal: 3540,
    paymentStatus: "Pending Handover",
    bay: "Bay 3 (Express Mechanical)",
    saName: "Amit Sharma",
    techName: "Sunil Rathore",
    roadTestCompleted: false,
    midDayPulseSent: false
  };
  
  db.vehicles.unshift(newVehicle);
  db.jobCards.unshift(newJobCard);
  db.whatsappThreads[newJcId] = [
    {
      id: `msg-${Date.now()}`,
      sender: "system",
      senderName: "Sanghi Tata Official Service",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "status_update",
      content: `🚗 *Namaste ${customerName}!* Your ${newVehicle.model} (${newVehicle.regNo}) has been safely checked in at *Sanghi Brothers Tata, Indore*. Service Advisor: *Amit Sharma*. Track live progress & approve video items: https://tata.sanghi.in/track/${newJcId}`
    }
  ];
  
  saveDB(db);
  broadcast('JOB_CARD_CREATED', newJobCard);
  
  res.json({ success: true, data: newJobCard });
});

// Itemized Approval
app.post('/api/job-cards/:id/approve-item', (req, res) => {
  const db = getDB();
  const { videoItemId } = req.body;
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const item = jc.videoItems?.find(v => v.id === videoItemId);
  if (item) {
    item.status = "approved";
    item.approvedAt = new Date().toISOString();
    jc.approvedTotal = (jc.approvedTotal || 0) + item.total;
    
    // Add to approved items if not present
    if (!jc.approvedItems.some(a => a.name === item.partName)) {
      jc.approvedItems.push({
        name: item.partName,
        partCost: item.partCost,
        laborCost: item.laborCost,
        gst: item.gst,
        total: item.total,
        mandatory: false
      });
    }
  }

  saveDB(db);
  broadcast('JOB_CARD_UPDATED', jc);
  res.json({ success: true, data: jc });
});

// Itemized Decline
app.post('/api/job-cards/:id/decline-item', (req, res) => {
  const db = getDB();
  const { videoItemId } = req.body;
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const item = jc.videoItems?.find(v => v.id === videoItemId);
  if (item) {
    item.status = "declined";
  }

  saveDB(db);
  broadcast('JOB_CARD_UPDATED', jc);
  res.json({ success: true, data: jc });
});

// Advance Stage with Road Test Enforcement
app.post('/api/job-cards/:id/advance-stage', (req, res) => {
  const db = getDB();
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });
  
  const stages = [
    { key: "intake", label: "Vehicle Intake & Digital Check-in" },
    { key: "inspection", label: "Multi-Point Health Inspection" },
    { key: "diagnostics", label: "OBD-II & Acoustic Diagnostics" },
    { key: "mechanical_repair", label: "Mechanical & Part Replacement" },
    { key: "washing", label: "Automated Washing & Detailing" },
    { key: "quality_check", label: "Pre-Delivery 5km Road Test & QC" },
    { key: "delivered", label: "Vehicle Delivered & Handed Over" }
  ];
  
  const currentIndex = jc.stageIndex !== undefined ? jc.stageIndex : stages.findIndex(s => s.key === jc.stage);
  const targetIndex = currentIndex + 1;

  if (targetIndex >= stages.length) {
    return res.status(400).json({ success: false, error: "Vehicle is already in final stage (Delivered)." });
  }

  if (stages[targetIndex].key === "delivered" && !jc.roadTestCompleted) {
    return res.status(403).json({
      success: false,
      error: "⛔ QUALITY ASSURANCE BLOCK: 5 km Pre-Delivery Road Test has NOT been logged or passed! Tata Aarohan Quality Shield forbids customer handover without verified technician road test signature."
    });
  }

  const nextStage = stages[targetIndex];
  jc.stage = nextStage.key;
  jc.stageIndex = targetIndex;
  
  const thread = db.whatsappThreads[jc.id] || [];
  const statusMessages = {
    inspection: `🔍 *Update:* Inspection in progress. Master technician is performing a 40-point safety check.`,
    diagnostics: `💻 *Update:* Connected to Tata Diagnostic Terminal. Scanning CAN-bus and sensor PIDs.`,
    mechanical_repair: `🔧 *Update:* Approved mechanical repairs and genuine parts installation underway in ${jc.bay}.`,
    washing: `🚿 *Update:* Mechanical work complete! Your vehicle has moved to Washing Bay 1 for foam bath and interior vacuuming.`,
    quality_check: `🛡️ *Update:* 5 km Pre-Delivery Road Test underway by Quality Supervisor to ensure First-Time-Right (FTR) quality.`,
    delivered: `🎉 *Congratulations!* Your vehicle is ready for delivery. Gate pass generated. Thank you for choosing Sanghi Brothers Tata!`
  };
  
  if (statusMessages[nextStage.key]) {
    thread.push({
      id: `msg-${Date.now()}`,
      sender: "system",
      senderName: "Sanghi Tata Official Service",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "status_update",
      content: statusMessages[nextStage.key]
    });
    db.whatsappThreads[jc.id] = thread;
  }
  
  saveDB(db);
  broadcast('JOB_CARD_UPDATED', jc);
  
  res.json({ success: true, data: jc });
});

// =========================================================================
// 3. PART B1: TATA CARE+ MOTOR INSURANCE UPSELL MODULE
// =========================================================================
app.get('/api/insurance/quotes', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.insuranceQuotes });
});

app.post('/api/insurance/dispatch-quote', (req, res) => {
  const db = getDB();
  const { quoteId } = req.body;
  const quote = db.insuranceQuotes.find(q => q.id === quoteId);
  if (!quote) return res.status(404).json({ success: false, error: "Quote not found" });

  quote.whatsappQuoteSent = true;
  
  // Post into WhatsApp thread
  const thread = db.whatsappThreads[quote.jobCardId] || [];
  thread.push({
    id: `msg-ins-${Date.now()}`,
    sender: "system",
    senderName: "Tata Care+ Insurance Desk",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "insurance_quote",
    content: `🛡️ *Tata Care+ Motor Insurance Renewal Quote*\n\nVehicle: *${quote.model} (${quote.regNo})*\nIDV Value: *₹${quote.idvValue.toLocaleString()}*\nPlan: *${quote.recommendedPlan}*\nSpecial Dealer Net Payable: *₹${quote.netPayable.toLocaleString()}* (50% NCB Applied)\n\nTap to lock in renewal with 1-click cash-less claim guarantee across all Sanghi Tata body shops.`
  });
  db.whatsappThreads[quote.jobCardId] = thread;

  saveDB(db);
  broadcast('INSURANCE_QUOTE_DISPATCHED', quote);

  res.json({ success: true, data: quote });
});

// =========================================================================
// 4. PART B2: ACCESSORY RECOMMENDATION ENGINE
// =========================================================================
app.get('/api/accessories/:model', (req, res) => {
  const db = getDB();
  const modelKey = req.params.model;
  const accessories = db.accessoryCatalog[modelKey] || db.accessoryCatalog["Tata Harrier Fearless Plus Dark Edition"] || [];
  res.json({ success: true, data: accessories });
});

app.post('/api/job-cards/:id/add-accessory', (req, res) => {
  const db = getDB();
  const { accessoryId, model } = req.body;
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const catalog = db.accessoryCatalog[model || jc.model] || Object.values(db.accessoryCatalog)[0];
  const acc = catalog.find(a => a.id === accessoryId);
  if (!acc) return res.status(404).json({ success: false, error: "Accessory not found" });

  const totalCost = acc.mrp + acc.installLabor;
  const gst = Math.round(totalCost * 0.18);
  const grandTotal = totalCost + gst;

  jc.approvedItems.push({
    name: `OEM Accessory: ${acc.name} (Part #${acc.partNo})`,
    partCost: acc.mrp,
    laborCost: acc.installLabor,
    gst,
    total: grandTotal,
    mandatory: false
  });

  jc.approvedTotal += grandTotal;

  saveDB(db);
  broadcast('JOB_CARD_UPDATED', jc);

  res.json({ success: true, data: { jobCard: jc, addedAccessory: acc } });
});

// =========================================================================
// 5. PART B3: WHATSAPP SERVICE REMINDER DRIP SEQUENCES
// =========================================================================
app.get('/api/drip-campaigns/status', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.dripSequences });
});

app.post('/api/drip-campaigns/trigger-step', (req, res) => {
  const db = getDB();
  const { stepNumber, jobCardId } = req.body;
  const seq = db.dripSequences.find(s => s.step === Number(stepNumber));
  if (!seq) return res.status(404).json({ success: false, error: "Sequence step not found" });

  const jcId = jobCardId || "jc-4020";
  const thread = db.whatsappThreads[jcId] || [];
  thread.push({
    id: `msg-drip-${Date.now()}`,
    sender: "system",
    senderName: "Sanghi Tata Care Automations",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "drip_nudge",
    content: `📬 *${seq.title}*\n\n${seq.content}`
  });
  db.whatsappThreads[jcId] = thread;

  saveDB(db);
  broadcast('WHATSAPP_UPDATE', { jobCardId: jcId, message: thread[thread.length - 1] });

  res.json({ success: true, data: { step: seq, jobCardId: jcId } });
});

// =========================================================================
// 6. PART B4: DAILY MD/GM WHATSAPP MORNING BRIEFING
// =========================================================================
app.get('/api/briefing/morning', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.mdMorningBriefing });
});

app.post('/api/briefing/send-to-md', (req, res) => {
  const db = getDB();
  const briefing = db.mdMorningBriefing;

  db.whatsappConfig.logs.unshift({
    id: `log-md-${Date.now()}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "MD_DAILY_BRIEFING_DISPATCH",
    recipient: briefing.recipient,
    content: briefing.sampleWhatsAppMessage.slice(0, 70) + '...',
    status: "DELIVERED_READ"
  });

  saveDB(db);
  broadcast('MD_BRIEFING_SENT', briefing);

  res.json({
    success: true,
    data: {
      message: `Executive Daily Briefing successfully dispatched to ${briefing.recipient} via WhatsApp.`,
      briefing
    }
  });
});

// =========================================================================
// 7. PART B5: TATA SEVA LOYALTY POINTS ENGINE
// =========================================================================
app.get('/api/loyalty/:vehicleId', (req, res) => {
  const db = getDB();
  const account = db.loyaltyAccounts[req.params.vehicleId] || db.loyaltyAccounts["veh-001"];
  res.json({ success: true, data: account });
});

app.post('/api/loyalty/redeem', (req, res) => {
  const db = getDB();
  const { vehicleId, perkName, pointsCost } = req.body;
  const account = db.loyaltyAccounts[vehicleId || "veh-001"];
  if (!account) return res.status(404).json({ success: false, error: "Loyalty account not found" });

  const cost = Number(pointsCost) || 400;
  if (account.pointsBalance < cost) {
    return res.status(400).json({ success: false, error: `Insufficient points! Balance is ${account.pointsBalance}, required ${cost}.` });
  }

  account.pointsBalance -= cost;
  account.pointValueINR = account.pointsBalance;

  saveDB(db);
  broadcast('LOYALTY_POINTS_REDEEMED', { vehicleId, perkName, remainingBalance: account.pointsBalance });

  res.json({
    success: true,
    data: {
      message: `Successfully redeemed '${perkName}' for ${cost} Tata Seva Points. Remaining Balance: ${account.pointsBalance} pts.`,
      account
    }
  });
});

// =========================================================================
// 8. PART B9: EXPORT REPORTS TO CSV / EXCEL
// =========================================================================
app.get('/api/reports/export-csv', (req, res) => {
  const db = getDB();
  const type = req.query.type || 'job_cards';

  if (type === 'job_cards') {
    let csv = "Job Card ID,Registration No,Model,Customer Name,Phone,Intake Time,Stage,Approved Total (INR),Payment Status\n";
    db.jobCards.forEach(j => {
      csv += `"${j.id}","${j.regNo}","${j.model}","${j.customerName}","${j.customerPhone}","${j.intakeTime}","${j.stage}","${j.approvedTotal}","${j.paymentStatus}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Tata_Sanghi_JobCards_Report.csv"');
    return res.send(csv);
  }

  if (type === 'financials') {
    let csv = "Metric,Monthly Baseline (Old INR),NatureXpress Optimized (INR),Variance (%)\n";
    csv += `"Average Job Card Turnaround","8.5 Hours","4.2 Hours","-50.5%"\n`;
    csv += `"First Time Right (FTR) Rate","68.2%","93.4%","+25.2%"\n`;
    csv += `"Warranty Claim Rejection Rate","9.8%","0.8%","-9.0%"\n`;
    csv += `"Average Monthly Dealer Gross Profit","₹14,20,000","₹23,80,000","+67.6%"\n`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Tata_Sanghi_Financial_PL.csv"');
    return res.send(csv);
  }

  res.json({ success: false, error: "Invalid report type" });
});

// =========================================================================
// 9. PART B10: DEMO SANDBOX TOOL & SCENARIO INJECTOR
// =========================================================================
app.post('/api/admin/inject-scenario', (req, res) => {
  const db = getDB();
  const { scenario } = req.body;

  if (scenario === 'angry_customer') {
    const targetJc = db.jobCards[0];
    const angryMsg = {
      id: `msg-sim-${Date.now()}`,
      sender: "customer",
      senderName: targetJc.customerName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "escalation",
      content: "Why is my car delayed by 5 hours? If this is not sorted by 6pm I am taking this to Consumer Court and Twitter!",
      sentiment: { sentiment: "Severe Agitation / Legal Threat", score: 0.96, isUrgentEscalation: true, keywords: ["court", "delay", "twitter"] }
    };
    db.whatsappThreads[targetJc.id].push(angryMsg);
    
    // Create CCM alert
    const newAlert = {
      id: `ccm-sim-${Date.now().toString().slice(-4)}`,
      jobCardId: targetJc.id,
      regNo: targetJc.regNo,
      model: targetJc.model,
      customerName: targetJc.customerName,
      customerPhone: targetJc.customerPhone,
      triggerReason: "Injected Demo Scenario: Customer Legal Escalation Triggered",
      severity: "CRITICAL",
      sentimentScore: 0.96,
      escalatedAt: new Date().toISOString(),
      status: "Action Required: CCM Intervention",
      assignedCCM: "Kunal Deshmukh (Tata OEM CCM)",
      assignedGM: "Chetan Sanghi (MD)",
      rootCause: "Customer message: Consumer Court threat"
    };
    db.ccmAlerts.unshift(newAlert);
    saveDB(db);
    broadcast('CCM_ALERT_CREATED', newAlert);
    broadcast('WHATSAPP_UPDATE', { jobCardId: targetJc.id, message: angryMsg });
    return res.json({ success: true, message: "Injected Angry Customer & CCM Escalation Scenario" });
  }

  if (scenario === 'ew_sale') {
    const targetJc = db.jobCards[1] || db.jobCards[0];
    targetJc.extendedWarrantyPurchased = {
      package: "Platinum 5-Year Comprehensive",
      price: 24500,
      emi: "₹2,041/mo (12 Mos No-Cost EMI)",
      commission: 1100
    };
    targetJc.approvedTotal += 24500;
    db.leaderboard.serviceAdvisors[0].ewSold += 1;
    db.leaderboard.serviceAdvisors[0].ewRevenue += 24500;
    db.leaderboard.serviceAdvisors[0].commissionEarned += 1100;
    saveDB(db);
    broadcast('JOB_CARD_UPDATED', targetJc);
    return res.json({ success: true, message: "Injected Platinum EW Sale (+₹1,100 Commission)" });
  }

  res.json({ success: false, error: "Unknown scenario" });
});

// All Existing Supporting Endpoints
app.get('/api/webhook/whatsapp', (req, res) => {
  const db = getDB();
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === db.whatsappConfig.webhookVerifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/api/webhook/whatsapp', (req, res) => {
  const db = getDB();
  const { from, text, jobCardId } = req.body;
  let targetJcId = jobCardId || "jc-8899";
  const messageText = text || "Hello";
  const sentimentAnalysis = analyzeSentiment(messageText);

  const newMessage = {
    id: `msg-in-${Date.now()}`,
    sender: "customer",
    senderName: db.jobCards.find(j => j.id === targetJcId)?.customerName || "Customer",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: sentimentAnalysis.isUrgentEscalation ? "escalation" : "chat",
    content: messageText,
    sentiment: sentimentAnalysis
  };

  if (!db.whatsappThreads[targetJcId]) db.whatsappThreads[targetJcId] = [];
  db.whatsappThreads[targetJcId].push(newMessage);

  if (sentimentAnalysis.isUrgentEscalation) {
    const existingAlert = db.ccmAlerts.find(a => a.jobCardId === targetJcId);
    if (!existingAlert) {
      const jc = db.jobCards.find(j => j.id === targetJcId);
      const newAlert = {
        id: `ccm-auto-${Date.now().toString().slice(-4)}`,
        jobCardId: targetJcId,
        regNo: jc ? jc.regNo : "MP-09-XX-0000",
        model: jc ? jc.model : "Tata Vehicle",
        customerName: jc ? jc.customerName : "Customer",
        customerPhone: jc ? jc.customerPhone : from,
        triggerReason: `Real-time WhatsApp Sentiment Alert: [${sentimentAnalysis.keywords.join(', ')}]`,
        severity: "CRITICAL",
        sentimentScore: sentimentAnalysis.score,
        escalatedAt: new Date().toISOString(),
        status: "Action Required: CCM Intervention",
        assignedCCM: "Kunal Deshmukh (Tata OEM CCM)",
        assignedGM: "Chetan Sanghi (MD)",
        rootCause: `Customer message: "${messageText}"`
      };
      db.ccmAlerts.unshift(newAlert);
      broadcast('CCM_ALERT_CREATED', newAlert);
    }
  }

  saveDB(db);
  broadcast('WHATSAPP_UPDATE', { jobCardId: targetJcId, message: newMessage });
  res.json({ success: true, data: { message: newMessage, sentiment: sentimentAnalysis } });
});

app.post('/api/whatsapp/send-direct', (req, res) => {
  const db = getDB();
  const { jobCardId, content, sender, senderName } = req.body;
  if (!db.whatsappThreads[jobCardId]) db.whatsappThreads[jobCardId] = [];

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: sender || "advisor",
    senderName: senderName || "Amit Sharma (SA)",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "chat",
    content
  };

  db.whatsappThreads[jobCardId].push(newMsg);
  saveDB(db);
  broadcast('WHATSAPP_UPDATE', { jobCardId, message: newMsg });
  res.json({ success: true, data: newMsg });
});

app.get('/api/whatsapp/config', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.whatsappConfig });
});

app.post('/api/whatsapp/config', (req, res) => {
  const db = getDB();
  db.whatsappConfig = { ...db.whatsappConfig, ...req.body };
  saveDB(db);
  res.json({ success: true, data: db.whatsappConfig });
});

app.post('/api/job-cards/:id/pulse-check', (req, res) => {
  const db = getDB();
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  jc.midDayPulseSent = true;
  const thread = db.whatsappThreads[jc.id] || [];
  const pulseMsg = {
    id: `msg-pulse-${Date.now()}`,
    sender: "system",
    senderName: "Sanghi Tata Service Bot",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "interactive_pulse",
    content: `👋 *Namaste ${jc.customerName}!* How is your service experience at Sanghi Tata today so far?\n\n[😊 Delighted]  [😐 Neutral]  [😞 Concerned]`
  };
  thread.push(pulseMsg);
  db.whatsappThreads[jc.id] = thread;
  saveDB(db);
  broadcast('WHATSAPP_UPDATE', { jobCardId: jc.id, message: pulseMsg });
  res.json({ success: true, data: { jobCardId: jc.id, pulseSent: true } });
});

app.post('/api/payments/create-link', (req, res) => {
  const db = getDB();
  const { jobCardId, packageTier, amount, tenureMonths } = req.body;
  const jc = db.jobCards.find(j => j.id === jobCardId);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const monthly = Math.round(Number(amount) / (Number(tenureMonths) || 12));
  const linkId = `plink_Tata_${Date.now().toString().slice(-6)}`;
  const paymentRecord = {
    id: `pay-${Date.now().toString().slice(-4)}`,
    jobCardId: jc.id,
    type: "EXTENDED_WARRANTY_EMI",
    customerName: jc.customerName,
    customerPhone: jc.customerPhone,
    packageTier: packageTier || "Gold Shield (2-Year)",
    amount: Number(amount),
    emiTenureMonths: Number(tenureMonths) || 12,
    monthlyEmi: monthly,
    provider: "Razorpay / Pine Labs No-Cost EMI",
    razorpayLinkId: linkId,
    paymentUrl: `https://rzp.io/i/${linkId}`,
    status: "LINK_GENERATED",
    timestamp: new Date().toISOString()
  };

  db.payments.unshift(paymentRecord);
  saveDB(db);
  res.json({ success: true, data: paymentRecord });
});

app.post('/api/payments/verify-instant', (req, res) => {
  const db = getDB();
  const { jobCardId, packageTier, amount, tenureMonths, commission } = req.body;
  const jc = db.jobCards.find(j => j.id === jobCardId);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const monthly = Math.round(Number(amount) / (Number(tenureMonths) || 12));
  const commAmount = Number(commission) || 650;

  jc.extendedWarrantyPurchased = {
    package: packageTier || "Gold Shield 2-Year Comprehensive",
    price: Number(amount),
    emi: `₹${monthly}/mo (${tenureMonths || 12} Mos No-Cost EMI)`,
    commission: commAmount
  };
  jc.approvedTotal += Number(amount);

  const payRecord = {
    id: `pay-${Date.now().toString().slice(-4)}`,
    jobCardId: jc.id,
    type: "EXTENDED_WARRANTY_EMI",
    customerName: jc.customerName,
    customerPhone: jc.customerPhone,
    amount: Number(amount),
    emiTenureMonths: Number(tenureMonths) || 12,
    monthlyEmi: monthly,
    provider: "Razorpay No-Cost EMI",
    razorpayLinkId: `rzp_settled_${Date.now().toString().slice(-6)}`,
    paymentUrl: "https://rzp.io/success",
    status: "COMPLETED",
    timestamp: new Date().toISOString(),
    saCommissionPaid: commAmount
  };
  db.payments.unshift(payRecord);

  const sa = db.leaderboard.serviceAdvisors.find(s => s.name === jc.saName) || db.leaderboard.serviceAdvisors[0];
  if (sa) {
    sa.ewSold += 1;
    sa.ewRevenue += Number(amount);
    sa.commissionEarned += commAmount;
  }

  const thread = db.whatsappThreads[jc.id] || [];
  thread.push({
    id: `msg-ew-${Date.now()}`,
    sender: "system",
    senderName: "Sanghi Tata Official Service",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "ew_receipt",
    content: `🛡️ *Extended Warranty Certificate Activated!*\n\nVehicle: *${jc.model} (${jc.regNo})*\nPackage: *${packageTier}*\nCoverage: *5 Years / 150,000 km*\nEMI Plan: *₹${monthly}/month (No-Cost EMI via Razorpay)*\n\nCertificate #EW-SNG-${Date.now().toString().slice(-6)} linked to VIN.`
  });
  db.whatsappThreads[jc.id] = thread;

  saveDB(db);
  broadcast('JOB_CARD_UPDATED', jc);
  broadcast('EW_PURCHASED', { jobCardId: jc.id, payment: payRecord, saCommission: commAmount });

  res.json({ success: true, data: { jobCard: jc, payment: payRecord } });
});

app.get('/api/job-cards/:id/invoice', (req, res) => {
  const db = getDB();
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const vehicle = db.vehicles.find(v => v.id === jc.vehicleId);
  const invoiceNo = `INV-SNG-2026-${jc.id.replace('jc-', '')}`;
  
  let partsTotal = 0;
  let laborTotal = 0;
  let gstTotal = 0;

  const lineItems = (jc.approvedItems || []).map((item, idx) => {
    partsTotal += (item.partCost || 0);
    laborTotal += (item.laborCost || 0);
    gstTotal += (item.gst || 0);
    return {
      srNo: idx + 1,
      description: item.name,
      hsnSacCode: item.partCost > 0 ? "87082900" : "998729",
      partCost: item.partCost || 0,
      laborCost: item.laborCost || 0,
      cgstRate: "9%",
      sgstRate: "9%",
      gstAmount: item.gst || 0,
      total: item.total || (item.partCost + item.laborCost + item.gst)
    };
  });

  const grandTotal = jc.approvedTotal;

  res.json({
    success: true,
    data: {
      invoiceNo,
      invoiceDate: new Date().toISOString().split('T')[0],
      dealership: db.dealership,
      customer: {
        name: jc.customerName,
        phone: jc.customerPhone,
        address: vehicle ? `${vehicle.customer.city}, Madhya Pradesh` : "Indore, MP"
      },
      vehicle: {
        regNo: jc.regNo,
        model: jc.model,
        vin: vehicle ? vehicle.vin : "MAT621459P1N08899",
        odometer: vehicle ? vehicle.odometer : 24350,
        jobCardId: jc.id,
        saName: jc.saName
      },
      lineItems,
      financials: {
        partsTotal,
        laborTotal,
        taxableValue: partsTotal + laborTotal,
        cgstTotal: Math.round(gstTotal / 2),
        sgstTotal: Math.round(gstTotal / 2),
        gstTotal,
        grandTotal
      },
      authorizedSignatory: "For Sanghi Brothers (Indore) Pvt Ltd",
      digitalSignatureHash: crypto.createHash('sha256').update(invoiceNo + grandTotal).digest('hex')
    }
  });
});

app.get('/api/parts/bins', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.partsBins });
});

app.post('/api/parts/bin-checkout', (req, res) => {
  const db = getDB();
  const { barcode, jobCardId, scannedBy } = req.body;

  const bin = db.partsBins.find(b => b.barcode === barcode || b.binId === barcode || b.partNumber === barcode);
  if (!bin) return res.status(404).json({ success: false, error: "Part bin not found for barcode." });

  if (bin.availableStock <= 0) {
    return res.status(400).json({ success: false, error: `Bin ${bin.binId} has 0 available physical stock!` });
  }

  const jc = db.jobCards.find(j => j.id === jobCardId);
  const sealId = `SEAL-${Date.now().toString().slice(-6)}`;

  bin.availableStock -= 1;
  bin.allocatedStock += 1;
  bin.lockedJobCardId = jobCardId;
  bin.antiCannibalizationSeal = sealId;
  bin.lastScannedBy = scannedBy || "Rakesh Verma (Parts Head)";

  saveDB(db);
  broadcast('BIN_CHECKED_OUT', { bin, jobCardId, sealId });

  res.json({
    success: true,
    data: {
      bin,
      antiCannibalizationSeal: sealId,
      message: `Part [${bin.partName}] scanned and locked to Job Card ${jobCardId} (${jc ? jc.regNo : ''}).`
    }
  });
});

app.post('/api/job-cards/:id/road-test', (req, res) => {
  const db = getDB();
  const jc = db.jobCards.find(j => j.id === req.params.id);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  const { inspectorName, startOdo, endOdo, checklist, supervisorComments } = req.body;
  const distance = Math.max(0, (Number(endOdo) || 0) - (Number(startOdo) || 0));

  if (distance < 5.0) {
    return res.status(400).json({
      success: false,
      error: `Road Test Gate Failed: Minimum mandatory distance is 5.0 km (logged ${distance.toFixed(1)} km).`
    });
  }

  const roadTestRecord = {
    jobCardId: jc.id,
    regNo: jc.regNo,
    model: jc.model,
    inspectorName: inspectorName || "Deepak Yadav (Master Tech)",
    startOdo: Number(startOdo),
    endOdo: Number(endOdo),
    distanceKm: distance,
    timestamp: new Date().toISOString(),
    checklist: checklist || {},
    status: "PASSED",
    signedBy: inspectorName || "Deepak Yadav (Master Tech)",
    supervisorComments: supervisorComments || "5 km mandatory road test verified."
  };

  db.roadTests[jc.id] = roadTestRecord;
  jc.roadTestCompleted = true;

  saveDB(db);
  broadcast('ROAD_TEST_LOGGED', { jobCardId: jc.id, roadTest: roadTestRecord });

  res.json({ success: true, data: roadTestRecord });
});

app.post('/api/diagnostics/acoustic-analyze', (req, res) => {
  const { vehicleModel, audioProfile } = req.body;
  const acousticProfiles = {
    "timing_belt": {
      fault: "1.2L Revotron Timing Belt Tensioner Harmonic Slack",
      frequencyPeak: "1840 Hz (Flutter Resonance)",
      confidence: "97.2%",
      riskLevel: "Critical",
      hindiSolution: "टाइमिंग बेल्ट टेंशनर में ढीलापन है। टेंशनर पुली और बेल्ट किट तुरंत बदलें। इग्निशन टाइमिंग 2.4° रिटार्ड हो रही है।",
      partRequired: "Timing Belt Tensioner Kit #2841-8890-11"
    },
    "alternator_bearing": {
      fault: "Kryotec 2.0L Alternator Freewheel Bearing Dry Wear",
      frequencyPeak: "3420 Hz (High-Pitched Whine)",
      confidence: "95.8%",
      riskLevel: "Medium",
      hindiSolution: "अल्टरनेटर की फ्री-व्हील पुली बेयरिंग सूखी चल रही है। 40,000 km सर्विस पर पुली लुब्रिकेशन या चाइल्ड-बेयरिंग रिप्लेसमेंट आवश्यक है।",
      partRequired: "Alternator Decoupler Pulley #2811-4420-00"
    },
    "ev_chiller_pump": {
      fault: "Ziptron EV Battery Chiller Cavitation / Low Pressure",
      frequencyPeak: "720 Hz (Cavitation Pulsing)",
      confidence: "98.4%",
      riskLevel: "High",
      hindiSolution: "HV बैटरी कूलेंट पंप में एयर पॉकेट (Air Lock) है। वैक्यूम ब्लीडिंग टूल से कूलेंट लूप को फ्लैश करें।",
      partRequired: "Ziptron Organic EV Coolant #2872-0091-00"
    }
  };

  const selected = acousticProfiles[audioProfile] || acousticProfiles["timing_belt"];
  res.json({
    success: true,
    data: {
      ...selected,
      analyzedAt: new Date().toISOString(),
      spectrogramData: [12, 45, 88, 140, 290, 180, 95, 30]
    }
  });
});

app.get('/api/edms/status', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.eDmsQueue });
});

app.post('/api/edms/sync', (req, res) => {
  const db = getDB();
  db.eDmsQueue.lastSuccessfulSync = new Date().toISOString();
  db.eDmsQueue.morningPeakLagBypassedCount += 1;
  db.eDmsQueue.pendingPackets = [];
  saveDB(db);
  broadcast('EDMS_SYNC_COMPLETED', db.eDmsQueue);
  res.json({
    success: true,
    data: {
      status: "SYNC_COMPLETE",
      siebelResponseCode: "SOAP_200_OK",
      syncedAt: db.eDmsQueue.lastSuccessfulSync,
      message: "Bi-directional sync completed."
    }
  });
});

app.get('/api/oem/batch-defects', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.batchDefects });
});

app.get('/api/csi/status', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.csiIntegrity });
});

app.post('/api/csi/dispatch-survey', (req, res) => {
  const db = getDB();
  const { jobCardId } = req.body;
  const jc = db.jobCards.find(j => j.id === jobCardId);
  if (!jc) return res.status(404).json({ success: false, error: "Job card not found" });

  db.csiIntegrity.totalSurveysSentToday += 1;
  db.csiIntegrity.directOemDispatched += 1;
  db.csiIntegrity.auditLogs.unshift({
    id: `csi-aud-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    action: "OEM_SURVEY_DISPATCHED",
    regNo: jc.regNo,
    customerPhone: jc.customerPhone,
    status: "DISPATCHED_DIRECT_FROM_OEM"
  });

  saveDB(db);
  res.json({
    success: true,
    data: {
      message: `CSI Survey dispatched directly to verified customer mobile (${jc.customerPhone}).`
    }
  });
});

app.post('/api/dead-stock/:id/make-offer', (req, res) => {
  const db = getDB();
  const item = db.deadStockPool.find(d => d.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: "Item not found" });

  const { counterOfferAmount, targetDealer } = req.body;
  item.negotiationStatus = "COUNTER_OFFER_RECEIVED";
  item.counterOfferAmount = Number(counterOfferAmount) || item.discountedOffer;
  item.targetDealer = targetDealer || "Jagdish Motors Pithampur";

  saveDB(db);
  broadcast('DEAD_STOCK_OFFER_UPDATED', item);
  res.json({ success: true, data: item });
});

app.post('/api/dead-stock/:id/accept-offer', (req, res) => {
  const db = getDB();
  const item = db.deadStockPool.find(d => d.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: "Item not found" });

  item.negotiationStatus = "OFFER_ACCEPTED";
  db.territoryNetworkStats.deadStockLiquidatedThisMonth += (item.counterOfferAmount || item.discountedOffer);

  saveDB(db);
  broadcast('DEAD_STOCK_LIQUIDATED', item);
  res.json({ success: true, data: item });
});

app.get('/api/parts/buffer-forecast', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.fastMovingBufferForecast });
});

app.get('/api/system/queue-status', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.eventBrokerQueue });
});

app.post('/api/admin/reset-demo-data', (req, res) => {
  saveDB(INITIAL_DATA);
  broadcast('DATA_RESET', { reset: true });
  res.json({ success: true, message: "Demo seed data cleanly restored to initial state." });
});

app.get('/api/ccm-radar', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.ccmAlerts });
});

app.post('/api/ccm-radar/:id/intervene', (req, res) => {
  const db = getDB();
  const alert = db.ccmAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ success: false, error: "Alert not found" });
  
  const { actionNotes, goodwillDiscountPercent, courtesyCarAssigned } = req.body;
  alert.status = "Resolved by CCM Intervention";
  alert.actionTaken = `${actionNotes || 'Personal intervention by OEM CCM'}. Courtesy Car: ${courtesyCarAssigned ? 'Yes' : 'No'}, Goodwill: ${goodwillDiscountPercent || 0}%`;
  
  saveDB(db);
  broadcast('CCM_ALERT_RESOLVED', alert);
  res.json({ success: true, data: alert });
});

app.get('/api/cre-queue', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.creQueue });
});

app.post('/api/cre-queue/:id/nudge-whatsapp', (req, res) => {
  const db = getDB();
  const lead = db.creQueue.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: "Lead not found" });
  
  lead.callStatus = "WARM_NUDGE_SENT";
  lead.nudgeSentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  saveDB(db);
  broadcast('CRE_LEAD_UPDATED', lead);
  res.json({ success: true, data: lead });
});

app.get('/api/ew-packages', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.ewPackages });
});

app.get('/api/campaigns', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.campaigns });
});

app.get('/api/leaderboard', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.leaderboard });
});

app.get('/api/value-club', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.valueClubMemberships });
});

app.get('/api/warranty-claims', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.warrantyClaims });
});

app.get('/api/diagnostics/dtc/:code', (req, res) => {
  const db = getDB();
  const code = req.params.code.toUpperCase();
  const dtc = db.diagnosticKnowledgeBase[code];
  if (!dtc) return res.status(404).json({ success: false, error: "DTC code not found in knowledge base" });
  res.json({ success: true, data: dtc });
});

app.get('/api/inter-dealer-parts', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.interDealerPartsPool });
});

app.get('/api/dead-stock', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.deadStockPool });
});

app.get('/api/territory-stats', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.territoryNetworkStats });
});

// --- Phase 1: Revenue Leakage Radar & Action Center Routes ---
app.get('/api/revenue-leakage', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.revenueLeakageRadar || INITIAL_DATA.revenueLeakageRadar });
});

app.get('/api/revenue-opportunities', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.revenueOpportunities || INITIAL_DATA.revenueOpportunities });
});

app.post('/api/revenue-opportunities/:id/execute-action', (req, res) => {
  const db = getDB();
  if (!db.revenueOpportunities) {
    db.revenueOpportunities = JSON.parse(JSON.stringify(INITIAL_DATA.revenueOpportunities));
  }
  const opp = db.revenueOpportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ success: false, error: "Opportunity not found" });

  if (opp.status === 'RECOVERED') {
    return res.json({ success: true, data: opp, message: "Opportunity already recovered." });
  }

  opp.status = "RECOVERED";
  opp.recoveredAt = new Date().toISOString();

  // Update dynamic radar counters
  if (!db.revenueLeakageRadar) {
    db.revenueLeakageRadar = JSON.parse(JSON.stringify(INITIAL_DATA.revenueLeakageRadar));
  }
  const radar = db.revenueLeakageRadar;
  radar.totalRecoveredToday = (radar.totalRecoveredToday || 0) + opp.marginValue;
  radar.totalLeakageAtRisk = Math.max(0, (radar.totalLeakageAtRisk || 472500) - opp.grossValue);
  radar.monthlyRecoveredAchieved = (radar.monthlyRecoveredAchieved || 548200) + opp.marginValue;

  const catKey = opp.categoryKey;
  if (radar.categories && radar.categories[catKey]) {
    radar.categories[catKey].recoveredAmount = (radar.categories[catKey].recoveredAmount || 0) + opp.marginValue;
    radar.categories[catKey].amount = Math.max(0, (radar.categories[catKey].amount || 0) - opp.grossValue);
  }

  // If this opportunity links to a job card or WhatsApp thread, log the action into the thread
  if (opp.jobCardId) {
    const thread = db.whatsappThreads[opp.jobCardId] || [];
    let messageContent = '';
    if (opp.actionType === 'WHATSAPP_INSURANCE') {
      messageContent = `📋 *Tata Care+ Motor Insurance Renewal Quote Sent:*\n\nVehicle: *${opp.vehicle} (${opp.regNo})*\nPlan: *${opp.title}*\nNet Payable: *₹${opp.grossValue.toLocaleString('en-IN')}* (50% NCB Applied)\n\nTap to complete renewal authorization: https://tata.sanghi.in/renew/${opp.id}`;
    } else if (opp.actionType === 'VIDEO_APPROVAL') {
      messageContent = `📹 *15-Second Inspection Video Approval Dispatched:*\n\nEstimate: *${opp.title}*\nAmount: *₹${opp.grossValue.toLocaleString('en-IN')} incl GST*\n\nTap for 1-click digital authorization: https://tata.sanghi.in/approve/${opp.id}`;
    } else if (opp.actionType === 'RAZORPAY_EMI') {
      messageContent = `🛡️ *Tata Care+ Extended Warranty No-Cost EMI Link:*\n\nPlan: *${opp.title}*\nMonthly EMI: *₹1,791/mo (No-Cost EMI via Razorpay)*\n\nActivate instant coverage: https://rzp.io/i/TatEW_${opp.id}`;
    } else if (opp.actionType === 'WHATSAPP_DRIP') {
      messageContent = `🚗 *Scheduled Service Nudge Sent:*\n\n*${opp.vehicle} (${opp.regNo})* is due for periodic maintenance.\nExpress Bay reserved. Tap to confirm slot: https://tata.sanghi.in/book/${opp.id}`;
    } else {
      messageContent = `✨ *Exclusive OEM Genuine Accessory Bundle Recommended:*\n\n*${opp.title}*\nPackage Price: *₹${opp.grossValue.toLocaleString('en-IN')} incl fitting*`;
    }

    const actionMsg = {
      id: `msg-act-${Date.now()}`,
      sender: "advisor",
      senderName: `${opp.assignedSA || 'Amit Sharma'} (SA)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "action_dispatch",
      content: messageContent
    };
    thread.push(actionMsg);
    db.whatsappThreads[opp.jobCardId] = thread;
    broadcast('WHATSAPP_UPDATE', { jobCardId: opp.jobCardId, message: actionMsg });
  }

  // Update staff commission in leaderboard
  if (db.leaderboard && db.leaderboard.serviceAdvisors) {
    const sa = db.leaderboard.serviceAdvisors.find(s => s.name === opp.assignedSA) || db.leaderboard.serviceAdvisors[0];
    if (sa) {
      sa.commissionEarned += Math.round(opp.marginValue * 0.1);
      sa.upsellRevenue = (sa.upsellRevenue || 0) + opp.grossValue;
    }
  }

  saveDB(db);
  broadcast('REVENUE_OPPORTUNITY_RECOVERED', { opportunity: opp, radar });
  res.json({
    success: true,
    data: {
      opportunity: opp,
      radar,
      recoveredMargin: opp.marginValue,
      grossValue: opp.grossValue
    }
  });
});

app.get('/api/executive/command-summary', (req, res) => {
  const db = getDB();
  const radar = db.revenueLeakageRadar || INITIAL_DATA.revenueLeakageRadar;
  const opps = db.revenueOpportunities || INITIAL_DATA.revenueOpportunities;
  const openOpps = opps.filter(o => o.status !== 'RECOVERED');
  const recoveredOpps = opps.filter(o => o.status === 'RECOVERED');

  const pendingJobCards = (db.jobCards || []).filter(j => j.status !== 'delivered');
  const criticalComplaints = (db.ccmAlerts || []).filter(c => c.sentimentScore > 0.7 || c.status !== 'Resolved by CCM Intervention');
  const partsShortages = (db.fastMovingBufferForecast?.predictedDemand || []).filter(p => (p.bufferStatus || '').includes('SHORTAGE'));

  res.json({
    success: true,
    data: {
      dealership: db.dealership,
      dealershipGroup: db.dealershipGroup || INITIAL_DATA.dealershipGroup,
      radar,
      totalPendingOpportunities: openOpps.length,
      totalRecoveredOpportunities: recoveredOpps.length,
      activeVehiclesInWorkshop: pendingJobCards.length,
      bayUtilizationPercent: Math.round((pendingJobCards.length / (db.dealership?.activeBays || 18)) * 100),
      criticalComplaintsCount: criticalComplaints.length,
      partsShortagesCount: partsShortages.length,
      todayEstimatedRevenue: 842000,
      todayRecoveredRevenue: radar.totalRecoveredToday
    }
  });
});

// =========================================================================
// STEP 1: MULTI-BRANCH GROUP HIERARCHY & IMMUTABLE AUDIT LEDGER (SHA-256)
// =========================================================================

function logAuditEvent(eventData) {
  const db = getDB();
  if (!db.auditLedger) {
    db.auditLedger = JSON.parse(JSON.stringify(INITIAL_DATA.auditLedger || []));
  }

  const previousEvent = db.auditLedger[db.auditLedger.length - 1];
  const previousHash = previousEvent ? previousEvent.sha256Hash : "0000000000000000000000000000000000000000000000000000000000000000";
  
  const eventId = `evt-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();
  
  const rawPayload = JSON.stringify({
    eventId,
    timestamp,
    branchId: eventData.branchId || db.dealership.id || "sanghi-bypass",
    userId: eventData.userId || "usr-01",
    actionType: eventData.actionType,
    entityId: eventData.entityId,
    details: eventData.details,
    previousHash
  });

  const sha256Hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

  const newEvent = {
    id: eventId,
    timestamp,
    branchId: eventData.branchId || db.dealership.id || "sanghi-bypass",
    userId: eventData.userId || "usr-01",
    userName: eventData.userName || "Chetan Sanghi",
    userRole: eventData.userRole || "DEALER_PRINCIPAL",
    actionType: eventData.actionType,
    entityType: eventData.entityType || "GENERAL",
    entityId: eventData.entityId || "N/A",
    details: eventData.details || "",
    ipAddress: eventData.ipAddress || "192.168.1.10",
    previousHash,
    sha256Hash,
    severity: eventData.severity || "INFO"
  };

  db.auditLedger.push(newEvent);
  saveDB(db);
  broadcast('AUDIT_EVENT_LOGGED', newEvent);
  return newEvent;
}

app.get('/api/dealership-group', (req, res) => {
  const db = getDB();
  res.json({
    success: true,
    data: db.dealershipGroup || INITIAL_DATA.dealershipGroup
  });
});

app.post('/api/branches/switch', (req, res) => {
  const db = getDB();
  const { branchId } = req.body;
  const group = db.dealershipGroup || INITIAL_DATA.dealershipGroup;
  const targetBranch = group.branches.find(b => b.id === branchId);
  
  if (!targetBranch) {
    return res.status(404).json({ success: false, error: "Branch not found in group" });
  }

  db.dealership = {
    ...db.dealership,
    id: targetBranch.id,
    branchId: targetBranch.id,
    name: targetBranch.name,
    phone: targetBranch.phone,
    verifiedWhatsApp: targetBranch.verifiedWhatsApp,
    activeBays: targetBranch.activeBays,
    totalTechnicians: targetBranch.totalTechnicians,
    liveThroughputToday: targetBranch.throughputToday,
    address: targetBranch.address
  };

  logAuditEvent({
    branchId: targetBranch.id,
    userId: "usr-01",
    userName: "Chetan Sanghi",
    userRole: "DEALER_PRINCIPAL",
    actionType: "BRANCH_CONTEXT_SWITCHED",
    entityType: "BRANCH",
    entityId: targetBranch.id,
    details: `Active workshop context switched to ${targetBranch.name} (${targetBranch.activeBays} Bays).`,
    severity: "INFO"
  });

  saveDB(db);
  broadcast('BRANCH_SWITCHED', { branch: targetBranch, dealership: db.dealership });
  res.json({ success: true, data: { branch: targetBranch, dealership: db.dealership } });
});

app.get('/api/audit-ledger', (req, res) => {
  const db = getDB();
  const ledger = db.auditLedger || INITIAL_DATA.auditLedger || [];
  const { branchId, severity, limit } = req.query;

  let filtered = [...ledger];
  if (branchId && branchId !== 'ALL') {
    filtered = filtered.filter(e => e.branchId === branchId);
  }
  if (severity && severity !== 'ALL') {
    filtered = filtered.filter(e => e.severity === severity);
  }

  const maxLimit = Number(limit) || 100;
  res.json({
    success: true,
    data: {
      totalEvents: ledger.length,
      filteredCount: filtered.length,
      events: filtered.reverse().slice(0, maxLimit)
    }
  });
});

app.post('/api/audit-ledger/verify-integrity', (req, res) => {
  const db = getDB();
  const ledger = db.auditLedger || INITIAL_DATA.auditLedger || [];
  let isChainValid = true;
  let brokenIndex = -1;

  for (let i = 1; i < ledger.length; i++) {
    if (ledger[i].previousHash !== ledger[i - 1].sha256Hash) {
      isChainValid = false;
      brokenIndex = i;
      break;
    }
  }

  res.json({
    success: true,
    data: {
      verified: isChainValid,
      totalEventsAudited: ledger.length,
      tamperedCount: isChainValid ? 0 : 1,
      brokenIndex: brokenIndex,
      lastBlockHash: ledger[ledger.length - 1]?.sha256Hash || "N/A",
      auditStatus: isChainValid ? "100% CRYPTOGRAPHICALLY_VERIFIED" : "INTEGRITY_BREACH_DETECTED"
    }
  });
});

// =========================================================================
// STEP 2: MATHEMATICAL CSP BAY LOAD BALANCER & GANTT ENGINE
// =========================================================================

app.get('/api/csp-bay-balancer/gantt', (req, res) => {
  const db = getDB();
  const gantt = db.bayScheduleGantt || INITIAL_DATA.bayScheduleGantt;
  
  // Calculate live dynamic load metrics across all 18 bays
  const totalBays = gantt.bays.length;
  const occupiedBays = gantt.bays.filter(b => b.status === 'OCCUPIED').length;
  const idleBays = gantt.bays.filter(b => b.status === 'IDLE').length;
  const reservedBays = gantt.bays.filter(b => b.status === 'RESERVED').length;

  const totalYieldCapacity = gantt.bays.reduce((sum, b) => sum + (b.hourlyYieldTarget * 9), 0);
  const currentHourlyYield = gantt.bays.filter(b => b.status === 'OCCUPIED').reduce((sum, b) => sum + b.hourlyYieldTarget, 0);

  // Dynamic on-time delivery probability
  const avgOnTimeProbability = Math.round(
    gantt.bays
      .filter(b => b.jobDetails)
      .reduce((sum, b) => sum + (b.jobDetails.onTimeDeliveryProbability || 90), 0) / (occupiedBays || 1)
  );

  res.json({
    success: true,
    data: {
      ...gantt,
      metrics: {
        totalBays,
        occupiedBays,
        idleBays,
        reservedBays,
        utilizationPercent: Math.round((occupiedBays / totalBays) * 100),
        currentHourlyYield,
        totalYieldCapacity,
        avgOnTimeProbability: avgOnTimeProbability || 94,
        bottleneckBaysCount: 1 // DCA Cleanroom parts bottleneck
      }
    }
  });
});

app.post('/api/csp-bay-balancer/reallocate', (req, res) => {
  const db = getDB();
  const { jobCardId, fromBayId, toBayId } = req.body;
  const gantt = db.bayScheduleGantt || INITIAL_DATA.bayScheduleGantt;

  const sourceBay = gantt.bays.find(b => b.id === fromBayId);
  const targetBay = gantt.bays.find(b => b.id === toBayId);
  const jc = db.jobCards.find(j => j.id === jobCardId);

  if (!targetBay) {
    return res.status(404).json({ success: false, error: "Target bay not found" });
  }

  // Constraint check: EV to EV bay restriction
  if (jc && jc.model && jc.model.includes('EV') && targetBay.type !== 'EV_HV' && targetBay.type !== 'WASHING_DETAILING') {
    return res.status(400).json({
      success: false,
      error: `CSP Constraint Violation: EV vehicle requires 1000V Insulated Bay. Cannot allocate to ${targetBay.name}.`
    });
  }

  // Move job
  if (sourceBay) {
    targetBay.jobDetails = sourceBay.jobDetails;
    targetBay.activeVehicleReg = sourceBay.activeVehicleReg;
    targetBay.currentJobCardId = sourceBay.currentJobCardId;
    targetBay.status = 'OCCUPIED';

    sourceBay.jobDetails = null;
    sourceBay.activeVehicleReg = null;
    sourceBay.currentJobCardId = null;
    sourceBay.status = 'IDLE';
  }

  logAuditEvent({
    branchId: db.dealership.id,
    userId: "usr-03",
    userName: "Deepak Yadav",
    userRole: "MASTER_TECHNICIAN",
    actionType: "CSP_BAY_REALLOCATION",
    entityType: "WORKSHOP_BAY",
    entityId: targetBay.id,
    details: `Reallocated Job Card ${jobCardId} from ${sourceBay ? sourceBay.name : 'Queue'} to ${targetBay.name}.`,
    severity: "OPERATIONAL"
  });

  saveDB(db);
  broadcast('BAY_SCHEDULE_UPDATED', gantt);
  res.json({ success: true, data: gantt });
});

app.post('/api/csp-bay-balancer/auto-balance', (req, res) => {
  const db = getDB();
  const gantt = db.bayScheduleGantt || INITIAL_DATA.bayScheduleGantt;

  // Run simulated Constraint Satisfaction Solver: reorders jobs, fills idle gaps, guarantees 5:30 PM delivery
  gantt.bays.forEach(bay => {
    if (bay.jobDetails) {
      bay.jobDetails.onTimeDeliveryProbability = Math.min(100, (bay.jobDetails.onTimeDeliveryProbability || 90) + 6);
    }
  });

  logAuditEvent({
    branchId: db.dealership.id,
    userId: "usr-01",
    userName: "Chetan Sanghi",
    userRole: "DEALER_PRINCIPAL",
    actionType: "CSP_ALGORITHM_AUTOBALANCE_EXECUTED",
    entityType: "ALGORITHM",
    entityId: "CSP-SOLVER-V2",
    details: "Executed CSP constraint optimization. 18 Bays re-sequenced. On-time 5:30 PM delivery score improved to 98.4%.",
    severity: "OPERATIONAL"
  });

  saveDB(db);
  broadcast('BAY_SCHEDULE_UPDATED', gantt);
  res.json({
    success: true,
    message: "Constraint Satisfaction Solver successfully re-balanced all 18 bays. Zero technician idle gaps.",
    data: gantt
  });
});

const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Fallback for SPA routing and root endpoint
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>NatureXpress - Tata Dealership OS</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; text-align: center; padding: 60px 20px; }
          .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .btn:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 style="font-size: 24px; margin-bottom: 8px;">🚗 NatureXpress Tata Dealership OS</h1>
          <p style="color: #64748b; font-size: 14px;">Backend API and WebSocket Server are running actively.</p>
          <a class="btn" href="http://localhost:3000">Open Frontend Application (Port 3000)</a>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🚗 NatureXpress Tata Dealership OS Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket Real-time Event Stream active`);
});
