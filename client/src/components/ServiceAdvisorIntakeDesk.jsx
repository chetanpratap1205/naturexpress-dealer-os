import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Camera, 
  Fuel, 
  Gauge, 
  Wrench, 
  Share2, 
  ExternalLink, 
  User, 
  Phone, 
  AlertCircle, 
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  Check,
  Printer
} from 'lucide-react';
import VehicleWalkaroundMapper from './VehicleWalkaroundMapper';

const PRESET_VEHICLES = [
  { reg: 'MP-09-WA-9011', label: 'Nexon Petrol (Pooja Choudhary)' },
  { reg: 'MP-09-CZ-4412', label: 'Harrier Dark (Devendra Rathore)' },
  { reg: 'MP-09-EB-8820', label: 'Nexon EV (Dr. Anand Maheshwari)' },
  { reg: 'MP-09-UK-3032', label: 'Punch MT (Sunil Agrawal)' }
];

const PRESET_COMPLAINTS = [
  'Scheduled 30,000 KM Periodic Maintenance Service (PMS)',
  'Front wheel metallic squeal noise when applying brakes at 40 km/h',
  'AC cooling slow in heavy afternoon traffic',
  'Wheel alignment drift to left side on highway speeds',
  'Engine pickup hesitation in 2nd gear during cold start'
];

export default function ServiceAdvisorIntakeDesk({ currentUser, onJobCardCreated }) {
  const [searchReg, setSearchReg] = useState('');
  const [searching, setSearching] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  
  // Intake Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [odometer, setOdometer] = useState('24200');
  const [odometerPhoto, setOdometerPhoto] = useState(null);
  const [fuelLevel, setFuelLevel] = useState(65);
  const [serviceType, setServiceType] = useState('Periodic Maintenance Service (PMS)');
  const [complaints, setComplaints] = useState([PRESET_COMPLAINTS[0], PRESET_COMPLAINTS[1]]);
  const [newComplaintInput, setNewComplaintInput] = useState('');
  const [scratchMarkers, setScratchMarkers] = useState([
    { id: 'sc-1', view: 'left', x: 74, y: 52, type: 'scratch', panel: 'Left Rear Door Lower Edge', severity: 'Minor (Buffing / PDR)', notes: 'Pre-existing 3cm scratch near door handle' }
  ]);
  
  // Inventory Custody Checklist
  const [custody, setCustody] = useState({
    spareWheel: true,
    toolKit: true,
    dashcamSdRemoved: true,
    fastagChecked: true,
    valuablesDeclared: false
  });

  // Digital Signature Canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [createdJc, setCreatedJc] = useState(null);

  // Auto-load default vehicle for instant review
  useEffect(() => {
    handleLookup('MP-09-WA-9011');
  }, []);

  const handleLookup = async (reg) => {
    const query = reg || searchReg;
    if (!query || query.length < 3) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/v2/vehicles/lookup?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.success && json.data) {
        const v = json.data;
        setVehicle(v);
        setSearchReg(v.reg_no);
        setCustomerName(v.customer_name);
        setCustomerPhone(v.customer_phone);
        setModel(v.model);
        setFuelType(v.fuel_type);
        setOdometer(v.last_service_km ? String(v.last_service_km + 4400) : '24200');
      } else {
        setVehicle(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleAddComplaint = () => {
    if (!newComplaintInput.trim()) return;
    setComplaints([...complaints, newComplaintInput.trim()]);
    setNewComplaintInput('');
  };

  const handleRemoveComplaint = (index) => {
    setComplaints(complaints.filter((_, i) => i !== index));
  };

  // Canvas drawing handlers with responsive scaling
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleOdometerPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setOdometerPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitIntake = async (e) => {
    e.preventDefault();
    if (!customerName || !searchReg) return;
    setSubmitting(true);

    try {
      const payload = {
        branch_id: 'shyam-scheme-140',
        reg_no: searchReg.toUpperCase(),
        customer_name: customerName,
        customer_phone: customerPhone,
        model: model || 'Tata Nexon',
        fuel_type: fuelType,
        odometer_in: parseInt(odometer || 0, 10),
        odometer_photo: odometerPhoto,
        fuel_level: fuelLevel,
        service_type: serviceType,
        complaints,
        inventory_checklist: custody,
        scratch_markers: scratchMarkers,
        customer_signature: signatureData,
        sa_id: currentUser?.id || 'usr-sa-1',
        sa_name: currentUser?.name || 'Ramesh Sharma',
        estimated_amount: 7640,
        items: [
          { item_type: 'LABOR', code: 'SAC-9987-PMS30K', description: '30,000 KM Periodic Maintenance Labor', qty: 1, unit_price: 2200, gst_rate: 18, is_mandatory: 1 },
          { item_type: 'PART', code: 'LUB-SYN-5W30-35', description: 'Castrol Magnatec Pro Tata 5W30 Synthetic (3.5L)', qty: 1, unit_price: 2350, gst_rate: 18, is_mandatory: 1 },
          { item_type: 'PART', code: '287018100109', description: 'OEM Engine Oil Filter Cartridge', qty: 1, unit_price: 345, gst_rate: 18, is_mandatory: 1 },
          { item_type: 'PART', code: '542442100108', description: 'Front Disc Brake Pad Set (2.1mm remaining - Critical Safety)', qty: 1, unit_price: 2450, gst_rate: 28, is_mandatory: 0, approval_status: 'PENDING', inspection_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-car-mechanic-checking-the-front-wheel-brake-41908-large.mp4', inspection_notes: 'Vernier caliper reading 2.1mm (OEM minimum 3.0mm).' }
        ]
      };

      const res = await fetch('/api/v2/job-cards/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setCreatedJc(json.data);
        if (onJobCardCreated) onJobCardCreated(json.data.jobCard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate Native wa.me intent link (Zero Meta API dependencies)
  const getWhatsAppIntentUrl = () => {
    if (!createdJc) return '';
    const cleanPhone = (customerPhone || '9827055102').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const origin = (typeof window !== 'undefined' && window.location.origin) || import.meta.env.VITE_APP_URL || 'https://automotive.naturexpress.in';
    const estimateLink = `${origin}/#/view/estimate/${createdJc.token}`;
    const message = `Namaste ${customerName} ji! 🙏\n\nYour ${model} (${searchReg}) is checked in at Shyam Automotive (Tata Motors, Indore).\n\nJob Card #${createdJc.id} created.\n📋 View your 360° vehicle scratch report & live estimate here:\n${estimateLink}\n\n- Ramesh Sharma, Service Advisor`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              Service Advisor Floor Tablet Desk
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              90-Sec Fast Intake Mode
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Vehicle Intake & 360° Scratch Protection Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operator: <span className="text-slate-800 font-bold">{currentUser?.name || 'Ramesh Sharma'}</span> • Dealership: Shyam Automotive (Scheme 140)
          </p>
        </div>

        {/* Preset Vehicle Quick Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-2 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Quick Lookup:
          </span>
          {PRESET_VEHICLES.map((pv) => (
            <button
              key={pv.reg}
              type="button"
              onClick={() => handleLookup(pv.reg)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 text-slate-700 hover:text-white transition-all border border-slate-300 cursor-pointer shadow-2xs"
            >
              {pv.reg}
            </button>
          ))}
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL (If Job Card Created) */}
      {createdJc && (
        <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  Job Card Created Successfully
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {createdJc.id} • {model} ({searchReg})
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Customer: {customerName} ({customerPhone}) • 360° Scratch Record Saved
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCreatedJc(null)}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left w-full sm:w-auto">
                <div className="text-xs font-bold text-slate-700">
                  Customer Estimate Approval Link:
                </div>
                <div className="text-xs font-mono text-blue-700 break-all select-all font-semibold">
                  {window.location.origin}/#/view/estimate/{createdJc.token}
                </div>
              </div>
              <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto">
                {/* Native WhatsApp Intent Link (Zero Meta Cloud API) */}
                <a
                  href={getWhatsAppIntentUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send via WhatsApp (wa.me)</span>
                </a>
                <a
                  href={`/#/view/estimate/${createdJc.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-300 cursor-pointer shadow-2xs"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Preview Estimate</span>
                </a>
              </div>
            </div>

            {/* Phase 2: Customer Service Tracker Link */}
            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 text-left">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-blue-700 flex items-center justify-center">
                    <span className="text-white text-[8px] font-black">↻</span>
                  </span>
                  Live Service Tracker (share with customer — updates in real-time):
                </div>
                <div className="text-xs font-mono text-indigo-700 break-all select-all font-semibold">
                  {window.location.origin}/#/track/{createdJc.token}
                </div>
              </div>
              <a
                href={`/#/track/${createdJc.token}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Tracker View</span>
              </a>
            </div>

            {/* Print Bay Job Card Clipboard Sheet */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Bay Clipboard Sheet (Physical Copy)</span>
              </button>
            </div>
          </div>

          {/* Hidden on screen, visible during window.print(): Official Job Card Physical Copy */}
          <div className="hidden print:block printable-document text-left font-mono text-xs space-y-3">
            <div className="border-b-2 border-black pb-2 flex justify-between items-start">
              <div>
                <h1 className="text-base font-black uppercase">SHYAM AUTOMOTIVE (TATA MOTORS)</h1>
                <p className="text-[10px]">Scheme 140 Flagship Hub, Indore (MP) • Workshop Floor Intake Copy</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black">JOB CARD: {createdJc.id}</div>
                <div className="text-[10px]">Date: {new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-black pb-2 text-[11px]">
              <div>
                <div><strong>REG NO:</strong> {searchReg}</div>
                <div><strong>MODEL:</strong> {model} ({fuelType})</div>
                <div><strong>ODOMETER:</strong> {odometer} KM</div>
                <div><strong>FUEL LEVEL:</strong> {fuelLevel}%</div>
              </div>
              <div>
                <div><strong>CUSTOMER:</strong> {customerName}</div>
                <div><strong>PHONE:</strong> {customerPhone}</div>
                <div><strong>SERVICE ADVISOR:</strong> {currentUser?.name || 'Ramesh Sharma'}</div>
                <div><strong>SERVICE TYPE:</strong> {serviceType}</div>
              </div>
            </div>

            <div className="border-b border-black pb-2">
              <strong className="block text-xs uppercase mb-1">Customer Reported Complaints:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {complaints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="border-b border-black pb-2">
              <strong className="block text-xs uppercase mb-1">Vehicle Walkaround & Pre-Existing Marks:</strong>
              <div className="text-[11px]">
                {scratchMarkers.length > 0 ? (
                  scratchMarkers.map((m, idx) => (
                    <div key={idx}>• [{m.view.toUpperCase()}] {m.panel} - {m.severity}: {m.notes}</div>
                  ))
                ) : (
                  <div>No pre-existing exterior damage recorded.</div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-end pt-8 text-[11px]">
              <div className="border-t border-black pt-1 w-44 text-center">
                Customer Signature
              </div>
              <div className="border-t border-black pt-1 w-44 text-center">
                Service Advisor Signature
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Main Intake Form */}
      <form onSubmit={handleSubmitIntake} className="space-y-6">
        {/* Step 1: Vehicle Identification */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-blue-700 flex items-center justify-center text-xs font-black text-white">
                1
              </span>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Vehicle Master & Parivahan Lookup
              </h2>
            </div>
            {vehicle && vehicle.vip_flag === 1 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> VIP Dealership Client
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">Registration Number *</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchReg}
                  onChange={(e) => setSearchReg(e.target.value.toUpperCase())}
                  placeholder="e.g. MP-09-WA-9011"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-slate-900 uppercase focus:outline-hidden focus:border-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleLookup(searchReg)}
                  disabled={searching}
                  className="absolute right-2 top-2 p-1 rounded-lg bg-slate-200 hover:bg-blue-700 text-slate-700 hover:text-white cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-5">
              <label className="text-xs font-bold text-slate-700 block mb-1">Model & Variant</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Tata Nexon Creative Plus 1.2"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-hidden focus:border-blue-600"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="EV">EV (Ziptron)</option>
                <option value="CNG">iCNG</option>
              </select>
            </div>
          </div>

          {/* Customer Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Pooja Choudhary"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Mobile *</label>
              <div className="relative">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98270 55102"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium font-mono"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {vehicle && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div>VIN: <span className="text-slate-900 font-mono font-bold">{vehicle.vin}</span></div>
              <div>Last Service: <span className="text-slate-900 font-bold">{vehicle.last_service_km} KM</span> ({vehicle.last_service_date})</div>
              <div>EW: <span className="text-emerald-700 font-bold">{vehicle.active_extended_warranty ? 'Active (5-Yr/1,25,000km)' : 'Expired / None'}</span></div>
              {vehicle.open_recalls !== 'None' && (
                <div className="text-amber-800 font-bold">Recall: {vehicle.open_recalls}</div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Telemetry & Custody */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <span className="w-6 h-6 rounded-lg bg-blue-700 flex items-center justify-center text-xs font-black text-white">
              2
            </span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Odometer, Fuel Gauge & Custody Checklist
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Odometer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Current Odometer (KM) *</span>
                <span className="text-[11px] text-blue-700">Dashboard Snap Required</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono font-black text-slate-900 focus:outline-hidden focus:border-blue-600"
                  required
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Camera className="w-4 h-4 text-blue-700" />
                  <span>{odometerPhoto ? 'Snapped ✓' : 'Snap'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleOdometerPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Fuel Level Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Fuel Level In Tank:</span>
                <span className="text-amber-800 font-mono font-black">{fuelLevel}% ({fuelLevel < 25 ? 'Reserve / E' : fuelLevel < 50 ? '1/4 Tank' : fuelLevel < 75 ? '1/2 Tank' : 'Full'})</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                <span>E (Empty)</span>
                <span>1/4</span>
                <span>1/2</span>
                <span>3/4</span>
                <span>F (Full)</span>
              </div>
            </div>
          </div>

          {/* Custody Checklist */}
          <div className="border-t border-slate-200 pt-3">
            <span className="text-xs font-bold text-slate-700 block mb-2">Custody & Valuables Audit:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { key: 'spareWheel', label: 'Spare Wheel / Stepney' },
                { key: 'toolKit', label: 'Jack & Tool Kit' },
                { key: 'dashcamSdRemoved', label: 'Dashcam SD Removed' },
                { key: 'fastagChecked', label: 'Fastag & Docs Verified' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCustody({ ...custody, [c.key]: !custody[c.key] })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                    custody[c.key]
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span>{c.label}</span>
                  <span>{custody[c.key] ? '✓' : '✕'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Interactive 360° Scratch & Dent Mapper */}
        <div className="space-y-2">
          <VehicleWalkaroundMapper
            markers={scratchMarkers}
            onChange={setScratchMarkers}
          />
        </div>

        {/* Step 4: Customer Complaints & Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <span className="w-6 h-6 rounded-lg bg-blue-700 flex items-center justify-center text-xs font-black text-white">
              3
            </span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Customer Reported Complaints & Demands ({complaints.length})
            </h2>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newComplaintInput}
              onChange={(e) => setNewComplaintInput(e.target.value)}
              placeholder="e.g. Front suspension thud noise on speed breaker"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
            />
            <button
              type="button"
              onClick={handleAddComplaint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {complaints.map((comp, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-bold font-mono">#{idx + 1}</span>
                  <span>{comp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveComplaint(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 5: Customer Stylus Signature Canvas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-blue-700 flex items-center justify-center text-xs font-black text-white">
                4
              </span>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Customer Digital Stylus Signature
              </h2>
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
            >
              Clear Pad
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-white border border-dashed border-slate-300 rounded-lg w-full max-w-lg h-36 cursor-crosshair touch-none shadow-2xs"
            />
            <div className="text-[11px] text-slate-500 mt-1">
              Sign above with finger or tablet stylus to approve physical vehicle custody and scratch record.
            </div>
          </div>
        </div>

        {/* Final Submit Button */}
        <div className="flex justify-end pt-2 pb-8">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Digital Job Card...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Complete Intake & Generate Job Card</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
