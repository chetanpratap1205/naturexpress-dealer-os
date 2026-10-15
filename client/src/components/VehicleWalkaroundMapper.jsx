import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Camera, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';

const DEFECT_TYPES = [
  { id: 'scratch', label: 'Scratch [S]', color: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', badge: 'S' },
  { id: 'dent', label: 'Dent [D]', color: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-400', badge: 'D' },
  { id: 'crack', label: 'Glass / Crack [C]', color: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-400', badge: 'C' },
  { id: 'paint', label: 'Paint Scrape [P]', color: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-400', badge: 'P' },
];

const SEVERITIES = ['Minor (Buffing / PDR)', 'Moderate (Touchup / Dry Dent)', 'Severe (Denting & Painting Required)'];

export default function VehicleWalkaroundMapper({ markers = [], onChange, readOnly = false }) {
  const [activeView, setActiveView] = useState('left'); // 'front', 'rear', 'left', 'right', 'top'
  const [selectedDefectType, setSelectedDefectType] = useState('scratch');
  const [pendingPin, setPendingPin] = useState(null); // { view, x, y }
  const [panelNote, setPanelNote] = useState('');
  const [severity, setSeverity] = useState(SEVERITIES[0]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);

  const handleCanvasClick = (e) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Auto-detect panel rough name based on active view and coordinates
    let detectedPanel = `${activeView.toUpperCase()} Panel`;
    if (activeView === 'left' || activeView === 'right') {
      if (x < 25) detectedPanel = activeView === 'left' ? 'Front Bumper / Fender' : 'Rear Quarter / Bumper';
      else if (x < 50) detectedPanel = activeView === 'left' ? 'Front Door Panel' : 'Rear Door Panel';
      else if (x < 75) detectedPanel = activeView === 'left' ? 'Rear Door Panel' : 'Front Door Panel';
      else detectedPanel = activeView === 'left' ? 'Rear Quarter Panel' : 'Front Fender / Bumper';
    } else if (activeView === 'front') {
      if (y < 35) detectedPanel = 'Hood / Bonnet Upper';
      else if (y < 65) detectedPanel = 'Grille / Headlamp Bezel';
      else detectedPanel = 'Front Bumper Lower Lip';
    } else if (activeView === 'rear') {
      if (y < 40) detectedPanel = 'Tailgate / Rear Glass';
      else if (y < 70) detectedPanel = 'Rear Boot Lid / Monogram';
      else detectedPanel = 'Rear Bumper / Skid Plate';
    }

    setPendingPin({ view: activeView, x, y, detectedPanel });
    setPanelNote('');
    setSeverity(SEVERITIES[0]);
    setPhotoPreview(null);
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPhotoPreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePin = () => {
    if (!pendingPin) return;
    const newMarker = {
      id: `mark-${Date.now()}`,
      view: pendingPin.view,
      x: pendingPin.x,
      y: pendingPin.y,
      type: selectedDefectType,
      panel: panelNote.trim() || pendingPin.detectedPanel,
      severity,
      photoUrl: photoPreview || null,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    const nextMarkers = [...markers, newMarker];
    if (onChange) onChange(nextMarkers);
    setPendingPin(null);
  };

  const handleDeleteMarker = (id) => {
    if (readOnly) return;
    const nextMarkers = markers.filter(m => m.id !== id);
    if (onChange) onChange(nextMarkers);
  };

  const currentViewMarkers = markers.filter(m => m.view === activeView);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              360° Vehicle Walkaround & Scratch Guard
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              {markers.length} Defects Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap vehicle silhouette to pin pre-existing scratches/dents with photo evidence to eliminate customer disputes.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'left', label: 'Left Side' },
            { id: 'front', label: 'Front' },
            { id: 'right', label: 'Right Side' },
            { id: 'rear', label: 'Rear' },
            { id: 'top', label: 'Roof / Top' },
          ].map((v) => {
            const count = markers.filter(m => m.view === v.id).length;
            const isActive = activeView === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setActiveView(v.id);
                  setPendingPin(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{v.label}</span>
                {count > 0 && (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                    isActive ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Defect Type Selector (Active Tool) */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Defect Pin Tool:
          </span>
          {DEFECT_TYPES.map((dt) => {
            const isSelected = selectedDefectType === dt.id;
            return (
              <button
                key={dt.id}
                type="button"
                onClick={() => setSelectedDefectType(dt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? `${dt.color} text-white shadow-xs ring-2 ring-blue-500/30`
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>{dt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive Vehicle Diagram Canvas */}
      <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center min-h-[260px] overflow-hidden select-none">
        <div 
          onClick={handleCanvasClick}
          className={`relative w-full max-w-xl aspect-[21/9] flex items-center justify-center ${
            readOnly ? 'cursor-default' : 'cursor-crosshair'
          }`}
        >
          {/* High-Contrast Vector Silhouette of Tata PV/EV */}
          {activeView === 'left' && (
            <svg viewBox="0 0 600 220" className="w-full h-full stroke-slate-500 fill-slate-200/90 filter drop-shadow-xs">
              {/* Car Body Left Profile */}
              <path d="M 60 155 Q 70 95 140 85 L 210 50 Q 320 42 410 50 L 500 95 Q 545 105 550 155 L 530 160 Q 480 160 460 140 Q 440 120 410 140 Q 390 160 340 160 L 260 160 Q 210 160 190 140 Q 170 120 140 140 Q 120 160 70 160 Z" strokeWidth="3" />
              {/* Windows */}
              <path d="M 215 58 L 160 88 L 290 88 L 290 55 Z" strokeWidth="2" fill="#cbd5e1" />
              <path d="M 305 55 L 305 88 L 440 88 L 400 58 Z" strokeWidth="2" fill="#cbd5e1" />
              {/* Wheels */}
              <circle cx="165" cy="155" r="32" strokeWidth="4" className="stroke-slate-600 fill-slate-800" />
              <circle cx="165" cy="155" r="16" strokeWidth="2" className="stroke-slate-400 fill-slate-600" />
              <circle cx="435" cy="155" r="32" strokeWidth="4" className="stroke-slate-600 fill-slate-800" />
              <circle cx="435" cy="155" r="16" strokeWidth="2" className="stroke-slate-400 fill-slate-600" />
              {/* Door Cutlines */}
              <line x1="298" y1="56" x2="298" y2="155" strokeWidth="2" className="stroke-slate-400" />
              <line x1="160" y1="90" x2="160" y2="140" strokeWidth="2" className="stroke-slate-400" />
              <line x1="445" y1="90" x2="445" y2="140" strokeWidth="2" className="stroke-slate-400" />
            </svg>
          )}

          {activeView === 'right' && (
            <svg viewBox="0 0 600 220" className="w-full h-full stroke-slate-500 fill-slate-200/90 filter drop-shadow-xs transform -scale-x-100">
              {/* Inverted for Right Side Profile */}
              <path d="M 60 155 Q 70 95 140 85 L 210 50 Q 320 42 410 50 L 500 95 Q 545 105 550 155 L 530 160 Q 480 160 460 140 Q 440 120 410 140 Q 390 160 340 160 L 260 160 Q 210 160 190 140 Q 170 120 140 140 Q 120 160 70 160 Z" strokeWidth="3" />
              <path d="M 215 58 L 160 88 L 290 88 L 290 55 Z" strokeWidth="2" fill="#cbd5e1" />
              <path d="M 305 55 L 305 88 L 440 88 L 400 58 Z" strokeWidth="2" fill="#cbd5e1" />
              <circle cx="165" cy="155" r="32" strokeWidth="4" className="stroke-slate-600 fill-slate-800" />
              <circle cx="165" cy="155" r="16" strokeWidth="2" className="stroke-slate-400 fill-slate-600" />
              <circle cx="435" cy="155" r="32" strokeWidth="4" className="stroke-slate-600 fill-slate-800" />
              <circle cx="435" cy="155" r="16" strokeWidth="2" className="stroke-slate-400 fill-slate-600" />
            </svg>
          )}

          {activeView === 'front' && (
            <svg viewBox="0 0 400 220" className="w-full h-full stroke-slate-500 fill-slate-200/90 filter drop-shadow-xs">
              <path d="M 70 180 L 70 140 Q 70 100 120 80 L 140 40 L 260 40 L 280 80 Q 330 100 330 140 L 330 180 Z" strokeWidth="3" />
              {/* Windshield */}
              <polygon points="145,45 255,45 270,82 130,82" strokeWidth="2" fill="#cbd5e1" />
              {/* Grille & Headlamps */}
              <rect x="130" y="110" width="140" height="30" rx="4" strokeWidth="2" fill="#64748b" />
              <polygon points="80,105 125,115 120,135 75,120" strokeWidth="2" fill="#94a3b8" />
              <polygon points="320,105 275,115 280,135 325,120" strokeWidth="2" fill="#94a3b8" />
              {/* Tyres */}
              <rect x="50" y="145" width="22" height="42" rx="4" strokeWidth="2" className="stroke-slate-600 fill-slate-800" />
              <rect x="328" y="145" width="22" height="42" rx="4" strokeWidth="2" className="stroke-slate-600 fill-slate-800" />
            </svg>
          )}

          {activeView === 'rear' && (
            <svg viewBox="0 0 400 220" className="w-full h-full stroke-slate-500 fill-slate-200/90 filter drop-shadow-xs">
              <path d="M 70 180 L 70 140 Q 70 90 120 75 L 145 40 L 255 40 L 280 75 Q 330 90 330 140 L 330 180 Z" strokeWidth="3" />
              {/* Rear Windshield */}
              <polygon points="150,45 250,45 270,85 130,85" strokeWidth="2" fill="#cbd5e1" />
              {/* Tail Lamps */}
              <polygon points="75,105 125,110 120,130 75,125" strokeWidth="2" fill="#ef4444" />
              <polygon points="325,105 275,110 280,130 325,125" strokeWidth="2" fill="#ef4444" />
              {/* Number Plate Recess */}
              <rect x="150" y="130" width="100" height="25" rx="3" strokeWidth="2" fill="#64748b" />
              {/* Tyres */}
              <rect x="50" y="145" width="22" height="42" rx="4" strokeWidth="2" className="stroke-slate-600 fill-slate-800" />
              <rect x="328" y="145" width="22" height="42" rx="4" strokeWidth="2" className="stroke-slate-600 fill-slate-800" />
            </svg>
          )}

          {activeView === 'top' && (
            <svg viewBox="0 0 500 220" className="w-full h-full stroke-slate-500 fill-slate-200/90 filter drop-shadow-xs">
              <rect x="60" y="50" width="380" height="120" rx="40" strokeWidth="3" />
              <rect x="150" y="65" width="180" height="90" rx="12" strokeWidth="2" fill="#cbd5e1" />
              <line x1="140" y1="50" x2="140" y2="170" strokeWidth="2" className="stroke-slate-400" />
              <line x1="340" y1="50" x2="340" y2="170" strokeWidth="2" className="stroke-slate-400" />
            </svg>
          )}

          {/* Render All Existing Markers on this View */}
          {currentViewMarkers.map((marker) => {
            const dt = DEFECT_TYPES.find(d => d.id === marker.type) || DEFECT_TYPES[0];
            return (
              <div
                key={marker.id}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (marker.photoUrl) setViewingPhoto(marker.photoUrl);
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-white text-xs border-2 shadow-lg transition-transform group-hover:scale-125 ${dt.color} ${dt.border}`}>
                  {dt.badge}
                </div>

                {/* Hover Popover */}
                <div className="hidden group-hover:flex flex-col absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-xl bg-white border border-slate-200 text-left text-xs shadow-xl z-30 pointer-events-none">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{marker.panel}</span>
                    <span className={`text-[10px] font-bold ${dt.text}`}>{dt.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{marker.severity}</div>
                  {marker.photoUrl && (
                    <div className="mt-1 text-[10px] text-blue-700 font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Photo Attached (Click to view)
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render Pending Pin */}
          {pendingPin && (
            <div
              style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-xl">
                +
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline Pin Creator Dialog (Appears on Tap) */}
      {pendingPin && (
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></span>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Log Defect Pin at {pendingPin.x}%, {pendingPin.y}% ({pendingPin.view.toUpperCase()})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setPendingPin(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Panel Name</label>
              <input
                type="text"
                value={panelNote || pendingPin.detectedPanel}
                onChange={(e) => setPanelNote(e.target.value)}
                placeholder="e.g. Left Rear Door Lower Edge"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Severity Assessment</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600"
              >
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Attach Scratch Photo (Tablet Camera)</label>
              <label className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold cursor-pointer transition-all shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-blue-700" />
                <span>{photoPreview ? 'Photo Captured ✓' : 'Snap Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {photoPreview && (
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img src={photoPreview} alt="Scratch Evidence" className="w-14 h-14 object-cover rounded-lg border border-slate-300 shadow-xs" />
              <div className="text-xs text-slate-800">
                <div className="font-bold text-emerald-700">Evidence Photo Attached</div>
                <div className="text-[11px] text-slate-500">Timestamped proof stored with digital job card</div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setPendingPin(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePin}
              className="px-4 py-1.5 rounded-lg text-xs font-black text-white bg-blue-700 hover:bg-blue-600 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Confirm & Lock Pin
            </button>
          </div>
        </div>
      )}

      {/* Markers Ledger Table / List */}
      {markers.length > 0 && (
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Logged Defects Summary ({markers.length})</span>
            <span className="text-[11px] text-slate-500">Tamper-Proof Intake Record</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {markers.map((m) => {
              const dt = DEFECT_TYPES.find(d => d.id === m.type) || DEFECT_TYPES[0];
              return (
                <div
                  key={m.id}
                  className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between space-x-3 text-left shadow-2xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-white text-[10px] shrink-0 ${dt.color}`}>
                      {dt.badge}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {m.panel}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span className="capitalize">{m.view}</span>
                        <span>•</span>
                        <span className="truncate">{m.severity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {m.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingPhoto(m.photoUrl)}
                        className="p-1 rounded bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 cursor-pointer"
                        title="View Photo Evidence"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMarker(m.id)}
                        className="p-1 rounded bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 cursor-pointer"
                        title="Delete Pin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-700" />
                Intake Scratch Photo Evidence Proof
              </span>
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={viewingPhoto} alt="Scratch Detail" className="w-full max-h-80 object-contain rounded-xl border border-slate-200 bg-slate-50" />
            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Cryptographically linked to digital intake docket</span>
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer shadow-2xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
