import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  DollarSign, 
  RotateCw, 
  Layers, 
  Send,
  AlertTriangle,
  ArrowRight,
  Scan,
  Server,
  AlertOctagon,
  TrendingUp,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PartsBinScannerModal from './PartsBinScannerModal';
import EDmsBridgeConsole from './EDmsBridgeConsole';
import OEMBatchDefectRadar from './OEMBatchDefectRadar';

export default function InterDealerPartsSwarm({ 
  partsPool, 
  deadStock, 
  territoryStats, 
  onDispatchRunner, 
  onLiquidateDeadStock 
}) {
  const [selectedPart, setSelectedPart] = useState(partsPool?.[0]);
  const [activeTab, setActiveTab] = useState('pool'); // 'pool', 'deadstock', or 'buffer'
  const [dispatchSuccess, setDispatchSuccess] = useState(null);
  const [showBinScanner, setShowBinScanner] = useState(false);
  const [showEDmsBridge, setShowEDmsBridge] = useState(false);
  const [showBatchRadar, setShowBatchRadar] = useState(false);
  const [bufferForecast, setBufferForecast] = useState(null);

  useEffect(() => {
    fetch('/api/parts/buffer-forecast')
      .then(res => res.json())
      .then(res => {
        if (res.success) setBufferForecast(res.data);
      })
      .catch(console.error);
  }, []);

  const handleRunner = (partId, fromDealer, toDealer, jobCardId) => {
    onDispatchRunner(partId, fromDealer, toDealer, jobCardId);
    setDispatchSuccess({
      partName: selectedPart.partName,
      from: fromDealer,
      eta: "45 Minutes",
      runner: "Rakesh Verma (Indore Express Logistics)"
    });
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
    setTimeout(() => setDispatchSuccess(null), 6000);
  };

  const handleLiquidate = (stockId) => {
    onLiquidateDeadStock(stockId);
    confetti({ particleCount: 80, spread: 60 });
  };

  const handleCounterOffer = async (stockId, offerAmt) => {
    try {
      const res = await fetch(`/api/dead-stock/${stockId}/make-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counterOfferAmount: offerAmt, targetDealer: "Jagdish Motors Pithampur" })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✓ Counter-Offer of ₹${offerAmt.toLocaleString()} submitted to Sanghi Brothers Bypass.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-200">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                  Inter-Dealer Swarm & Warehouse Inventory
                </span>
                <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Truck className="w-3.5 h-3.5" />
                  <span>90-Min Intra-City Runner Network Active</span>
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Indore Virtual Parts Exchange & Dead-Stock Liquidator
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Unifies inventory across Sanghi Brothers, Shyam Automotive, Jagdish Motors, and TASS satellite centers. Reduces 7-day plant backorder wait times to under 60 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBinScanner(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" /> Barcode Bin Scanner
            </button>
            <button
              onClick={() => setShowEDmsBridge(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Server className="w-4 h-4" /> e-DMS Bridge
            </button>
            <button
              onClick={() => setShowBatchRadar(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" /> Batch Anomaly Radar
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-xl">
        <button
          onClick={() => setActiveTab('pool')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'pool' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Indore Virtual Parts Pool</span>
        </button>
        <button
          onClick={() => setActiveTab('deadstock')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'deadstock' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>Dead-Stock B2B Trading</span>
        </button>
        <button
          onClick={() => setActiveTab('buffer')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'buffer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Morning Parts Buffer</span>
        </button>
      </div>

      {/* Runner Success Notification */}
      {dispatchSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Truck className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                ⚡ 45-Min Courier Dispatched: {dispatchSuccess.partName}
              </span>
              <span className="text-slate-600">
                Runner {dispatchSuccess.runner} en-route from {dispatchSuccess.from} • ETA: {dispatchSuccess.eta}
              </span>
            </div>
          </div>
          <span className="text-emerald-800 font-mono font-bold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
            TRACKING: #IND-RUNNER-9982
          </span>
        </div>
      )}

      {/* Main Tab 1: Virtual Parts Pool */}
      {activeTab === 'pool' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Parts Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Urgent Parts Requisitions ({partsPool?.length || 0})
            </h3>
            <div className="space-y-2">
              {(partsPool || []).map((part) => (
                <div
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPart?.id === part.id
                      ? 'bg-blue-50 border-blue-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      {part.partNumber}
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      ₹{part.price.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{part.partName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{part.vehicleFitment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Multi-Dealer Inventory Dispatch Desk */}
          {selectedPart && (
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-4">
                <div>
                  <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                    {selectedPart.category}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedPart.partName}</h2>
                  <span className="text-xs font-mono text-slate-500">Part No: {selectedPart.partNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Standard MRP</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">₹{selectedPart.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Real-Time Indore Territory Stock Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Multi-Dealer Stock Availability (Indore Cluster)</span>
                </h3>

                <div className="space-y-3">
                  {selectedPart.stockLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        loc.stockQty > 0
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{loc.dealerName}</span>
                          <span className="text-xs text-slate-500 font-mono">({loc.distanceKm} km away)</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                          <span className={`font-bold ${loc.stockQty > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {loc.stockQty > 0 ? `✓ ${loc.stockQty} Units in Stock` : 'Out of Stock'}
                          </span>
                          {loc.etaMins > 0 && (
                            <span className="text-blue-600 font-medium">
                              • Runner ETA: {loc.etaMins} mins
                            </span>
                          )}
                        </div>
                      </div>

                      {loc.stockQty > 0 && loc.distanceKm > 0 && (
                        <button
                          onClick={() => handleRunner(selectedPart.id, loc.dealerName, 'Sanghi Brothers (Bypass)', 'jc-1102')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dispatch 45-Min Runner</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Tab 2: Dead Stock Trading */}
      {activeTab === 'deadstock' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-indigo-600" /> Inter-Dealer Dead Stock Liquidation Marketplace
              </h3>
              <p className="text-xs text-slate-500">
                Liquidates obsolete parts stuck for &gt; 180 days by matching active customer job cards across the Indore network.
              </p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200 font-bold">
              Point #17 Active
            </span>
          </div>

          <div className="space-y-3">
            {(deadStock || []).map((ds) => (
              <div key={ds.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{ds.partName}</span>
                    <span className="text-xs font-mono text-slate-500">({ds.partNo})</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">
                      Stuck {ds.stuckDays} Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Holding Dealer: {ds.holdingDealer}</p>
                  <p className="text-xs text-emerald-700 font-medium">🎯 {ds.matchFound}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block line-through">MRP: ₹{ds.holdingValue.toLocaleString()}</span>
                    <span className="text-lg font-black text-amber-600 font-mono">
                      Offer: ₹{(ds.counterOfferAmount || ds.discountedOffer || 29000).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLiquidate(ds.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Accept & Trade
                  </button>
                  <button
                    onClick={() => handleCounterOffer(ds.id, (ds.discountedOffer || 29000) - 2500)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Counter-Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 3: Morning Fast-Moving Parts Buffer Forecast */}
      {activeTab === 'buffer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> Morning Appointment Parts Demand Forecast
              </h3>
              <p className="text-xs text-slate-500">
                Predicts fast-moving inventory requirements before 9:00 AM intake to prevent bay idle time.
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-bold">
              Point #22 Buffer Engine
            </span>
          </div>

          <div className="space-y-2">
            {(bufferForecast?.predictedDemand || []).map((item, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{item.item}</span>
                  <span className="text-[11px] text-slate-600">
                    Predicted Requirement for {bufferForecast.expectedVehicles} Morning Cars: <strong className="text-slate-800">{item.required}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 font-mono">In-Hand: {item.inHand}</span>
                  <span className={`text-[10px] block font-bold uppercase ${item.bufferStatus === 'OPTIMAL' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {item.bufferStatus === 'OPTIMAL' ? '✓ Stock Optimal' : '⚠️ Re-order Triggered'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <PartsBinScannerModal
        isOpen={showBinScanner}
        onClose={() => setShowBinScanner(false)}
        onPartCheckedOut={(res) => {
          alert(`✓ Part checked out from Bin: ${res.bin?.partName}. Cannibalization Seal: ${res.antiCannibalizationSeal}`);
        }}
      />

      <EDmsBridgeConsole
        isOpen={showEDmsBridge}
        onClose={() => setShowEDmsBridge(false)}
      />

      <OEMBatchDefectRadar
        isOpen={showBatchRadar}
        onClose={() => setShowBatchRadar(false)}
      />
    </div>
  );
}
