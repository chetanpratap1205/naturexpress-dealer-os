import React, { useState } from 'react';
import { 
  Users, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';

const FLOOR_STAFF_ROSTER = [
  { id: 'usr-sa-1', name: 'Ramesh Sharma', role: 'SERVICE_ADVISOR', roleTitle: 'Senior Service Advisor', pin: '1111', badge: 'Bay 1-4 Lead' },
  { id: 'usr-sa-2', name: 'Vikram Patel', role: 'SERVICE_ADVISOR', roleTitle: 'Service Advisor', pin: '2222', badge: 'Bay 5-8 Lead' },
  { id: 'usr-tech-1', name: 'Amit Verma', role: 'FLOOR_TECHNICIAN', roleTitle: 'Master Diagnostic Tech', pin: '3333', badge: 'EV & Powertrain Cert' },
  { id: 'usr-tech-2', name: 'Sanjay Kumar', role: 'FLOOR_TECHNICIAN', roleTitle: 'Diagnostic Tech', pin: '4444', badge: 'Fast Track Bays' },
  { id: 'usr-store-1', name: 'Rajesh Malviya', role: 'PARTS_MANAGER', roleTitle: 'Parts & Inventory Manager', pin: '5555', badge: 'Main Spares Store' },
  { id: 'usr-cashier-1', name: 'Sunita Chouhan', role: 'BILLING_CASHIER', roleTitle: 'Billing & Settlement Cashier', pin: '6666', badge: 'Desk 1' },
  { id: 'usr-guard-1', name: 'Ram Singh', role: 'SECURITY_GUARD', roleTitle: 'Security Lead (Gate 1)', pin: '7777', badge: 'Workshop Exit' },
  { id: 'usr-dp-1', name: 'Shyam Singhal', role: 'DEALER_PRINCIPAL', roleTitle: 'Dealer Principal & Owner', pin: '9999', badge: 'Executive Board' }
];

export default function RapidPinSwitchModal({ isOpen, onClose, onSwitchSuccess, currentUser }) {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

  if (!isOpen) return null;

  const handleDigitInput = (digit) => {
    setErrorMsg('');
    const firstEmptyIndex = pinDigits.findIndex(d => d === '');
    if (firstEmptyIndex !== -1) {
      const next = [...pinDigits];
      next[firstEmptyIndex] = digit;
      setPinDigits(next);

      // If last digit filled, auto submit
      if (firstEmptyIndex === 3) {
        const fullPin = next.join('');
        verifyPin(selectedStaff, fullPin);
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    const lastFilledIndex = [...pinDigits].reverse().findIndex(d => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const next = [...pinDigits];
      next[actualIndex] = '';
      setPinDigits(next);
    }
  };

  const verifyPin = async (staff, fullPin) => {
    if (!staff) {
      setErrorMsg('Please select a staff member first');
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/v2/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin, userId: staff.id })
      });
      const data = await res.json();
      if (data.success && data.data?.user) {
        onSwitchSuccess(data.data.user, data.data.token, data.data.branch);
        onClose();
      } else {
        setErrorMsg('Incorrect 4-digit floor PIN. Try again.');
        setPinDigits(['', '', '', '']);
      }
    } catch (e) {
      // Offline fallback: match locally if server unreachable
      if (staff.pin === fullPin) {
        onSwitchSuccess(staff, 'demo-token-' + Date.now(), null);
        onClose();
      } else {
        setErrorMsg('Invalid PIN. Use default quick PIN shown on card.');
        setPinDigits(['', '', '', '']);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleQuickSelect = (staff) => {
    setSelectedStaff(staff);
    setPinDigits(['', '', '', '']);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Workshop Tablet Fast-PIN Switcher</h2>
              <p className="text-xs text-blue-200">
                Current active user: <span className="font-bold text-white">{currentUser?.name || 'Ramesh Sharma'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!selectedStaff ? (
            /* Staff Member Selection Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Staff Member to Switch Account
                </span>
                <span className="text-[11px] text-blue-600 font-bold">2-Second Fast Floor Handoff</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FLOOR_STAFF_ROSTER.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => handleQuickSelect(staff)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-blue-700">
                          {staff.name}
                        </span>
                        {currentUser?.id === staff.id && (
                          <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block font-medium mt-0.5">
                        {staff.roleTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        Default PIN: <strong className="text-slate-600">{staff.pin}</strong>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* PIN Pad Input Screen */
            <div className="max-w-xs mx-auto text-center space-y-5">
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto cursor-pointer"
              >
                ← Back to Staff List
              </button>

              <div>
                <h3 className="text-base font-black text-slate-900">{selectedStaff.name}</h3>
                <span className="text-xs text-slate-500">{selectedStaff.roleTitle}</span>
              </div>

              {/* 4 Pin Dots */}
              <div className="flex justify-center items-center gap-3 py-2">
                {pinDigits.map((d, i) => (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-black font-mono transition-all ${
                      d !== ''
                        ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {d ? '●' : ''}
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleDigitInput(num.toString())}
                    className="h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-all cursor-pointer border border-slate-200/80 shadow-2xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinDigits(['', '', '', ''])}
                  className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase active:scale-95 transition-all cursor-pointer border border-slate-200"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleDigitInput('0')}
                  className="h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-all cursor-pointer border border-slate-200/80 shadow-2xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-13 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs uppercase active:scale-95 transition-all cursor-pointer border border-rose-200"
                >
                  ⌫
                </button>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Demo Hint: PIN is <strong className="text-slate-700 font-mono">{selectedStaff.pin}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
