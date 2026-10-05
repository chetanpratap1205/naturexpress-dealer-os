const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  dealershipGroup: {
    id: "grp-sanghi-indore",
    name: "Sanghi Automotive Retail Group",
    cluster: "Indore Region (MP West)",
    totalActiveBays: 60,
    totalTechnicians: 78,
    todayGroupThroughput: 168,
    groupRevenueToday: 2480000,
    groupRecoveredToday: 142500,
    branches: [
      {
        id: "sanghi-bypass",
        name: "Sanghi Brothers - Central Bypass (Flagship)",
        shortName: "Bypass Flagship",
        code: "SNG-IND-01",
        address: "Plot 14-B, A.B. Road, Bypass Junction, Indore 452010",
        phone: "+91 731 4055000",
        verifiedWhatsApp: "+91 98930 11223",
        activeBays: 18,
        totalTechnicians: 24,
        throughputToday: 42,
        bayUtilization: 78,
        csiScore: 9.4,
        isHQ: true,
        latitude: 22.7533,
        longitude: 75.8937
      },
      {
        id: "sanghi-manorama",
        name: "Sanghi Brothers - Manorama Ganj Service Station",
        shortName: "Manorama Ganj",
        code: "SNG-IND-02",
        address: "12/1, Manorama Ganj Main Road, Indore 452001",
        phone: "+91 731 4268000",
        verifiedWhatsApp: "+91 98930 22334",
        activeBays: 12,
        totalTechnicians: 16,
        throughputToday: 28,
        bayUtilization: 83,
        csiScore: 9.6,
        isHQ: false,
        latitude: 22.7196,
        longitude: 75.8824
      },
      {
        id: "shyam-dewas",
        name: "Shyam Automotive - Dewas Road Cluster Hub",
        shortName: "Shyam Dewas Rd",
        code: "SHY-IND-01",
        address: "Dewas Naka Industrial Area, Sector B, Indore 452010",
        phone: "+91 731 4982000",
        verifiedWhatsApp: "+91 98260 77112",
        activeBays: 14,
        totalTechnicians: 18,
        throughputToday: 34,
        bayUtilization: 71,
        csiScore: 9.1,
        isHQ: false,
        latitude: 22.7821,
        longitude: 75.9125
      },
      {
        id: "jagdish-pithampur",
        name: "Jagdish Motors - Pithampur Commercial Hub",
        shortName: "Jagdish Pithampur",
        code: "JAG-PTH-01",
        address: "Industrial Sector 3, Pithampur Auto Cluster, MP 454775",
        phone: "+91 7292 411000",
        verifiedWhatsApp: "+91 98270 99441",
        activeBays: 16,
        totalTechnicians: 20,
        throughputToday: 38,
        bayUtilization: 75,
        csiScore: 8.9,
        isHQ: false,
        latitude: 22.6105,
        longitude: 75.6881
      }
    ]
  },
  dealership: {
    id: "sanghi-bypass",
    branchId: "sanghi-bypass",
    name: "Sanghi Brothers (Tata Motors - Bypass Flagship)",
    cluster: "Indore Central - Bypass & Manorama Ganj",
    phone: "+91 731 4055000",
    verifiedWhatsApp: "+91 98930 11223",
    activeBays: 18,
    totalTechnicians: 24,
    liveThroughputToday: 42,
    gstin: "23AABCS1429B1Z8",
    pan: "AABCS1429B",
    address: "Plot 14-B, A.B. Road, Bypass Junction, Indore, Madhya Pradesh 452010"
  },
  auditLedger: [
    {
      id: "evt-9901",
      timestamp: "2026-10-06T08:30:15Z",
      branchId: "sanghi-bypass",
      userId: "usr-01",
      userName: "Chetan Sanghi",
      userRole: "DEALER_PRINCIPAL",
      actionType: "SECURITY_SESSION_INITIALIZED",
      entityType: "SYSTEM",
      entityId: "SYS-AUTH",
      details: "Dealer Principal Chetan Sanghi authenticated session via biometrics + SSO.",
      ipAddress: "192.168.1.10",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      severity: "INFO"
    },
    {
      id: "evt-9902",
      timestamp: "2026-10-06T09:15:20Z",
      branchId: "sanghi-bypass",
      userId: "usr-02",
      userName: "Amit Sharma",
      userRole: "SERVICE_ADVISOR",
      actionType: "JOB_CARD_CREATED",
      entityType: "JOB_CARD",
      entityId: "jc-8899",
      details: "Fast 30-sec intake recorded for Nexon EV (MP-09-EB-8899). ODO: 24,350 km.",
      ipAddress: "192.168.1.42",
      previousHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      sha256Hash: "8a1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
      severity: "INFO"
    },
    {
      id: "evt-9903",
      timestamp: "2026-10-06T10:22:40Z",
      branchId: "sanghi-bypass",
      userId: "usr-02",
      userName: "Amit Sharma",
      userRole: "SERVICE_ADVISOR",
      actionType: "CUSTOMER_VIDEO_AUTHORIZATION",
      entityType: "VIDEO_APPROVAL",
      entityId: "vi-01",
      details: "Customer Rajesh Verma digitally authorized Cabin Filter replacement (₹2,242) via WhatsApp OTP token.",
      ipAddress: "49.36.120.44",
      previousHash: "8a1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
      sha256Hash: "3f7c9e1a2b4d5e8f9a0b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f",
      severity: "FINANCIAL_AUDIT"
    },
    {
      id: "evt-9904",
      timestamp: "2026-10-06T11:36:12Z",
      branchId: "sanghi-bypass",
      userId: "usr-01",
      userName: "Chetan Sanghi",
      userRole: "DEALER_PRINCIPAL",
      actionType: "EXTENDED_WARRANTY_ACTIVATION",
      entityType: "PAYMENT_EMI",
      entityId: "pay-1001",
      details: "Dr. Vikram Singhal activated 2-Year Extended Warranty (₹18,900) via Razorpay 12-Month No-Cost EMI.",
      ipAddress: "192.168.1.10",
      previousHash: "3f7c9e1a2b4d5e8f9a0b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f",
      sha256Hash: "9b2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e",
      severity: "FINANCIAL_AUDIT"
    },
    {
      id: "evt-9905",
      timestamp: "2026-10-06T12:05:00Z",
      branchId: "shyam-dewas",
      userId: "usr-06",
      userName: "Rakesh Verma",
      userRole: "PARTS_MANAGER",
      actionType: "INTER_DEALER_RUNNER_DISPATCH",
      entityType: "PARTS_SWARM",
      entityId: "PART-DCA-2871",
      details: "Dispatched inter-dealer parts runner from Shyam Dewas Rd to Sanghi Bypass for Safari DCA Solenoid.",
      ipAddress: "192.168.2.15",
      previousHash: "9b2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e4f6a8c0d2e",
      sha256Hash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      severity: "OPERATIONAL"
    },
    {
      id: "evt-9906",
      timestamp: "2026-10-06T12:40:18Z",
      branchId: "sanghi-bypass",
      userId: "usr-05",
      userName: "Kunal Deshmukh",
      userRole: "OEM_CCM",
      actionType: "CCM_ESCALATION_INTERVENTION",
      entityType: "CCM_RADAR",
      entityId: "ccm-01",
      details: "TSM Kunal Deshmukh intervened in Safari DCA transmission repeat shudder case. Approved courtesy vehicle and 100% OEM warranty cover.",
      ipAddress: "10.42.0.88",
      previousHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      sha256Hash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
      severity: "CRITICAL_COMPLIANCE"
    }
  ],
  bayScheduleGantt: {
    branchId: "sanghi-bypass",
    scheduleDate: "2026-10-06",
    startTime: "08:30",
    endTime: "18:30",
    timeSlots: [
      "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
      "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "16:30", "17:00", "17:30", "18:00"
    ],
    bays: [
      {
        id: "bay-01",
        number: 1,
        name: "Bay 1 (EV High-Voltage Insulated Lift 1000V)",
        type: "EV_HV",
        category: "EV Specialized",
        assignedTech: "Sunil Rathore (EV L3)",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 1850,
        restrictions: ["EV_ONLY", "1000V_INSULATED_GLOVES_MANDATORY"],
        activeVehicleReg: null
      },
      {
        id: "bay-02",
        number: 2,
        name: "Bay 2 (Heavy Mechanical 2-Post Lift 4.5T)",
        type: "MECHANICAL_2POST",
        category: "Mechanical & Express",
        assignedTech: "Deepak Yadav (Master Tech)",
        currentJobCardId: "jc-4020",
        status: "OCCUPIED",
        capacityPerHour: 1,
        hourlyYieldTarget: 2200,
        restrictions: ["MAJOR_REPAIRS", "SUSPENSION_BRAKES"],
        activeVehicleReg: "MP-09-CW-4020 (Harrier Dark)",
        jobDetails: {
          jobCardId: "jc-4020",
          customerName: "Dr. Vikram Singhal",
          model: "Tata Harrier Fearless Plus Dark",
          stage: "mechanical_repair",
          progressPercent: 65,
          startTime: "09:40",
          promisedDeliveryTime: "18:00",
          onTimeDeliveryProbability: 96,
          activeTask: "Front Brake Disc Skimming & Bush Replacement",
          partsStatus: "PARTS_FITTED_IN_BAY"
        }
      },
      {
        id: "bay-03",
        number: 3,
        name: "Bay 3 (Express Quick-Lube Pit)",
        type: "EXPRESS_LUBE",
        category: "Express 45-Min",
        assignedTech: "Sunil Sharma",
        currentJobCardId: "jc-5521",
        status: "OCCUPIED",
        capacityPerHour: 2,
        hourlyYieldTarget: 1400,
        restrictions: ["PERIODIC_SERVICE_ONLY", "MAX_60_MINS"],
        activeVehicleReg: "MP-09-TA-5521 (Punch CNG)",
        jobDetails: {
          jobCardId: "jc-5521",
          customerName: "Sneha Joshi",
          model: "Tata Punch Adventure CNG",
          stage: "delivered",
          progressPercent: 100,
          startTime: "08:30",
          promisedDeliveryTime: "15:00",
          onTimeDeliveryProbability: 100,
          activeTask: "2nd Periodic Service Completed & Gate Pass Issued",
          partsStatus: "ALL_PARTS_FITTED"
        }
      },
      {
        id: "bay-04",
        number: 4,
        name: "Bay 4 (General Mechanical 2-Post Lift)",
        type: "MECHANICAL_2POST",
        category: "Mechanical",
        assignedTech: "Rohan Verma",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 1600,
        restrictions: ["GENERAL_SERVICE"],
        activeVehicleReg: null
      },
      {
        id: "bay-05",
        number: 5,
        name: "Bay 5 (EV High-Voltage Lane & BMS Scan)",
        type: "EV_HV",
        category: "EV Specialized",
        assignedTech: "Sunil Rathore (EV L3)",
        currentJobCardId: "jc-8899",
        status: "OCCUPIED",
        capacityPerHour: 1,
        hourlyYieldTarget: 2400,
        restrictions: ["EV_HV_BATTERY_CALIBRATION"],
        activeVehicleReg: "MP-09-EB-8899 (Nexon EV)",
        jobDetails: {
          jobCardId: "jc-8899",
          customerName: "Rajesh Verma",
          model: "Tata Nexon EV Empowered Plus",
          stage: "diagnostics",
          progressPercent: 45,
          startTime: "09:15",
          promisedDeliveryTime: "17:30",
          onTimeDeliveryProbability: 92,
          activeTask: "BMS Firmware Flash & Coolant Loop Pressure Test",
          partsStatus: "CABIN_FILTER_APPROVED_AWAITING_FITMENT"
        }
      },
      {
        id: "bay-06",
        number: 6,
        name: "Bay 6 (Mechanical 4-Post Heavy Lift)",
        type: "MECHANICAL_2POST",
        category: "Mechanical",
        assignedTech: "Manish Solanki",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 1600,
        restrictions: ["SUSPENSION_CHASSIS"],
        activeVehicleReg: null
      },
      {
        id: "bay-07",
        number: 7,
        name: "Bay 7 (DCA Transmission Cleanroom)",
        type: "DCA_CLEANROOM",
        category: "Transmission Specialized",
        assignedTech: "Deepak Yadav (Master Tech)",
        currentJobCardId: "jc-1102",
        status: "OCCUPIED",
        capacityPerHour: 0.5,
        hourlyYieldTarget: 3200,
        restrictions: ["DCA_TRANSMISSION_ONLY", "DUST_FREE_ZONE"],
        activeVehicleReg: "MP-09-ZF-1102 (Safari Accomplished)",
        jobDetails: {
          jobCardId: "jc-1102",
          customerName: "Anand Malviya",
          model: "Tata Safari Accomplished Plus 6S",
          stage: "mechanical_repair",
          progressPercent: 80,
          startTime: "10:00",
          promisedDeliveryTime: "19:00",
          onTimeDeliveryProbability: 88,
          activeTask: "Fitting Shyam Tata Procured Mechatronic Solenoid",
          partsStatus: "RUNNER_DELIVERED_PARTS_IN_BAY"
        }
      },
      {
        id: "bay-08",
        number: 8,
        name: "Bay 8 (DCA Transmission Calibration & Pressure)",
        type: "DCA_CLEANROOM",
        category: "Transmission Specialized",
        assignedTech: "Deepak Yadav",
        currentJobCardId: null,
        status: "RESERVED",
        capacityPerHour: 0.5,
        hourlyYieldTarget: 3000,
        restrictions: ["DCA_TRANSMISSION_ONLY"],
        activeVehicleReg: null
      },
      {
        id: "bay-09",
        number: 9,
        name: "Bay 9 (Express Service & Oil Change)",
        type: "EXPRESS_LUBE",
        category: "Express 45-Min",
        assignedTech: "Sunil Sharma",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 2,
        hourlyYieldTarget: 1500,
        restrictions: ["QUICK_SERVICE"],
        activeVehicleReg: null
      },
      {
        id: "bay-10",
        number: 10,
        name: "Bay 10 (Mechanical Repair Lift)",
        type: "MECHANICAL_2POST",
        category: "Mechanical",
        assignedTech: "Vijay Chouhan",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 1600,
        restrictions: ["GENERAL_REPAIRS"],
        activeVehicleReg: null
      },
      {
        id: "bay-11",
        number: 11,
        name: "Bay 11 (3D Computerized Wheel Alignment Pit)",
        type: "WHEEL_ALIGNMENT",
        category: "Diagnostics & Alignment",
        assignedTech: "Praveen Tiwari (Alignment Specialist)",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 2,
        hourlyYieldTarget: 1800,
        restrictions: ["ALIGNMENT_BALANCING_ONLY"],
        activeVehicleReg: null
      },
      {
        id: "bay-12",
        number: 12,
        name: "Bay 12 (3D Wheel Balancer & Tyre Pit)",
        type: "WHEEL_ALIGNMENT",
        category: "Diagnostics & Alignment",
        assignedTech: "Praveen Tiwari",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 2,
        hourlyYieldTarget: 1700,
        restrictions: ["TYRE_CHANGER_WHEEL_WEIGHTS"],
        activeVehicleReg: null
      },
      {
        id: "bay-13",
        number: 13,
        name: "Bay 13 (Electrical & AC Diagnostic Station)",
        type: "MECHANICAL_2POST",
        category: "Electrical & AC",
        assignedTech: "Kailash Gehlot",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 1900,
        restrictions: ["AC_RECOVERY_CAN_DIAGNOSTICS"],
        activeVehicleReg: null
      },
      {
        id: "bay-14",
        number: 14,
        name: "Bay 14 (Periodic Inspection & Lubrication)",
        type: "EXPRESS_LUBE",
        category: "Mechanical",
        assignedTech: "Rohan Verma",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1.5,
        hourlyYieldTarget: 1500,
        restrictions: ["ROUTINE_SERVICE"],
        activeVehicleReg: null
      },
      {
        id: "bay-15",
        number: 15,
        name: "Bay 15 (Underbody Coating & Anti-Rust Pit)",
        type: "EXPRESS_LUBE",
        category: "Value Added Services",
        assignedTech: "Kishore Parmar",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 1,
        hourlyYieldTarget: 2100,
        restrictions: ["UNDERBODY_SILENCER_COATING"],
        activeVehicleReg: null
      },
      {
        id: "bay-16",
        number: 16,
        name: "Bay 16 (Automated Foam Wash Line)",
        type: "WASHING_DETAILING",
        category: "Washing & Detailing",
        assignedTech: "Washing Crew Alpha (4 Staff)",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 4,
        hourlyYieldTarget: 1200,
        restrictions: ["WASH_PREP_UNDERBODY_BLAST"],
        activeVehicleReg: null
      },
      {
        id: "bay-17",
        number: 17,
        name: "Bay 17 (Interior Vacuum & Microfiber Wipe)",
        type: "WASHING_DETAILING",
        category: "Washing & Detailing",
        assignedTech: "Washing Crew Beta (3 Staff)",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 4,
        hourlyYieldTarget: 1200,
        restrictions: ["INTERIOR_VACUUM_DRESSING"],
        activeVehicleReg: null
      },
      {
        id: "bay-18",
        number: 18,
        name: "Bay 18 (Final QC Sign-Off & Delivery Canopy)",
        type: "WASHING_DETAILING",
        category: "QC & Handover Gate",
        assignedTech: "Sunil Rathore (QC Lead)",
        currentJobCardId: null,
        status: "IDLE",
        capacityPerHour: 3,
        hourlyYieldTarget: 1800,
        restrictions: ["FINAL_INSPECTION_ROAD_TEST_GATE"],
        activeVehicleReg: null
      }
    ]
  },
  users: [
    {
      id: "usr-01",
      name: "Chetan Sanghi",
      email: "chetan@sanghitata.in",
      role: "DEALER_PRINCIPAL",
      title: "Managing Director / Dealer Principal",
      avatar: "👑",
      permissions: ["ALL", "FINANCIAL_PL", "CCM_ESCALATION", "EW_MARGINS", "AUDIT_LOGS"]
    },
    {
      id: "usr-02",
      name: "Amit Sharma",
      email: "amit.sa@sanghitata.in",
      role: "SERVICE_ADVISOR",
      title: "Senior Service Advisor (EV & Luxury)",
      avatar: "📋",
      permissions: ["JOB_CARD_CREATE", "WHATSAPP_CHAT", "EW_CONFIG", "VIDEO_UPLOAD"]
    },
    {
      id: "usr-03",
      name: "Deepak Yadav",
      email: "deepak.tech@sanghitata.in",
      role: "MASTER_TECHNICIAN",
      title: "Master Diagnostic Tech (EV HV-Level 3 & DCA)",
      avatar: "🔧",
      permissions: ["VCI_DIAGNOSTICS", "ROAD_TEST_SIGN", "ACOUSTIC_AI", "WARRANTY_EVIDENCE"]
    },
    {
      id: "usr-04",
      name: "Priya Mandloi",
      email: "priya.cre@sanghitata.in",
      role: "CRE_SPECIALIST",
      title: "Customer Relationship Lead (Telephony CRM)",
      avatar: "🎧",
      permissions: ["TELEPHONY_CALLS", "WHATSAPP_NUDGE", "CAMPAIGN_BLAST", "CSI_MONITOR"]
    },
    {
      id: "usr-05",
      name: "Kunal Deshmukh",
      email: "kunal.ccm@tatamotors.com",
      role: "OEM_CCM",
      title: "Tata Motors OEM Territory Customer Care Manager (Indore Cluster)",
      avatar: "🛡️",
      permissions: ["CCM_RADAR", "BATCH_DEFECTS", "WARRANTY_FINAL_APPROVAL", "CSI_AUDIT"]
    },
    {
      id: "usr-06",
      name: "Rakesh Verma",
      email: "rakesh.parts@sanghitata.in",
      role: "PARTS_MANAGER",
      title: "Spare Parts & Inventory Head",
      avatar: "📦",
      permissions: ["BIN_CHECKOUT", "INTER_DEALER_SWARM", "DEAD_STOCK_TRADING", "BUFFER_FORECAST"]
    }
  ],
  whatsappConfig: {
    mode: "SIMULATED",
    phoneNumberId: "109348912831201",
    metaApiToken: "EAAG...NATUREXPRESS_PROD_BEARER_TOKEN",
    webhookVerifyToken: "naturexpress_tata_indore_secret_2026",
    verifiedNumber: "+91 98930 11223",
    displaySenderName: "Sanghi Tata Official Service",
    deliveryRateMsgsPerSec: 80,
    sentimentAlertThreshold: 0.70,
    webhookUrl: "http://localhost:5000/api/webhook/whatsapp",
    logs: [
      { id: "log-1", time: "10:15 AM", type: "OUTBOUND_TEMPLATE", recipient: "+91 98260 44551", template: "job_card_intake_v2", status: "DELIVERED_READ" },
      { id: "log-2", time: "11:32 AM", type: "OUTBOUND_INTERACTIVE", recipient: "+91 98931 77220", template: "video_approval_card", status: "DELIVERED_READ" }
    ]
  },
  // B0: Revenue Leakage Radar & Daily Opportunity Ledger
  revenueLeakageRadar: {
    totalLeakageAtRisk: 472500,
    totalRecoveredToday: 42600,
    monthlyRecoveredTarget: 850000,
    monthlyRecoveredAchieved: 548200,
    categories: {
      insurance: {
        id: "cat_insurance",
        label: "Insurance Renewals (Expiring & Uncontacted)",
        amount: 142000,
        recoveredAmount: 18400,
        marginRate: "20-25%",
        count: 12,
        riskLevel: "HIGH",
        icon: "Shield",
        color: "emerald"
      },
      accessories: {
        id: "cat_accessories",
        label: "Genuine OEM Accessories Not Offered",
        amount: 82000,
        recoveredAmount: 7200,
        marginRate: "35%",
        count: 8,
        riskLevel: "MEDIUM",
        icon: "ShoppingBag",
        color: "blue"
      },
      overdueService: {
        id: "cat_overdue",
        label: "Overdue Periodic Service (60+ Days Out)",
        amount: 115000,
        recoveredAmount: 9600,
        marginRate: "45%",
        count: 18,
        riskLevel: "HIGH",
        icon: "Calendar",
        color: "amber"
      },
      extendedWarranty: {
        id: "cat_ew",
        label: "Tata Care+ Extended Warranty Expiring",
        amount: 63500,
        recoveredAmount: 4800,
        marginRate: "15%",
        count: 5,
        riskLevel: "MEDIUM",
        icon: "ShieldCheck",
        color: "purple"
      },
      unapprovedEstimates: {
        id: "cat_estimates",
        label: "Unapproved Video Inspection Estimates",
        amount: 70000,
        recoveredAmount: 2600,
        marginRate: "60%",
        count: 6,
        riskLevel: "CRITICAL",
        icon: "Video",
        color: "rose"
      }
    }
  },
  revenueOpportunities: [
    {
      id: "opp-01",
      category: "INSURANCE",
      categoryKey: "insurance",
      vehicle: "Tata Nexon EV Empowered Plus",
      regNo: "MP-09-EB-8899",
      customerName: "Rajesh Verma",
      customerPhone: "+91 98260 44551",
      title: "HDFC Ergo EV Titanium Renewal (Battery Degradation + Zero-Dep)",
      detail: "Policy expires in 12 days. IDV ₹16.2L. Zero contact recorded in e-DMS.",
      grossValue: 12540,
      marginValue: 3200,
      status: "PENDING",
      actionLabel: "Send WhatsApp Quote",
      actionType: "WHATSAPP_INSURANCE",
      assignedSA: "Amit Sharma",
      priority: "CRITICAL",
      timestamp: "Today 08:30 AM",
      jobCardId: "jc-8899",
      notes: "High conversion EV prospect. Battery degradation policy lock recommended."
    },
    {
      id: "opp-02",
      category: "UNAPPROVED_ESTIMATE",
      categoryKey: "unapprovedEstimates",
      vehicle: "Tata Harrier Fearless Plus Dark",
      regNo: "MP-09-CW-4020",
      customerName: "Dr. Vikram Singhal",
      customerPhone: "+91 98931 77220",
      title: "Front Ceramic Brake Pad & Disc Skimming Authorization",
      detail: "Rotor wear 0.08mm. 15-Sec micrometer video ready for digital authorization.",
      grossValue: 8500,
      marginValue: 4800,
      status: "PENDING",
      actionLabel: "Send 15-Sec Video Approval",
      actionType: "VIDEO_APPROVAL",
      assignedSA: "Preeti Patel",
      priority: "HIGH",
      timestamp: "Today 09:15 AM",
      jobCardId: "jc-4020",
      notes: "Customer on rounds at hospital; prefers 1-tap WhatsApp authorization."
    },
    {
      id: "opp-03",
      category: "EXTENDED_WARRANTY",
      categoryKey: "extendedWarranty",
      vehicle: "Tata Safari Accomplished Plus 6S",
      regNo: "MP-09-ZF-1102",
      customerName: "Anand Malviya",
      customerPhone: "+91 99260 55190",
      title: "Gold Shield Year 4-5 Extended Warranty (No-Cost EMI)",
      detail: "Factory warranty ending in 30 days. Protects ₹88k DCA risk for ₹1,791/mo.",
      grossValue: 21500,
      marginValue: 3225,
      status: "PENDING",
      actionLabel: "Send Razorpay No-Cost EMI Link",
      actionType: "RAZORPAY_EMI",
      assignedSA: "Amit Sharma",
      priority: "HIGH",
      timestamp: "Today 09:40 AM",
      jobCardId: "jc-1102",
      notes: "Will eliminate repeat DCA transmission anxiety with OEM coverage."
    },
    {
      id: "opp-04",
      category: "OVERDUE_SERVICE",
      categoryKey: "overdueService",
      vehicle: "Tata Punch Adventure CNG",
      regNo: "MP-09-TA-5521",
      customerName: "Sneha Joshi",
      customerPhone: "+91 94251 66200",
      title: "10k km 2nd Periodic Service + Monsoon Wiper Nudge",
      detail: "Overdue by 14 days. Pre-allocated Express Bay 3 slot for 45-min turnaround.",
      grossValue: 4800,
      marginValue: 2600,
      status: "PENDING",
      actionLabel: "Send WhatsApp Drip Nudge",
      actionType: "WHATSAPP_DRIP",
      assignedSA: "Amit Sharma",
      priority: "MEDIUM",
      timestamp: "Today 10:00 AM",
      jobCardId: "jc-5521",
      notes: "Previous customer satisfied. High likelihood of immediate booking."
    },
    {
      id: "opp-05",
      category: "ACCESSORIES",
      categoryKey: "accessories",
      vehicle: "Tata Harrier Fearless Plus Dark",
      regNo: "MP-09-CW-4020",
      customerName: "Dr. Vikram Singhal",
      customerPhone: "+91 98931 77220",
      title: "OEM 4K Dual Dashcam + 7D Luxury All-Weather Mats",
      detail: "72% adoption among Indore Dark Edition owners. Plug & play warranty safe.",
      grossValue: 10349,
      marginValue: 3620,
      status: "PENDING",
      actionLabel: "Propose Accessory Bundle",
      actionType: "ACCESSORY_PROPOSAL",
      assignedSA: "Preeti Patel",
      priority: "MEDIUM",
      timestamp: "Today 10:15 AM",
      jobCardId: "jc-4020",
      notes: "Pre-configured combo pack ready for 1-tap addition to job card."
    },
    {
      id: "opp-06",
      category: "INSURANCE",
      categoryKey: "insurance",
      vehicle: "Tata Altroz Racer R3",
      regNo: "MP-09-CQ-2881",
      customerName: "Mayank Jha",
      customerPhone: "+91 98263 11988",
      title: "Tata AIG Auto Secure (Zero Dep + Engine Protect)",
      detail: "Policy expiring in 8 days. Direct dealer renewal margin ₹2,840.",
      grossValue: 14200,
      marginValue: 2840,
      status: "PENDING",
      actionLabel: "Send WhatsApp Quote",
      actionType: "WHATSAPP_INSURANCE",
      assignedSA: "Amit Sharma",
      priority: "HIGH",
      timestamp: "Today 10:30 AM",
      jobCardId: null,
      notes: "Renewal quote auto-computed with 50% NCB transfer benefit."
    }
  ],
  // B1: Tata Care+ Motor Insurance Renewal Engine
  insuranceQuotes: [
    {
      id: "ins-4020",
      jobCardId: "jc-4020",
      regNo: "MP-09-CW-4020",
      model: "Tata Harrier Fearless Plus Dark",
      customerName: "Dr. Vikram Singhal",
      customerPhone: "+91 98931 77220",
      idvValue: 1850000,
      currentPolicyExpiry: "2026-11-28 (Expiring in 54 Days)",
      recommendedPlan: "Tata AIG Auto Secure (Zero-Depreciation + Engine Protect + Return to Invoice)",
      grossPremium: 28400,
      ncbDiscountPercent: 50,
      netPayable: 14200,
      dealerReferralCommission: 2840,
      whatsappQuoteSent: false
    },
    {
      id: "ins-8899",
      jobCardId: "jc-8899",
      regNo: "MP-09-EB-8899",
      model: "Tata Nexon EV Empowered Plus",
      customerName: "Rajesh Verma",
      customerPhone: "+91 98260 44551",
      idvValue: 1620000,
      currentPolicyExpiry: "2026-12-10 (Expiring in 66 Days)",
      recommendedPlan: "HDFC Ergo EV Titanium (Battery Degradation + Charger Theft + Zero-Dep)",
      grossPremium: 22800,
      ncbDiscountPercent: 45,
      netPayable: 12540,
      dealerReferralCommission: 2500,
      whatsappQuoteSent: true
    }
  ],
  // B2: Personalized OEM Accessories Recommendation Catalog
  accessoryCatalog: {
    "Tata Harrier Fearless Plus Dark Edition": [
      { id: "acc-01", name: "Tata OEM 4K Dual Dashcam (Front + Rear)", partNo: "8821-DASH-4K", mrp: 6499, installLabor: 650, socialProof: "72% of Harrier Dark owners in Indore installed this", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400" },
      { id: "acc-02", name: "7D Luxury All-Weather Floor Liner Mats", partNo: "8821-MAT-7D", mrp: 3850, installLabor: 200, socialProof: "Protects against Indore red soil & monsoon mud", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400" },
      { id: "acc-03", name: "Heavy Duty Aluminium Side Footstep Integrated", partNo: "8821-STEP-AL", mrp: 12800, installLabor: 1200, socialProof: "Recommended for family & elderly passenger ingress", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400" }
    ],
    "Tata Nexon EV Empowered Plus (45 kWh)": [
      { id: "acc-04", name: "15W Qi Wireless Fast Charger Pad Console", partNo: "8822-CHG-QI", mrp: 2999, installLabor: 400, socialProof: "68% of Nexon EV tech-commuters use this", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400" },
      { id: "acc-05", name: "Illuminated Door Scuff Plates (Nexon EV Blue)", partNo: "8822-SCUFF-EV", mrp: 2450, installLabor: 350, socialProof: "Night puddle illumination & scratch defense", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400" },
      { id: "acc-06", name: "Type-2 to 15A Portable Smart EV Extension Cable (10m)", partNo: "8822-EV-EXT", mrp: 4800, installLabor: 0, socialProof: "Essential for Indore to Ujjain/Omkareshwar weekend trips", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400" }
    ],
    "Tata Safari Accomplished Plus 6S": [
      { id: "acc-07", name: "Integrated Smart Air Purifier with PM2.5 Display", partNo: "8823-AIR-PM25", mrp: 5200, installLabor: 300, socialProof: "Indore AQI pollution filter", image: "https://images.unsplash.com/photo-1527247043589-98e6ac08f56c?w=400" },
      { id: "acc-08", name: "Electrically Deployable Auto-Step Rails", partNo: "8823-AUTOS-EP", mrp: 38000, installLabor: 2500, socialProof: "Luxury flagship convenience", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400" }
    ],
    "Tata Punch Adventure CNG": [
      { id: "acc-09", name: "Frameless Rain Wiper Blade Set (Silicon Coated)", partNo: "8824-WIPER-FR", mrp: 950, installLabor: 150, socialProof: "Monsoon highway clarity", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400" }
    ]
  },
  // B3: Automated 6-Step Post-Service WhatsApp Drip Sequences
  dripSequences: [
    { step: 1, trigger: "Day 0 (Immediately on Handover)", title: "Google 5-Star Review & Digital Invoice", content: "Thank you for visiting Sanghi Tata! Please share your 5-star rating on Google Reviews & download your GST Invoice: https://tata.sanghi.in/inv", responseRate: "42%" },
    { step: 2, trigger: "Day 7 Post-Delivery", title: "Post-Service Drive Experience Check", content: "Namaste! How is your Tata Harrier feeling on the road? Tap [Smooth Drive ✓] or [Need Advisor Call 📞]", responseRate: "68%" },
    { step: 3, trigger: "Day 30 Post-Delivery", title: "Complimentary Fluid Top-Up Voucher", content: "Your Tata is running strong! Enjoy a complimentary coolant & washer fluid top-up at Sanghi Bypass express bay this weekend.", responseRate: "28%" },
    { step: 4, trigger: "Day 60 Post-Delivery", title: "Pending Advisory Reminder (Brake Pads)", content: "Health Reminder: Master Tech Deepak noted front brake pads at 30% wear during your last visit. Book a free inspection slot.", responseRate: "34%" },
    { step: 5, trigger: "Day 90 Post-Delivery", title: "Extended Warranty Expiry Warning", content: "Your factory warranty is ending soon. Lock in 2 extra years for just ₹39/day before OEM price revision.", responseRate: "29%" },
    { step: 6, trigger: "Day 120 Post-Delivery", title: "Indore Value Club VIP Enrollment Offer", content: "Exclusive invitation: Enroll in Indore Value Club for 25% off future labor & free highway towing.", responseRate: "31%" }
  ],
  // B4: Daily MD/GM Morning WhatsApp Briefing Card
  mdMorningBriefing: {
    briefingTime: "08:45 AM (Daily Automated Dispatch)",
    dealershipName: "Sanghi Brothers (Tata Motors Indore)",
    recipient: "Chetan Sanghi (Dealer Principal / MD - +91 98260 00001)",
    todayDate: "2026-10-06",
    metrics: {
      todayBookedAppointments: 38,
      openJobCardsInWorkshop: 14,
      yesterdayLaborRevenue: 242500,
      yesterdayPartsMargin: 184000,
      activeEscalationAlerts: 1,
      interDealerPartsPending: 2,
      topServiceAdvisor: "Amit Sharma (3 EW Sold - ₹48,200)",
      topCRECaller: "Priya Mandloi (35.3% Conversion)",
      washingBayPredictedPeak: "04:15 PM (Sequencer Activated)"
    },
    sampleWhatsAppMessage: "🌅 *Good morning Chetan Sir!* Here is your Sanghi Tata Daily Workshop Briefing for 06 Oct:\n\n📋 *Today's Load:* 38 Appointments | 14 Open Bays\n💰 *Yesterday Labor Revenue:* ₹2,42,500 (114% of Target)\n⚠️ *Escalations:* 1 Case (Kunal Deshmukh CCM Intervening)\n📦 *Inter-Dealer Pool:* 2 child-parts en-route from Shyam Tata\n🏆 *Top SA:* Amit Sharma (₹48.2k EW sold)\n\nHave a high-velocity day! 🚀"
  },
  // B5: Customer Loyalty Points Wallet (Tata Seva Points)
  loyaltyAccounts: {
    "veh-001": { customerName: "Rajesh Verma", pointsBalance: 850, pointValueINR: 850, lifetimeEarned: 2400, tier: "Gold Seva Tier", perks: ["Free AC Foam Disinfection (Cost 600 pts)", "Free Foam Car Wash (Cost 400 pts)", "10% Off Labor Voucher (Cost 500 pts)"] },
    "veh-002": { customerName: "Dr. Vikram Singhal", pointsBalance: 1420, pointValueINR: 1420, lifetimeEarned: 3800, tier: "Platinum Seva Tier", perks: ["Free 3D Wheel Alignment (Cost 800 pts)", "Complimentary Interior Detailing (Cost 1200 pts)"] },
    "veh-003": { customerName: "Anand Malviya", pointsBalance: 950, pointValueINR: 950, lifetimeEarned: 1950, tier: "Gold Seva Tier", perks: ["Free Express Lube Service (Cost 900 pts)"] },
    "veh-004": { customerName: "Sneha Joshi", pointsBalance: 420, pointValueINR: 420, lifetimeEarned: 420, tier: "Silver Seva Tier", perks: ["Free Windshield Water Repellent Coating (Cost 350 pts)"] }
  },
  payments: [
    {
      id: "pay-1001",
      jobCardId: "jc-4020",
      type: "EXTENDED_WARRANTY_EMI",
      customerName: "Dr. Vikram Singhal",
      customerPhone: "+91 98931 77220",
      amount: 18900,
      emiTenureMonths: 12,
      monthlyEmi: 1575,
      provider: "Razorpay / Pine Labs No-Cost EMI",
      razorpayLinkId: "plink_TatEW_4020_991",
      paymentUrl: "https://rzp.io/i/TatEW4020",
      status: "COMPLETED",
      timestamp: "2026-10-05T12:45:00Z",
      saCommissionPaid: 650
    }
  ],
  roadTests: {
    "jc-5521": {
      jobCardId: "jc-5521",
      regNo: "MP-09-TA-5521",
      model: "Tata Punch Adventure CNG",
      inspectorName: "Sunil Rathore",
      startOdo: 12195,
      endOdo: 12201,
      distanceKm: 6.0,
      timestamp: "2026-10-05T14:10:00Z",
      checklist: {
        steeringAlignment: { passed: true, notes: "Centered, no pull" },
        brakeShudder: { passed: true, notes: "Braking linear, 0 vibration" },
        suspensionNVH: { passed: true, notes: "No thuds on rough tarmac" },
        cngSwitchover: { passed: true, notes: "Smooth transition at 1200 RPM" },
        acCoolingEfficiency: { passed: true, notes: "Vent temp 6.2°C at idle" },
        noActiveWarnings: { passed: true, notes: "Cluster 100% clean" },
        washingQuality: { passed: true, notes: "Dry wiped & vacuumed" }
      },
      status: "PASSED",
      signedBy: "Sunil Rathore (QC Lead)",
      supervisorComments: "5 km mandatory road test verified on Bypass stretch. Safe for customer handover."
    }
  },
  partsBins: [
    {
      binId: "BIN-B14-SOLENOID",
      barcode: "BAR-2871-5420",
      partNumber: "2871-5420-0104",
      partName: "DCA Mechatronic Solenoid Valve Block",
      location: "Aisle B, Shelf 14, Tray 2",
      totalStock: 3,
      allocatedStock: 1,
      availableStock: 2,
      lockedJobCardId: "jc-1102",
      antiCannibalizationSeal: "SEAL-NX-9982",
      lastScannedBy: "Rakesh Verma (Parts Head)"
    },
    {
      binId: "BIN-E05-HV-VALVE",
      barcode: "BAR-2872-9901",
      partNumber: "2872-9901-0021",
      partName: "High Voltage Coolant Manifold Relief Valve",
      location: "EV Safe Room, Locker E5",
      totalStock: 5,
      allocatedStock: 1,
      availableStock: 4,
      lockedJobCardId: "jc-8899",
      antiCannibalizationSeal: "SEAL-EV-4411",
      lastScannedBy: "Rakesh Verma"
    },
    {
      binId: "BIN-S02-BUSH-KIT",
      barcode: "BAR-2865-1109",
      partNumber: "2865-1109-8812",
      partName: "Power Steering Rack Pinion Bush Kit",
      location: "Fast Moving Rack 2",
      totalStock: 12,
      allocatedStock: 2,
      availableStock: 10,
      lockedJobCardId: null,
      antiCannibalizationSeal: null,
      lastScannedBy: "Rakesh Verma"
    }
  ],
  eDmsQueue: {
    connectionStatus: "LIVE_CONNECTED",
    mode: "ASYNC_RESILIENT_SOAP_BRIDGE",
    lastSuccessfulSync: "2026-10-05T16:40:00Z",
    morningPeakLagBypassedCount: 28,
    pendingPackets: [
      { id: "pkt-01", type: "JOB_CARD_SYNC", entityId: "jc-1102", siebelDocNo: "SR-IND-2026-9921", status: "QUEUED_HIGH_PRIORITY", retries: 0 }
    ],
    prsGeneratedToday: [
      { prsNo: "PRS-SNG-8891", jcId: "jc-4020", partNo: "2841-0092-11", amount: 4800, siebelApproved: true }
    ]
  },
  batchDefects: [
    {
      id: "def-01",
      cluster: "Indore Metropolitan Cluster",
      model: "Tata Nexon EV Max / Empowered (2023-2024 Batch)",
      dtcCode: "P0AC0 / P0AA6",
      affectedSubsystem: "HV Coolant Isolation Manifold Valve",
      occurrencesLast7Days: 6,
      dealershipBreakdown: [
        { dealer: "Sanghi Brothers (Bypass)", cases: 2 },
        { dealer: "Shyam Automotive (Dewas Rd)", cases: 3 },
        { dealer: "Jagdish Motors (Pithampur)", cases: 1 }
      ],
      severity: "CRITICAL_BATCH_ANOMALY",
      oemAdvisoryTriggered: true,
      advisoryText: "Automated Early-Warning: Batch #TC-23-M09 shows 14x failure rate. OEM Technical Service Bulletin (TSB-2026-EV-09) recommended for batch replacement before field breakdown.",
      notifiedCcm: "Kunal Deshmukh (Tata Motors TSM)"
    }
  ],
  csiIntegrity: {
    totalSurveysSentToday: 18,
    directOemDispatched: 18,
    bypassedStaffPhones: "100% Protected (Locked against SA phone substitution)",
    averageScore: 9.4,
    auditLogs: [
      { id: "csi-aud-01", timestamp: "14:30:15", action: "PHONE_NUMBER_LOCKED", regNo: "MP-09-TA-5521", customerPhone: "+91 94251 66200", status: "VERIFIED_OWNER" }
    ],
    recentFeedback: [
      { regNo: "MP-09-TA-5521", customer: "Sneha Joshi", score: 10, sentiment: "Delighted", comment: "Video approval on WhatsApp saved me 2 hours! Best service at Sanghi." }
    ]
  },
  fastMovingBufferForecast: {
    date: "2026-10-06",
    forecastTime: "08:30 AM Pre-Intake",
    expectedVehicles: 38,
    predictedDemand: [
      { item: "Castrol 0W-20 Fully Synthetic Engine Oil (Liters)", required: 145, inHand: 220, bufferStatus: "OPTIMAL" },
      { item: "Tata OEM Spin-On Oil Filters (Part #2841)", required: 32, inHand: 45, bufferStatus: "OPTIMAL" },
      { item: "Front Ceramic Brake Pad Kits (Harrier/Safari)", required: 8, inHand: 4, bufferStatus: "CRITICAL_SHORTAGE_REORDERED" },
      { item: "Ziptron Organic EV Coolant (5L Cans)", required: 6, inHand: 14, bufferStatus: "OPTIMAL" },
      { item: "Silicon Wiper Blade Sets (Monsoon Camp)", required: 18, inHand: 25, bufferStatus: "OPTIMAL" }
    ]
  },
  eventBrokerQueue: {
    status: "HEALTHY",
    processedEventsToday: 1420,
    activeSubscribers: 14,
    retryQueueCount: 0,
    rateLimitCapacity: "200 msgs/sec",
    deadLetterQueueCount: 0
  },
  vehicles: [
    {
      id: "veh-001",
      regNo: "MP-09-EB-8899",
      vin: "MAT621459P1N08899",
      model: "Tata Nexon EV Empowered Plus (45 kWh)",
      fuelType: "Electric",
      color: "Pristine White / Daytona Grey Roof",
      year: 2023,
      odometer: 24350,
      dailyUsageKm: 42,
      predictedOdometer: 24350,
      customer: {
        name: "Rajesh Verma",
        phone: "+91 98260 44551",
        email: "rajesh.verma@indorebusiness.com",
        city: "Indore (Vijay Nagar)",
        sentiment: "Neutral",
        isVIP: true
      },
      warranty: {
        standardStatus: "Active (Year 2)",
        expiryDate: "2026-11-20",
        extendedWarrantyEligible: true,
        evBatteryWarranty: "Active (8 Yrs / 160,000 km)",
        predictedRiskComponent: "High-Voltage Coolant Pump & BMS Firmware",
        ewQuote: {
          oneYear: 9800,
          twoYear: 14500,
          threeYear: 19900,
          riskWithoutEW: 62000,
          emiMonthly: 1208
        }
      },
      currentJobCardId: "jc-8899",
      status: "In Progress (Bay 5 - EV Lane)",
      sa: { name: "Amit Sharma", phone: "+91 94250 88711" },
      technician: { name: "Sunil Rathore (Level-3 EV Certified)", bay: "Bay 5 (HV Insulated Lift)" }
    },
    {
      id: "veh-002",
      regNo: "MP-09-CW-4020",
      vin: "MAT612888P2H44020",
      model: "Tata Harrier Fearless Plus Dark Edition",
      fuelType: "Diesel (2.0L Kryotec AT)",
      color: "Oberon Black",
      year: 2022,
      odometer: 38200,
      dailyUsageKm: 55,
      predictedOdometer: 38200,
      customer: {
        name: "Dr. Vikram Singhal",
        phone: "+91 98931 77220",
        email: "dr.vikram.singhal@chithospital.org",
        city: "Indore (Saket Nagar)",
        sentiment: "Anxious / Quality Focused",
        isVIP: true
      },
      warranty: {
        standardStatus: "Expiring in 45 Days (Year 3 End)",
        expiryDate: "2026-11-18",
        extendedWarrantyEligible: true,
        predictedRiskComponent: "Electronic Steering Column & Infotainment Display ECU",
        ewQuote: {
          oneYear: 12500,
          twoYear: 18900,
          threeYear: 24500,
          riskWithoutEW: 74000,
          emiMonthly: 1575
        }
      },
      currentJobCardId: "jc-4020",
      status: "Awaiting Video Approval",
      sa: { name: "Preeti Patel", phone: "+91 98270 33412" },
      technician: { name: "Deepak Yadav (Master Diagnostic Tech)", bay: "Bay 2 (Express Mechanical)" }
    },
    {
      id: "veh-003",
      regNo: "MP-09-ZF-1102",
      vin: "MAT619333P3S11102",
      model: "Tata Safari Accomplished Plus 6S",
      fuelType: "Diesel AT",
      color: "Cosmic Gold",
      year: 2023,
      odometer: 29800,
      dailyUsageKm: 48,
      predictedOdometer: 29800,
      customer: {
        name: "Anand Malviya",
        phone: "+91 99260 55190",
        email: "anand.malviya@malviyagroup.in",
        city: "Indore (Race Course Road)",
        sentiment: "Agitated / Escalated",
        isVIP: true
      },
      warranty: {
        standardStatus: "Active",
        expiryDate: "2027-02-14",
        extendedWarrantyEligible: true,
        predictedRiskComponent: "DCA Transmission Solenoid Valve Block",
        ewQuote: {
          oneYear: 13900,
          twoYear: 21500,
          threeYear: 27900,
          riskWithoutEW: 88000,
          emiMonthly: 1791
        }
      },
      currentJobCardId: "jc-1102",
      status: "ESCALATED (CCM Intervening - Part Backorder)",
      sa: { name: "Amit Sharma", phone: "+91 94250 88711" },
      technician: { name: "Deepak Yadav (Master Diagnostic Tech)", bay: "Bay 7 (DCA Diagnostics)" }
    },
    {
      id: "veh-004",
      regNo: "MP-09-TA-5521",
      vin: "MAT618844P1P55521",
      model: "Tata Punch Adventure CNG",
      fuelType: "CNG + Petrol",
      color: "Atomic Orange",
      year: 2024,
      odometer: 12200,
      dailyUsageKm: 35,
      predictedOdometer: 12200,
      customer: {
        name: "Sneha Joshi",
        phone: "+91 94251 66200",
        email: "sneha.joshi@tcs.com",
        city: "Indore (Palasia)",
        sentiment: "Delighted",
        isVIP: false
      },
      warranty: {
        standardStatus: "Active",
        expiryDate: "2027-08-01",
        extendedWarrantyEligible: true,
        predictedRiskComponent: "CNG Sequential Injector Rail",
        ewQuote: {
          oneYear: 6500,
          twoYear: 9900,
          threeYear: 13500,
          riskWithoutEW: 38000,
          emiMonthly: 825
        }
      },
      currentJobCardId: "jc-5521",
      status: "Delivered & Keys Handed Over",
      sa: { name: "Amit Sharma", phone: "+91 94250 88711" },
      technician: { name: "Sunil Rathore", bay: "Bay 3" }
    }
  ],
  jobCards: [
    {
      id: "jc-8899",
      vehicleId: "veh-001",
      regNo: "MP-09-EB-8899",
      model: "Tata Nexon EV Empowered Plus (45 kWh)",
      customerName: "Rajesh Verma",
      customerPhone: "+91 98260 44551",
      intakeTime: "2026-10-05T09:15:00Z",
      estimatedDelivery: "2026-10-05T17:30:00Z",
      stage: "diagnostics",
      stageIndex: 2,
      primaryConcerns: [
        "20,000 km Scheduled Service",
        "Regen Braking Level 3 intermittent drop",
        "HV Battery cooling fan continuous high RPM noise"
      ],
      videoItems: [
        {
          id: "vi-01",
          partName: "Cabin Air Micro-Filter & AC Evaporator Foam Treatment",
          partCost: 1450,
          laborCost: 450,
          gst: 342,
          total: 2242,
          reason: "Heavy dust choking airflow; Indore Ring Road construction particulate accumulation.",
          videoUrl: "https://assets.naturexpress.in/videos/nexon_cabin_filter_dirty.mp4",
          status: "approved",
          approvedAt: "2026-10-05T10:22:00Z"
        },
        {
          id: "vi-02",
          partName: "High Voltage Battery Coolant Loop Flush & Manifold Valve O-Ring",
          partCost: 3200,
          laborCost: 1800,
          gst: 900,
          total: 5900,
          reason: "Diagnostic scan flagged DTC P0AC0. Minor weeping at manifold valve causing thermal loop pressure variation.",
          videoUrl: "https://assets.naturexpress.in/videos/ev_coolant_loop_leak.mp4",
          status: "pending",
          approvedAt: null
        }
      ],
      approvedItems: [
        { name: "20,000 km EV Scheduled Inspection & BMS Calibration", partCost: 0, laborCost: 2200, gst: 396, total: 2596, mandatory: true },
        { name: "Cabin Air Micro-Filter & AC Treatment", partCost: 1450, laborCost: 450, gst: 342, total: 2242, mandatory: false }
      ],
      extendedWarrantyPurchased: null,
      totalEstimate: 10738,
      approvedTotal: 4838,
      paymentStatus: "Partial Handover",
      bay: "Bay 5 (EV High-Voltage Lane)",
      saName: "Amit Sharma",
      techName: "Sunil Rathore (EV Specialist)",
      roadTestCompleted: false,
      midDayPulseSent: true,
      midDayPulseResponse: "Delighted (😊)"
    },
    {
      id: "jc-4020",
      vehicleId: "veh-002",
      regNo: "MP-09-CW-4020",
      model: "Tata Harrier Fearless Plus Dark Edition",
      customerName: "Dr. Vikram Singhal",
      customerPhone: "+91 98931 77220",
      intakeTime: "2026-10-05T09:40:00Z",
      estimatedDelivery: "2026-10-05T18:00:00Z",
      stage: "mechanical_repair",
      stageIndex: 3,
      primaryConcerns: [
        "40,000 km Major Periodic Service",
        "Front brake squeal during high-speed deceleration on AB Road Bypass",
        "Steering wheel slight vibration at 90 km/h"
      ],
      videoItems: [
        {
          id: "vi-03",
          partName: "Front Brake Disc Skimming & Premium Ceramic Brake Pad Set",
          partCost: 4800,
          laborCost: 950,
          gst: 1035,
          total: 6785,
          reason: "Brake pad thickness is at 2.4 mm (critical limit is 3.0 mm). Micrometer run-out test shows 0.08 mm rotor warping.",
          videoUrl: "https://assets.naturexpress.in/videos/harrier_brakepad_micrometer.mp4",
          status: "approved",
          approvedAt: "2026-10-05T11:35:00Z"
        },
        {
          id: "vi-04",
          partName: "Electronic Steering Column Dampener Bush Replacement",
          partCost: 850,
          laborCost: 1200,
          gst: 369,
          total: 2419,
          reason: "Child-part replacement avoids ₹42,000 steering column swap. Removes the 90 km/h vibration completely.",
          videoUrl: "https://assets.naturexpress.in/videos/steering_bush_play.mp4",
          status: "approved",
          approvedAt: "2026-10-05T11:36:00Z"
        }
      ],
      approvedItems: [
        { name: "40k km Major Service (Synthetic Oil 0W-20 + All Filters)", partCost: 5400, laborCost: 2800, gst: 1476, total: 9676, mandatory: true },
        { name: "Front Brake Disc Skimming & Pad Set", partCost: 4800, laborCost: 950, gst: 1035, total: 6785, mandatory: false },
        { name: "Steering Column Dampener Bush Kit (Child-Part)", partCost: 850, laborCost: 1200, gst: 369, total: 2419, mandatory: false }
      ],
      extendedWarrantyPurchased: {
        package: "Gold Shield (Year 4 & 5 / 150,000 km)",
        price: 18900,
        emi: "₹1,575/mo (12 Months No-Cost EMI)",
        commission: 650
      },
      totalEstimate: 37780,
      approvedTotal: 37780,
      paymentStatus: "Online Authorized via Razorpay",
      bay: "Bay 2 (Heavy Mechanical Lift)",
      saName: "Preeti Patel",
      techName: "Deepak Yadav (Master Tech)",
      roadTestCompleted: false,
      midDayPulseSent: true,
      midDayPulseResponse: "Neutral (😐)"
    },
    {
      id: "jc-1102",
      vehicleId: "veh-003",
      regNo: "MP-09-ZF-1102",
      model: "Tata Safari Accomplished Plus 6S",
      customerName: "Anand Malviya",
      customerPhone: "+91 99260 55190",
      intakeTime: "2026-10-03T10:00:00Z",
      estimatedDelivery: "2026-10-05T19:00:00Z",
      stage: "mechanical_repair",
      stageIndex: 3,
      primaryConcerns: [
        "DCA Transmission Shudder on cold start (Repeat visit - 3rd time in 30 days)",
        "Check Engine Light ON"
      ],
      videoItems: [
        {
          id: "vi-05",
          partName: "DCA Mechatronic Solenoid Valve Block Replacement (Child-Part)",
          partCost: 18500,
          laborCost: 3500,
          gst: 3960,
          total: 25960,
          reason: "DTC P0841 confirmed. Mechatronic line pressure fluctuating. Child-part procured from Shyam Tata (Dewas Rd) via Inter-Dealer Pool.",
          videoUrl: "https://assets.naturexpress.in/videos/safari_dca_pressure_test.mp4",
          status: "approved",
          approvedAt: "2026-10-04T15:00:00Z"
        }
      ],
      approvedItems: [
        { name: "Warranty Covered: DCA Mechatronic Solenoid Valve Block", partCost: 0, laborCost: 0, gst: 0, total: 0, mandatory: true }
      ],
      extendedWarrantyPurchased: null,
      totalEstimate: 25960,
      approvedTotal: 0,
      paymentStatus: "100% OEM Warranty Claim (Zero Customer Liability)",
      bay: "Bay 7 (DCA Diagnostics)",
      saName: "Amit Sharma",
      techName: "Deepak Yadav (Master Tech)",
      hoursInWorkshop: 44,
      escalationStatus: "CCM_INTERVENED",
      roadTestCompleted: false,
      midDayPulseSent: true,
      midDayPulseResponse: "Concerned (😞)"
    },
    {
      id: "jc-5521",
      vehicleId: "veh-004",
      regNo: "MP-09-TA-5521",
      model: "Tata Punch Adventure CNG",
      customerName: "Sneha Joshi",
      customerPhone: "+91 94251 66200",
      intakeTime: "2026-10-05T08:30:00Z",
      estimatedDelivery: "2026-10-05T15:00:00Z",
      stage: "delivered",
      stageIndex: 6,
      primaryConcerns: [
        "10,000 km 2nd Free Service",
        "Wiper blades streaking in heavy rain"
      ],
      videoItems: [
        {
          id: "vi-06",
          partName: "Frameless Silicon Wiper Blade Pair",
          partCost: 950,
          laborCost: 150,
          gst: 198,
          total: 1298,
          reason: "Rubber edge torn, causing water film on driver side windscreen.",
          videoUrl: "https://assets.naturexpress.in/videos/punch_wiper_check.mp4",
          status: "approved",
          approvedAt: "2026-10-05T09:30:00Z"
        }
      ],
      approvedItems: [
        { name: "10,000 km 2nd Periodic Free Service (Free Labor)", partCost: 1650, laborCost: 0, gst: 297, total: 1947, mandatory: true },
        { name: "Frameless Silicon Wiper Blade Pair", partCost: 950, laborCost: 150, gst: 198, total: 1298, mandatory: false }
      ],
      extendedWarrantyPurchased: null,
      totalEstimate: 3245,
      approvedTotal: 3245,
      paymentStatus: "Paid via UPI / Gate Pass Issued",
      bay: "Delivery Bay",
      saName: "Amit Sharma",
      techName: "Sunil Rathore",
      roadTestCompleted: true,
      midDayPulseSent: true,
      midDayPulseResponse: "Delighted (😊)"
    }
  ],
  whatsappThreads: {
    "jc-8899": [
      {
        id: "msg-101",
        sender: "system",
        senderName: "Sanghi Tata Official Service",
        time: "09:16 AM",
        type: "status_update",
        content: "🚗 *Namaste Rajesh ji!* Your Nexon EV (MP-09-EB-8899) has been safely checked in at *Sanghi Brothers Tata, Indore (Bypass)*. Service Advisor: *Amit Sharma* (+91 94250 88711). Live tracker: https://tata.sanghi.in/track/jc-8899"
      },
      {
        id: "msg-102",
        sender: "advisor",
        senderName: "Amit Sharma (SA)",
        time: "10:20 AM",
        type: "video_quote",
        content: "📹 *Inspection Video Uploaded:* Rajesh ji, our EV technician Sunil has inspected your cabin micro-filter. Heavy dust accumulation is reducing cooling air velocity by 40%. Please review the 15-sec video and approve replacement (₹2,242 incl GST): https://tata.sanghi.in/track/jc-8899#items"
      },
      {
        id: "msg-103",
        sender: "customer",
        senderName: "Rajesh Verma",
        time: "10:22 AM",
        type: "approval",
        content: "✅ Approved the cabin filter on the link. Also please ensure the battery cooling fan noise is completely resolved. Thanks."
      }
    ],
    "jc-4020": [
      {
        id: "msg-201",
        sender: "system",
        senderName: "Sanghi Tata Official Service",
        time: "09:41 AM",
        type: "status_update",
        content: "🚗 *Namaste Dr. Vikram Singhal ji!* Your Harrier Dark Edition (MP-09-CW-4020) is in Bay 2 for 40k Major Service. Service Advisor: *Preeti Patel*."
      },
      {
        id: "msg-202",
        sender: "advisor",
        senderName: "Preeti Patel (SA)",
        time: "11:30 AM",
        type: "video_quote",
        content: "📹 *High-Speed Brake & Steering Check:* Dr. Singhal, Master Tech Deepak checked the brake discs with a digital micrometer (0.08mm runout) and found steering bush wear. We can resolve this with child-parts for ₹9,204 instead of a full steering rack (₹42k). Please tap to approve: https://tata.sanghi.in/track/jc-4020"
      },
      {
        id: "msg-203",
        sender: "customer",
        senderName: "Dr. Vikram Singhal",
        time: "11:36 AM",
        type: "approval",
        content: "Approved both. Great video transparency. Also add the 2-Year Extended Warranty on No-Cost EMI."
      }
    ],
    "jc-1102": [
      {
        id: "msg-301",
        sender: "customer",
        senderName: "Anand Malviya",
        time: "Yesterday 04:30 PM",
        type: "escalation",
        content: "This is the 3rd time my Safari has DCA transmission issues. My car is parked for 44 hours. If this is not solved today I am tagging Tata Motors Chairman and filing a complaint in Consumer Court Indore!"
      },
      {
        id: "msg-302",
        sender: "ccm",
        senderName: "Kunal Deshmukh (Tata OEM CCM)",
        time: "Yesterday 05:15 PM",
        type: "ccm_intervention",
        content: "Namaste Anand ji. I am Kunal Deshmukh, Territory Customer Care Manager from Tata Motors. I am personally monitoring your Safari. We have secured the Mechatronic Solenoid child-part from Shyam Tata and it is being installed under 100% OEM warranty. I have also authorized a complimentary full body ceramic wax and a courtesy vehicle for today."
      }
    ]
  },
  ccmAlerts: [
    {
      id: "ccm-01",
      jobCardId: "jc-1102",
      regNo: "MP-09-ZF-1102",
      model: "Tata Safari Accomplished Plus 6S",
      customerName: "Anand Malviya",
      customerPhone: "+91 99260 55190",
      triggerReason: "Vehicle in Workshop > 44 Hours (DCA Part Backorder) + Repeat Visit (3rd time) + Frustration Keyword 'Consumer Court'",
      severity: "CRITICAL",
      sentimentScore: 0.94,
      escalatedAt: "2026-10-04T16:00:00Z",
      status: "Intervened by CCM",
      assignedCCM: "Kunal Deshmukh (Territory CCM)",
      assignedGM: "Sunil Agarwal (Sanghi GM)",
      rootCause: "DCA Mechatronic Solenoid child-part stockout at dealer; procured from Shyam Tata via Inter-Dealer Pool.",
      actionTaken: "Courtesy car provided + 100% OEM Goodwill Warranty applied + Personal call by OEM CCM before social escalation."
    }
  ],
  creQueue: [
    {
      id: "cre-01",
      customerName: "Sanjay Agrawal",
      phone: "+91 98270 11984",
      regNo: "MP-09-CZ-7721",
      model: "Tata Nexon XZA+ Petrol (2022)",
      lastServiceDate: "2025-04-10",
      daysSinceService: 178,
      lastOdometer: 24200,
      predictedOdometer: 31450,
      dailyCadenceKm: 40.7,
      pendingAdvisory: "Front brake pads were at 30% wear 4 months ago; recommended replacement now.",
      ewStatus: "Standard Warranty Expired 2 Months Ago",
      recommendedHook: "Monsoon Brake & Wiper Safety Camp - Complimentary 24-Point Health Check + 15% Labor Discount",
      callStatus: "WARM_NUDGE_SENT",
      nudgeSentTime: "10:00 AM",
      aiScriptPrompt: "Namaste Sanjay ji! Sanjay ji, your Nexon's 30,000 km periodic service is due. As noted in your April service, your front brake pads were due for inspection before the monsoon highway season. Can we book a priority morning slot for tomorrow at Sanghi Bypass?"
    },
    {
      id: "cre-02",
      customerName: "Meenakshi Joshi",
      phone: "+91 94253 44102",
      regNo: "MP-09-WC-2209",
      model: "Tata Altroz XZ Plus Turbo",
      lastServiceDate: "2025-05-22",
      daysSinceService: 136,
      lastOdometer: 18500,
      predictedOdometer: 24800,
      dailyCadenceKm: 46.3,
      pendingAdvisory: "Extended Warranty expiring in 25 days (Year 3 end).",
      ewStatus: "Eligible for 4th & 5th Year Extension at ₹11,200",
      recommendedHook: "Extended Warranty Lock-in at Pre-Revision Pricing + No-Cost EMI (₹933/month)",
      callStatus: "READY_TO_DIAL",
      nudgeSentTime: null,
      aiScriptPrompt: "Namaste Meenakshi ji! Your Altroz has completed 24k kms flawlessly. Your 3rd year factory warranty ends in 25 days. You can lock in Year 4 & 5 comprehensive coverage for just ₹933/month on No-Cost EMI before the OEM rate revision next week."
    },
    {
      id: "cre-03",
      customerName: "Gaurav Patidar",
      phone: "+91 98930 88319",
      regNo: "MP-09-EV-3310",
      model: "Tata Tiago EV Tech LUX",
      lastServiceDate: "2025-06-18",
      daysSinceService: 109,
      lastOdometer: 14200,
      predictedOdometer: 19100,
      dailyCadenceKm: 45.0,
      pendingAdvisory: "High-Voltage BMS Firmware update v14.02 pending for 10% faster fast-charging.",
      ewStatus: "Battery Warranty Active (8 Yrs)",
      recommendedHook: "Complimentary EV Monsoon Battery Health & BMS Flash Camp",
      callStatus: "READY_TO_DIAL",
      nudgeSentTime: null,
      aiScriptPrompt: "Namaste Gaurav ji! We have a dedicated EV Express Bay slot reserved for your Tiago EV to flash the new BMS v14.02 update for enhanced rain-season regen and faster DC charging."
    }
  ],
  ewPackages: {
    "Tata Nexon EV Empowered Plus (45 kWh)": [
      { tier: "Silver Shield", durationYears: 1, durationKm: 125000, price: 9800, dealerMargin: 2450, saCommission: 450, emiMonthly: 816, coverage: "Motor Controller, On-Board Charger (OBC), DC-DC Converter" },
      { tier: "Gold Shield (Recommended)", durationYears: 2, durationKm: 150000, price: 14500, dealerMargin: 3800, saCommission: 650, emiMonthly: 1208, coverage: "Complete EV Powertrain, HVAC Chiller, Airbag Module, Infotainment" },
      { tier: "Platinum 5-Year Comprehensive", durationYears: 3, durationKm: 160000, price: 19900, dealerMargin: 5200, saCommission: 900, emiMonthly: 1658, coverage: "Bumper-to-Bumper Electrical, Suspension Dampeners, Steering & Display" }
    ],
    "Tata Harrier Fearless Plus Dark Edition": [
      { tier: "Silver Shield", durationYears: 1, durationKm: 100000, price: 12500, dealerMargin: 3100, saCommission: 500, emiMonthly: 1041, coverage: "Engine Mechanical, Turbocharger, Common Rail Injectors" },
      { tier: "Gold Shield (Recommended)", durationYears: 2, durationKm: 150000, price: 18900, dealerMargin: 4900, saCommission: 650, emiMonthly: 1575, coverage: "Kryotec 2.0L Engine, 6-Speed AT Gearbox, Electronic Steering Column, Touchscreen" },
      { tier: "Platinum 5-Year Comprehensive", durationYears: 3, durationKm: 150000, price: 24500, dealerMargin: 6400, saCommission: 1100, emiMonthly: 2041, coverage: "Complete Vehicle Electricals, ADAS Radar/Camera Suite, Panoramic Sunroof Mechanism" }
    ],
    "Tata Safari Accomplished Plus 6S": [
      { tier: "Silver Shield", durationYears: 1, durationKm: 100000, price: 13900, dealerMargin: 3400, saCommission: 550, emiMonthly: 1158, coverage: "Engine & Mechanical Drivetrain" },
      { tier: "Gold Shield (Recommended)", durationYears: 2, durationKm: 150000, price: 21500, dealerMargin: 5500, saCommission: 750, emiMonthly: 1791, coverage: "DCA Transmission, Mechatronics, ESP Module, Electronic Park Brake" },
      { tier: "Platinum 5-Year Comprehensive", durationYears: 3, durationKm: 150000, price: 27900, dealerMargin: 7200, saCommission: 1200, emiMonthly: 2325, coverage: "Complete Vehicle + DCA Clutch Assembly + ADAS Sensors" }
    ],
    "Tata Punch Adventure CNG": [
      { tier: "Silver Shield", durationYears: 1, durationKm: 100000, price: 6500, dealerMargin: 1600, saCommission: 300, emiMonthly: 541, coverage: "1.2L Revotron Engine & CNG High-Pressure Reducer" },
      { tier: "Gold Shield (Recommended)", durationYears: 2, durationKm: 125000, price: 9900, dealerMargin: 2600, saCommission: 450, emiMonthly: 825, coverage: "Engine, CNG Injector Rail, ECM, Starter Motor & Alternator" },
      { tier: "Platinum 5-Year Comprehensive", durationYears: 3, durationKm: 150000, price: 13500, dealerMargin: 3600, saCommission: 700, emiMonthly: 1125, coverage: "Complete Electrical & Mechanical Components" }
    ]
  },
  campaigns: [
    {
      id: "cmp-01",
      name: "Monsoon Highway Safety & Brake Camp 2026",
      targetAudience: "Nexon, Harrier & Safari owners with odo > 20,000 km",
      channel: "WhatsApp Interactive + CRE Dialer Context",
      leadsTotal: 340,
      messagesDelivered: 338,
      openedRate: "92.4%",
      slotsBooked: 118,
      conversionRate: "34.7%",
      projectedLaborRevenue: 342000,
      status: "Active (Blasting Daily Slots)"
    },
    {
      id: "cmp-02",
      name: "Indore Value Club Post-Warranty Win-Back (Year 3-6)",
      targetAudience: "Inactive owners who haven't visited Sanghi in > 180 days",
      channel: "WhatsApp Video Invitation + ₹1,500 Lube Voucher",
      leadsTotal: 520,
      messagesDelivered: 512,
      openedRate: "88.1%",
      slotsBooked: 162,
      conversionRate: "31.1%",
      projectedLaborRevenue: 518000,
      status: "Active"
    }
  ],
  leaderboard: {
    serviceAdvisors: [
      { rank: 1, name: "Amit Sharma", ewSold: 18, ewRevenue: 284000, commissionEarned: 11800, csiScore: 9.8, badge: "🏆 Extended Warranty Champion" },
      { rank: 2, name: "Preeti Patel", ewSold: 14, ewRevenue: 221000, commissionEarned: 9100, csiScore: 9.7, badge: "⭐ Customer Trust Leader" },
      { rank: 3, name: "Rahul Joshi", ewSold: 9, ewRevenue: 138000, commissionEarned: 5850, csiScore: 9.5, badge: "🔥 Fast Mover" }
    ],
    creTelecallers: [
      { rank: 1, name: "Priya Mandloi", callsMade: 68, appointmentsBooked: 24, conversionRate: "35.3%", commissionEarned: 4800, badge: "👑 Top Converter" },
      { rank: 2, name: "Vikas Dubey", callsMade: 72, appointmentsBooked: 21, conversionRate: "29.1%", commissionEarned: 4200, badge: "⚡ High Velocity" }
    ],
    technicians: [
      { rank: 1, name: "Deepak Yadav", carsServiced: 34, ftrRate: "97.8%", warrantyShieldAccuracy: "100%", badge: "🛠️ Master Diagnostic Expert" },
      { rank: 2, name: "Sunil Rathore", carsServiced: 38, ftrRate: "96.4%", warrantyShieldAccuracy: "100%", badge: "⚡ EV Specialist" }
    ]
  },
  valueClubMemberships: [
    {
      id: "ivc-01",
      membershipNumber: "IVC-2026-0881",
      customerName: "Harishankar Trivedi",
      phone: "+91 98260 99882",
      regNo: "MP-09-CA-1902",
      model: "Tata Safari Storme 2.2L Varicor (2018)",
      tier: "Platinum Vintage Club (Year 8)",
      joinedDate: "2026-09-12",
      benefits: ["25% Off Labor Charges", "10% Off Tata Genuine Parts", "2x Free Annual Towing (Indore + 50km)", "Zero Queuing Express Bay"],
      annualFee: 3999,
      totalVisitsSinceEnrolled: 2,
      savedAmount: 4850
    }
  ],
  warrantyClaims: [
    {
      id: "clm-1102",
      jobCardId: "jc-1102",
      regNo: "MP-09-ZF-1102",
      vin: "MAT619333P3S11102",
      model: "Tata Safari Accomplished Plus 6S",
      failedPart: "DCA Transmission Mechatronic Solenoid Valve Block",
      partNumber: "2871-5420-0104",
      claimAmount: 42800,
      odometer: 29800,
      dtcCode: "P0841 (Transmission Fluid Pressure Sensor A Circuit)",
      evidence: {
        vinPlatePhoto: { uploaded: true, aiSharpnessScore: 98, status: "Verified" },
        odometerPhoto: { uploaded: true, aiSharpnessScore: 95, status: "Verified" },
        failedPartPhoto: { uploaded: true, aiSharpnessScore: 92, status: "Verified" },
        ecuFreezeFrameLog: { uploaded: true, timestamp: "2026-10-03T11:04:12Z", rpm: 1820, temp: "88°C", pressure: "1.8 bar (Fault Low)", status: "Locked" },
        roadTestValidation: { completed: true, inspector: "Deepak Yadav (Master Tech)" }
      },
      oemAuditScore: 98.4,
      claimStatus: "Ready for Guaranteed OEM Payout",
      oemRejectionRisk: "0.2% (Protected by NatureXpress AI Shield)"
    },
    {
      id: "clm-8899",
      jobCardId: "jc-8899",
      regNo: "MP-09-EB-8899",
      vin: "MAT621459P1N08899",
      model: "Tata Nexon EV Empowered Plus",
      failedPart: "High Voltage Coolant Manifold Relief Valve",
      partNumber: "2872-9901-0021",
      claimAmount: 8900,
      odometer: 24350,
      dtcCode: "P0AC0 (Hybrid Battery Pack State of Charge Sensor Performance)",
      evidence: {
        vinPlatePhoto: { uploaded: true, aiSharpnessScore: 99, status: "Verified" },
        odometerPhoto: { uploaded: true, aiSharpnessScore: 96, status: "Verified" },
        failedPartPhoto: { uploaded: false, aiSharpnessScore: 0, status: "Missing Image" },
        ecuFreezeFrameLog: { uploaded: true, timestamp: "2026-10-05T09:18:22Z", insulationResistance: "550 MOhm", temp: "31°C", status: "Locked" },
        roadTestValidation: { completed: false, inspector: "Pending" }
      },
      oemAuditScore: 78.0,
      claimStatus: "Action Required: Upload Part Photo",
      oemRejectionRisk: "22.0% (Action Blocked by AI Shield until photo added)"
    }
  ],
  diagnosticKnowledgeBase: {
    "P0841": {
      dtc: "P0841",
      title: "Transmission Fluid Pressure Sensor A Circuit Range/Performance",
      system: "Tata Wet Dual-Clutch Automatic (DCA) Transmission",
      severity: "High",
      symptoms: "Harsh gear engagement from 1st to 2nd, transmission overheat warning on cluster, delayed reverse gear.",
      hindiGuide: [
        "Step 1 (सुरक्षा जांच): वाहन को 2-पोस्ट लिफ्ट पर उठाएं। ट्रांसमिशन ऑयल का स्तर और रिसाव (oil leakage) चेक करें।",
        "Step 2 (प्रेशर टेस्ट): VCI स्कैनर से लाइन 1 प्रेशर सेंसर PID पढ़ें। आइडल पर 4.2 से 4.8 bar होना चाहिए। यदि 2.0 bar से कम है तो सोलेनोइड वाल्व चोक है।",
        "Step 3 (इलेक्ट्रिकल चेक): मल्टीमीटर से पिन 4 और पिन 7 के बीच 12.4 Ohm रेजिस्टेंस चेक करें।",
        "Step 4 (समाधान): मेकाट्रॉनिक सोलेनोइड वाल्व ब्लॉक (Child-Part #2871-5420-0104) बदलें। पूरा गियरबॉक्स बदलने की आवश्यकता नहीं है।"
      ],
      livePids: [
        { name: "Transmission Line Pressure", value: "1.8 bar", expected: "4.5 bar", status: "Critical Low" },
        { name: "Clutch 1 Slip RPM", value: "320 RPM", expected: "< 50 RPM", status: "Slip Warning" },
        { name: "Transmission Sump Temp", value: "92°C", expected: "< 85°C", status: "Elevated" }
      ]
    },
    "P0AC0": {
      dtc: "P0AC0",
      title: "Hybrid/EV Battery Pack State of Charge Sensor Performance",
      system: "High Voltage (HV) 350V+ Ziptron EV Architecture",
      severity: "High",
      symptoms: "Regeneration braking fluctuation, limited power turtle icon on instrument cluster.",
      hindiGuide: [
        "Step 1 (HV आइसोलेशन): 1000V इंसुलेटेड ग्लव्स पहनें। सर्विस प्लग (MSD) डिस्कनेक्ट करें और 5 मिनट डिस्चार्ज का इंतजार करें।",
        "Step 2 (मेगर इंसुलेशन टेस्ट): इंसुलेशन टेस्टर से HV पॉजिटिव और बॉडी चेसिस के बीच रेजिस्टेंस नापें (> 500 MOhm होना चाहिए)।",
        "Step 3 (सेल वोल्टेज बैलेंस): VCI से सभी 96 लिथियम सेल्स का वोल्टेज चेक करें। अधिकतम सेल वोल्टेज डेविएशन < 15 mV होना चाहिए।",
        "Step 4 (सॉफ्टवेयर अपडेट): Tata BMS v14.02 OTA कैलिब्रेशन फाइल फ्लैश करें और 100% AC स्लो चार्ज साइकिल चलाएं।"
      ],
      livePids: [
        { name: "Max Cell Voltage Deviation", value: "8 mV", expected: "< 15 mV", status: "Healthy" },
        { name: "HV Pack Insulation Resistance", value: "550 MOhm", expected: "> 500 MOhm", status: "Passed" },
        { name: "Battery Pack State of Health (SoH)", value: "99.4%", expected: "> 90%", status: "Optimal" }
      ]
    }
  },
  interDealerPartsPool: [
    {
      id: "part-01",
      partNumber: "2871-5420-0104",
      partName: "DCA Mechatronic Solenoid Valve Block",
      vehicleFitment: "Tata Safari & Harrier DCA",
      category: "Critical Transmission Child-Part",
      price: 18500,
      stockLocations: [
        { dealerId: "shyam-dewas-02", dealerName: "Shyam Automotive (Dewas Road)", stockQty: 2, distanceKm: 8.5, etaMins: 45, status: "Available for Instant Dispatch" },
        { dealerId: "jagdish-pithampur-03", dealerName: "Jagdish Motors (Pithampur)", stockQty: 1, distanceKm: 22.0, etaMins: 75, status: "Available" },
        { dealerId: "sanghi-indore-01", dealerName: "Sanghi Brothers (Bypass)", stockQty: 0, status: "Out of Stock (Customer Waiting - jc-1102)" }
      ]
    },
    {
      id: "part-02",
      partNumber: "2872-9901-0021",
      partName: "High Voltage Coolant Manifold Relief Valve",
      vehicleFitment: "Tata Nexon EV & Punch EV",
      category: "EV High-Voltage Thermal Loop",
      price: 4200,
      stockLocations: [
        { dealerId: "sanghi-indore-01", dealerName: "Sanghi Brothers (Bypass)", stockQty: 3, distanceKm: 0, etaMins: 0, status: "In Local Store" },
        { dealerId: "shyam-dewas-02", dealerName: "Shyam Automotive (Dewas Road)", stockQty: 1, distanceKm: 8.5, etaMins: 45, status: "Available" }
      ]
    },
    {
      id: "part-03",
      partNumber: "2865-1109-8812",
      partName: "Electronic Power Steering Rack Pinion Bush Kit",
      vehicleFitment: "Tata Nexon, Altroz & Punch",
      category: "Steering Child-Part (Saves ₹34,000 vs Full Rack)",
      price: 850,
      stockLocations: [
        { dealerId: "jagdish-pithampur-03", dealerName: "Jagdish Motors (Pithampur)", stockQty: 6, distanceKm: 22.0, etaMins: 60, status: "Available for Intra-City Runner" },
        { dealerId: "sanghi-indore-01", dealerName: "Sanghi Brothers (Bypass)", stockQty: 1, distanceKm: 0, etaMins: 0, status: "In Local Store" }
      ]
    },
    {
      id: "part-04",
      partNumber: "2899-7714-3320",
      partName: "77 GHz Front ADAS Radar Sensor Unit",
      vehicleFitment: "Tata Safari & Harrier ADAS Suite",
      category: "ADAS Electronics",
      price: 26400,
      stockLocations: [
        { dealerId: "shyam-dewas-02", dealerName: "Shyam Automotive (Ring Road)", stockQty: 1, distanceKm: 12.0, etaMins: 50, status: "Available for Instant Dispatch" }
      ]
    }
  ],
  deadStockPool: [
    {
      id: "ds-01",
      holdingDealer: "Sanghi Brothers - Bypass",
      partName: "Tata Hexa 4x4 Rear Differential Crown Wheel",
      partNo: "2844-9911-00",
      stuckDays: 320,
      holdingValue: 48500,
      discountedOffer: 29000,
      targetDealer: "Jagdish Motors Pithampur",
      matchFound: "Matched with Active Requisition at Jagdish Motors Pithampur (Vehicle MP-09-XX-9912)",
      negotiationStatus: "COUNTER_OFFER_RECEIVED",
      counterOfferAmount: 26500
    },
    {
      id: "ds-02",
      holdingDealer: "Shyam Automotive - Dewas Rd",
      partName: "Tata Safari Storme Flywheel Assembly",
      partNo: "2811-3321-44",
      stuckDays: 280,
      holdingValue: 24000,
      discountedOffer: 15500,
      targetDealer: "Sanghi Brothers Indore",
      matchFound: "Matched with Indore Value Club Member IVC-2026-0881",
      negotiationStatus: "OFFER_ACCEPTED",
      counterOfferAmount: 15500
    }
  ],
  territoryNetworkStats: {
    totalDealers: 4,
    cityTotalBays: 72,
    todayTerritoryThroughput: 168,
    intraCityRunnerDispatchesToday: 9,
    avgInterDealerPartEtaMins: 52,
    deadStockLiquidatedThisMonth: 342000,
    territoryNpsScore: 89.4
  }
};

function getDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    for (const key of Object.keys(INITIAL_DATA)) {
      if (!(key in parsed)) {
        parsed[key] = INITIAL_DATA[key];
      }
    }
    return parsed;
  } catch (err) {
    console.error("Error reading db.json, returning initial", err);
    return INITIAL_DATA;
  }
}

function saveDB(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error saving db.json", err);
  }
}

module.exports = { getDB, saveDB, INITIAL_DATA };
