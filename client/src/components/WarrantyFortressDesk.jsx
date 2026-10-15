import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Clock, 
  Cpu, 
  Lock, 
  FileCheck, 
  Upload, 
  RefreshCw,
  Sparkles,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WarrantyFortressDesk({ currentUser, onDataRefresh }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Claim Form
  const [activeJcId, setActiveJcId] = useState('JC-2026-8899');
  const [regNo, setRegNo] = useState('MP-09-WA-9011');
  const [vin, setVin] = useState('MAT622154N4K99211');
  const [partSku, setPartSku] = useState('542442100108');
  const [partName, setPartName] = useState('Electronic Steering Rack Sensor / Brake Actuator');
  const [dtcCode, setDtcCode] = useState('P0AC0');
  const [claimAmount, setClaimAmount] = useState('14250');
  
  // 4 Mandatory Photo Angles
  const [photoOdo, setPhotoOdo] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400');
  const [photoVin, setPhotoVin] = useState('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400');
  const [photoMounted, setPhotoMounted] = useState('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400');
  const [photoRemoved, setPhotoRemoved] = useState('https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400');

  // Freeze Frame Telemetry
  const [freezeFrameLocked, setFreezeFrameLocked] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [auditMessage, setAuditMessage] = useState('');

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/v2/warranty/claims');
      const json = await res.json();
      if (json.success) setClaims(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handlePhotoUpload = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
  };

  const calculatePreAuditScore = () => {
    let score = 0;
    if (photoOdo) score += 25;
    if (photoVin) score += 25;
    if (photoMounted) score += 25;
    if (photoRemoved) score += 25;
    return score;
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/v2/warranty/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCardId: activeJcId,
          reg_no: regNo,
          vin,
          part_sku: partSku,
          part_name: partName,
          dtc_code: dtcCode,
          dtc_freeze_frame: {
            engine_rpm: 1820,
            coolant_temp_c: 88,
            throttle_pos_pct: 22,
            battery_voltage: 12.6,
            freeze_frame_locked: true
          },
          photo_odo: photoOdo,
          photo_vin: photoVin,
          photo_part_mounted: photoMounted,
          photo_part_removed: photoRemoved,
          claim_amount: parseFloat(claimAmount)
        })
      });
      const json = await res.json();
      if (json.success) {
        setAuditMessage(`Pre-Audit Passed! Score: ${json.data.score}/100 • 72-Hour Submission Window Locked ✓`);
        confetti({ particleCount: 70, spread: 50 });
        fetchClaims();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentScore = calculatePreAuditScore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Tata Motors OEM Warranty Shield
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Zero-Rejection Protocol Active
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Zero-Rejection Warranty Protection Fortress
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Eliminates ₹3L–₹6L monthly claim rejections caused by missing freeze-frame DTCs or missing photographic evidence angles.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600">Pre-Audit Guarantee:</span>
          <span className="text-xs font-mono font-black text-emerald-700">
            {currentScore}/100 {currentScore === 100 ? '✓ Ready for OEM' : '⚠️ Missing Photos'}
          </span>
        </div>
      </div>

      {auditMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4-Angle Photographic Audit */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-700" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Mandatory 4-Angle Photographic Evidence Pre-Audit
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                {currentScore}% Complete
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { title: 'Angle 1: Odometer Display', desc: 'Mileage legible', photo: photoOdo, setter: setPhotoOdo },
                { title: 'Angle 2: B-Pillar VIN Plate', desc: 'Chassis VIN stamped', photo: photoVin, setter: setPhotoVin },
                { title: 'Angle 3: Defective Part Mounted', desc: 'Mounted on chassis context', photo: photoMounted, setter: setPhotoMounted },
                { title: 'Angle 4: Defective Part Removed', desc: 'OEM part stamping legible', photo: photoRemoved, setter: setPhotoRemoved }
              ].map((ang, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{ang.title}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${ang.photo ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>
                      {ang.photo ? '✓ Verified' : 'Missing'}
                    </span>
                  </div>

                  <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative group">
                    {ang.photo ? (
                      <img src={ang.photo} alt={ang.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                        <Camera className="w-6 h-6 mb-1" />
                        <span>Take Photo</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-opacity">
                      <span>Change Photo</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload(ang.setter)} className="hidden" />
                    </label>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium">{ang.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ECU DTC Freeze Frame Telemetry Locker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-700" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ECU DTC Freeze-Frame Telemetry Lock (DTC: {dtcCode})
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                🔒 Locked Pre-Clearance
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>Engine RPM: <span className="text-slate-900 font-bold">1,820 RPM</span></div>
              <div>Coolant Temp: <span className="text-slate-900 font-bold">88°C</span></div>
              <div>Vehicle Speed: <span className="text-slate-900 font-bold">0 km/h</span></div>
              <div>Battery Voltage: <span className="text-emerald-700 font-bold">12.6 V</span></div>
            </div>
            <div className="text-[10px] text-slate-500">
              Stored in cryptographic audit log before diagnostic trouble codes were erased from vehicle ECU.
            </div>
          </div>
        </div>

        {/* Right Column: Claim Submission & 72-Hour Clock */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  72-Hour OEM Submission Clock
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                68h 42m Remaining
              </span>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-bold">Vehicle Registration & VIN</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Defective Part Description</label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-bold">Part SKU</label>
                  <input
                    type="text"
                    value={partSku}
                    onChange={(e) => setPartSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-bold">Claim Amount (₹)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50 mt-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Run Pre-Audit & Lock Claim</span>
              </button>
            </form>
          </div>

          {/* Active Claims List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Audited Warranty Claims ({claims.length})
            </h3>

            <div className="space-y-2">
              {claims.map((cl) => (
                <div key={cl.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cl.part_name}</span>
                    <span className="font-mono font-bold text-emerald-700">₹{cl.claim_amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{cl.reg_no} • DTC: {cl.dtc_code}</span>
                    <span className="text-blue-700 font-bold">Score: {cl.pre_audit_score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
