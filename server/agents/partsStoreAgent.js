/**
 * NatureXpress DealerOS - Parts Logistics Specialist Autonomous Agent
 * 
 * Role: Live Bay Requisition Stream, RFID Bin Scanner & 45-Min Cluster Swarm
 * Persona: High-Velocity Inventory Dispatcher & Dead-Stock Liquidator
 * Standards: 1000% Inventory Accuracy, Zero Stock-Outs & 45-Min Cluster Pool Delivery
 */

/**
 * 1. Master Bin Location & Indore Cluster Inventory Map
 */
const INDORE_CLUSTER_DEALERS = [
  { id: "d-shyam-scheme140", name: "Shyam Automotive - Scheme 140 (Flagship Spares Hub)", distanceKm: 0, dispatchTimeMins: 5 },
  { id: "d-shyam-dewas", name: "Shyam Automotive - Dewas Naka Depot", distanceKm: 12, dispatchTimeMins: 25 },
  { id: "d-sng-bypass", name: "Sanghi Brothers - Central Bypass", distanceKm: 7.5, dispatchTimeMins: 20 },
  { id: "d-jagdish-pith", name: "Jagdish Motors - Pithampur Industrial", distanceKm: 26, dispatchTimeMins: 45 }
];

const MASTER_BIN_LOCATIONS = {
  "2871-5420-0104": { bin: "Bin C-14", shelf: "Level 2 (Hydraulics)", inStockQty: 3, leadTimeMins: 5, partName: "DCA Solenoid Valve Block Assembly", priceINR: 8500 },
  "TAT-OIL-DCA-01": { bin: "Bin L-02", shelf: "Level 1 (Fluids)", inStockQty: 18, leadTimeMins: 3, partName: "Tata Genuine DCA Wet Clutch Fluid (1L)", priceINR: 1450 },
  "MSD-NEX-002": { bin: "Bin EV-01", shelf: "Secure HV Vault", inStockQty: 2, leadTimeMins: 5, partName: "Manual Service Disconnect (MSD) Fuse 450A", priceINR: 4200 },
  "2871-4200-01": { bin: "Bin B-04", shelf: "Level 3 (Brakes)", inStockQty: 12, leadTimeMins: 4, partName: "Front Ceramic Brake Pad Set", priceINR: 2850 },
  "5422-3310-09": { bin: "Bin S-09", shelf: "Level 2 (Suspension)", inStockQty: 0, leadTimeMins: 45, partName: "Front Lower Control Arm Bush Kit", priceINR: 1850, clusterStock: "Available at Shyam Automotive Dewas Depot (4 units)" }
};

/**
 * 2. Get Live Parts Storekeeper State
 */
function getLivePartsStoreState(db) {
  const requisitions = db.bayRequisitions || [
    { id: "req-01", jobCardId: "jc-001", bay: "Bay 04 (Express Mechanical)", partNo: "2871-5420-0104", partName: "DCA Solenoid Valve Block Assembly", quantity: 1, priceINR: 8500, bin: "Bin C-14", status: "PENDING_DISPATCH", timestamp: "10:15 AM" },
    { id: "req-02", jobCardId: "jc-002", bay: "Bay 05 (EV High-Voltage Lane)", partNo: "MSD-NEX-002", partName: "MSD Disconnect Fuse 450A", quantity: 1, priceINR: 4200, bin: "Bin EV-01", status: "RUNNER_ASSIGNED", timestamp: "10:22 AM" }
  ];

  const deadStockItems = db.deadStock || [
    { id: "ds-01", partNumber: "5422-3310-09", description: "Safari Hydraulic Steering Rack Assy (Pre-Facelift)", stockAgeDays: 142, qty: 3, bookValueINR: 34500, liquidationOfferINR: 24150, discountPercent: 30, targetDealer: "Jagdish Motors Pithampur" },
    { id: "ds-02", partNumber: "2841-8890-11", description: "Hexa Drivetrain Rear Propeller Shaft", stockAgeDays: 210, qty: 1, bookValueINR: 28900, liquidationOfferINR: 17340, discountPercent: 40, targetDealer: "Sanghi Brothers Bypass" }
  ];

  const totalRequisitionsPending = requisitions.filter(r => r.status !== 'DELIVERED').length;
  const deadStockTotalValue = deadStockItems.reduce((acc, d) => acc + (d.bookValueINR || 0), 0);

  return {
    timestamp: new Date().toISOString(),
    storeName: "Shyam Automotive Spares & Accessories Flagship Hub (Scheme 140, Indore)",
    inventoryStats: {
      totalBinsMonitored: 420,
      activeRequisitionsCount: totalRequisitionsPending,
      deadStockItemsCount: deadStockItems.length,
      deadStockTotalValueINR: deadStockTotalValue,
      clusterDealersOnline: INDORE_CLUSTER_DEALERS.length
    },
    activeRequisitions: requisitions,
    deadStockLedger: deadStockItems,
    clusterDealers: INDORE_CLUSTER_DEALERS,
    binCatalog: MASTER_BIN_LOCATIONS
  };
}

/**
 * 3. Handle Parts Storekeeper Interactive Queries
 */
function handlePartsStoreQuery(query, db) {
  const state = getLivePartsStoreState(db);
  const q = (query || '').toLowerCase().trim();

  // Route 1: Bin Location & Barcode Lookup
  const matchedPart = Object.keys(MASTER_BIN_LOCATIONS).find(pNo => q.includes(pNo.toLowerCase()) || q.includes(MASTER_BIN_LOCATIONS[pNo].partName.toLowerCase().split(' ')[0]));
  if (matchedPart) {
    const item = MASTER_BIN_LOCATIONS[matchedPart];
    return {
      success: true,
      intent: 'BIN_LOCATION_LOOKUP',
      title: `📦 Bin Location: ${item.partName}`,
      directAnswer: `**Part:** ${item.partName} (#${matchedPart})\n**Location:** **${item.bin}** (${item.shelf})\n**In-Stock:** **${item.inStockQty} units** (Price: ₹${item.priceINR.toLocaleString('en-IN')})\n${item.clusterStock ? `⚠️ Cluster Swarm: ${item.clusterStock}` : '✅ In-house stock ready for bay runner.'}`,
      breakdown: [
        { label: "Bin Location", value: item.bin, status: "SHELF SCAN" },
        { label: "Available Stock", value: `${item.inStockQty} Units`, status: item.inStockQty > 0 ? "IN STOCK" : "CLUSTER SWARM" },
        { label: "Lead Time to Bay", value: `${item.leadTimeMins} Minutes`, status: "RUNNER READY" }
      ],
      quickAction: {
        label: `🏃 Dispatch Runner to ${item.bin}`,
        actionKey: "DISPATCH_BIN_RUNNER",
        payload: { bin: item.bin, partName: item.partName }
      }
    };
  }

  // Route 2: 45-Minute Indore Cluster Swarm
  if (q.includes('swarm') || q.includes('cluster') || q.includes('out of stock') || q.includes('shyam') || q.includes('jagdish') || q.includes('dewas')) {
    return {
      success: true,
      intent: 'CLUSTER_PARTS_SWARM',
      title: "🌐 45-Minute Indore Inter-Dealer Parts Swarm",
      directAnswer: `4 authorized Tata dealerships connected across Indore cluster. Live stock pooling active for critical mechanical & DCA parts with 45-minute guaranteed runner dispatch.`,
      breakdown: INDORE_CLUSTER_DEALERS.map(d => ({
        label: d.name,
        value: `${d.distanceKm} km away`,
        status: `${d.dispatchTimeMins} mins ETA`
      })),
      quickAction: {
        label: "🚚 Dispatch Cluster Pool Runner",
        actionKey: "DISPATCH_CLUSTER_RUNNER"
      }
    };
  }

  // Route 3: Dead-Stock Liquidation
  if (q.includes('dead') || q.includes('liquidate') || q.includes('discount') || q.includes('aging') || q.includes('slow')) {
    const ds = state.deadStockLedger;
    return {
      success: true,
      intent: 'DEAD_STOCK_LIQUIDATION',
      title: "💰 Dead-Stock Liquidation & B2B Trade Engine",
      directAnswer: `Identified **₹${state.inventoryStats.deadStockTotalValueINR.toLocaleString('en-IN')} in dead-stock inventory** sitting > 90 days. Automated counter-offers with 30-40% discount available to liquidate cash flow immediately.`,
      breakdown: ds.map(d => ({
        label: `${d.description} (#${d.partNumber})`,
        value: `₹${d.liquidationOfferINR.toLocaleString('en-IN')}`,
        status: `${d.stockAgeDays} Days Old (-${d.discountPercent}%)`
      })),
      quickAction: {
        label: "🤝 Liquidate All Dead-Stock to Cluster",
        actionKey: "LIQUIDATE_DEAD_STOCK"
      }
    };
  }

  // Default Overview
  return {
    success: true,
    intent: 'PARTS_STORE_OVERVIEW',
    title: "📦 Parts Storekeeper Command & Live Stream",
    directAnswer: `Shyam Automotive Spares Hub (Scheme 140) monitoring **420 active storage bins**. **${state.inventoryStats.activeRequisitionsCount} bay requisitions** are currently active. 4 Indore cluster nodes ready for 45-min stock swarm.`,
    breakdown: [
      { label: "Active Bay Requisitions", value: `${state.inventoryStats.activeRequisitionsCount} Orders`, status: "LIVE STREAM" },
      { label: "Dead-Stock at Risk", value: `₹${state.inventoryStats.deadStockTotalValueINR.toLocaleString('en-IN')}`, status: "LIQUIDATION READY" },
      { label: "Indore Swarm Pool", value: "4 Dealers Online", status: "45-MIN ETA" }
    ],
    quickAction: {
      label: "🔍 Scan Barcode / RFID Bin",
      actionKey: "OPEN_BIN_SCANNER"
    }
  };
}

module.exports = {
  MASTER_BIN_LOCATIONS,
  INDORE_CLUSTER_DEALERS,
  getLivePartsStoreState,
  handlePartsStoreQuery
};
