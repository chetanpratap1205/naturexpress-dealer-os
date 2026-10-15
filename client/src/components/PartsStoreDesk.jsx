import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  TrendingDown,
  Box
} from 'lucide-react';

export default function PartsStoreDesk({ currentUser, onDataRefresh }) {
  const [requisitions, setRequisitions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('requisitions'); // 'requisitions' | 'inventory'
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [reqRes, invRes] = await Promise.all([
        fetch('/api/v2/spares/requisitions'),
        fetch('/api/v2/spares/inventory')
      ]);
      const reqJson = await reqRes.json();
      const invJson = await invRes.json();
      if (reqJson.success) setRequisitions(reqJson.data);
      if (invJson.success) setInventory(invJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssuePart = async (reqId) => {
    try {
      const res = await fetch('/api/v2/spares/requisitions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requisitionId: reqId,
          issuedBy: currentUser?.name || 'Rajesh Malviya (Parts Store)'
        })
      });
      const json = await res.json();
      if (json.success) {
        setMessage('Part Issued! Stock Decremented in SQLite & Billed to Job Card ✓');
        setTimeout(() => setMessage(''), 4000);
        fetchData();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.sku.includes(searchQuery) ||
    i.bin_location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requisitions.filter(r => r.status === 'REQUESTED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Parts Store Control Desk
            </span>
            <span className="text-xs text-amber-800 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {pendingCount} Bay Requisitions Awaiting Dispatch
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Store Bin Locator & Anti-Pilferage Dispatch Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operator: <span className="text-slate-800 font-bold">{currentUser?.name || 'Rajesh Malviya'}</span> • Real-Time Inventory Stock Tracking
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('requisitions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'requisitions'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <span>Bay Requisitions</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <span>Bin Inventory Master ({inventory.length})</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Tab 1: Live Bay Requisition Queue */}
      {activeTab === 'requisitions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-700" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Active Workshop Bay Requisitions Queue
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-adds to Job Card billing upon issue
            </span>
          </div>

          <div className="space-y-3">
            {requisitions.map((req) => {
              const isPending = req.status === 'REQUESTED';
              return (
                <div
                  key={req.id}
                  className={`bg-slate-50 rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isPending ? 'border-amber-400 bg-amber-50/20 shadow-xs' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-800 font-mono">
                        [Bay {req.bay_number}]
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {req.part_name} (Qty: {req.qty})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-mono">
                      <div className="text-blue-700 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Bin: {req.bin_location}</span>
                      </div>
                      <div>SKU: <span className="text-slate-900">{req.sku}</span></div>
                      <div>Job Card: <span className="text-slate-900">{req.job_card_id}</span></div>
                      <div>Tech: <span className="text-slate-900">{req.tech_name}</span></div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => handleIssuePart(req.id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Issue Part & Deduct Stock</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium italic">
                        Issued at {req.issued_at?.slice(11, 16) || 'Earlier'} by {req.issued_by}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Master & Bin Locations */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-blue-700" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Tata Genuine Parts & Warehouse Bin Coordinates
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, name, or bin..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU / Part Code</th>
                  <th className="p-3">Part Description</th>
                  <th className="p-3">Warehouse Bin Location</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3 text-right">Stock Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventory.map((it) => {
                  const isLow = it.stock_qty <= (it.min_buffer_qty || 5);
                  return (
                    <tr key={it.sku} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-blue-700 font-bold">{it.sku}</td>
                      <td className="p-3 text-slate-900 font-bold">
                        <div>{it.name}</div>
                        <div className="text-[10px] text-slate-500">{it.category}</div>
                      </td>
                      <td className="p-3 text-amber-800 font-mono font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>{it.bin_location}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{it.hsn_code}</td>
                      <td className="p-3 text-right font-mono text-slate-800">₹{it.selling_price}</td>
                      <td className="p-3 text-right">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                          isLow ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        }`}>
                          {it.stock_qty} units {isLow && '⚠️ Low'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
