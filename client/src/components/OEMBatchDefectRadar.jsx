import React, { useState, useEffect } from 'react';
import { AlertOctagon, ShieldAlert, Cpu, Radio, MapPin, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function OEMBatchDefectRadar({ isOpen = true, onClose, inline = false }) {
  const [defects, setDefects] = useState([]);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/oem/batch-defects')
        .then(res => res.json())
        .then(res => {
          if (res.success) setDefects(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200/60 shadow-xs">
            <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">Tata Motors OEM Batch Defect & Regional Radar</h2>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200 font-bold">
                Territory Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500">Cross-dealer failure clustering across Sanghi, Shyam & Jagdish Motors (Indore Territory)</p>
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
      <div className="p-6 space-y-5 text-slate-700 text-sm">
        {defects.map(d => (
          <div key={d.id} className="p-5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-100 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Critical Territory Batch Anomaly
              </span>
              <span className="text-xs font-mono text-slate-600">DTC Code: <strong className="text-slate-900">{d.dtcCode}</strong></span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{d.model}</h3>
              <p className="text-xs text-rose-700 font-semibold mt-0.5">Affected Subsystem: {d.affectedSubsystem}</p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-2 shadow-xs">
              <div className="font-bold text-slate-800">Indore Cluster Failure Breakdown (Last 7 Days - {d.occurrencesLast7Days} Cases):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {d.dealershipBreakdown.map((dealer, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-semibold text-slate-900 block truncate">{dealer.dealerName}</span>
                    <span className="text-rose-600 font-bold font-mono text-sm">{dealer.reportedCount} reported</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-rose-200/80 text-xs">
              <div className="text-slate-600">
                <span>Recommendation: </span>
                <strong className="text-slate-900">{d.recommendedAction}</strong>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-700 font-semibold">
                Auto-Alerted to TSM Pune: {d.puneOemAlertStatus}
              </span>
            </div>
          </div>
        ))}
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
