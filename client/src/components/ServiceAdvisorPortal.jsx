import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Car, 
  FileText, 
  Clock, 
  Phone, 
  Send,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ServiceAdvisorPortal({ jobCards, dealership, onJobCardCreated }) {
  const [regNo, setRegNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [model, setModel] = useState('Tata Nexon Creative Plus');
  const [odometer, setOdometer] = useState('24000');
  const [fuelType, setFuelType] = useState('Petrol');
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successCard, setSuccessCard] = useState(null);

  const handleVoiceInput = () => {
    setVoiceRecording(true);
    setTimeout(() => {
      setVoiceRecording(false);
      setCustomerName("Pooja Choudhary");
      setCustomerPhone("+91 98270 55102");
      setRegNo("MP-09-WA-9011");
      setModel("Tata Altroz XZ Plus Turbo");
      setOdometer("18500");
      setFuelType("Petrol");
    }, 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regNo || !customerName) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/job-cards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo,
          customerName,
          customerPhone,
          model,
          odometer,
          fuelType
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessCard(data.data);
        confetti({ particleCount: 90, spread: 60 });
        if (onJobCardCreated) onJobCardCreated();
        setRegNo('');
        setCustomerName('');
        setCustomerPhone('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
              SA Digital Desk (Floor Tablet)
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              60-Second Express Check-In Active
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Service Advisor Intake & Voice-to-Text Job Card Desk
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Bypasses 9:30 AM morning e-DMS server lags. Creates instant digital job cards with Hindi/English voice intake and auto-links WhatsApp live tracking.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-right shrink-0 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">SA Daily Check-In Velocity</span>
          <span className="text-2xl font-black text-blue-700 font-mono">14 Today</span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            Avg Intake: 58 Seconds
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 60-Second Check-In Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Fast Vehicle Check-In
            </h2>
            <button
              onClick={handleVoiceInput}
              disabled={voiceRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                voiceRecording
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{voiceRecording ? "Listening to Hindi audio..." : "Voice Auto-Fill (AI)"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                  placeholder="e.g. MP-09-WA-9011"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Tata Nexon Creative Plus">Tata Nexon Creative Plus</option>
                  <option value="Tata Harrier Fearless Plus Dark">Tata Harrier Fearless Plus Dark</option>
                  <option value="Tata Safari Accomplished Plus">Tata Safari Accomplished Plus</option>
                  <option value="Tata Nexon EV Empowered Plus">Tata Nexon EV Empowered Plus</option>
                  <option value="Tata Punch Adventure CNG">Tata Punch Adventure CNG</option>
                  <option value="Tata Altroz XZ Plus Turbo">Tata Altroz XZ Plus Turbo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Pooja Choudhary"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98270 55102"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fuel / Powertrain</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric (High Voltage)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{submitting ? "Dispatching Job Card..." : "Create Digital Job Card & Dispatch WhatsApp Link"}</span>
            </button>
          </form>

          {successCard && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Job Card #{successCard.id} Active!</span> Welcome WhatsApp message sent to {successCard.customerPhone}.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Floor Job Cards Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Workshop Job Cards ({jobCards?.length || 0})
          </h3>

          <div className="space-y-2">
            {(jobCards || []).map((jc) => (
              <div
                key={jc.id}
                className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{jc.regNo}</span>
                    <span className="text-xs text-slate-600 block">{jc.model}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                    {jc.stage?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>Advisor: <strong className="text-slate-800">{jc.saName}</strong></span>
                  <span className="font-mono font-bold text-slate-900">₹{jc.approvedTotal?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
