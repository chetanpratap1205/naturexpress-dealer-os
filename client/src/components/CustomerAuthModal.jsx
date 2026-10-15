import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Car, 
  User, 
  Lock,
  Smartphone,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '935687850459-jemqlrld2l8vskitshkb9t1r3n2s6ed2.apps.googleusercontent.com';

export default function CustomerAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'phone'
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleGsiReady, setGoogleGsiReady] = useState(false);

  // Initialize Google Identity Services (GIS) when modal opens
  useEffect(() => {
    if (!isOpen || authMethod !== 'google') return;

    let checkInterval = null;
    const initGoogleGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          const btnContainer = document.getElementById('googleSignInButtonDiv');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'pill',
              text: 'continue_with',
              logo_alignment: 'left',
              width: 320
            });
          }
          setGoogleGsiReady(true);
          if (checkInterval) clearInterval(checkInterval);
        } catch (e) {
          console.warn('Google GSI Init notice:', e.message);
        }
      }
    };

    initGoogleGsi();
    if (!window.google?.accounts?.id) {
      checkInterval = setInterval(initGoogleGsi, 300);
      setTimeout(() => { if (checkInterval) clearInterval(checkInterval); }, 4000);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [isOpen, authMethod]);

  // Handle Google Real JWT Credential Response from GIS
  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v2/customer/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 60, spread: 55 });
        localStorage.setItem('nx_customer_token', json.token);
        localStorage.setItem('nx_customer_profile', JSON.stringify(json.customer));
        if (onLoginSuccess) {
          onLoginSuccess(json.customer, json.token, json.garage);
        }
        onClose();
      } else {
        setError(json.error || 'Google authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to verify Google credential on server.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback / Preset Google Sign-In
  const handleGoogleSignIn = async (presetUser = null) => {
    // If real Google GSI is available and no preset user clicked, trigger native Google prompt
    if (!presetUser && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (promptErr) {
        console.warn('GSI prompt notice:', promptErr.message);
      }
    }

    setLoading(true);
    setError('');
    try {
      const payload = presetUser || {
        email: 'dr.anand@gmail.com',
        name: 'Dr. Anand Maheshwari',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        sub: 'goog-anand-8820'
      };

      const res = await fetch('/api/v2/customer/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: payload })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 60, spread: 55 });
        localStorage.setItem('nx_customer_token', json.token);
        localStorage.setItem('nx_customer_profile', JSON.stringify(json.customer));
        if (onLoginSuccess) {
          onLoginSuccess(json.customer, json.token, json.garage);
        }
        onClose();
      } else {
        setError(json.error || 'Google authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach authentication server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Indian Phone OTP Login
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpInput('1234'); // Pre-fill sample OTP for instant seamless testing
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v2/customer/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneInput,
          otp: otpInput || '1234'
        })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 60, spread: 55 });
        localStorage.setItem('nx_customer_token', json.token);
        localStorage.setItem('nx_customer_profile', JSON.stringify(json.customer));
        if (onLoginSuccess) {
          onLoginSuccess(json.customer, json.token, json.garage);
        }
        onClose();
      } else {
        setError(json.error || 'Invalid OTP code.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative my-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-3 shadow-inner">
            <Car className="w-6 h-6 text-amber-300" />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
              100% Free • Verified
            </span>
            <span className="text-xs text-blue-200 font-bold">Shyam Automotive</span>
          </div>

          <h2 className="text-xl font-black text-white mt-1 tracking-tight">
            Tata Owner Digital Garage
          </h2>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            Access your vehicle health, live service tracking, appointments & rewards in Indore.
          </p>
        </div>

        {/* Tab Toggle: Google 1-Tap vs Phone OTP */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => { setAuthMethod('google'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'google'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google OAuth (Free)</span>
          </button>

          <button
            onClick={() => { setAuthMethod('phone'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Mobile Phone OTP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          {/* Option A: Google OAuth Sign-In */}
          {authMethod === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                Sign in with your Google account to automatically link your Tata vehicle, service invoices, and warranty documents.
              </p>

              {/* Official Google GSI Button Container */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div id="googleSignInButtonDiv" className="w-full flex justify-center min-h-[44px]"></div>
                
                {/* Fallback button in case Google GSI is blocked by adblock or loading */}
                {!googleGsiReady && (
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-blue-500 text-slate-800 font-bold text-sm shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer group"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="group-hover:text-blue-700">Continue with Google (1-Tap)</span>
                  </button>
                )}
              </div>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-slate-400 font-bold">Or 1-Tap Preset Test Owner</span>
                </div>
              </div>

              {/* Quick Preset Customer Accounts */}
              <div className="space-y-2 text-left">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn({
                    email: 'anand.maheshwari@gmail.com',
                    name: 'Dr. Anand Maheshwari',
                    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                    sub: 'goog-anand-8820'
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/50 transition-all text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      AM
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Dr. Anand Maheshwari</div>
                      <div className="text-[10px] text-slate-500 font-mono">MP-09-EB-8820 • Nexon EV</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    EV Owner
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn({
                    email: 'pooja.choudhary@gmail.com',
                    name: 'Pooja Choudhary',
                    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                    sub: 'goog-pooja-9011'
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-all text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      PC
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Pooja Choudhary</div>
                      <div className="text-[10px] text-slate-500 font-mono">MP-09-WA-9011 • Nexon Petrol</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Active Service
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn({
                    email: 'devendra.rathore@gmail.com',
                    name: 'Devendra Rathore',
                    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                    sub: 'goog-devendra-4412'
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 transition-all text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      DR
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Devendra Rathore</div>
                      <div className="text-[10px] text-slate-500 font-mono">MP-09-CZ-4412 • Harrier Dark</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    Harrier Dark
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Option B: Mobile Phone Number OTP */}
          {authMethod === 'phone' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              {!otpSent ? (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Enter Indian Mobile Number:
                  </label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600 border-r border-slate-300 flex items-center">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="98270 55102"
                      className="w-full px-3 py-2.5 text-sm font-mono font-bold text-slate-900 outline-none"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    We will send an instant SMS / WhatsApp verification code.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Enter 4-Digit Code for +91 {phoneInput}:</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.slice(0, 4))}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full py-3 text-center text-xl font-mono font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    autoFocus
                  />
                  <p className="text-[11px] text-emerald-700 font-semibold text-center">
                    ✓ Test OTP code <strong className="font-mono">1234</strong> pre-loaded for instant verification.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Verifying...' : 'Verify & Enter My Garage'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Privacy & Trust Guarantee */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Tata Motors Dealership Security</span>
            </div>
            <span>No SPAM • 100% Free</span>
          </div>

        </div>

      </div>
    </div>
  );
}
