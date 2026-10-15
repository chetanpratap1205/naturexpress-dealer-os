import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  User,
  Car,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Camera,
  AlertCircle,
  ChevronDown,
  Fuel,
  Gauge,
  Navigation,
  Truck
} from 'lucide-react';

export default function ValetIdentityCard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [photosExpanded, setPhotosExpanded] = useState(true);

  const refreshTimerRef = useRef(null);
  const secondsTimerRef = useRef(null);

  const activeToken = token || 'demo-pickup-token-8812';

  const fetchValetTracking = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch(`/api/v2/track/${activeToken}`);
      const json = await res.json();

      if (json && json.success && json.data) {
        setData(json.data);
        setSecondsAgo(0);
      } else {
        // Test demo fallback
        if (activeToken.includes('demo')) {
          setData({
            pickup: {
              id: 'PKP-88219',
              pickup_token: activeToken,
              valet_id: 'val-02',
              valet_name: 'Rajesh Solanki',
              valet_phone: '+91 98261 44550',
              valet_employee_id: 'TAT-VAL-104',
              customer_name: 'Anand Vardhan',
              customer_phone: '+91 94250 88210',
              customer_address: 'Flat 402, Royal Palms, Near Agarwal Public School, Scheme 140, Indore',
              vehicle_model: 'Tata Safari Dark Edition Accomplished+',
              vehicle_reg: 'MP 09 CZ 8804',
              scheduled_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              status: 'VALET_DISPATCHED',
              dispatched_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
              odometer_reading: 34120,
              fuel_level: 70,
              photo_front: null,
              photo_rear: null,
              photo_odometer: null
            },
            branch: {
              name: 'Shyam Automotive (Tata Motors)',
              cluster: 'Indore East — Scheme 140 Flagship Hub',
              phone: '+91 88798 97825'
            },
            dealershipName: 'Shyam Automotive (Tata Motors)',
            dealershipPhone: '+91 88798 97825'
          });
          setSecondsAgo(0);
        } else {
          setError(json?.error || 'Valet mission tracking link not found or has expired.');
        }
      }
    } catch (err) {
      if (activeToken.includes('demo')) {
        setData({
          pickup: {
            id: 'PKP-88219',
            pickup_token: activeToken,
            valet_id: 'val-02',
            valet_name: 'Rajesh Solanki',
            valet_phone: '+91 98261 44550',
            valet_employee_id: 'TAT-VAL-104',
            customer_name: 'Anand Vardhan',
            customer_address: 'Royal Palms, Scheme 140, Indore',
            vehicle_model: 'Tata Safari Dark Edition',
            vehicle_reg: 'MP 09 CZ 8804',
            scheduled_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            status: 'VALET_DISPATCHED',
            dispatched_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            odometer_reading: 34120,
            fuel_level: 70
          },
          dealershipName: 'Shyam Automotive (Tata Motors)',
          dealershipPhone: '+91 88798 97825'
        });
        setSecondsAgo(0);
      } else {
        setError('Unable to retrieve valet identity details. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchValetTracking(false);

    // Auto-refresh poll every 30 seconds
    refreshTimerRef.current = setInterval(() => {
      fetchValetTracking(true);
    }, 30000);

    // Second counter for "Last updated X seconds ago"
    secondsTimerRef.current = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      if (secondsTimerRef.current) clearInterval(secondsTimerRef.current);
    };
  }, [activeToken]);

  // Loading Skeleton State
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans">
        <header className="bg-[#0f172a] text-white px-4 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="h-6 w-24 bg-emerald-900/60 rounded-full animate-pulse" />
          </div>
        </header>

        <main className="max-w-xl mx-auto w-full p-4 space-y-4">
          <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans">
        <header className="bg-[#0f172a] text-white px-4 py-4 shadow-sm">
          <div className="max-w-xl mx-auto flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold">Shyam Automotive — Authorized Valet Service</span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#0f172a]">Pickup Mission Not Found</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {error || 'This vehicle collection link has expired or is invalid.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fetchValetTracking(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Retry
              </button>
              <a
                href="tel:+91-88798-97825"
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-700" />
                <span>Call Concierge: +91 88798 97825</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pickup = data.pickup || data;
  const missionCode = (pickup.pickup_token || activeToken || '').substring(0, 8).toUpperCase();

  // Avatar Initials (First letters of valet name)
  const getInitials = (name) => {
    if (!name) return 'SA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const valetInitials = getInitials(pickup.valet_name);

  // Status Banner Configurations
  const getStatusBanner = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return {
          bg: 'bg-blue-700',
          text: 'text-white',
          border: 'border-blue-800',
          icon: Clock,
          message: 'Your valet is preparing for pickup'
        };
      case 'VALET_DISPATCHED':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-950 font-black',
          border: 'border-amber-600',
          icon: Navigation,
          message: '🚗 Your valet is on the way'
        };
      case 'VEHICLE_COLLECTED':
        return {
          bg: 'bg-orange-600',
          text: 'text-white font-bold',
          border: 'border-orange-700',
          icon: Truck,
          message: '🚙 Vehicle collected — en route to showroom'
        };
      case 'REACHED_SHOWROOM':
        return {
          bg: 'bg-emerald-700',
          text: 'text-white font-bold',
          border: 'border-emerald-800',
          icon: CheckCircle2,
          message: '✅ Vehicle safely arrived at Shyam Automotive'
        };
      default:
        return {
          bg: 'bg-blue-700',
          text: 'text-white',
          border: 'border-blue-800',
          icon: ShieldCheck,
          message: 'Valet pickup assigned'
        };
    }
  };

  const statusConfig = getStatusBanner(pickup.status);
  const StatusIcon = statusConfig.icon;

  // Format scheduled at time
  const scheduledFormatted = pickup.scheduled_at
    ? new Date(pickup.scheduled_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Today, As Confirmed';

  // Format collected at time
  const collectedFormatted = pickup.collected_at
    ? new Date(pickup.collected_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  // Fuel level calculations
  const fuelVal = typeof pickup.fuel_level === 'number' ? pickup.fuel_level : 65;
  const fuelBarClass =
    fuelVal < 25 ? 'bg-rose-500' : fuelVal < 50 ? 'bg-amber-500' : 'bg-emerald-500';

  const hasPhotos = pickup.photo_front || pickup.photo_rear || pickup.photo_odometer;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0f172a] font-sans selection:bg-blue-600 selection:text-white flex flex-col pb-16">
      {/* 1. HEADER (Dark Navy #0f172a) */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center border border-blue-500/40 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Authorized Vehicle Collection Service
              </div>
              <h1 className="text-sm font-black tracking-tight text-white">
                Shyam Automotive (Tata Motors)
              </h1>
            </div>
          </div>

          {/* Green Verified Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[11px] font-black tracking-wide shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Identity</span>
          </div>
        </div>
      </header>

      {/* 2. STATUS BANNER (Full-width colored band below header) */}
      <div className={`${statusConfig.bg} ${statusConfig.text} border-b ${statusConfig.border} px-4 py-2.5 shadow-xs transition-colors`}>
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2 font-black">
            <StatusIcon className="w-4 h-4 shrink-0" />
            <span>{statusConfig.message}</span>
          </div>

          <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider shrink-0 ml-2">
            Updated {secondsAgo}s ago
          </span>
        </div>
      </div>

      {/* MAIN BODY CONTAINER */}
      <main className="max-w-xl mx-auto w-full px-4 pt-4 space-y-4 flex-1">
        {/* Anti-Fraud Notice */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 flex items-start space-x-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Please verify the valet's <strong>Employee ID</strong> and <strong>Mission Code</strong> shown below before handing over your car keys.
          </p>
        </div>

        {/* 3. VALET IDENTITY CARD (Physical ID Card Styling) */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-700 rounded-2xl p-5 shadow-xs relative overflow-hidden space-y-4">
          {/* Dealership Watermark / Sub-header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Official Dealership Valet ID Card
              </div>
              <div className="text-xs font-bold text-slate-800">
                Shyam Automotive — Tata Motors Authorized Dealership
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-black">
              ACTIVE DISPATCH
            </span>
          </div>

          {/* Valet Persona Row */}
          <div className="flex items-start space-x-4">
            {/* Avatar Circle with Initials */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white ring-2 ring-blue-100 shrink-0">
              {valetInitials}
            </div>

            <div className="space-y-1 flex-1">
              <h2 className="text-lg font-black text-[#0f172a] leading-tight">
                {pickup.valet_name || 'Assigned Valet'}
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {/* Employee ID Badge */}
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#0f172a] text-white">
                  Employee ID: {pickup.valet_employee_id || 'TAT-VAL-104'}
                </span>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  Authorized Service Valet
                </span>
              </div>
            </div>
          </div>

          {/* Phone Call Link */}
          {pickup.valet_phone && (
            <a
              href={`tel:${pickup.valet_phone}`}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-2xs cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>Call Valet: {pickup.valet_phone}</span>
            </a>
          )}

          {/* QR-like Visual / Mission Code Box */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-[#f8fafc] -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                Security Handover Token
              </div>
              <div className="text-xs font-mono font-bold text-slate-800">
                Ask valet to recite this code upon arrival
              </div>
            </div>

            {/* Mission Code text box */}
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-900 font-mono font-black text-xs tracking-widest border border-blue-300 shadow-2xs">
              Mission Code: {missionCode}
            </div>
          </div>
        </div>

        {/* 4. PICKUP DETAILS CARD */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] flex items-center space-x-1.5">
              <Car className="w-4 h-4 text-blue-700" />
              <span>Assigned Pickup Booking</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              {pickup.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Vehicle Model & Reg */}
            <div className="flex items-start justify-between">
              <span className="text-slate-500">Your Vehicle:</span>
              <span className="font-bold text-[#0f172a] text-right">
                {pickup.vehicle_model || 'Tata Vehicle'} —{' '}
                <span className="font-mono text-blue-700 font-bold">{pickup.vehicle_reg || 'MP 09'}</span>
              </span>
            </div>

            {/* Scheduled Time */}
            <div className="flex items-start justify-between">
              <span className="text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Scheduled Time:</span>
              </span>
              <span className="font-bold text-slate-800 text-right">{scheduledFormatted}</span>
            </div>

            {/* Pickup From Address */}
            <div className="flex items-start justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 flex items-center space-x-1 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Pickup From:</span>
              </span>
              <span className="font-medium text-slate-800 text-right max-w-[260px] leading-snug">
                {pickup.customer_address || 'Customer Location (Indore)'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. TIMELINE & PICKUP EVIDENCE (If vehicle collected or photos available) */}
        {(pickup.status === 'VEHICLE_COLLECTED' ||
          pickup.status === 'REACHED_SHOWROOM' ||
          hasPhotos ||
          pickup.odometer_reading) && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-0">
            <button
              type="button"
              onClick={() => setPhotosExpanded(!photosExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                    Digital Pickup Evidence
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {collectedFormatted
                      ? `Photos taken at time of pickup — ${collectedFormatted}`
                      : 'Custody telemetry recorded at collection'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-xs font-bold text-slate-500">
                <span>{photosExpanded ? 'Hide' : 'View Photos'}</span>
                {photosExpanded ? (
                  <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition-transform" />
                )}
              </div>
            </button>

            {photosExpanded && (
              <div className="p-4 border-t border-slate-100 bg-[#f8fafc] space-y-3">
                {/* Odometer and Fuel Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-3">
                    <Gauge className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Odometer Reading
                      </div>
                      <div className="text-sm font-mono font-black text-slate-900">
                        {pickup.odometer_reading
                          ? `${pickup.odometer_reading.toLocaleString('en-IN')} KM`
                          : 'Recorded at Handover'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Fuel className="w-3.5 h-3.5 text-slate-600" />
                        <span>Fuel Level</span>
                      </span>
                      <span className="font-mono text-slate-800 font-bold">{fuelVal}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${fuelBarClass}`}
                        style={{ width: `${Math.min(Math.max(fuelVal, 5), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Evidence Photos Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Photo Front */}
                  <div className="bg-white border border-slate-200 rounded-xl p-2 text-center space-y-1">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                      {pickup.photo_front ? (
                        <img
                          src={pickup.photo_front}
                          alt="Front profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">Front Profile</div>
                  </div>

                  {/* Photo Rear */}
                  <div className="bg-white border border-slate-200 rounded-xl p-2 text-center space-y-1">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                      {pickup.photo_rear ? (
                        <img
                          src={pickup.photo_rear}
                          alt="Rear profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">Rear Profile</div>
                  </div>

                  {/* Photo Odometer */}
                  <div className="bg-white border border-slate-200 rounded-xl p-2 text-center space-y-1">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                      {pickup.photo_odometer ? (
                        <img
                          src={pickup.photo_odometer}
                          alt="Odometer cluster"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gauge className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">Cluster / Odo</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CONTACT US SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Questions or Concerns?
            </h4>
            <p className="text-[11px] text-slate-500">
              Call Shyam Automotive directly or speak to our Service Advisor for your case:
            </p>
          </div>

          <a
            href="tel:+91-88798-97825"
            className="w-full py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <span>Call Showroom Concierge (+91 88798 97825)</span>
          </a>
        </div>

        {/* 7. FOOTER */}
        <footer className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
          <p className="leading-relaxed">
            This is an official Shyam Automotive vehicle collection mission. Report any concerns to +91-88798-97825.
          </p>
          <p className="text-[10px] text-slate-400">
            Powered by NatureXpress DealerOS • Scheme 140, Indore
          </p>
        </footer>
      </main>
    </div>
  );
}
