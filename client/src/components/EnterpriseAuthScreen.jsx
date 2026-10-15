import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  UserCheck, 
  Wrench, 
  Package, 
  Receipt, 
  Shield, 
  Crown, 
  ArrowRight, 
  Delete, 
  Sparkles,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const FLOOR_ROLES = [
  {
    role: 'SERVICE_ADVISOR',
    title: 'Service Advisor',
    name: 'Ramesh Sharma',
    pin: '1111',
    avatar: '👨‍💼',
    icon: UserCheck,
    color: 'from-blue-600 to-indigo-700',
    border: 'border-blue-500',
    desc: 'Intake, 360° Scratch Mapper, Customer Estimates'
  },
  {
    role: 'FLOOR_TECHNICIAN',
    title: 'Master Diagnostic Tech',
    name: 'Amit Verma',
    pin: '2222',
    avatar: '🔧',
    icon: Wrench,
    color: 'from-amber-600 to-orange-700',
    border: 'border-amber-500',
    desc: 'Bay Timers, Inspection Video Proof, DTC Diagnostics'
  },
  {
    role: 'PARTS_MANAGER',
    title: 'Parts Store Head',
    name: 'Rajesh Malviya',
    pin: '3333',
    avatar: '📦',
    icon: Package,
    color: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-500',
    desc: 'Bin Locator (Aisle-Rack-Bin), Issue Slips, Consumables'
  },
  {
    role: 'BILLING_CASHIER',
    title: 'Billing & Cashier',
    name: 'Sunita Chouhan',
    pin: '4444',
    avatar: '🧾',
    icon: Receipt,
    color: 'from-purple-600 to-violet-700',
    border: 'border-purple-500',
    desc: 'GST SAC/HSN Billing, Card EDC RRN, Gate Pass QR'
  },
  {
    role: 'SECURITY_GUARD',
    title: 'Security Gate 1',
    name: 'Ram Singh',
    pin: '5555',
    avatar: '🛡️',
    icon: Shield,
    color: 'from-slate-700 to-slate-900',
    border: 'border-slate-500',
    desc: 'Physical Gate Pass Scanner, Vehicle Outward Clearance'
  },
  {
    role: 'DEALER_PRINCIPAL',
    title: 'Dealer Principal / GM',
    name: 'Shyam Singhal',
    pin: '9999',
    avatar: '👑',
    icon: Crown,
    color: 'from-rose-600 to-red-800',
    border: 'border-rose-500',
    desc: 'Daily P&L Ledger, Labour Gross Margin, Legal CCM Defense'
  }
];

export default function EnterpriseAuthScreen({ onLoginSuccess, onBackToShowroom }) {
  const [selectedRole, setSelectedRole] = useState(FLOOR_ROLES[0]);
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyPress = (num) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        verifyPin(nextPin, selectedRole.role);
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const verifyPin = async (pin, role) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/v2/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, role })
      });
      const json = await res.json();
      if (json.success) {
        onLoginSuccess(json.data.user, json.data.token, json.data.branch);
      } else {
        setErrorMsg(json.error || 'Invalid PIN entered. Please check terminal code.');
        setPinInput('');
      }
    } catch (e) {
      setErrorMsg('Connection to dealership local server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleObj) => {
    setSelectedRole(roleObj);
    setPinInput(roleObj.pin);
    verifyPin(roleObj.pin, roleObj.role);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dealership Header Bar */}
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center font-black text-white text-xl shadow-md border border-blue-600">
            NX
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                Tata Motors Dealership Floor OS
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Local Workshop SQLite Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Shyam Automotive (Indore Flagship)
            </h1>
            <p className="text-xs text-slate-500">
              Scheme 140 & Bicholi Mardana Hub • 18 Bays • GSTIN: 23AABCS8899K1Z4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onBackToShowroom && (
            <button
              onClick={onBackToShowroom}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>🌐 Public Showroom Website</span>
            </button>
          )}
          <a
            href="/#/view/estimate/demo-token-nexon-9011"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span>📱 Open Car Owner View</span>
          </a>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-right hidden sm:block shadow-xs">
            <div className="text-[11px] font-mono text-slate-500">STAFF WORKSHOP FLOOR</div>
            <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              Role-Isolated Terminal PIN
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Role Selection Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Select Floor Terminal & Operator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your assigned workshop post to enter your 4-digit rapid PIN. No unauthorized cross-role access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {FLOOR_ROLES.map((r) => {
              const isSelected = selectedRole.role === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => {
                    setSelectedRole(r);
                    setPinInput('');
                    setErrorMsg('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group text-left ${
                    isSelected
                      ? `bg-white border-blue-600 shadow-md ring-2 ring-blue-500/30`
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-2 rounded-lg bg-slate-100 border border-slate-200">
                        {r.avatar}
                      </span>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {r.title}
                        </div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">
                          {r.name}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickDemoLogin(r);
                      }}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition-all border border-slate-200"
                      title="1-Click Instant Demo Login"
                    >
                      Instant PIN: {r.pin}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-1">
                    {r.desc}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High-Visibility PIN Pad */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="text-center space-y-1 mb-6">
            <span className="text-2xl">{selectedRole.avatar}</span>
            <div className="text-base font-black text-slate-900 mt-1">
              {selectedRole.name}
            </div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {selectedRole.title}
            </div>
          </div>

          {/* PIN Input Display Dots */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pinInput.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border transition-all ${
                    isFilled 
                      ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-md shadow-blue-500/20' 
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                >
                  {isFilled ? '●' : '○'}
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Numeric Keypad for Grease/Tablet Touch */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                disabled={loading}
                className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 font-black text-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={loading}
              className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-600 active:text-white text-slate-800 font-black text-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="h-14 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 font-bold border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="text-xs text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 cursor-pointer"
            >
              Auto-fill PIN {selectedRole.pin} for {selectedRole.name}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl w-full mx-auto border-t border-slate-200 pt-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          NatureXpress Dealership OS • Built for Tata Motors High-Volume Dealerships
        </div>
        <div className="text-[11px] text-slate-400">
          Shyam Automotive • Scheme 140 Indore Flagship
        </div>
      </div>
    </div>
  );
}
