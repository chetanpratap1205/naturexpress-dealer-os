import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Smartphone, Send, Star, AlertCircle, CheckCircle2, Award, X, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CSIIntegrityShield({ isOpen = true, onClose, inline = false }) {
  const [csiData, setCsiData] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  useEffect(() => {
    if (isOpen || inline) {
      fetch('/api/csi/status')
        .then(res => res.json())
        .then(res => {
          if (res.success) setCsiData(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen, inline]);

  if (!isOpen && !inline) return null;

  const handleDispatchDirect = async (jobCardId) => {
    setDispatching(true);
    setDispatchSuccess(null);

    try {
      const res = await fetch('/api/csi/dispatch-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobCardId })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchSuccess(data.data.message);
        confetti({ particleCount: 50, spread: 45 });
        setCsiData(prev => ({
          ...prev,
          totalSurveysSentToday: (prev?.totalSurveysSentToday || 0) + 1,
          directOemDispatched: (prev?.directOemDispatched || 0) + 1
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDispatching(false);
    }
  };

  const content = (
    <div className={`bg-white border border-slate-200 w-full ${inline ? 'rounded-2xl shadow-xs' : 'max-w-3xl rounded-2xl shadow-2xl my-8'} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/60 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">CSI Score Integrity Shield & Anti-Tamper Engine</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Direct OEM Gateway
              </span>
            </div>
            <p className="text-xs text-slate-500">Locks customer mobile numbers & routes official Tata CSI surveys directly from OEM number</p>
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
        {/* Anti-Extortion Explainer Banner */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <span className="font-bold block">Solving Insider Reality #8 (Customer Rating Manipulation):</span>
            SAs often manipulate DMS phone numbers to direct survey SMS links to staff phones. NatureXpress locks the customer phone field via OTP verification and dispatches surveys directly from the Tata Motors Corporate Sender ID.
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">CSI Target</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
              {csiData?.csiTarget || '950 / 1000'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Actual CSI Score</span>
            <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">
              {csiData?.actualCsiScore || '968 / 1000'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Locked Numbers</span>
            <span className="text-xl font-black text-blue-600 font-mono mt-1 block">
              {csiData?.customerNumbersLocked || 42}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Tampering Prevented</span>
            <span className="text-xl font-black text-rose-600 font-mono mt-1 block">
              {csiData?.staffTamperingAttemptsPrevented || 3}
            </span>
          </div>
        </div>

        {/* Survey Queue Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Delivered Vehicles Awaiting Direct OEM CSI Survey
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Verified Mobile</th>
                  <th className="p-3">Phone Field Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {csiData?.surveyQueue?.map((item) => (
                  <tr key={item.jobCardId} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-blue-900">{item.regNo}</td>
                    <td className="p-3 font-medium text-slate-900">{item.customerName}</td>
                    <td className="p-3 font-mono text-slate-600">{item.phone}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> OTP Locked
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDispatchDirect(item.jobCardId)}
                        disabled={dispatching}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Dispatch OEM Survey</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {dispatchSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{dispatchSuccess}</span>
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
