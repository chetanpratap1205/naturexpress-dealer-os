import React, { useState, useEffect } from 'react';
import { QrCode, Scan, ShieldAlert, CheckCircle2, X, Lock, PackageCheck, Box } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartsBinScannerModal({ jobCards = [], isOpen = true, onClose, inline = false, onPartCheckedOut }) {
  const [bins, setBins] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState("BAR-2871-5420");
  const [selectedJobCardId, setSelectedJobCardId] = useState("jc-1102");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/parts/bins')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setBins(res.data);
            if (res.data.length > 0) setSelectedBarcode(res.data[0].barcode);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/parts/bin-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: selectedBarcode,
          jobCardId: selectedJobCardId,
          scannedBy: "Rakesh Verma (Spare Parts Head)"
        })
      });

      const data = await res.json();
      setScanResult(data);
      if (data.success) {
        confetti({ particleCount: 50, spread: 45 });
        if (onPartCheckedOut) onPartCheckedOut(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedBinItem = bins.find(b => b.barcode === selectedBarcode);

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/60 shadow-xs">
            <Scan className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">Parts Bin RFID/Barcode Scanner & Anti-Theft Lock</h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                Anti-Cannibalization Seal
              </span>
            </div>
            <p className="text-xs text-slate-500">Strict physical bin-to-VIN verification preventing unauthorized mechanic part swapping</p>
          </div>
        </div>
        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Anti-Cannibalization Policy Alert */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold block">Tata Motors Workshop Standard Operating Procedure #14:</span>
            Every OEM spare part (high-value sensors, steering racks, actuators, HV harnesses) must be physically scanned and digitally married to the active customer Job Card before unsealing.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bin & Barcode Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">1. Select Bin Item / Barcode</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {bins.map(bin => {
                const isSelected = selectedBarcode === bin.barcode;
                return (
                  <div
                    key={bin.id}
                    onClick={() => setSelectedBarcode(bin.barcode)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500 font-medium'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{bin.partName}</span>
                      <span className="font-mono text-amber-800 text-[11px]">{bin.binLocation}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] mt-1 font-mono">
                      <span>{bin.partNumber}</span>
                      <span>₹{bin.price?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Card Destination Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">2. Link to Active Job Card</label>
              <select
                value={selectedJobCardId}
                onChange={(e) => setSelectedJobCardId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              >
                {jobCards.length > 0 ? (
                  jobCards.map(j => (
                    <option key={j.id} value={j.id}>{j.regNumber || j.regNo} — {j.model} ({j.customerName})</option>
                  ))
                ) : (
                  <>
                    <option value="jc-1102">MP-09-ZF-1102 — Tata Safari Accomplished Plus (Ananya Roy)</option>
                    <option value="jc-8899">MP-09-EB-8899 — Tata Nexon EV Empowered Plus (Rajesh Verma)</option>
                    <option value="jc-4020">MP-09-CW-4020 — Tata Harrier Fearless Plus (Vikram Malhotra)</option>
                  </>
                )}
              </select>
            </div>

            {/* Selected Item Summary Card */}
            {selectedBinItem && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Part:</span>
                  <span className="font-bold text-slate-900">{selectedBinItem.partName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bin Location:</span>
                  <span className="font-mono font-bold text-amber-700">{selectedBinItem.binLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Tag:</span>
                  <span className="font-mono text-slate-700">{selectedBarcode}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              {loading ? "Verifying & Checking Out..." : "Scan & Authorize Part Issue to Bay"}
            </button>
          </div>
        </div>

        {scanResult && (
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
            scanResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{scanResult.message || (scanResult.success ? "Part checked out and sealed to Job Card." : "Checkout failed")}</p>
              {scanResult.success && (
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Audit Entry logged: Dispatched by Rakesh Verma. Bay work authorized.
                </p>
              )}
            </div>
          </div>
        )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      {content}
    </div>
  );
}
