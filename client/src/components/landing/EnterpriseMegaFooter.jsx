import React from 'react';
import {
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Lock,
  Compass,
  FileText
} from 'lucide-react';

export default function EnterpriseMegaFooter({
  onOpenStaffPortal,
  onOpenPolicyModal,
  onOpenRtoStatus,
  onOpenAccidentalStatus,
  onSelectCar
}) {
  return (
    <footer className="bg-slate-100 border-t border-slate-300 pt-12 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Brand Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-900 font-black text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-mono">TATA</div>
              <span className="tracking-tight text-lg">SHYAM AUTOMOTIVE</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200">
                Authorized 3S Dealership
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Central India's Platinum Tata Motors Hub • Scheme 140 Main Rd, Bicholi Mardana, Indore. 18 Robotic Bays, 60kW DC Supercharger, and 28,400+ satisfied families.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:18002097979"
              className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>24x7 Roadside SOS: 1800 209 7979</span>
            </a>

            <button
              onClick={onOpenStaffPortal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>DealerOS Staff PIN Portal</span>
            </button>
          </div>
        </div>

        {/* 5-Column Navigation Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-[11px]">
          
          {/* Column 1: Vehicles Lineup */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Tata Vehicles</h5>
            <ul className="space-y-1.5 text-slate-600">
              <li><button onClick={() => onSelectCar('curvv-ice')} className="hover:text-blue-600 cursor-pointer">Tata Curvv (Coupe SUV)</button></li>
              <li><button onClick={() => onSelectCar('curvv-ev')} className="hover:text-blue-600 cursor-pointer font-semibold text-emerald-700">Tata Curvv.ev</button></li>
              <li><button onClick={() => onSelectCar('harrier')} className="hover:text-blue-600 cursor-pointer">Tata Harrier</button></li>
              <li><button onClick={() => onSelectCar('safari')} className="hover:text-blue-600 cursor-pointer">Tata Safari (7-Seater)</button></li>
              <li><button onClick={() => onSelectCar('nexon-ice')} className="hover:text-blue-600 cursor-pointer">Tata Nexon</button></li>
              <li><button onClick={() => onSelectCar('nexon-ev')} className="hover:text-blue-600 cursor-pointer font-semibold text-emerald-700">Tata Nexon.ev</button></li>
              <li><button onClick={() => onSelectCar('punch-ice')} className="hover:text-blue-600 cursor-pointer">Tata Punch</button></li>
              <li><button onClick={() => onSelectCar('punch-ev')} className="hover:text-blue-600 cursor-pointer font-semibold text-emerald-700">Tata Punch.ev</button></li>
              <li><button onClick={() => onSelectCar('altroz')} className="hover:text-blue-600 cursor-pointer">Tata Altroz</button></li>
              <li><button onClick={() => onSelectCar('tiago-ice')} className="hover:text-blue-600 cursor-pointer">Tata Tiago &amp; Tiago.ev</button></li>
            </ul>
          </div>

          {/* Column 2: Dealership Services */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Workshop &amp; Care</h5>
            <ul className="space-y-1.5 text-slate-600">
              <li><span className="font-semibold text-slate-800">90-Min Express Service</span></li>
              <li><span>Doorstep Valet TrustPass™</span></li>
              <li><span>Cashless Accidental Bodyshop</span></li>
              <li><span>Tata Care Insurance Renewal</span></li>
              <li><span>Value Care AMC &amp; EW</span></li>
              <li><span>Tata Motors Assured Exchange</span></li>
              <li><span>60kW DC Fast Charging Hub</span></li>
              <li><span>Tata Genuine Accessories</span></li>
              <li><span>Ceramic 9H Nano Coating</span></li>
            </ul>
          </div>

          {/* Column 3: Dealership Hubs */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Branch Network</h5>
            <ul className="space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900 block">Scheme 140 Flagship Hub</strong>
                <span className="text-[10px] text-slate-500 block">Bicholi Mardana, Indore</span>
                <a href="tel:+918879897825" className="text-blue-600 font-semibold text-[10px]">+91 88798 97825</a>
              </li>
              <li>
                <strong className="text-slate-900 block">Bhawarkua Showroom &amp; Rau</strong>
                <span className="text-[10px] text-slate-500 block">A.B Road &amp; CAT Rd Bodyshop</span>
                <a href="tel:+917611120000" className="text-blue-600 font-semibold text-[10px]">+91 76111 20000</a>
              </li>
              <li>
                <strong className="text-slate-900 block">Kukshi Branch (Dhar)</strong>
                <span className="text-[10px] text-slate-500 block">Main Road Dhar, Kukshi</span>
                <a href="tel:+918879231832" className="text-blue-600 font-semibold text-[10px]">+91 88792 31832</a>
              </li>
              <li>
                <strong className="text-slate-900 block">Badnawar Branch</strong>
                <span className="text-[10px] text-slate-500 block">Badnagar Rd, Badnawar</span>
                <a href="tel:+918291247759" className="text-blue-600 font-semibold text-[10px]">+91 82912 47759</a>
              </li>
            </ul>
          </div>

          {/* Column 4: RTO & Digital Utilities */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Digital Utilities</h5>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button onClick={onOpenRtoStatus} className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                  <Compass className="w-3 h-3" /> Track RTO Smart Card
                </button>
              </li>
              <li>
                <button onClick={onOpenAccidentalStatus} className="text-amber-700 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                  <FileText className="w-3 h-3" /> Accidental Claim Radar
                </button>
              </li>
              <li><span className="text-slate-500">Parivahan Form 29/30 (TMA)</span></li>
              <li><span className="text-slate-500">Fastag Recharge Portal</span></li>
              <li><span className="text-slate-500">BNCAP Safety Certificate Desk</span></li>
              <li><span className="text-slate-500">Tata Seva Rewards Program</span></li>
            </ul>
          </div>

          {/* Column 5: Compliance & Legal */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Compliance &amp; Trust</h5>
            <ul className="space-y-1.5 text-slate-600">
              <li><button onClick={() => onOpenPolicyModal('privacy')} className="hover:text-slate-900 cursor-pointer">Privacy &amp; Data Policy</button></li>
              <li><button onClick={() => onOpenPolicyModal('terms')} className="hover:text-slate-900 cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => onOpenPolicyModal('disclaimer')} className="hover:text-slate-900 cursor-pointer">Pricing Disclaimer</button></li>
              <li><button onClick={() => onOpenPolicyModal('refund')} className="hover:text-slate-900 cursor-pointer">Booking Refund Policy</button></li>
              <li><span className="text-slate-400">ISO 9001:2015 Quality Reg.</span></li>
              <li><span className="text-slate-400">GSTIN: 23AABCS8899M1ZQ</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong>Shyam Automotive (Tata Motors)</strong>. All Rights Reserved. Commenced 14th Feb 2018.
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>Powered by NatureXpress Dealership OS</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● All Systems Live
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
