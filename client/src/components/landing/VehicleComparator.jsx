import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  Car,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function VehicleComparator({ vehicles, onBookTestDrive, onGetQuote }) {
  const [car1Id, setCar1Id] = useState('curvv-ice');
  const [car2Id, setCar2Id] = useState('nexon-ice');

  const car1 = vehicles.find(v => v.id === car1Id) || vehicles[0];
  const car2 = vehicles.find(v => v.id === car2Id) || vehicles[1];

  // Detailed comparative technical specifications
  const DETAILED_SPECS = {
    'curvv-ice': {
      powerTorque: '125 PS / 225 Nm (1.2L Turbo GDi) & 118 PS (1.5L Diesel)',
      mileageRange: '19.8 kmpl (Diesel) / 15.6 kmpl (Petrol)',
      bootSpace: '500 Litres (Best in Segment)',
      groundClearance: '208 mm (Class Leading)',
      infotainment: '12.3" Cinematic Touchscreen + JBL 9-Speaker Audio',
      adas: 'Level 2 ADAS (20 Autonomous Features including Lane Keep & AEB)',
      uniqueUSP: 'India’s 1st Coupe SUV styling with gesture-controlled powered tailgate'
    },
    'curvv-ev': {
      powerTorque: '167 PS / 215 Nm (Pure Electric Motor)',
      mileageRange: '502 km Certified ARAI Range (55 kWh Battery)',
      bootSpace: '500 Litres + 35L Front Frunk',
      groundClearance: '190 mm',
      infotainment: '12.3" Cinematic Touchscreen + Arcade.ev Gaming App Suite',
      adas: 'Level 2 ADAS with Blind View & Surround Camera',
      uniqueUSP: 'Vehicle-to-Load (V2L) and Vehicle-to-Vehicle (V2V) charging capability'
    },
    'harrier': {
      powerTorque: '170 PS / 350 Nm (2.0L Kryotec Turbo Diesel)',
      mileageRange: '16.8 kmpl (ARAI Certified)',
      bootSpace: '445 Litres (Expandable to 815L)',
      groundClearance: '205 mm',
      infotainment: '12.3" Harman Display + JBL 10-Speaker with Subwoofer',
      adas: 'Level 2 ADAS (Adaptive Cruise Control with Stop & Go)',
      uniqueUSP: 'Built on Land Rover D8 OMEGARC architecture'
    },
    'safari': {
      powerTorque: '170 PS / 350 Nm (2.0L Kryotec Turbo Diesel)',
      mileageRange: '16.3 kmpl (ARAI Certified)',
      bootSpace: '420 Litres (737L with 3rd row folded)',
      groundClearance: '205 mm',
      infotainment: '12.3" Harman Display + Ventilated 1st & 2nd Row Captain Seats',
      adas: 'Level 2 ADAS (11 Active Safety Sensors + 7 Airbags)',
      uniqueUSP: 'Luxury 6 or 7-seater flagship with dual-zone climate and gesture tailgate'
    },
    'nexon-ice': {
      powerTorque: '120 PS / 170 Nm (1.2L Turbo Petrol) & 115 PS (1.5L Diesel)',
      mileageRange: '23.2 kmpl (Diesel) / 17.4 kmpl (Petrol)',
      bootSpace: '382 Litres',
      groundClearance: '208 mm',
      infotainment: '10.25" Floating Touchscreen + JBL 8-Speaker Audio',
      adas: '360° High-Def Surround Camera with Blind View Monitor',
      uniqueUSP: 'Dual-clutch 7-speed DCA with paddle shifters & 5-Star BNCAP'
    },
    'nexon-ev': {
      powerTorque: '145 PS / 215 Nm (Gen 2 Permanent Magnet Motor)',
      mileageRange: '465 km ARAI Certified (40.5 kWh Long Range)',
      bootSpace: '350 Litres',
      groundClearance: '190 mm',
      infotainment: '12.3" Harman Cinematic Touchscreen + Wireless Apple CarPlay',
      adas: 'Smart Digital Shifter with Blind Spot View & Electronic Parking Brake',
      uniqueUSP: 'Fast DC charging: 10% to 80% in 56 mins'
    },
    'punch-ice': {
      powerTorque: '88 PS / 115 Nm (1.2L Revotron) / Twin-Cylinder iCNG',
      mileageRange: '26.99 km/kg (iCNG) / 18.8 kmpl (Petrol)',
      bootSpace: '366 Litres (210L in iCNG with usable boot)',
      groundClearance: '187 mm',
      infotainment: '10.25" Touchscreen + Voice-Assisted Electric Sunroof',
      adas: 'Traction Pro Mode & Dual Airbags standard',
      uniqueUSP: 'Twin-Cylinder CNG technology with uncompromised luggage capacity'
    },
    'punch-ev': {
      powerTorque: '122 PS / 190 Nm (Long Range E-Motor)',
      mileageRange: '421 km ARAI Range (35 kWh Pack)',
      bootSpace: '366 Litres + 14L Front Frunk',
      groundClearance: '190 mm',
      infotainment: '10.25" Dual Digital Screens + 360° Camera',
      adas: 'Electronic Parking Brake with Auto Hold & 6 Airbags standard',
      uniqueUSP: 'Built on pure EV acti.ev architecture with paddle regen'
    },
    'altroz': {
      powerTorque: '110 PS / 140 Nm (i-Turbo) / 88 PS (Petrol) / 73.5 PS (iCNG)',
      mileageRange: '26.2 km/kg (iCNG) / 19.3 kmpl (Petrol)',
      bootSpace: '345 Litres',
      groundClearance: '165 mm',
      infotainment: '10.25" Harman Display + 90° Wide Opening Doors',
      adas: 'Wet-Clutch 6-Speed Dual Clutch Automatic (DCA)',
      uniqueUSP: 'The only hatchback in India with 5-Star Global NCAP safety'
    },
    'tiago-ice': {
      powerTorque: '86 PS / 113 Nm (1.2L Revotron) / Twin-Cylinder iCNG',
      mileageRange: '26.49 km/kg (iCNG) / 19.0 kmpl (Petrol)',
      bootSpace: '242 Litres',
      groundClearance: '170 mm',
      infotainment: '7" Harman Touchscreen + 8-Speaker Sound',
      adas: 'Corner Stability Control & Rear Parking Camera',
      uniqueUSP: 'Most affordable 4-Star crash safety rated family car in India'
    },
    'tiago-ev': {
      powerTorque: '75 PS / 114 Nm (Permanent Magnet Motor)',
      mileageRange: '315 km ARAI Range (24 kWh Long Range)',
      bootSpace: '240 Litres',
      groundClearance: '166 mm',
      infotainment: '7" Harman Touchscreen + ZConnect Connected Car Suite',
      adas: 'Multi-Mode Regenerative Braking & Hill Start Assist',
      uniqueUSP: 'India’s most accessible electric car with ₹0.90/km running cost'
    }
  };

  const spec1 = DETAILED_SPECS[car1.id] || DETAILED_SPECS['curvv-ice'];
  const spec2 = DETAILED_SPECS[car2.id] || DETAILED_SPECS['nexon-ice'];

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-slate-50/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>SIDE-BY-SIDE TATA VEHICLE COMPARATOR</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Compare Models, Specs &amp; Safety Side-by-Side
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Unsure between Curvv vs Nexon, or ICE vs Electric? Compare performance, boot space, BNCAP ratings, and EMI instantly.
          </p>
        </div>

        {/* Vehicle Selection Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1 Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">Vehicle 1</span>
              {car1.isEV && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">⚡ PURE EV</span>}
            </div>

            <select
              value={car1Id}
              onChange={(e) => setCar1Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.bodyType})</option>
              ))}
            </select>

            <div className="aspect-16/9 bg-slate-50 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-slate-100">
              <img src={car1.image} alt={car1.name} className="w-full h-full object-contain hover:scale-105 transition-transform" />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Ex-Showroom Starting</span>
                <strong className="text-slate-900 text-sm">{car1.priceLabel}</strong>
              </div>
              <button
                onClick={() => onBookTestDrive(car1)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                <Car className="w-3.5 h-3.5" /> Book Test Drive
              </button>
            </div>
          </div>

          {/* Card 2 Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-indigo-600 font-mono">Vehicle 2</span>
              {car2.isEV && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">⚡ PURE EV</span>}
            </div>

            <select
              value={car2Id}
              onChange={(e) => setCar2Id(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.bodyType})</option>
              ))}
            </select>

            <div className="aspect-16/9 bg-slate-50 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-slate-100">
              <img src={car2.image} alt={car2.name} className="w-full h-full object-contain hover:scale-105 transition-transform" />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Ex-Showroom Starting</span>
                <strong className="text-slate-900 text-sm">{car2.priceLabel}</strong>
              </div>
              <button
                onClick={() => onBookTestDrive(car2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                <Car className="w-3.5 h-3.5" /> Book Test Drive
              </button>
            </div>
          </div>

        </div>

        {/* Detailed Spec Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Direct Technical &amp; Comfort Comparison
            </span>
            <span className="text-[10px] font-mono text-slate-500">Official OEM Specifications</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            
            {/* Row 1: Safety NCAP */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>BNCAP Safety Rating</span>
              </div>
              <div className="col-span-4 font-semibold text-slate-900 pr-2">
                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  {car1.safety}
                </span>
              </div>
              <div className="col-span-4 font-semibold text-slate-900">
                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                  {car2.safety}
                </span>
              </div>
            </div>

            {/* Row 2: Powertrain & Power */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">Powertrain &amp; Output</div>
              <div className="col-span-4 text-slate-800 pr-2 leading-relaxed">{spec1.powerTorque}</div>
              <div className="col-span-4 text-slate-800 leading-relaxed">{spec2.powerTorque}</div>
            </div>

            {/* Row 3: Fuel Mileage / Electric Range */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors bg-blue-50/30">
              <div className="col-span-4 font-bold text-slate-700">Mileage / Range</div>
              <div className="col-span-4 font-bold text-blue-700 pr-2">{spec1.mileageRange}</div>
              <div className="col-span-4 font-bold text-indigo-700">{spec2.mileageRange}</div>
            </div>

            {/* Row 4: Transmission Options */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">Transmission</div>
              <div className="col-span-4 text-slate-800 pr-2">{car1.transmission}</div>
              <div className="col-span-4 text-slate-800">{car2.transmission}</div>
            </div>

            {/* Row 5: Boot Space */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">Boot Capacity</div>
              <div className="col-span-4 font-semibold text-slate-900 pr-2">{spec1.bootSpace}</div>
              <div className="col-span-4 font-semibold text-slate-900">{spec2.bootSpace}</div>
            </div>

            {/* Row 6: Ground Clearance */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">Ground Clearance</div>
              <div className="col-span-4 text-slate-800 pr-2">{spec1.groundClearance}</div>
              <div className="col-span-4 text-slate-800">{spec2.groundClearance}</div>
            </div>

            {/* Row 7: Infotainment & Audio */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">Infotainment Display</div>
              <div className="col-span-4 text-slate-800 pr-2">{spec1.infotainment}</div>
              <div className="col-span-4 text-slate-800">{spec2.infotainment}</div>
            </div>

            {/* Row 8: ADAS & Driver Assistance */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors">
              <div className="col-span-4 font-bold text-slate-700">ADAS &amp; Vision</div>
              <div className="col-span-4 text-slate-800 pr-2 leading-relaxed">{spec1.adas}</div>
              <div className="col-span-4 text-slate-800 leading-relaxed">{spec2.adas}</div>
            </div>

            {/* Row 9: Key Standing USP */}
            <div className="grid grid-cols-12 p-3 sm:p-4 hover:bg-slate-50/70 transition-colors bg-amber-50/30">
              <div className="col-span-4 font-bold text-amber-900">Standout USP</div>
              <div className="col-span-4 text-amber-900 pr-2 font-medium">{spec1.uniqueUSP}</div>
              <div className="col-span-4 text-amber-900 font-medium">{spec2.uniqueUSP}</div>
            </div>

          </div>

          {/* Bottom Dual Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-600 text-center sm:text-left">
              Want to test drive both back-to-back at your home or at our Scheme 140 track?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onBookTestDrive(car1)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Test Drive {car1.name}
              </button>
              <button
                onClick={() => onBookTestDrive(car2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Test Drive {car2.name}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
