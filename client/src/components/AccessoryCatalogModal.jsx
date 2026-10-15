import React, { useState, useEffect } from 'react';
import { Package, Plus, Check, CheckCircle2, X, Sparkles, ShoppingBag, Car } from 'lucide-react';
import confetti from 'canvas-confetti';

const FALLBACK_ACCESSORIES = [
  { id: "acc-01", name: "Tata OEM 4K Dual Dashcam (Front + Rear)", partNo: "8821-DASH-4K", mrp: 6499, installLabor: 650, socialProof: "72% of Harrier Dark owners in Indore installed this", category: "ELECTRONICS", description: "Hardwired OEM loop recording with parking surveillance" },
  { id: "acc-02", name: "7D Luxury All-Weather Floor Liner Mats", partNo: "8821-MAT-7D", mrp: 3850, installLabor: 200, socialProof: "Protects against Indore red soil & monsoon mud", category: "INTERIOR", description: "Precision laser-cut water-resistant floor liners" },
  { id: "acc-03", name: "Heavy Duty Aluminium Side Footstep Integrated", partNo: "8821-STEP-AL", mrp: 12800, installLabor: 1200, socialProof: "Recommended for family & elderly passenger ingress", category: "EXTERIOR", description: "Chassis-mounted anti-slip footboard" },
  { id: "acc-04", name: "15W Qi Wireless Fast Charger Pad Console", partNo: "8822-CHG-QI", mrp: 2999, installLabor: 400, socialProof: "68% of tech-commuters use this", category: "CONVENIENCE", description: "OEM drop-in rubberized fast-charging dock" }
];

export default function AccessoryCatalogModal({ jobCard, jobCards = [], isOpen = true, onClose, inline = false, onAccessoryAdded }) {
  const [accessories, setAccessories] = useState(FALLBACK_ACCESSORIES);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);
  const [selectedJc, setSelectedJc] = useState(jobCard || (jobCards.length > 0 ? jobCards[0] : null));

  const activeCard = jobCard || selectedJc || (jobCards.length > 0 ? jobCards[0] : {
    id: 'jc-8899',
    model: 'Tata Nexon EV Empowered Plus (45 kWh)',
    regNo: 'MP-09-EB-8899',
    customerName: 'Rajesh Verma'
  });

  useEffect(() => {
    if (isOpen || inline) {
      const modelName = activeCard?.model || "Tata Nexon EV Empowered Plus (45 kWh)";
      fetch(`/api/accessories/${encodeURIComponent(modelName)}`)
        .then(res => res.json())
        .then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setAccessories(res.data);
          }
        })
        .catch(err => {
          console.error("Error fetching accessories", err);
        });
    }
  }, [isOpen, inline, activeCard?.model]);

  if (!isOpen && !inline) return null;

  const handleAddAccessory = async (acc) => {
    setAddingId(acc.id);
    try {
      const res = await fetch(`/api/job-cards/${activeCard.id}/add-accessory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessoryId: acc.id, model: activeCard.model })
      });
      const data = await res.json().catch(() => ({}));
      setAddedIds(prev => [...prev, acc.id]);
      confetti({ particleCount: 50, spread: 40 });
      if (onAccessoryAdded && data.data) onAccessoryAdded(data.data);
    } catch (err) {
      console.error(err);
      setAddedIds(prev => [...prev, acc.id]);
    } finally {
      setAddingId(null);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-3xl shadow-sm' : 'max-w-4xl rounded-3xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200/60 shadow-xs shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">OEM Accessory Recommendation Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Genuine Tata Motors Catalog
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Curated high-margin genuine accessories for {activeCard?.model || 'Tata Vehicles'}</p>
          </div>
        </div>
        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Vehicle Context Selector if inline */}
        {inline && jobCards.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 shrink-0">Target Vehicle in Workshop:</span>
            <select
              value={activeCard?.id}
              onChange={(e) => {
                const found = jobCards.find(j => j.id === e.target.value);
                if (found) setSelectedJc(found);
              }}
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-medium focus:outline-none"
            >
              {jobCards.map(j => (
                <option key={j.id} value={j.id}>{j.regNumber || j.regNo} — {j.model} ({j.customerName})</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accessories.map((acc) => {
            const isAdded = addedIds.includes(acc.id);
            const isAdding = addingId === acc.id;
            const priceVal = Number(acc.mrp || acc.price || 3499);
            const laborVal = Number(acc.installLabor || acc.laborPrice || 250);

            return (
              <div
                key={acc.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isAdded
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-purple-300 hover:shadow-xs bg-white'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900 text-sm">{acc.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full shrink-0">
                      {acc.category || 'OEM'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{acc.description || 'Genuine Tata Motors approved accessory'}</p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{acc.socialProof || acc.popularity || 'Recommended by 68% of Tata owners in Indore'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900 font-mono">
                      ₹{priceVal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">+ Installation ₹{laborVal}</span>
                  </div>

                  <button
                    onClick={() => handleAddAccessory(acc)}
                    disabled={isAdded || isAdding}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Job Card
                      </>
                    ) : isAdding ? (
                      "Adding..."
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add to Estimate
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!inline && (
        <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      {content}
    </div>
  );
}
