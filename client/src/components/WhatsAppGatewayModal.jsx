import React, { useState, useEffect } from 'react';
import { MessageSquare, Shield, Key, Send, CheckCircle2, AlertTriangle, Sparkles, X, Terminal } from 'lucide-react';

export default function WhatsAppGatewayModal({ isOpen, onClose, onWebhookSimulated }) {
  const [config, setConfig] = useState({
    mode: "SIMULATED",
    phoneNumberId: "109348912831201",
    metaApiToken: "EAAG...NATUREXPRESS_PROD_TOKEN",
    webhookVerifyToken: "naturexpress_tata_indore_secret_2026",
    verifiedNumber: "+91 98930 11223"
  });
  const [testMessage, setTestMessage] = useState("This is the 3rd time my Safari has broken down. If not fixed by 5pm I am going to Consumer Court!");
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/whatsapp/config')
        .then(res => res.json())
        .then(res => {
          if (res.success) setConfig(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        alert("WhatsApp Meta Cloud Gateway Configuration Updated!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateWebhook = async () => {
    setSimulating(true);
    setResult(null);

    try {
      const res = await fetch('/api/webhook/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: "+91 99260 55190",
          jobCardId: "jc-1102",
          text: testMessage
        })
      });

      const data = await res.json();
      setResult(data);
      if (onWebhookSimulated) onWebhookSimulated(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">Meta WhatsApp Cloud API Gateway & NLP Sentiment Console</h2>
              <p className="text-xs text-slate-500">Zero-Group Architecture & Real-Time Escalation Ingestion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-slate-700 text-sm">
          {/* Mode Switcher */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 text-xs">Gateway Engine Mode</span>
              <p className="text-[11px] text-slate-500">Toggle between Simulated Sandbox & Live Meta Graph API</p>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => setConfig({ ...config, mode: "SIMULATED" })}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${config.mode === 'SIMULATED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Simulated Sandbox
              </button>
              <button
                onClick={() => setConfig({ ...config, mode: "LIVE_META" })}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${config.mode === 'LIVE_META' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Live Meta Graph API
              </button>
            </div>
          </div>

          {/* Credentials Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">WhatsApp Phone Number ID</label>
              <input
                type="text"
                value={config.phoneNumberId}
                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Webhook Verify Token</label>
              <input
                type="text"
                value={config.webhookVerifyToken}
                onChange={(e) => setConfig({ ...config, webhookVerifyToken: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-600 mb-1">Meta Permanent System User Access Token</label>
              <input
                type="password"
                value={config.metaApiToken}
                onChange={(e) => setConfig({ ...config, metaApiToken: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Live Webhook Ingestion & NLP Tester */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-600" /> Incoming Customer Webhook & NLP Analyzer
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                Point #5 Automated Sentiment Radar
              </span>
            </div>

            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={2}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 text-xs focus:outline-emerald-500"
              placeholder="Type simulated customer message..."
            />

            <div className="flex gap-2">
              <button
                onClick={() => setTestMessage("This is the 3rd time my Safari has broken down. If not fixed by 5pm I am going to Consumer Court!")}
                className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-2 py-1 rounded-md hover:bg-rose-200 font-medium"
              >
                💥 Angry Test (Consumer Court)
              </button>
              <button
                onClick={() => setTestMessage("Approved the brake disc skimming quote on video link. Thank you Amit ji for the quick update.")}
                className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md hover:bg-emerald-200 font-medium"
              >
                ✅ Happy Approval Test
              </button>
              <button
                onClick={() => setTestMessage("Why is my Nexon EV taking 6 hours for washing? I have an urgent flight.")}
                className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-md hover:bg-amber-200 font-medium"
              >
                ⚠️ Delay Frustration Test
              </button>
            </div>

            <button
              onClick={handleSimulateWebhook}
              disabled={simulating}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {simulating ? "Analyzing Message Sentiment..." : "Fire Webhook & Execute Sentiment Engine"}
            </button>
          </div>

          {/* Result Output */}
          {result && (
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Sentiment Output Result:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.data?.sentiment?.isUrgentEscalation ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                  {result.data?.sentiment?.sentiment} (Score: {((result.data?.sentiment?.score || 0) * 100).toFixed(0)}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Triggered Action: {result.data?.sentiment?.isUrgentEscalation ? '🚨 Escalated to CCM Radar & Dealership MD in Real-Time!' : '✓ Normal interaction logged to VIN thread.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Save Gateway Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
