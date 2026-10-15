import React, { useState, useEffect } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  CreditCard, 
  ShoppingBag, 
  ExternalLink, 
  Plus, 
  Share2, 
  ChevronRight, 
  Check, 
  LogOut, 
  Search, 
  Star, 
  Award, 
  Navigation, 
  Flame, 
  Truck, 
  Lock, 
  QrCode,
  Download,
  Smartphone,
  Layers,
  Fuel,
  Gauge,
  HelpCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CustomerAuthModal from './CustomerAuthModal';
import CustomerEstimateApprovalView from './CustomerEstimateApprovalView';
import CustomerServiceTracker from './CustomerServiceTracker';
import ValetIdentityCard from './ValetIdentityCard';

export default function CustomerSuperApp({ 
  onBackToShowroom, 
  onOpenStaffPortal,
  initialUser = null 
}) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('nx_customer_profile');
      return saved ? JSON.parse(saved) : (initialUser || {
        id: 'goog-anand-8820',
        name: 'Dr. Anand Maheshwari',
        email: 'anand.maheshwari@gmail.com',
        phone: '+91 98260 88201',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        loyaltyPoints: 1850,
        tier: 'Gold Privileged Member',
        homeBranch: 'shyam-scheme-140',
        verifiedProvider: 'Google OAuth 2.0 (Verified)'
      });
    } catch (e) {
      return initialUser;
    }
  });

  const [garage, setGarage] = useState([]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'garage' | 'tracker' | 'book' | 'buy_sell' | 'store' | 'rewards'
  const [showAuthModal, setShowAuthModal] = useState(!customer);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // Subsystem States
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newRegInput, setNewRegInput] = useState('');
  const [linkingVehicle, setLinkingVehicle] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Booking Form State
  const [bookingBranch, setBookingBranch] = useState('shyam-scheme-140');
  const [bookingService, setBookingService] = useState('Periodic Maintenance Service (PMS)');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingSlot, setBookingSlot] = useState('10:00 AM');
  const [valetRequired, setValetRequired] = useState(true);
  const [valetAddress, setValetAddress] = useState('Flat 402, Royal Palms, Scheme 140, Indore');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Trade-in State
  const [tradeModel, setTradeModel] = useState('Tata Nexon');
  const [tradeYear, setTradeYear] = useState('2021');
  const [tradeKm, setTradeKm] = useState('32000');
  const [tradeCondition, setTradeCondition] = useState('EXCELLENT');
  const [tradeValuation, setTradeValuation] = useState(null);

  // Test Drive State
  const [tdModel, setTdModel] = useState('Tata Curvv EV (Coupe SUV)');
  const [tdDate, setTdDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [tdSlot, setTdSlot] = useState('11:00 AM');
  const [tdAddress, setTdAddress] = useState('Indore Residence');
  const [tdResult, setTdResult] = useState(null);

  // Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sosResult, setSosResult] = useState(null);

  // Fetch Garage Vehicles
  const fetchGarage = async () => {
    try {
      const identifier = customer?.email || customer?.phone || 'MP-09-EB-8820';
      const res = await fetch(`/api/v2/customer/garage?q=${encodeURIComponent(identifier)}`);
      const json = await res.json();
      if (json.success && json.data?.length > 0) {
        setGarage(json.data);
      } else {
        // Fallback default vehicle for Dr. Anand
        const defRes = await fetch('/api/v2/customer/garage?q=MP-09-EB-8820');
        const defJson = await defRes.json();
        if (defJson.success && defJson.data?.length > 0) {
          setGarage(defJson.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchGarage();
  }, [customer]);

  const activeCar = garage[activeVehicleIndex] || garage[0] || {
    reg_no: 'MP-09-EB-8820',
    model: 'Tata Nexon EV Empowered Plus',
    fuel_type: 'Electric',
    year_mfg: 2023,
    last_service_km: 19500,
    customer_name: customer?.name || 'Dr. Anand Maheshwari',
    customer_phone: customer?.phone || '+91 98260 88201',
    warranty: {
      isActive: true,
      type: 'Tata Care+ Extended Warranty (5-Year / 1,00,000 KM)',
      expiryDate: '30 Nov 2028',
      coverage: 'High-Voltage Battery, EV Motor & Core Drivetrain'
    },
    rsa: {
      isActive: true,
      policyNumber: 'TATA-RSA-MP09EB8820',
      tollFree: '1800 209 8282',
      dealershipHotline: '+91 88798 97825'
    },
    insurance: {
      provider: 'Tata AIG General Insurance',
      policyNumber: '01688921104',
      validTill: '18 Dec 2026',
      idv: 1780000
    },
    puc: {
      valid: true,
      validTill: '14 Jan 2027',
      emissionNorm: 'Zero Emission (EV)'
    }
  };

  // 1. Link Vehicle Handler
  const handleLinkVehicle = async (e) => {
    e.preventDefault();
    if (!newRegInput.trim()) return;
    setLinkingVehicle(true);
    setLinkError('');
    try {
      const res = await fetch('/api/v2/customer/vehicles/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo: newRegInput.trim().toUpperCase(),
          customerEmail: customer?.email,
          customerPhone: customer?.phone
        })
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 50, spread: 45 });
        setGarage(json.data);
        setShowAddVehicleModal(false);
        setNewRegInput('');
      } else {
        setLinkError(json.error || 'Vehicle registration not found in dealership records.');
      }
    } catch (e) {
      setLinkError('Unable to link vehicle. Check internet connection.');
    } finally {
      setLinkingVehicle(false);
    }
  };

  // 2. Service Booking Handler
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      const res = await fetch('/api/v2/customer/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer?.name || activeCar.customer_name,
          customerPhone: customer?.phone || activeCar.customer_phone,
          regNo: activeCar.reg_no,
          model: activeCar.model,
          branch: bookingBranch,
          serviceType: bookingService,
          date: bookingDate,
          slot: bookingSlot,
          valetRequired,
          address: valetAddress,
          notes: bookingNotes
        })
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 70, spread: 60 });
        setBookingResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBookingSubmitting(false);
    }
  };

  // 3. Trade-In Valuation Calculator
  const handleCalculateTradeIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v2/customer/trade-in/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: 'Tata Motors',
          model: tradeModel,
          year: tradeYear,
          km: tradeKm,
          condition: tradeCondition,
          customerName: customer?.name,
          phone: customer?.phone
        })
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 50, spread: 50 });
        setTradeValuation(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Doorstep Test Drive Booking
  const handleBookTestDrive = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v2/customer/test-drive/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: tdModel,
          date: tdDate,
          slot: tdSlot,
          address: tdAddress,
          customerName: customer?.name,
          phone: customer?.phone
        })
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 60, spread: 50 });
        setTdResult(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Emergency SOS Trigger
  const handleTriggerSOS = async () => {
    if (!window.confirm("Trigger Shyam Automotive 24x7 Emergency Recovery Van in Indore?")) return;
    setSosActive(true);
    try {
      const res = await fetch('/api/v2/customer/emergency-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer?.name || 'Tata Vehicle Owner',
          phone: customer?.phone || '+91 98260 88201',
          regNo: activeCar.reg_no,
          lat: 22.7196,
          lng: 75.8577,
          locationText: 'Near Bicholi Mardana / Scheme 140 Ring Road, Indore',
          emergencyType: 'BREAKDOWN_ASSISTANCE'
        })
      });
      const json = await res.json();
      if (json.success) {
        setSosResult(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nx_customer_token');
    localStorage.removeItem('nx_customer_profile');
    setCustomer(null);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 lg:pb-12 select-none">
      
      {/* 1. TOP PWA INSTALL & WELCOME BANNER (Mobile-Friendly) */}
      {showPwaBanner && !pwaInstalled && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">Install Shyam Tata App:</span>
            <span className="hidden sm:inline text-blue-100">Keep on your home screen for instant Indore valet & live service tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                alert("To install: Tap the Share/Options button in your browser and select 'Add to Home Screen'.");
                setPwaInstalled(true);
              }}
              className="px-2.5 py-0.5 rounded-lg bg-emerald-400 text-slate-950 font-bold text-[11px] hover:bg-emerald-300 transition-colors cursor-pointer shadow-2xs"
            >
              Add to Home Screen
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="text-white/70 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN APP NAVIGATION HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left: Dealership Brand + Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex flex-col items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
              <span className="text-[10px] font-black tracking-widest leading-none">TATA</span>
              <span className="text-[8px] font-extrabold opacity-90 leading-none mt-0.5">MOTORS</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  Shyam Automotive
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  MY TATA APP
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Scheme 140 Flagship Hub • Indore</span>
              </div>
            </div>
          </div>

          {/* Right: Customer Profile Pill / Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {customer ? (
              <div className="flex items-center space-x-2">
                {/* Rewards Badge */}
                <div 
                  onClick={() => setActiveTab('rewards')}
                  className="hidden sm:flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 cursor-pointer shadow-2xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{customer.loyaltyPoints} Pts</span>
                </div>

                {/* Profile Pill */}
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-1 sm:pr-3 rounded-2xl">
                  <img
                    src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={customer.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-300"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {customer.name}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      {customer.tier || 'Verified Owner'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Sign In</span>
              </button>
            )}

            {/* Switch to Showroom Website */}
            {onBackToShowroom && (
              <button
                onClick={onBackToShowroom}
                className="hidden md:flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <span>🌐 Showroom</span>
              </button>
            )}

            {/* Switch to Staff Portal */}
            {onOpenStaffPortal && (
              <button
                onClick={onOpenStaffPortal}
                className="hidden lg:flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
              >
                <span>🔒 Staff Desk</span>
              </button>
            )}
          </div>

        </div>

        {/* Desktop Tab Switcher */}
        <div className="hidden lg:block border-t border-slate-100 bg-slate-50/70 px-4">
          <div className="max-w-6xl mx-auto flex items-center space-x-1 py-1.5">
            {[
              { id: 'home', label: 'Dashboard & Quick Actions', icon: Layers },
              { id: 'garage', label: 'My Tata Garage & Health', icon: Car },
              { id: 'tracker', label: 'Live Service Tracker', icon: Clock, badge: activeCar.activeJobCard ? 'Active' : null },
              { id: 'book', label: 'Book Service & Valet', icon: Calendar },
              { id: 'buy_sell', label: 'Buy New & Sell Car', icon: DollarSign },
              { id: 'store', label: 'Genuine Accessories', icon: ShoppingBag },
              { id: 'rewards', label: 'Indore Value Club', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-700 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ============================================================== */}
        {/* DESK 1: HOME & QUICK COMMAND DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Active Vehicle Hero Card */}
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Primary Registered Vehicle
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      VIN: {activeCar.vin || 'MAT621448R09881'}
                    </span>
                    {activeCar.warranty?.isActive && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 5-Yr Extended Warranty Active
                      </span>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {activeCar.model}
                    </h1>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm font-black font-mono px-3 py-1 bg-slate-900 text-white rounded-lg tracking-wider">
                        {activeCar.reg_no}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {activeCar.fuel_type} • {activeCar.last_service_km?.toLocaleString('en-IN') || '19,500'} KM Driven
                      </span>
                    </div>
                  </div>

                  {/* Active Service In-Progress Alert Banner */}
                  {activeCar.activeJobCard ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                        <div>
                          <span className="font-bold text-blue-900">Vehicle in Workshop (Scheme 140):</span>
                          <span className="text-blue-700 ml-1 font-semibold capitalize">Stage: {activeCar.activeJobCard.status}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('tracker')}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Track Bay Live
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Vehicle Health Certified • Next PMS Service due in 4,500 KM</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('book')}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                      >
                        Book Ahead
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Hero Actions & 24x7 SOS */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Service / Doorstep Valet</span>
                  </button>

                  <button
                    onClick={handleTriggerSOS}
                    className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span>24x7 Emergency SOS (Indore)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Service Shortcuts Grid (8 Luxury Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              
              <div 
                onClick={() => setActiveTab('garage')}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700">My Garage</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Specs, RC, Insurance & Warranty Vault</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('tracker')}
                className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700">Live Service Tracker</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">8-Stage Live Bay Telemetry & Approvals</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('book')}
                className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">Doorstep Valet Pickup</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Free 15km Indore Home/Office Pickup</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('buy_sell')}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700">Sell / Trade-In Car</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">10-Sec Valuation + ₹50k Exchange Bonus</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('buy_sell')}
                className="bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-700">Doorstep Test Drive</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Curvv EV, Safari, Harrier at Home</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('store')}
                className="bg-white border border-slate-200 hover:border-cyan-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-cyan-700">Genuine Accessories</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">3D Mats, Starvis Dashcams, Sunshades</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('rewards')}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700">Indore Value Club</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">₹1,850 Cash Points + ₹2,000 Referral</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  alert("Shyam Automotive Emergency Hotline: +91 88798 97825\nTata National 24x7 RSA: 1800 209 8282\nScheme 140 Workshop: 0731 422 9900");
                }}
                className="bg-white border border-slate-200 hover:border-rose-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-700">24x7 Assistance Hotline</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Immediate Indore Recovery Dispatch</p>
                </div>
              </div>

            </div>

            {/* Emergency SOS Response Banner (If Dispatched) */}
            {sosResult && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 space-y-3 animate-in zoom-in-95">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-black text-rose-900 text-base">
                      Shyam Automotive Recovery Van Dispatched!
                    </h3>
                    <p className="text-xs text-rose-700">
                      Emergency Ticket #{sosResult.sosId} • ETA: ~{sosResult.etaMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-rose-200 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>Assigned Unit: <strong className="text-slate-900">{sosResult.vanNumber}</strong></div>
                  <div>Technician: <strong className="text-slate-900">{sosResult.driverName}</strong></div>
                  <div>Driver Contact: <strong className="text-blue-700">{sosResult.driverPhone}</strong></div>
                  <div>Central Hotline: <strong className="text-emerald-700">{sosResult.hotline}</strong></div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 2: MY TATA GARAGE & DIGITAL GLOVEBOX */}
        {/* ============================================================== */}
        {activeTab === 'garage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Bar: Vehicle Selector + Add Vehicle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black text-slate-900">My Tata Vehicles</h2>
                <p className="text-xs text-slate-500">Manage all your cars, warranty meters, and digital documents</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddVehicleModal(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Link Another Tata Vehicle</span>
                </button>
              </div>
            </div>

            {/* Vehicle Selector Pills */}
            {garage.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                {garage.map((car, idx) => (
                  <button
                    key={car.reg_no}
                    onClick={() => setActiveVehicleIndex(idx)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      activeVehicleIndex === idx
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {car.model} ({car.reg_no})
                  </button>
                ))}
              </div>
            )}

            {/* 4 Pillars of Car Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Factory & Extended Warranty */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Tata Care+ Warranty</h3>
                      <div className="text-[11px] text-slate-500">{activeCar.warranty?.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    PROTECTED
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Valid Through:</span>
                    <strong className="text-slate-900">{activeCar.warranty?.expiryDate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Coverage Scope:</span>
                    <strong className="text-slate-900">{activeCar.warranty?.coverage}</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: 24x7 Roadside Assistance */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">24x7 Tata Roadside Assistance</h3>
                      <div className="text-[11px] text-slate-500">Pan-India & Indore Coverage</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Policy Number:</span>
                    <strong className="font-mono text-slate-900">{activeCar.rsa?.policyNumber}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shyam Recovery Hotline:</span>
                    <strong className="text-blue-700">{activeCar.rsa?.dealershipHotline}</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Motor Insurance */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Motor Insurance</h3>
                      <div className="text-[11px] text-slate-500">{activeCar.insurance?.provider}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    ZERO DEP
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Policy Number:</span>
                    <strong className="font-mono text-slate-900">{activeCar.insurance?.policyNumber}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Insured Declared Value (IDV):</span>
                    <strong className="text-slate-900">₹{activeCar.insurance?.idv?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Card 4: Digital Glovebox Documents */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Digital Glovebox Vault</h3>
                      <div className="text-[11px] text-slate-500">Paperless Document Access</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    SYNCED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => alert(`Registration Certificate (RC) for ${activeCar.reg_no}\nOwner: ${customer?.name}\nRTO: Indore MP-09`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>View RC Copy</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => alert(`Policy Document #01688921104\nInsurer: Tata AIG\nCoverage: Zero Dep Comprehensive`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Insurance PDF</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 3: LIVE SERVICE TRACKER & VIDEO APPROVALS */}
        {/* ============================================================== */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CustomerServiceTracker token={activeCar.activeJobCard?.token || 'demo-token-nexon-9011'} />
          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 4: 1-CLICK SERVICE & VALET BOOKING WIZARD */}
        {/* ============================================================== */}
        {activeTab === 'book' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                1-Click Dealership Booking
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Book Service & Doorstep Valet Pickup
              </h2>
              <p className="text-xs text-slate-500">
                Schedule your appointment at Shyam Automotive Indore with guaranteed same-day delivery.
              </p>
            </div>

            {bookingResult ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">
                  Booking Confirmed: #{bookingResult.bookingId}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {bookingResult.message}
                </p>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 font-mono text-xs max-w-sm mx-auto text-slate-800 text-left space-y-1">
                  <div>Vehicle: <strong>{activeCar.reg_no} ({activeCar.model})</strong></div>
                  <div>Branch: <strong>{bookingResult.branch}</strong></div>
                  <div>Date & Slot: <strong>{bookingResult.date} at {bookingResult.slot}</strong></div>
                  <div>Doorstep Valet: <strong>{bookingResult.valetAssigned ? 'YES — Driver Assigned' : 'Direct Drive-In'}</strong></div>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingResult(null)}
                  className="px-5 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Book Another Service
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateBooking} className="space-y-4">
                
                {/* Select Dealership Branch */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Shyam Automotive Branch:
                  </label>
                  <select
                    value={bookingBranch}
                    onChange={(e) => setBookingBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="shyam-scheme-140">Scheme 140 Hub (Opp Agarwal Public School) • Flagship 18 Bays</option>
                    <option value="shyam-dewas">Dewas Naka Depot (A.B. Road) • 14 Bays</option>
                    <option value="shyam-rau">Rau Express Workshop (Rau Circle) • 12 Bays</option>
                  </select>
                </div>

                {/* Select Service Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Service Required:
                  </label>
                  <select
                    value={bookingService}
                    onChange={(e) => setBookingService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Periodic Maintenance Service (PMS)">Periodic Maintenance Service (PMS 10k/20k/30k/40k)</option>
                    <option value="Brake Overhaul & Suspension Check">Brake Overhaul & Suspension Inspection</option>
                    <option value="AC Cooling & Evaporator Disinfection">AC Deep Clean & Evaporator Disinfection</option>
                    <option value="Wheel Alignment, Balancing & Rotation">3D Wheel Alignment & Balancing</option>
                    <option value="Ceramic Paint Protection & Foam Wash">Ceramic Paint Protection & Interior Spa</option>
                    <option value="General Diagnostics & Running Repairs">General Diagnostics (OBD-II Scan)</option>
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Date:</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot:</label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="09:30 AM">09:30 AM (Express Intake)</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:30 PM">04:30 PM (Evening Drop)</option>
                    </select>
                  </div>
                </div>

                {/* Doorstep Valet Pickup Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Truck className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Doorstep Valet Pickup & Drop</div>
                        <div className="text-[11px] text-slate-500">Free within 15 KM in Indore (Scheme 140 / Vijay Nagar / Rau)</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={valetRequired}
                      onChange={(e) => setValetRequired(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {valetRequired && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Pickup Address in Indore:
                      </label>
                      <input
                        type="text"
                        value={valetAddress}
                        onChange={(e) => setValetAddress(e.target.value)}
                        placeholder="Flat / House No, Area, Indore"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Specific Symptoms / Requests:
                  </label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Squeaking noise when braking, AC cooling slow in afternoon..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{bookingSubmitting ? 'Confirming Appointment...' : 'Confirm Service Appointment'}</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 5: BUY NEW TATA & SELL OLD CAR (TATA ASSURED) */}
        {/* ============================================================== */}
        {activeTab === 'buy_sell' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Sell / Trade-In (Tata Motors Assured) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Tata Motors Assured
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">+₹50,000 Exchange Bonus</span>
                </div>

                <h2 className="text-lg font-black text-slate-900">
                  Instant Used Car Valuation Calculator
                </h2>
                <p className="text-xs text-slate-500">
                  Get certified fair market value for your existing car (any brand) within 10 seconds.
                </p>

                {tradeValuation ? (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3 animate-in zoom-in-95">
                    <div className="text-xs font-bold text-amber-900 uppercase">
                      Official Tata Assured Valuation Estimate
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-600">Fair Market Estimate:</span>
                      <span className="text-2xl font-mono font-black text-slate-900">
                        ₹{tradeValuation.estimatedFairValue?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-emerald-700 font-bold border-t border-amber-200 pt-2">
                      <span>Shyam Tata Exchange Bonus:</span>
                      <span>+₹{tradeValuation.exchangeBonus?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-sm font-black text-slate-900 border-t-2 border-amber-300 pt-2">
                      <span>Total Value on Exchange:</span>
                      <span className="text-blue-900 font-mono text-lg">
                        ₹{tradeValuation.totalEffectiveValue?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Certified Valuator Kailash Rathore will visit your Indore residence for a 15-minute physical inspection.")}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer mt-2"
                    >
                      Book Free Doorstep Physical Evaluation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCalculateTradeIn} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Model:</label>
                        <select
                          value={tradeModel}
                          onChange={(e) => setTradeModel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="Tata Nexon">Tata Nexon</option>
                          <option value="Tata Harrier">Tata Harrier</option>
                          <option value="Tata Safari">Tata Safari</option>
                          <option value="Tata Punch">Tata Punch</option>
                          <option value="Tata Tiago">Tata Tiago</option>
                          <option value="Hyundai Creta">Hyundai Creta</option>
                          <option value="Maruti Brezza">Maruti Brezza</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Year:</label>
                        <select
                          value={tradeYear}
                          onChange={(e) => setTradeYear(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                          <option value="2020">2020</option>
                          <option value="2019">2019</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">KM Driven:</label>
                        <input
                          type="number"
                          value={tradeKm}
                          onChange={(e) => setTradeKm(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Condition:</label>
                        <select
                          value={tradeCondition}
                          onChange={(e) => setTradeCondition(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="EXCELLENT">Excellent (Single Owner)</option>
                          <option value="GOOD">Good (Regularly Serviced)</option>
                          <option value="FAIR">Fair (Minor Marks)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>Calculate Instant Valuation</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Book Doorstep Test Drive (New Tata Models) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    VIP Doorstep Test Drive
                  </span>
                  <span className="text-xs text-blue-700 font-bold">5-Star BNCAP Fleet</span>
                </div>

                <h2 className="text-lg font-black text-slate-900">
                  Book Doorstep Test Drive in Indore
                </h2>
                <p className="text-xs text-slate-500">
                  We bring the car directly to your home or office at your preferred time.
                </p>

                {tdResult ? (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 text-center space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-10 h-10 text-purple-600 mx-auto" />
                    <h3 className="font-bold text-slate-900 text-sm">{tdResult.message}</h3>
                    <p className="text-[11px] text-slate-600">
                      Product Specialist will call from +91 88798 97825 to confirm ETA.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookTestDrive} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Select Model:</label>
                      <select
                        value={tdModel}
                        onChange={(e) => setTdModel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="Tata Curvv.ev (Coupe SUV)">Tata Curvv.ev (Coupe SUV • 502 km Range)</option>
                        <option value="Tata Curvv (1.2 Turbo Petrol)">Tata Curvv (1.2 Turbo Petrol DCA)</option>
                        <option value="Tata Safari Accomplished Plus 6S">Tata Safari Accomplished Plus 6S</option>
                        <option value="Tata Harrier Dark Edition">Tata Harrier Dark Edition</option>
                        <option value="Tata Nexon EV Empowered Plus">Tata Nexon EV Empowered Plus (45 kWh)</option>
                        <option value="Tata Punch.ev Long Range">Tata Punch.ev Long Range</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Date:</label>
                        <input
                          type="date"
                          value={tdDate}
                          onChange={(e) => setTdDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Slot:</label>
                        <select
                          value={tdSlot}
                          onChange={(e) => setTdSlot(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="11:00 AM">11:00 AM (Morning)</option>
                          <option value="03:00 PM">03:00 PM (Afternoon)</option>
                          <option value="05:30 PM">05:30 PM (Evening)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Indore Address:</label>
                      <input
                        type="text"
                        value={tdAddress}
                        onChange={(e) => setTdAddress(e.target.value)}
                        placeholder="House / Office Address in Indore"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Book Free Doorstep Test Drive</span>
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 6: TATA GENUINE ACCESSORIES STORE */}
        {/* ============================================================== */}
        {activeTab === 'store' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black text-slate-900">Tata Genuine Accessories Store</h2>
                <p className="text-xs text-slate-500">Official OEM accessories guaranteed compatible with your {activeCar.model}</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Free Fitment at Scheme 140 Hub
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '3D All-Weather Floor Mats & Boot Liner', category: 'Interior', price: 3450, rating: 4.9, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400' },
                { name: 'Front & Rear Sony Starvis 4K Dashcam', category: 'Safety', price: 11990, rating: 5.0, img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400' },
                { name: 'Illuminated LED Door Sill Scuff Plates', category: 'Styling', price: 2950, rating: 4.8, img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400' },
                { name: 'Magnetic Custom-Fit Sunshades (Set of 4)', category: 'Comfort', price: 1850, rating: 4.7, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400' },
                { name: 'Wireless Smartphone 15W Fast Charger Pad', category: 'Electronics', price: 4200, rating: 4.9, img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400' },
                { name: 'Tata 9H Ceramic Paint Shield Coating', category: 'Care', price: 8500, rating: 4.9, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400' }
              ].map((acc, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {acc.category}
                      </span>
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-0.5">
                        ★ {acc.rating}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{acc.name}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-base font-black font-mono text-slate-900">
                      ₹{acc.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => alert(`Added "${acc.name}" to your vehicle service cart. Our team will keep this ready for installation during your next visit.`)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-2xs"
                    >
                      Book Fitment
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* DESK 7: INDORE VALUE CLUB & REWARDS WALLET */}
        {/* ============================================================== */}
        {activeTab === 'rewards' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            
            {/* Membership Digital Card */}
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-black tracking-widest uppercase opacity-80">
                    SHYAM AUTOMOTIVE • INDORE
                  </div>
                  <h3 className="text-xl font-black tracking-tight mt-0.5">
                    Indore Value Club
                  </h3>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 uppercase">
                  {customer?.tier || 'Gold Privileged'}
                </span>
              </div>

              <div className="space-y-1 my-4">
                <div className="text-xs opacity-75 font-mono">Available Wallet Points</div>
                <div className="text-4xl font-mono font-black tracking-tight">
                  {customer?.loyaltyPoints || 1850} <span className="text-base font-sans font-bold">PTS (= ₹{customer?.loyaltyPoints || 1850})</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/20 pt-3 text-xs opacity-90 font-mono">
                <div>{customer?.name}</div>
                <div>{activeCar.reg_no}</div>
              </div>
            </div>

            {/* Earn & Redeem Benefits */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Privileged Membership Perks:</h4>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>5% Cashback Points</strong> on all paid mechanical labor & scheduled PMS services.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Instant 100% Redemption</strong> directly deducted at cashier counter on your next invoice.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Complimentary Pick & Drop</strong> within 15 km in Indore.</span>
                </div>
              </div>

              {/* Refer-a-Friend Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-4 space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Refer a Tata Friend & Get ₹2,000</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Share your referral link with anyone in Indore buying or servicing a Tata car. You both receive ₹2,000 in service vouchers!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const link = `${window.location.origin}/#/showroom?ref=${customer?.id || 'anand'}`;
                    navigator.clipboard?.writeText(link);
                    alert(`Referral link copied:\n${link}`);
                  }}
                  className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Copy Referral Link
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 4. MOBILE BOTTOM ACTION BAR (Smartphones & Tablets) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-slate-500 shadow-lg"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        {[
          { id: 'home', label: 'Home', icon: Layers },
          { id: 'garage', label: 'Garage', icon: Car },
          { id: 'tracker', label: 'Tracker', icon: Clock, badge: activeCar.activeJobCard ? '●' : null },
          { id: 'book', label: 'Book', icon: Calendar },
          { id: 'buy_sell', label: 'Buy/Sell', icon: DollarSign },
          { id: 'rewards', label: 'Rewards', icon: Award }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-3 text-emerald-500 text-xs font-black animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 5. ADD / LINK VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Link Tata Vehicle</h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Enter your vehicle registration number as registered with Tata Motors & Shyam Automotive.
            </p>

            {linkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
                {linkError}
              </div>
            )}

            <form onSubmit={handleLinkVehicle} className="space-y-3">
              <input
                type="text"
                value={newRegInput}
                onChange={(e) => setNewRegInput(e.target.value.toUpperCase())}
                placeholder="MP-09-WA-9011"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-black text-slate-900 text-center uppercase"
                autoFocus
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkingVehicle}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs"
                >
                  {linkingVehicle ? 'Verifying...' : 'Link Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FREE GOOGLE OAUTH & PHONE AUTH MODAL */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(loggedUser, token, fetchedGarage) => {
          setCustomer(loggedUser);
          if (fetchedGarage && fetchedGarage.length > 0) {
            setGarage(fetchedGarage);
          }
        }}
      />

    </div>
  );
}
