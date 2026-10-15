import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  Car,
  Zap,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  Search,
  Calendar,
  Sliders,
  Sparkles,
  Truck,
  Navigation,
  X,
  ExternalLink,
  Award,
  Users,
  Check,
  Share2,
  Lock,
  ChevronDown,
  ChevronRight,
  Gauge,
  Fuel,
  Info,
  AlertTriangle,
  FileText,
  Wrench,
  HelpCircle,
  Mail,
  DollarSign,
  Gift,
  BookOpen,
  Download,
  RefreshCw,
  PhoneCall,
  Compass,
  Layers,
  HeartHandshake,
  CarFront,
  Home,
  Menu,
  Smartphone,
  Radio,
  Flame,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Enterprise Landing Page High-Value Interactive Modules
import LiveTelemetryRadar from './landing/LiveTelemetryRadar';
import ServiceCostEstimator from './landing/ServiceCostEstimator';
import VehicleComparator from './landing/VehicleComparator';
import ValetTrustPassDeepDive from './landing/ValetTrustPassDeepDive';
import EvSavingsCalculator from './landing/EvSavingsCalculator';
import TradeInValuationWizard from './landing/TradeInValuationWizard';
import DealershipHeritageCharter from './landing/DealershipHeritageCharter';
import CustomerReviewsWall from './landing/CustomerReviewsWall';
import ComprehensiveFaq from './landing/ComprehensiveFaq';
import EnterpriseMegaFooter from './landing/EnterpriseMegaFooter';
import VehicleDetailVariantModal from './landing/VehicleDetailVariantModal';

// 1. COMPLETE 15 TATA VEHICLE CATALOG (ICE & EV)
const TATA_VEHICLES = [
  {
    id: 'curvv-ice',
    name: 'Tata Curvv',
    category: 'SUV',
    bodyType: 'Coupe SUV',
    tagline: 'Shaped to Stun • India’s First Coupe SUV',
    priceStarting: 999000,
    priceLabel: '₹9.99 Lakh*',
    fuelType: 'Petrol / Diesel',
    transmission: '6-Speed MT / 7-Speed DCA Dual Clutch',
    safety: '5-Star BNCAP (Adult & Child)',
    highlight: 'Panoramic Sunroof & 500L Boot',
    image: 'https://cdn3.shopvii.com/1017/813/pro_curvv.webp',
    isNew: true,
    isEV: false
  },
  {
    id: 'curvv-ev',
    name: 'Tata Curvv.ev',
    category: 'EV',
    bodyType: 'Coupe SUV',
    tagline: 'Born Electric Coupe SUV • acti.ev Architecture',
    priceStarting: 1749000,
    priceLabel: '₹17.49 Lakh*',
    fuelType: '100% Electric (55 kWh Battery)',
    transmission: 'Single Speed E-Drive',
    safety: '5-Star BNCAP Certified',
    highlight: '502 km Certified ARAI Range',
    image: 'https://cdn3.shopvii.com/1017/813/pro_curvv_ev.webp',
    isNew: true,
    isEV: true
  },
  {
    id: 'harrier',
    name: 'Tata Harrier',
    category: 'SUV',
    bodyType: 'Mid-Size SUV',
    tagline: 'Born of Land Rover D8 OMEGARC Pedigree',
    priceStarting: 1499000,
    priceLabel: '₹14.99 Lakh*',
    fuelType: '2.0L Kryotec Diesel (170 PS)',
    transmission: '6-Speed AT with Paddle Shifters',
    safety: '5-Star BNCAP (Highest Score in India)',
    highlight: 'Level 2 ADAS (11 Autonomous Features)',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_harrier.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'safari',
    name: 'Tata Safari',
    category: 'SUV',
    bodyType: 'Luxury 7-Seater',
    tagline: '7-Seater Luxury Flagship SUV',
    priceStarting: 1549000,
    priceLabel: '₹15.49 Lakh*',
    fuelType: '2.0L Turbo Diesel (350 Nm)',
    transmission: 'E-Shifter with Terrain Response Modes',
    safety: '5-Star BNCAP Certified',
    highlight: 'Ventilated 1st & 2nd Row Captain Seats',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_safari.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'nexon-ice',
    name: 'Tata Nexon',
    category: 'SUV',
    bodyType: 'Compact SUV',
    tagline: 'India’s #1 Selling Compact SUV',
    priceStarting: 799000,
    priceLabel: '₹7.99 Lakh*',
    fuelType: '1.2L Turbo Petrol / 1.5L Diesel',
    transmission: '7-Speed DCA Dual Clutch with Paddles',
    safety: '5-Star Global & Bharat NCAP',
    highlight: '360° Surround Camera & Blind View',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_nexon.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'nexon-ev',
    name: 'Tata Nexon.ev',
    category: 'EV',
    bodyType: 'Electric SUV',
    tagline: 'Game-Changing Electric SUV',
    priceStarting: 1249000,
    priceLabel: '₹12.49 Lakh*',
    fuelType: '40.5 kWh High Density Battery',
    transmission: 'Shift-by-Wire Intelligent E-Drive',
    safety: '5-Star BNCAP Certified',
    highlight: '465 km Range • V2V & V2L Charging',
    image: 'https://cdn3.shopvii.com/1017/813/pro_nexon_ev2.webp',
    isNew: false,
    isEV: true
  },
  {
    id: 'punch-ice',
    name: 'Tata Punch',
    category: 'SUV',
    bodyType: 'Sub-Compact SUV',
    tagline: 'Vibes with Your Vibe • Sub-Compact SUV',
    priceStarting: 612000,
    priceLabel: '₹6.12 Lakh*',
    fuelType: '1.2L Revotron / Dual-Cylinder iCNG',
    transmission: '5-Speed MT / AMT',
    safety: '5-Star BNCAP Certified',
    highlight: 'Voice-Assisted Sunroof & 187mm Ground Clearance',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_punch.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'punch-ev',
    name: 'Tata Punch.ev',
    category: 'EV',
    bodyType: 'Electric Sub-Compact',
    tagline: 'Beyond Everyday • Pure EV Platform',
    priceStarting: 999000,
    priceLabel: '₹9.99 Lakh*',
    fuelType: '35 kWh Long Range Battery',
    transmission: 'Single Speed E-Drive',
    safety: '5-Star BNCAP Certified',
    highlight: '421 km Range • Frunk Storage',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_punch_ev.jpeg',
    isNew: true,
    isEV: true
  },
  {
    id: 'altroz',
    name: 'Tata Altroz',
    category: 'Hatchback',
    bodyType: 'Premium Hatchback',
    tagline: 'The Gold Standard of Safety & Style',
    priceStarting: 664000,
    priceLabel: '₹6.64 Lakh*',
    fuelType: 'Petrol / Diesel / Twin Cylinder iCNG',
    transmission: 'Wet-Clutch 6-Speed DCA Automatic',
    safety: '5-Star Global NCAP Certified',
    highlight: '90° Wide Opening Doors & Sunroof',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_altroz.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'tiago-ice',
    name: 'Tata Tiago',
    category: 'Hatchback',
    bodyType: 'Hatchback',
    tagline: 'It’s Seriously Fun • High Mileage City Car',
    priceStarting: 499000,
    priceLabel: '₹4.99 Lakh*',
    fuelType: '1.2L Revotron / Dual Cylinder iCNG',
    transmission: '5-Speed MT / AMT',
    safety: '4-Star Global NCAP Tested',
    highlight: 'Harman™ 8-Speaker Audio & Best-in-Class Mileage',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_tiago.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'tigor-ice',
    name: 'Tata Tigor',
    category: 'Styleback',
    bodyType: 'Styleback Sedan',
    tagline: 'The Sedanese of Style & Sedan Comfort',
    priceStarting: 599000,
    priceLabel: '₹5.99 Lakh*',
    fuelType: 'Petrol / Factory-Fitted iCNG',
    transmission: '5-Speed MT / AMT',
    safety: '4-Star Global NCAP Proven',
    highlight: 'Automatic Climate Control & 419L Boot',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_tigor.jpeg',
    isNew: false,
    isEV: false
  },
  {
    id: 'tiago-ev',
    name: 'Tata Tiago.ev',
    category: 'EV',
    bodyType: 'Electric Hatchback',
    tagline: 'India’s Most Loved Electric Hatchback',
    priceStarting: 799000,
    priceLabel: '₹7.99 Lakh*',
    fuelType: '24 kWh Lithium-ion Pack',
    transmission: 'Single Speed Direct Drive',
    safety: '4-Star Global NCAP Proven',
    highlight: '315 km Range • ₹0.90 per km Running Cost',
    image: 'https://cdn3.shopvii.com/1017/813/menu_pro_tiago_ev.jpeg',
    isNew: false,
    isEV: true
  },
  {
    id: 'harrier-ev',
    name: 'Tata Harrier.ev',
    category: 'EV',
    bodyType: 'Electric Flagship SUV',
    tagline: 'Legendary Power Meets Pure Electrification',
    priceStarting: 2199000,
    priceLabel: '₹21.99 Lakh (Expected)*',
    fuelType: 'Dual Motor AWD Electric',
    transmission: 'All-Wheel Drive Intelligent Vectoring',
    safety: '5-Star BNCAP Planned',
    highlight: '500+ km Range • V2L Vehicle-to-Load Powerbank',
    image: 'https://cdn3.shopvii.com/1017/813/harrier_ev.jpg',
    isNew: true,
    isEV: true
  },
  {
    id: 'sierra-ice',
    name: 'Tata Sierra',
    category: 'SUV',
    bodyType: 'Legendary SUV',
    tagline: 'The Cult Classic Returns • Timeless Design',
    priceStarting: 1399000,
    priceLabel: '₹13.99 Lakh (Expected)*',
    fuelType: '1.5L Turbo GDi Petrol / Diesel',
    transmission: '6-Speed MT / Torque Converter AT',
    safety: '5-Star BNCAP Engineering',
    highlight: 'Iconic Curved Rear Glass & Lounge Seating',
    image: 'https://cdn3.shopvii.com/1017/813/sierra.png',
    isNew: true,
    isEV: false
  },
  {
    id: 'sierra-ev',
    name: 'Tata Sierra.ev',
    category: 'EV',
    bodyType: 'Electric Iconic SUV',
    tagline: 'The Electric Renaissance of an Icon',
    priceStarting: 1899000,
    priceLabel: '₹18.99 Lakh (Expected)*',
    fuelType: 'Pure Electric Gen 2 EV Architecture',
    transmission: 'All-Wheel Drive E-Motor',
    safety: '5-Star BNCAP Engineering',
    highlight: 'Panoramic Signature Canopy Roof',
    image: 'https://cdn3.shopvii.com/1017/813/sierra.png',
    isNew: true,
    isEV: true
  }
];

// 2. OFFICIAL DEALERSHIP HUBS WITH REAL GROUND TRUTH DATA
const DEALERSHIP_HUBS = [
  {
    id: 'scheme-140',
    shortName: 'Scheme 140, Indore',
    name: 'Shyam Tata Cars - Scheme No. 140 Flagship Hub',
    tag: 'Main 3S Showroom & 18-Bay Ultra Workshop',
    address: 'SN 03, 81/1/3 & 15/3/4 Scheme No.140 Shivneri Sahil Empire, Bicholi Mardana, Indore - 452016',
    serviceCenterAddress: 'Khasra No. 14/2/4/1 Bypass Road, Bicholi Mardana, Indore - 452016',
    phone: '+91 88798 97825',
    servicePhone: '+91 88798 97825',
    hours: 'Showroom: 10:00 AM - 7:30 PM | Service: 9:30 AM - 6:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Tata+Motors+Cars+Showroom+Shyam+Automotive+Scheme+140+Indore',
    badge: '18 Active Bays • EV High-Voltage Insulated Lift • 4.9★ Rated'
  },
  {
    id: 'bhawarkua',
    shortName: 'Bhawarkua & Rau',
    name: 'Shyam Tata Cars - Bhawarkua Indore',
    tag: 'City Central Showroom, Rau Service Center & Bodyshop',
    address: '4 Aditya Nagar, A.B Road, Bhawarkua, Indore (M.P.)',
    serviceCenterAddress: '150/1/2/1, AB Road Rau, Indore - 452001',
    bodyShopAddress: '79/1/2, CAT Rd, Siddhipuram Colony, Rau, Indore - 453331',
    phone: '+91 76111 20000',
    servicePhone: '+91 76111 40000',
    hours: 'Showroom: 10:00 AM - 7:30 PM | Workshop: 9:30 AM - 6:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Tata+Motors+Cars+Showroom+Shyam+Automotive+Aditya+Nagar+Indore',
    badge: 'Central Bodyshop • 10-Ton Hydraulic Chassis Jig • PPG Paint Booth'
  },
  {
    id: 'kukshi',
    shortName: 'Kukshi (Dhar)',
    name: 'Shyam Tata Cars - Kukshi Showroom & Service',
    tag: 'Dhar District Rural & Highway Support Hub',
    address: 'Khasra No. 236/9 Main Road Dhar, Kukshi, Dist. Dhar (M.P.)',
    serviceCenterAddress: 'Badwani Road, Nariman Point, Infront of Krishna Hospital, Dist Dhar - 454331',
    phone: '+91 88792 31832',
    servicePhone: '+91 76111 71000',
    hours: 'Mon - Sun: 9:30 AM - 7:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Tata+Motors+Cars+Showroom+Shyam+Automotive+Kukshi',
    badge: 'Full Mechanical & Electrical Diagnostic Bay'
  },
  {
    id: 'badnawar',
    shortName: 'Badnawar',
    name: 'Shyam Tata Cars - Badnawar Branch',
    tag: 'Express Service & Sales Counter',
    address: '41, Badnagar Road, Near HP Petrol Pump, Badi Choupati, Badnawar, MP - 454660',
    serviceCenterAddress: 'No. 41, Badi Choupati, Badnagar Road, Near HP Petrol Pump, Badnawar',
    phone: '+91 82912 47759',
    servicePhone: '+91 82912 47759',
    hours: 'Mon - Sat: 9:30 AM - 7:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Tata+Motors+Cars+Showroom+Shyam+Automotive+Badnawar',
    badge: 'Express Lubrication & Periodic Maintenance'
  }
];

// 3. TATA GENUINE ACCESSORIES CATALOG
const GENUINE_ACCESSORIES = [
  { id: 'acc-1', name: '7D All-Weather Luxury Floor Mats', category: 'Interior', price: '₹4,499', code: 'TATA-INT-7D-MAT', desc: 'Precision laser-cut mats with high wall protection, waterproof & anti-skid.', image: 'https://cdn3.shopvii.com/1017/813/accessories-1.jpg' },
  { id: 'acc-2', name: 'Front & Rear Skid Plate Styling Pack', category: 'Exterior', price: '₹7,999', code: 'TATA-EXT-SKID-PLT', desc: 'Satin silver brushed finish skid plates with aerodynamically tested brackets.', image: 'https://cdn3.shopvii.com/1017/813/accessories.jpg' },
  { id: 'acc-3', name: 'Tata OEM Integrated Front Dashcam (FHD)', category: 'Electronics', price: '₹5,999', code: 'TATA-ELC-DASH-CAM', desc: '1080p Sony STARVIS sensor, G-sensor shock detection with seamless ignition harness.', image: 'https://cdn3.shopvii.com/1017/813/accessories-1.jpg' },
  { id: 'acc-4', name: 'Puddle Lamps with Tata Flying Wings Logo', category: 'Exterior', price: '₹2,499', code: 'TATA-EXT-PUDDLE-LED', desc: 'High-intensity LED projection lamps replacing stock door lamps.', image: 'https://cdn3.shopvii.com/1017/813/accessories.jpg' },
  { id: 'acc-5', name: 'Wireless Smart Tyre Inflator + Pressure Gauge', category: 'Utility', price: '₹3,299', code: 'TATA-UTL-INFLAT-PRO', desc: 'Cordless 150 PSI auto-shutoff digital air pump with built-in torch.', image: 'https://cdn3.shopvii.com/1017/813/accessories-1.jpg' },
  { id: 'acc-6', name: 'Ceramic 9H Nano Shield Paint Protection Kit', category: 'Care', price: '₹8,999', code: 'TATA-CAR-CERAMIC-9H', desc: 'Dealer-applied hydrophobic ceramic coating protecting against UV and acid rain.', image: 'https://cdn3.shopvii.com/1017/813/accessories.jpg' }
];

export default function ShyamAutomotivePortal({ onOpenStaffPortal, currentUser, onOpenCustomerApp }) {
  // Mobile App Navigation State
  const [mobileActiveNav, setMobileActiveNav] = useState('home'); // 'home' | 'cars' | 'service' | 'status' | 'menu'
  const [selectedBranch, setSelectedBranch] = useState(DEALERSHIP_HUBS[0]);
  const [branchSelectorOpen, setBranchSelectorOpen] = useState(false);
  const [pwaBannerDismissed, setPwaBannerDismissed] = useState(() => {
    return localStorage.getItem('shyam_pwa_banner_dismissed') === 'true';
  });

  // Category Filter for Showroom
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Quick Tracking State (Registration / Token)
  const [quickTrackQuery, setQuickTrackQuery] = useState('');
  const [quickTrackLoading, setQuickTrackLoading] = useState(false);
  const [quickTrackError, setQuickTrackError] = useState('');
  const [quickTrackResult, setQuickTrackResult] = useState(null);

  // Status Boards (RTO & Accidental)
  const [statusBoardModalOpen, setStatusBoardModalOpen] = useState(false);
  const [statusBoardType, setStatusBoardType] = useState('RTO'); // 'RTO' | 'ACCIDENTAL'
  const [statusBoardQuery, setStatusBoardQuery] = useState('');
  const [statusBoardLoading, setStatusBoardLoading] = useState(false);
  const [statusBoardError, setStatusBoardError] = useState('');
  const [statusBoardResult, setStatusBoardResult] = useState(null);

  // Lead Modals & Vehicle Variant Decision Hub
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedCarForDetail, setSelectedCarForDetail] = useState(TATA_VEHICLES[0]);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [selectedCarForTD, setSelectedCarForTD] = useState(TATA_VEHICLES[0]);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [selectedCarForEMI, setSelectedCarForEMI] = useState(TATA_VEHICLES[0]);
  const [serviceBookingModalOpen, setServiceBookingModalOpen] = useState(false);
  const [salesBookingModalOpen, setSalesBookingModalOpen] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [rsaModalOpen, setRsaModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [customerEducationModalOpen, setCustomerEducationModalOpen] = useState(false);
  const [educationActiveTab, setEducationActiveTab] = useState('general');
  const [accessoriesModalOpen, setAccessoriesModalOpen] = useState(false);
  const [offersModalOpen, setOffersModalOpen] = useState(false);
  const [awardsModalOpen, setAwardsModalOpen] = useState(false);
  const [aboutUsModalOpen, setAboutUsModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState('privacy');
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Mobile App Sheet (Menu Tab)
  const [appMenuSheetOpen, setAppMenuSheetOpen] = useState(false);

  // Form States
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // PWA Install Prompt Capture
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerPwaInstall = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(() => {
        setInstallPromptEvent(null);
      });
    } else {
      alert('To install Shyam Automotive App:\n• iOS: Tap Share ➔ Add to Home Screen\n• Android/Chrome: Tap ⋮ Menu ➔ Install app');
    }
  };

  // Generic Lead Submission Handler
  const handleGenericLeadSubmit = async (leadData, successFeedback) => {
    setFormSubmitting(true);
    setFormSuccessMessage('');
    try {
      const res = await fetch('/api/v2/leads/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      const json = await res.json();
      if (json.success) {
        setFormSuccessMessage(json.data.message || successFeedback);
        confetti({ particleCount: 70, spread: 60 });
      } else {
        alert(json.error || 'Failed to submit request');
      }
    } catch (err) {
      alert('Network error. Our customer care desk is directly available at +91-7611120000.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Test Drive Submit Handler
  const [tdName, setTdName] = useState('');
  const [tdPhone, setTdPhone] = useState('');
  const [tdDate, setTdDate] = useState('');
  const [tdSlot, setTdSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [tdBranch, setTdBranch] = useState(selectedBranch.name);

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    if (!tdName || !tdPhone) return;
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/v2/leads/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: tdName,
          customerPhone: tdPhone,
          model: selectedCarForTD.name,
          preferredDate: tdDate || new Date().toISOString().split('T')[0],
          preferredSlot: tdSlot,
          branch: tdBranch
        })
      });
      const json = await res.json();
      if (json.success) {
        setFormSuccessMessage(json.data.message);
        confetti({ particleCount: 80, spread: 60 });
      }
    } catch (err) {
      alert('Unable to submit request. Please call our sales desk at +91 76111 20000.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Doorstep Service Pickup Submit Handler
  const [pickupName, setPickupName] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupReg, setPickupReg] = useState('');
  const [pickupModel, setPickupModel] = useState('Tata Nexon');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [pickupResult, setPickupResult] = useState(null);

  const handleServicePickupSubmit = async (e) => {
    e.preventDefault();
    if (!pickupName || !pickupPhone || !pickupReg) return;
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/v2/pickups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: pickupName,
          customer_phone: pickupPhone,
          customer_address: pickupAddress || 'Indore Customer Address (To be confirmed on call)',
          vehicle_model: pickupModel,
          vehicle_reg: pickupReg.toUpperCase(),
          scheduled_at: pickupDateTime || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          valet_id: 'usr-sa-1'
        })
      });
      const json = await res.json();
      if (json.success) {
        setPickupResult(json.data);
        confetti({ particleCount: 90, spread: 70 });
      } else {
        alert(json.error || 'Failed to create pickup request');
      }
    } catch (err) {
      alert('Network error. Please call service concierge at +91 88798 97825.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // RTO / Accidental Status Board Handler
  const handleStatusBoardSearch = async (e) => {
    e.preventDefault();
    if (!statusBoardQuery || statusBoardQuery.trim().length < 3) {
      setStatusBoardError('Please enter a valid mobile number or registration plate');
      return;
    }
    setStatusBoardLoading(true);
    setStatusBoardError('');
    setStatusBoardResult(null);

    const endpoint = statusBoardType === 'RTO' ? '/api/v2/status-board/rto' : '/api/v2/status-board/accidental';
    try {
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(statusBoardQuery.trim())}`);
      const json = await res.json();
      if (json.success) {
        setStatusBoardResult(json.data);
      } else {
        setStatusBoardError(json.error || 'No matching record found. Please verify your phone or vehicle plate.');
      }
    } catch (err) {
      setStatusBoardError('Could not reach the status verification server. Please check your network.');
    } finally {
      setStatusBoardLoading(false);
    }
  };

  // Quick Track Handler (Privacy-Hardened)
  const handleQuickTrack = async (e) => {
    e.preventDefault();
    if (!quickTrackQuery || quickTrackQuery.trim().length < 3) {
      setQuickTrackError('Please enter a valid registration number or secure token');
      return;
    }
    setQuickTrackLoading(true);
    setQuickTrackError('');
    setQuickTrackResult(null);

    try {
      const res = await fetch(`/api/v2/vehicles/quick-track?q=${encodeURIComponent(quickTrackQuery.trim())}`);
      const json = await res.json();
      if (json.success) {
        if (json.type === 'TOKEN_AUTH' && json.redirectUrl) {
          window.location.hash = json.redirectUrl.startsWith('/#') ? json.redirectUrl.slice(1) : json.redirectUrl;
        } else if (json.type === 'PUBLIC_STATUS_PREVIEW' && json.vehicle) {
          setQuickTrackResult(json.vehicle);
        }
      } else {
        setQuickTrackError(json.error || 'Vehicle record not found. Please contact Shyam Automotive at +91 88798 97825.');
      }
    } catch (err) {
      setQuickTrackError('Could not connect to dealership server. Please check your network.');
    } finally {
      setQuickTrackLoading(false);
    }
  };

  // EMI Calculator State
  const [loanPrice, setLoanPrice] = useState(TATA_VEHICLES[0].priceStarting);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.75);

  const calculateEmi = () => {
    const downPayment = (loanPrice * downPaymentPct) / 100;
    const principal = loanPrice - downPayment;
    const r = interestRate / (12 * 100);
    const n = tenureYears * 12;
    const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalAmount = emi * n;
    const totalInterest = totalAmount - principal;
    return { monthlyEmi: emi, principal, downPayment, totalInterest, totalAmount };
  };
  const emiValues = calculateEmi();

  const filteredVehicles = TATA_VEHICLES.filter(v => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'EV') return v.isEV;
    if (selectedCategory === 'SUV') return v.category === 'SUV';
    if (selectedCategory === 'HATCH') return v.category === 'Hatchback';
    if (selectedCategory === 'STYLEBACK') return v.category === 'Styleback';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-safe">

      {/* ========================================================================= */}
      {/* 1. TOP PWA APP BAR (MOBILE + DESKTOP ADAPTIVE)                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 pt-safe shadow-xs">
        
        {/* Desktop Top Strip (hidden on small mobile) */}
        <div className="hidden lg:block bg-slate-100/90 text-slate-600 text-xs py-1.5 px-4 border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Official Shyam Automotive Tata Motors PWA App
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> 4.9★ (1,237 Google Reviews)
              </span>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <a href="tel:+917611120000" className="hover:text-slate-900 flex items-center gap-1 text-slate-600">
                <Phone className="w-3 h-3 text-blue-600" /> +91-7611120000
              </a>
              <a href="https://api.whatsapp.com/send?phone=919009550950" target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1">
                WhatsApp +91-9009550950
              </a>
              <button 
                onClick={onOpenCustomerApp || (() => { window.location.hash = '#/app'; })}
                className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Car className="w-3.5 h-3.5 text-amber-300" />
                <span>My Tata Garage</span>
                <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">Sign In</span>
              </button>
              {currentUser ? (
                <button onClick={onOpenStaffPortal} className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-bold cursor-pointer">
                  Staff OS ({currentUser.name}) ➔
                </button>
              ) : (
                <button onClick={onOpenStaffPortal} className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
                  <Lock className="w-3 h-3 text-amber-500" /> Staff Portal
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main PWA Header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
          
          {/* Brand Logo & Dynamic Location Selector */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex flex-col items-center justify-center text-white font-black text-[10px] leading-tight shadow-md shrink-0">
              <span>TATA</span>
              <span className="text-[8px] text-blue-100">SHYAM</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="font-black text-sm sm:text-base text-slate-900 tracking-tight truncate">
                  SHYAM AUTOMOTIVE
                </h1>
                <span className="hidden xs:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  TATA MOTORS
                </span>
              </div>
              
              {/* Interactive Branch Pill */}
              <button
                onClick={() => setBranchSelectorOpen(true)}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 font-medium truncate cursor-pointer transition-colors"
                title="Tap to switch dealership branch"
              >
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">{selectedBranch.shortName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar (SOS 24x7, Search, Staff Switcher) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* 24x7 SOS Button */}
            <button
              onClick={() => setRsaModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              title="24x7 Emergency Roadside Assistance"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-extrabold text-[11px]">24x7 SOS</span>
            </button>

            {/* Quick Search Trigger */}
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer active:scale-95 shadow-xs"
              title="Search cars, services & tips"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Mobile Customer App Trigger */}
            <button
              onClick={onOpenCustomerApp || (() => { window.location.hash = '#/app'; })}
              className="p-2 rounded-xl text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 transition-colors cursor-pointer active:scale-95 sm:hidden shadow-xs"
              title="My Tata Garage Customer App"
            >
              <Car className="w-4 h-4" />
            </button>

            {/* Quick Staff Button on mobile */}
            <button
              onClick={onOpenStaffPortal}
              className="p-2 rounded-xl text-amber-600 hover:text-amber-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer active:scale-95 sm:hidden shadow-xs"
              title="Dealership Staff Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* My Tata Garage Customer App (Desktop) */}
            <button
              onClick={onOpenCustomerApp || (() => { window.location.hash = '#/app'; })}
              className="hidden sm:flex bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm transition-all items-center gap-1.5 cursor-pointer border border-blue-400/30"
              title="My Tata Garage, Live Service & Bookings"
            >
              <Car className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">My Tata Garage</span>
              <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                App
              </span>
            </button>

            {/* Desktop Action for Service */}
            <button
              onClick={() => setServiceBookingModalOpen(true)}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" /> Book Doorstep Service
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. PWA INSTALL BANNER (DISMISSIBLE / 1-TAP INSTALL)                       */}
      {/* ========================================================================= */}
      {!pwaBannerDismissed && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-100 border-b border-blue-200 px-3 py-2 text-xs text-slate-700">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] text-slate-700 truncate">
                <strong className="text-slate-900">Install Shyam Automotive App:</strong> 1-Tap Doorstep Service, RTO Radar & Offline access.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={triggerPwaInstall}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Install
              </button>
              <button
                onClick={() => {
                  setPwaBannerDismissed(true);
                  localStorage.setItem('shyam_pwa_banner_dismissed', 'true');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STORIES / QUICK ACTION HORIZONTAL CAROUSEL (APP-LIKE EXPERIENCE)       */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-3 px-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
            
            {/* Story 1: Curvv */}
            <button
              onClick={() => { setSelectedCategory('SUV'); document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center overflow-hidden shadow-xs">
                  <Flame className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Curvv.ev</span>
            </button>

            {/* Story 2: Doorstep Valet */}
            <button
              onClick={() => setServiceBookingModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-teal-500 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Valet Service</span>
            </button>

            {/* Story 3: RTO Radar */}
            <button
              onClick={() => { setStatusBoardType('RTO'); setStatusBoardModalOpen(true); }}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-blue-400 to-cyan-500 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <Compass className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">RTO Radar</span>
            </button>

            {/* Story 4: Accidental Claim */}
            <button
              onClick={() => { setStatusBoardType('ACCIDENTAL'); setStatusBoardModalOpen(true); }}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-orange-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Bodyshop</span>
            </button>

            {/* Story 5: Insurance */}
            <button
              onClick={() => setInsuranceModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-teal-400 to-emerald-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Insurance</span>
            </button>

            {/* Story 6: Value Care AMC */}
            <button
              onClick={() => setWarrantyModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-amber-500 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Value Care</span>
            </button>

            {/* Story 7: TMA Exchange */}
            <button
              onClick={() => setExchangeModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-purple-400 to-indigo-500 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">TMA Exchange</span>
            </button>

            {/* Story 8: 24x7 RSA */}
            <button
              onClick={() => setRsaModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 to-red-600 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <PhoneCall className="w-6 h-6 text-rose-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">24x7 RSA</span>
            </button>

            {/* Story 9: Accessories */}
            <button
              onClick={() => setAccessoriesModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-sky-400 to-blue-500 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6 text-sky-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Accessories</span>
            </button>

            {/* Story 10: Offers */}
            <button
              onClick={() => setOffersModalOpen(true)}
              className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-rose-400 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center shadow-xs">
                  <Gift className="w-6 h-6 text-pink-500" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-600">Offers</span>
            </button>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. APP HERO BANNER (MOBILE-FIRST CAROUSEL & VALUE PROPOSITION)             */}
      {/* ========================================================================= */}
      <section className="px-3 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/60 rounded-2xl sm:rounded-3xl border border-blue-100 p-4 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Central India’s Highest Rated Tata Dealership (4.9★)</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Safer, Smarter Driving with <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                    Tata Motors &amp; Shyam
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Book a free doorstep test drive, schedule valet maintenance with digital TrustPass ID, or check your live RTO Smart Card status in 1-tap.
                </p>

                {/* Mobile Quick Action Buttons */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={() => { setSelectedCarForTD(TATA_VEHICLES[0]); setTestDriveModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Car className="w-4 h-4 shrink-0" />
                    <span>Book Test Drive</span>
                  </button>

                  <button
                    onClick={() => setServiceBookingModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>Valet Pickup</span>
                  </button>

                  <button
                    onClick={() => { setStatusBoardType('RTO'); setStatusBoardModalOpen(true); }}
                    className="col-span-2 sm:col-span-1 bg-white hover:bg-slate-50 border border-slate-300 text-amber-800 px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Check RTO Status</span>
                  </button>
                </div>
              </div>

              {/* Hero Car Showcase Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-blue-600 uppercase text-[10px]">Spotlight Vehicle</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      5-Star BNCAP
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">Tata Curvv &amp; Curvv.ev</h3>
                  <p className="text-[11px] text-slate-500 mb-2">Coupe SUV • Panoramic Sunroof • 502 km Range</p>

                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-3">
                    <img
                      src="https://cdn3.shopvii.com/1017/813/pro_curvv.webp"
                      alt="Tata Curvv"
                      className="w-full h-full object-contain hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Starting Ex-Showroom</span>
                      <strong className="text-slate-900 text-sm">₹9.99 Lakh*</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">EMI Starting</span>
                      <strong className="text-emerald-700 text-sm">₹16,490/mo*</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NATIVE APP SEARCH & QUICK VEHICLE TRACK RADAR STRIP                     */}
      {/* ========================================================================= */}
      <section className="px-3 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            
            <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Plate (e.g. MP09CW4821) or Secure Token"
                  value={quickTrackQuery}
                  onChange={(e) => setQuickTrackQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 uppercase font-mono tracking-wider focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={quickTrackLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
              >
                {quickTrackLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                <span>Live Radar</span>
              </button>
            </form>

            {quickTrackError && (
              <p className="text-rose-600 text-xs font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" /> {quickTrackError}
              </p>
            )}

            {/* Quick Track Preview */}
            {quickTrackResult && (
              <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Vehicle</span>
                  <span className="font-bold text-slate-900 truncate block">{quickTrackResult.model}</span>
                  <span className="font-mono text-blue-600 text-[10px]">{quickTrackResult.regNo}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Current Stage</span>
                  <span className="font-bold text-emerald-700 truncate block">{quickTrackResult.stageName}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Service Advisor</span>
                  <span className="font-bold text-slate-900 truncate block">{quickTrackResult.saName || 'Ramesh Sharma'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Delivery ETA</span>
                  <span className="font-bold text-amber-700 truncate block">{quickTrackResult.estimatedReadyTime || 'Today by 5:30 PM'}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5B. LIVE WORKSHOP TELEMETRY & 18-BAY ACTIVE CSP RADAR                     */}
      {/* ========================================================================= */}
      <LiveTelemetryRadar
        onOpenServiceBooking={() => setServiceBookingModalOpen(true)}
        onOpenValet={() => setServiceBookingModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 6. MOBILE APP SERVICES TILES GRID (NATIVE 4x2 / 6x1 LAYOUT)               */}
      {/* ========================================================================= */}
      <section className="px-3 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Dealership Quick Services</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">1-Tap Booking</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            
            {/* Tile 1: Service Booking */}
            <button
              onClick={() => setServiceBookingModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600">Valet Service</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Free Pickup</span>
            </button>

            {/* Tile 2: RTO Status */}
            <button
              onClick={() => { setStatusBoardType('RTO'); setStatusBoardModalOpen(true); }}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-cyan-600">RTO Status</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Smart Card RC</span>
            </button>

            {/* Tile 3: Accidental Bodyshop */}
            <button
              onClick={() => { setStatusBoardType('ACCIDENTAL'); setStatusBoardModalOpen(true); }}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-amber-600">Bodyshop</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Cashless Claim</span>
            </button>

            {/* Tile 4: Insurance Renewal */}
            <button
              onClick={() => setInsuranceModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-600">Insurance</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Zero-Dep Quote</span>
            </button>

            {/* Tile 5: Extended Warranty & AMC */}
            <button
              onClick={() => setWarrantyModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-yellow-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-yellow-600">Value Care</span>
              <span className="text-[10px] text-slate-500 mt-0.5">43% AMC Save</span>
            </button>

            {/* Tile 6: 24x7 Roadside Assistance */}
            <button
              onClick={() => setRsaModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-rose-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-rose-600">24x7 RSA</span>
              <span className="text-[10px] text-slate-500 mt-0.5">1800 209 7979</span>
            </button>

            {/* Tile 7: TMA Exchange */}
            <button
              onClick={() => setExchangeModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-purple-600">Exchange</span>
              <span className="text-[10px] text-slate-500 mt-0.5">TMA Assured</span>
            </button>

            {/* Tile 8: Owner Education */}
            <button
              onClick={() => setCustomerEducationModalOpen(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600">Education</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Tips &amp; Safety</span>
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. VEHICLE SHOWROOM (CATEGORY FILTER CHIPS + TOUCH-FRIENDLY CARDS)         */}
      {/* ========================================================================= */}
      <section id="showroom-section" className="px-3 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Tata Vehicles Lineup</h3>
              <p className="text-xs text-slate-500">All 15 Passenger Vehicles on display at Indore Scheme 140</p>
            </div>

            {/* Filter Chips Horizontal Carousel */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Models (15)' },
                { id: 'SUV', label: 'SUVs & Coupes' },
                { id: 'EV', label: '⚡ Pure Electric' },
                { id: 'HATCH', label: 'Hatchbacks' },
                { id: 'STYLEBACK', label: 'Sedan Styleback' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
              >
                {/* Image Banner */}
                <div
                  onClick={() => { setSelectedCarForDetail(vehicle); setVariantModalOpen(true); }}
                  className="relative aspect-16/10 bg-slate-50 p-4 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {vehicle.isEV && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Zap className="w-3 h-3" /> PURE ELECTRIC
                    </span>
                  )}
                  {vehicle.isNew && (
                    <span className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      NEW LAUNCH
                    </span>
                  )}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-slate-900 font-bold text-[11px] px-3 py-1 rounded-full shadow-md transition-opacity">
                      Click to View Variants &amp; Specs
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span className="text-blue-600 uppercase">{vehicle.bodyType}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                        {vehicle.safety}
                      </span>
                    </div>

                    <h4
                      onClick={() => { setSelectedCarForDetail(vehicle); setVariantModalOpen(true); }}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {vehicle.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{vehicle.tagline}</p>

                    <div className="my-3 py-2 border-y border-slate-100 space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Powertrain:</span>
                        <span className="font-semibold text-slate-800">{vehicle.fuelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Highlight:</span>
                        <span className="font-semibold text-emerald-700 truncate max-w-[180px]">{vehicle.highlight}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-2.5">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Starting Price</span>
                        <strong className="text-lg font-black text-slate-900">{vehicle.priceLabel}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400">Ex-Showroom MP</span>
                    </div>

                    {/* Primary Variant & Price Exploration Button */}
                    <button
                      onClick={() => { setSelectedCarForDetail(vehicle); setVariantModalOpen(true); }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 mb-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-200" />
                      <span>Explore Variants &amp; On-Road Price</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setSelectedCarForTD(vehicle); setTestDriveModalOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                      >
                        <Car className="w-3.5 h-3.5" /> Test Drive
                      </button>
                      <button
                        onClick={() => { setSelectedCarForEMI(vehicle); setLoanPrice(vehicle.priceStarting); setEmiModalOpen(true); }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      >
                        <DollarSign className="w-3.5 h-3.5" /> EMI
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7B. SIDE-BY-SIDE TATA VEHICLE COMPARATOR ENGINE                           */}
      {/* ========================================================================= */}
      <VehicleComparator
        vehicles={TATA_VEHICLES}
        onBookTestDrive={(car) => {
          setSelectedCarForTD(car);
          setTestDriveModalOpen(true);
        }}
        onGetQuote={(car) => {
          setSelectedCarForTD(car);
          setSalesBookingModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 7C. 100% TRANSPARENT SERVICE COST & MAINTENANCE ESTIMATOR                 */}
      {/* ========================================================================= */}
      <ServiceCostEstimator
        onBookService={() => setServiceBookingModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 7D. DOORSTEP VALET TRUSTPASS™ ANTI-SCAM SECURITY BLUEPRINT                */}
      {/* ========================================================================= */}
      <ValetTrustPassDeepDive
        onBookValet={() => setServiceBookingModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 7E. TATA.EV CLEAN ENERGY ROI & 60kW DC CHARGING HUB                      */}
      {/* ========================================================================= */}
      <EvSavingsCalculator
        onExploreEVs={() => {
          setSelectedCategory('EV');
          const el = document.getElementById('showroom-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ========================================================================= */}
      {/* 7F. TATA MOTORS ASSURED (TMA) SCIENTIFIC TRADE-IN VALUATION               */}
      {/* ========================================================================= */}
      <TradeInValuationWizard
        onBookExchange={() => setExchangeModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 7G. DEALERSHIP HERITAGE & 5-POINT CUSTOMER BILL OF RIGHTS                 */}
      {/* ========================================================================= */}
      <DealershipHeritageCharter
        onOpenAboutModal={() => setAboutUsModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 7H. WALL OF TRUST: VERIFIED INDORE CUSTOMER REVIEWS & STORIES             */}
      {/* ========================================================================= */}
      <CustomerReviewsWall />

      {/* ========================================================================= */}
      {/* 8. DEALERSHIP HUBS & CONTACT (TAP TO SWITCH BRANCH OR GET DIRECTIONS)     */}
      {/* ========================================================================= */}
      <section className="px-3 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">Dealership Branches</h3>
              <p className="text-xs text-slate-500">Scheme 140 • Bhawarkua &amp; Rau • Kukshi • Badnawar</p>
            </div>
            <button
              onClick={() => setBranchSelectorOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View All 4 ➔
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEALERSHIP_HUBS.map(hub => (
              <div
                key={hub.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedBranch.id === hub.id
                    ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200 truncate">
                      {hub.badge.split('•')[0]}
                    </span>
                    <a
                      href={hub.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white transition-colors"
                      title="Google Maps"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900">{hub.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{hub.address}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hub.hours.split('|')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                  <a
                    href={`tel:${hub.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <Phone className="w-3 h-3" /> Call ({hub.phone.split(' ')[1] || hub.phone})
                  </a>
                  <button
                    onClick={() => setSelectedBranch(hub)}
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8B. COMPREHENSIVE AUTOMOTIVE FAQ ACCORDION                                */}
      {/* ========================================================================= */}
      <ComprehensiveFaq />

      {/* ========================================================================= */}
      {/* 9. ENTERPRISE MULTI-COLUMN MEGA FOOTER & COMPLIANCE LEDGER                */}
      {/* ========================================================================= */}
      <EnterpriseMegaFooter
        onOpenStaffPortal={onOpenStaffPortal}
        onOpenPolicyModal={(policy) => {
          setCurrentPolicy(policy);
          setPolicyModalOpen(true);
        }}
        onOpenRtoStatus={() => {
          setStatusBoardType('RTO');
          setStatusBoardModalOpen(true);
        }}
        onOpenAccidentalStatus={() => {
          setStatusBoardType('ACCIDENTAL');
          setStatusBoardModalOpen(true);
        }}
        onSelectCar={(carId) => {
          const car = TATA_VEHICLES.find(c => c.id === carId);
          if (car) {
            setSelectedCarForTD(car);
            setTestDriveModalOpen(true);
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 10. PERSISTENT NATIVE APP BOTTOM NAVIGATION BAR (FIXED ON MOBILE/TABLET)   */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 sm:px-6 shadow-lg"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around text-[10px] font-bold">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => {
              setMobileActiveNav('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer active:scale-90 ${
              mobileActiveNav === 'home' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </button>

          {/* Tab 2: Showroom (Cars) */}
          <button
            onClick={() => {
              setMobileActiveNav('cars');
              document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer active:scale-90 ${
              mobileActiveNav === 'cars' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Car className="w-5 h-5 mb-0.5" />
            <span>Cars</span>
          </button>

          {/* Tab 3: Service Booking (Center Highlight) */}
          <button
            onClick={() => {
              setMobileActiveNav('service');
              setServiceBookingModalOpen(true);
            }}
            className="flex flex-col items-center -mt-4 cursor-pointer group active:scale-90"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border-2 border-white transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-slate-700 font-extrabold mt-0.5">Service</span>
          </button>

          {/* Tab 4: Status Radar */}
          <button
            onClick={() => {
              setMobileActiveNav('status');
              setStatusBoardType('RTO');
              setStatusBoardModalOpen(true);
            }}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer active:scale-90 ${
              mobileActiveNav === 'status' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Status</span>
          </button>

          {/* Tab 5: App Menu Sheet */}
          <button
            onClick={() => {
              setMobileActiveNav('menu');
              setAppMenuSheetOpen(true);
            }}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer active:scale-90 ${
              mobileActiveNav === 'menu' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* BOTTOM SHEET 1: APP MENU & QUICK ACCESS DRAWER                           */}
      {/* ========================================================================= */}
      {appMenuSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full border border-slate-200 p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                  TATA
                </div>
                <h3 className="font-black text-base text-slate-900">Shyam Automotive Menu</h3>
              </div>
              <button
                onClick={() => setAppMenuSheetOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 mb-4">
              <button
                onClick={() => { setAppMenuSheetOpen(false); setServiceBookingModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-emerald-400 cursor-pointer shadow-xs"
              >
                <Truck className="w-4 h-4 text-emerald-600" /> Doorstep Service
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setStatusBoardType('RTO'); setStatusBoardModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-cyan-400 cursor-pointer shadow-xs"
              >
                <Compass className="w-4 h-4 text-cyan-600" /> RTO Status Board
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setStatusBoardType('ACCIDENTAL'); setStatusBoardModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-amber-400 cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Bodyshop Claim
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setInsuranceModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-emerald-400 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Insurance Renewal
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setWarrantyModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-yellow-400 cursor-pointer shadow-xs"
              >
                <Shield className="w-4 h-4 text-yellow-600" /> Value Care AMC
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setRsaModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-rose-400 cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" /> 24x7 Roadside RSA
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setExchangeModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-purple-400 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4 text-purple-600" /> TMA Exchange Car
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setCustomerEducationModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-indigo-400 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" /> Education Tips
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setAccessoriesModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-sky-400 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-sky-600" /> Accessories
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setOffersModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-pink-400 cursor-pointer shadow-xs"
              >
                <Gift className="w-4 h-4 text-pink-600" /> Festive Offers
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setAwardsModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-amber-400 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-600" /> Awards
              </button>

              <button
                onClick={() => { setAppMenuSheetOpen(false); setAboutUsModalOpen(true); }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 hover:border-blue-400 cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4 text-blue-600" /> About Heritage
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <a href="tel:+917611120000" className="text-blue-600 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Call +91-7611120000
              </a>
              <button
                onClick={() => { setAppMenuSheetOpen(false); onOpenStaffPortal(); }}
                className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Lock className="w-3 h-3 text-amber-600" /> Staff OS
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM SHEET 2: BRANCH SELECTOR DRAWER                                    */}
      {/* ========================================================================= */}
      {branchSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-slate-900">Select Dealership Hub</h3>
              <button onClick={() => setBranchSelectorOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {DEALERSHIP_HUBS.map(hub => (
                <button
                  key={hub.id}
                  onClick={() => { setSelectedBranch(hub); setBranchSelectorOpen(false); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedBranch.id === hub.id
                      ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-slate-900">{hub.name}</strong>
                    {selectedBranch.id === hub.id && <CheckCheck className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{hub.address}</p>
                  <div className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {hub.phone}
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: RTO & ACCIDENTAL VEHICLE STATUS BOARD (BOTTOM SHEET ON MOBILE)   */}
      {/* ========================================================================= */}
      {statusBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button
              onClick={() => { setStatusBoardModalOpen(false); setStatusBoardResult(null); setStatusBoardError(''); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Type Switcher Tabs */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => { setStatusBoardType('RTO'); setStatusBoardResult(null); setStatusBoardError(''); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  statusBoardType === 'RTO'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" /> RTO Status Board
              </button>
              <button
                onClick={() => { setStatusBoardType('ACCIDENTAL'); setStatusBoardResult(null); setStatusBoardError(''); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  statusBoardType === 'ACCIDENTAL'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4" /> Accidental Bodyshop
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {statusBoardType === 'RTO' ? 'RTO Indore (MP-09) Registration Radar' : 'Bodyshop & Cashless Claim Tracker'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {statusBoardType === 'RTO'
                  ? 'Track High-Security Registration Plate (HSRP) & Speed Post RC dispatch.'
                  : 'Track IRDAI insurance survey approval, chassis puller, and paint booth stage.'}
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleStatusBoardSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={statusBoardType === 'RTO' ? 'Enter Plate (e.g. MP09CZ8821) or Mobile' : 'Enter Mobile, Job Card (JC-...), or Plate'}
                  value={statusBoardQuery}
                  onChange={(e) => setStatusBoardQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={statusBoardLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {statusBoardLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </form>

            {statusBoardError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" /> {statusBoardError}
              </div>
            )}

            {/* Result Box */}
            {statusBoardResult && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicle</span>
                    <h4 className="font-black text-slate-900 text-sm">{statusBoardResult.vehicleModel}</h4>
                    <span className="font-mono text-blue-600 font-bold">{statusBoardResult.regNo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Customer</span>
                    <div className="font-bold text-slate-800">{statusBoardResult.customerName}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {statusBoardType === 'RTO' ? 'HSRP READY AT HUB' : statusBoardResult.insurancePartner}
                    </span>
                  </div>
                </div>

                {/* Timeline Stages */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Stages</span>
                  {statusBoardResult.stages?.map((stage, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 relative">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        stage.status === 'COMPLETED' ? 'bg-emerald-600 text-white' :
                        stage.status === 'IN_PROGRESS' || stage.status === 'READY_AT_DEALERSHIP' || stage.status === 'DISPATCHED' ? 'bg-blue-600 text-white animate-pulse' :
                        'bg-slate-200 text-slate-400'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900 text-xs">{stage.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">{stage.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{stage.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">
                    {statusBoardType === 'RTO' ? 'Fitment Hub: Scheme 140' : `ETA: ${statusBoardResult.promisedDeliveryDate}`}
                  </span>
                  <a
                    href="tel:+918879897825"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3 h-3" /> Call Desk
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SERVICE BOOKING & DOORSTEP VALET PICKUP                          */}
      {/* ========================================================================= */}
      {serviceBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button
              onClick={() => { setServiceBookingModalOpen(false); setPickupResult(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4" /> OFFICIAL DOORSTEP SERVICE DESK
            </div>
            <h3 className="text-lg font-black text-slate-900">Book Tata Workshop Service</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Complimentary Doorstep Valet Pickup across Indore with digital TrustPass ID verification.
            </p>

            {pickupResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Service Pickup Scheduled!</h4>
                <p className="text-xs text-slate-600">
                  Your pickup assignment code is <strong className="font-mono text-emerald-700">{pickupResult.pickup?.id || 'PK-IND-8821'}</strong>. A verified Shyam Automotive valet will connect with you.
                </p>
                <button
                  onClick={() => { setServiceBookingModalOpen(false); setPickupResult(null); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleServicePickupSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={pickupName}
                    onChange={(e) => setPickupName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vehicle Plate *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MP09CW4821"
                      value={pickupReg}
                      onChange={(e) => setPickupReg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 uppercase font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tata Model</label>
                    <select
                      value={pickupModel}
                      onChange={(e) => setPickupModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    >
                      {TATA_VEHICLES.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Time</label>
                    <input
                      type="datetime-local"
                      value={pickupDateTime}
                      onChange={(e) => setPickupDateTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doorstep Address (Indore Area)</label>
                  <textarea
                    rows={2}
                    placeholder="Scheme 140, Vijay Nagar, Saket, Rau, etc."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Doorstep Pickup Slot'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DOORSTEP TEST DRIVE BOOKING                                      */}
      {/* ========================================================================= */}
      {testDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button
              onClick={() => { setTestDriveModalOpen(false); setFormSuccessMessage(''); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Car className="w-4 h-4" /> OFFICIAL TEST DRIVE DESK
            </div>
            <h3 className="text-lg font-black text-slate-900">Experience {selectedCarForTD.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Free doorstep test drive in Indore or priority session at Scheme 140 Flagship Hub.
            </p>

            {formSuccessMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Test Drive Reserved!</h4>
                <p className="text-xs text-slate-600">{formSuccessMessage}</p>
                <button
                  onClick={() => { setTestDriveModalOpen(false); setFormSuccessMessage(''); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chetan Patidar"
                    value={tdName}
                    onChange={(e) => setTdName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={tdPhone}
                    onChange={(e) => setTdPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={tdDate}
                      onChange={(e) => setTdDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Slot</label>
                    <select
                      value={tdSlot}
                      onChange={(e) => setTdSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                    >
                      <option>Morning (10:00 AM - 1:00 PM)</option>
                      <option>Afternoon (1:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 7:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Showroom Location</label>
                  <select
                    value={tdBranch}
                    onChange={(e) => setTdBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  >
                    {DEALERSHIP_HUBS.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Free Test Drive'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EMI LOAN CALCULATOR                                              */}
      {/* ========================================================================= */}
      {emiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => setEmiModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" /> OFFICIAL EMI CALCULATOR
            </div>
            <h3 className="text-lg font-black text-slate-900">Finance {selectedCarForEMI.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Shyam Automotive tie-up banks: SBI, HDFC, ICICI, Tata Capital with zero prepayment charges.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Ex-Showroom Price</span>
                  <span className="text-blue-600">₹{loanPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="499000"
                  max="2800000"
                  step="25000"
                  value={loanPrice}
                  onChange={(e) => setLoanPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Down Payment ({downPaymentPct}%)</span>
                  <span>₹{emiValues.downPayment.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tenure</label>
                  <select
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  >
                    <option value={3}>3 Years (36 Mo)</option>
                    <option value={4}>4 Years (48 Mo)</option>
                    <option value={5}>5 Years (60 Mo)</option>
                    <option value={7}>7 Years (84 Mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200 shadow-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Estimated Monthly EMI</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">₹{emiValues.monthlyEmi.toLocaleString('en-IN')}</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <div>Principal: <strong className="text-slate-900">₹{emiValues.principal.toLocaleString('en-IN')}</strong></div>
                  <div>Interest: <strong className="text-slate-900">₹{emiValues.totalInterest.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>

              <button
                onClick={() => { setEmiModalOpen(false); setSelectedCarForTD(selectedCarForEMI); setTestDriveModalOpen(true); }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer active:scale-95 shadow-xs"
              >
                Apply for Loan &amp; Test Drive
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: INSURANCE RENEWAL DESK                                           */}
      {/* ========================================================================= */}
      {insuranceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => { setInsuranceModalOpen(false); setFormSuccessMessage(''); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> TATA MOTORS INSURANCE DESK
            </div>
            <h3 className="text-lg font-black text-slate-900">Tata Care Insurance Renewal</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              100% Cashless garage claims at Shyam Rau &amp; Scheme 140 Bodyshops. Maximum NCB preservation.
            </p>

            {formSuccessMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Renewal Request Received!</h4>
                <p className="text-xs text-slate-600">{formSuccessMessage}</p>
                <button onClick={() => { setInsuranceModalOpen(false); setFormSuccessMessage(''); }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-xs">
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  handleGenericLeadSubmit({
                    type: 'INSURANCE_RENEWAL',
                    customerName: fd.get('name'),
                    customerPhone: fd.get('phone'),
                    vehicleModel: fd.get('model'),
                    vehicleReg: fd.get('regNo'),
                    notes: `NCB: ${fd.get('ncb')}, Zero-Dep: ${fd.get('zeroDep')}`
                  }, 'Our Insurance Concierge will deliver your comparative quotes on WhatsApp within 30 minutes.');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input type="text" name="name" required placeholder="Owner Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input type="tel" name="phone" required placeholder="10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registration No. *</label>
                    <input type="text" name="regNo" required placeholder="e.g. MP09CZ8821" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tata Model</label>
                    <select name="model" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      {TATA_VEHICLES.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Existing NCB</label>
                    <select name="ncb" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      <option value="50%">50% (5+ Claim-free yrs)</option>
                      <option value="45%">45%</option>
                      <option value="35%">35%</option>
                      <option value="25%">25%</option>
                      <option value="20%">20%</option>
                      <option value="0%">0% (First year/claimed)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cover Preference</label>
                  <select name="zeroDep" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                    <option value="Bumper-to-Bumper Zero Dep">Bumper-to-Bumper Zero Dep + Engine Protect + RTI</option>
                    <option value="Zero Dep Only">Zero Depreciation Only</option>
                    <option value="Comprehensive Standard">Comprehensive Standard</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Get Lowest Renewal Quote'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: EXTENDED WARRANTY & VALUE CARE (AMC)                             */}
      {/* ========================================================================= */}
      {warrantyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => { setWarrantyModalOpen(false); setFormSuccessMessage(''); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> TATA VALUE CARE &amp; WARRANTY
            </div>
            <h3 className="text-lg font-black text-slate-900">Extended Warranty &amp; AMC Program</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Silver &amp; Gold maintenance packages delivering up to 43% savings vs ad-hoc servicing.
            </p>

            {formSuccessMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Enquiry Received!</h4>
                <p className="text-xs text-slate-600">{formSuccessMessage}</p>
                <button onClick={() => { setWarrantyModalOpen(false); setFormSuccessMessage(''); }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-xs">
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">Extended Warranty</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">+1 or +2 Years</h5>
                    <p className="text-[11px] text-slate-600 mt-1">Engine, gearbox &amp; electrical components protected.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Value Care AMC</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">Silver / Gold</h5>
                    <p className="text-[11px] text-slate-600 mt-1">Lubes, filters &amp; wear-tear clutch/brakes covered.</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    handleGenericLeadSubmit({
                      type: 'EXTENDED_WARRANTY',
                      customerName: fd.get('name'),
                      customerPhone: fd.get('phone'),
                      vehicleModel: fd.get('model'),
                      vehicleReg: fd.get('regNo'),
                      notes: `Package: ${fd.get('pkg')}`
                    }, 'Our Warranty Desk will configure your package with official Tata Motors terms.');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" name="name" required placeholder="Name *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                    <input type="tel" name="phone" required placeholder="Mobile Number *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <select name="model" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      {TATA_VEHICLES.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                    <select name="pkg" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      <option>Gold AMC (Full Wear &amp; Tear)</option>
                      <option>Silver AMC (Periodic Service)</option>
                      <option>Extended Warranty (+1-2 Yrs)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                  >
                    {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Enroll in Protection Program'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: 24X7 ROADSIDE ASSISTANCE (RSA) EMERGENCY                         */}
      {/* ========================================================================= */}
      {rsaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => { setRsaModalOpen(false); setFormSuccessMessage(''); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
              <PhoneCall className="w-4 h-4" /> TVS AUTO ASSIST TIE-UP
            </div>
            <h3 className="text-lg font-black text-slate-900">24x7 Roadside Assistance (RSA)</h3>
            
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between gap-2 my-3">
              <div>
                <span className="text-[10px] text-rose-700 font-bold uppercase block">Toll-Free Emergency Line</span>
                <span className="text-xl font-black text-rose-700">1800 209 7979</span>
              </div>
              <a
                href="tel:18002097979"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            </div>

            {/* RSA Price Table */}
            <div className="overflow-x-auto my-3 text-xs">
              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                  <tr>
                    <th className="p-2 border-b border-slate-200">Plan</th>
                    <th className="p-2 border-b border-slate-200">Duration</th>
                    <th className="p-2 border-b border-slate-200">Price (GST Inc.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2 font-semibold">Basic RSA</td>
                    <td className="p-2">6 Months</td>
                    <td className="p-2 font-bold text-slate-900">₹480</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Premium RSA</td>
                    <td className="p-2">6 Months</td>
                    <td className="p-2 font-bold text-slate-900">₹900</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Basic RSA</td>
                    <td className="p-2">1 Year</td>
                    <td className="p-2 font-bold text-slate-900">₹1,040</td>
                  </tr>
                  <tr className="bg-blue-50/70">
                    <td className="p-2 font-bold text-blue-700">Premium 1-Yr (Recommended)</td>
                    <td className="p-2 text-slate-700">1 Year</td>
                    <td className="p-2 font-black text-emerald-700">₹1,795</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {formSuccessMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-700">
                {formSuccessMessage}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  handleGenericLeadSubmit({
                    type: 'ROADSIDE_ASSISTANCE',
                    customerName: fd.get('name'),
                    customerPhone: fd.get('phone'),
                    vehicleReg: fd.get('regNo'),
                    notes: `Plan: ${fd.get('plan')}`
                  }, 'Your 24x7 RSA Policy Request is registered. Dispatch team notified.');
                }}
                className="space-y-2.5 text-xs"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="name" required placeholder="Owner Name *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  <input type="tel" name="phone" required placeholder="Mobile Number *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="regNo" required placeholder="Vehicle Plate (e.g. MP09...)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase font-mono focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  <select name="plan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                    <option>Premium 1 Year (₹1,795)</option>
                    <option>Basic 1 Year (₹1,040)</option>
                    <option>Premium 6 Months (₹900)</option>
                    <option>Basic 6 Months (₹480)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Activate 24x7 RSA Policy'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: TATA MOTORS ASSURED (TMA) CAR EXCHANGE                           */}
      {/* ========================================================================= */}
      {exchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => { setExchangeModalOpen(false); setFormSuccessMessage(''); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
              <RefreshCw className="w-4 h-4" /> TATA MOTORS ASSURED (TMA)
            </div>
            <h3 className="text-lg font-black text-slate-900">Exchange Car &amp; Free Valuation</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Exchange any car for a new Tata with 125-point inspection &amp; up to ₹50,000 exchange bonus.
            </p>

            {formSuccessMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Valuation Scheduled!</h4>
                <p className="text-xs text-slate-600">{formSuccessMessage}</p>
                <button onClick={() => { setExchangeModalOpen(false); setFormSuccessMessage(''); }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-xs">
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  handleGenericLeadSubmit({
                    type: 'EXCHANGE_EVALUATION',
                    customerName: fd.get('name'),
                    customerPhone: fd.get('phone'),
                    vehicleModel: fd.get('oldMakeModel'),
                    notes: `Year: ${fd.get('year')}, KM: ${fd.get('km')}, Target: ${fd.get('targetCar')}`
                  }, 'Our TMA Evaluator will contact you for complimentary 15-min doorstep inspection.');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input type="text" name="name" required placeholder="Owner Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input type="tel" name="phone" required placeholder="10-digit number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Existing Car Model *</label>
                    <input type="text" name="oldMakeModel" required placeholder="e.g. 2018 Swift" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Year</label>
                    <select name="year" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kilometers</label>
                    <input type="text" name="km" placeholder="e.g. 45,000 km" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Desired Tata Car</label>
                    <select name="targetCar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white">
                      {TATA_VEHICLES.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95 shadow-xs"
                >
                  {formSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Get Free Valuation & Bonus'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 9: CUSTOMER EDUCATION HUB (PWA READABLE BOTTOM SHEET)               */}
      {/* ========================================================================= */}
      {customerEducationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => setCustomerEducationModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" /> OWNER KNOWLEDGE BASE
            </div>
            <h3 className="text-lg font-black text-slate-900">Customer Education &amp; Tips</h3>

            <div className="flex border-b border-slate-200 my-3 overflow-x-auto no-scrollbar text-xs font-bold whitespace-nowrap">
              {[
                { id: 'general', label: 'Do’s & Don’ts' },
                { id: 'safety', label: 'Safety Guidelines' },
                { id: 'fuel', label: 'Fuel Saving' },
                { id: 'monsoon', label: 'Monsoon & Fog' },
                { id: 'parts', label: 'OEM Spares' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setEducationActiveTab(tab.id)}
                  className={`py-2 px-3 border-b-2 cursor-pointer transition-colors ${
                    educationActiveTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-700 space-y-3 max-h-72 overflow-y-auto pr-1">
              {educationActiveTab === 'general' && (
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Always start the car from standstill in 1st gear (or D mode).</li>
                  <li>Press clutch pedal fully to floorboard before shifting to avoid synchronizer wear.</li>
                  <li>Maintain 32-36 PSI cold tyre pressure (as stamped on driver B-pillar).</li>
                  <li>Never ride the clutch pedal or rest your foot on it while cruising.</li>
                  <li>Do not spray high-pressure water directly into engine ECU sensor connectors.</li>
                </ul>
              )}
              {educationActiveTab === 'safety' && (
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Fasten seatbelts for all 5 occupants; pre-tensioners calibrate airbag deployment.</li>
                  <li>Use rear ISOFIX mounts for child seats.</li>
                  <li>Do not install metal bullbars; they interfere with front crumple zone timing.</li>
                </ul>
              )}
              {educationActiveTab === 'fuel' && (
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Under-inflated tyres by 4 PSI decrease fuel efficiency by up to 8%.</li>
                  <li>Shift between 1,800 to 2,200 RPM for maximum Revotron/Kryotec efficiency.</li>
                  <li>Turn off engine at red lights if stopped for over 45 seconds.</li>
                </ul>
              )}
              {educationActiveTab === 'monsoon' && (
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Wading limit is 300mm. Do not cross water higher than wheel rim center.</li>
                  <li>If stalled in flood water, <strong className="text-rose-600">NEVER crank the engine</strong> to avoid hydraulic lock.</li>
                  <li>Use low-beam fog lights instead of high beams during heavy Indore rains.</li>
                </ul>
              )}
              {educationActiveTab === 'parts' && (
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Tata Genuine Parts fitted at Shyam Automotive come with 6-month/10,000 km warranty.</li>
                  <li>Non-OEM brake pads contain abrasive composites that score brake rotors.</li>
                </ul>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setCustomerEducationModalOpen(false)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 10: GENUINE ACCESSORIES CATALOG                                     */}
      {/* ========================================================================= */}
      {accessoriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            
            <button onClick={() => setAccessoriesModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> OEM ACCESSORIES
            </div>
            <h3 className="text-lg font-black text-slate-900">Tata Genuine Accessories</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 max-h-72 overflow-y-auto pr-1 text-xs">
              {GENUINE_ACCESSORIES.map(acc => (
                <div key={acc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] font-bold text-blue-600 uppercase">{acc.category}</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">{acc.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{acc.desc}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">{acc.price}</strong>
                    <button
                      onClick={() => handleGenericLeadSubmit({
                        type: 'ACCESSORY_ORDER',
                        customerName: 'Mobile User',
                        customerPhone: '+91-7611120000',
                        notes: `Accessory: ${acc.name} (${acc.code})`
                      }, `Enquiry for ${acc.name} reserved.`)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer shadow-xs"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {formSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-700 font-bold">
                {formSuccessMessage}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 11: AWARDS & ABOUT US                                               */}
      {/* ========================================================================= */}
      {awardsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            <button onClick={() => setAwardsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-3">Awards &amp; Recognition</h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-amber-700 font-bold block">Best Dealership in Central India</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Awarded by Tata Motors Regional Office for exemplary delivery standards.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-blue-700 font-bold block">Customer Delight Score (4.9★)</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Maintained across 1,237 verified Google &amp; Parivahan feedback reviews.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-emerald-700 font-bold block">Electric Vehicle Pioneer Award</span>
                <p className="text-slate-600 text-[11px] mt-0.5">High-voltage certified bays and 800+ EV deliveries across MP.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {aboutUsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            <button onClick={() => setAboutUsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-2">Welcome to Shyam Automotive</h3>
            <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
              <p>Shyam Sangam Group commenced Shyam Automotive on <strong>14th February 2018</strong> as an exclusive Tata Motors dealership.</p>
              <p className="p-2.5 bg-blue-50 border-l-4 border-blue-600 italic text-blue-900">
                "Where your satisfaction is valued more than your money."
              </p>
              <p>We believe every customer deserves honest vehicle consultation, genuine parts, and prompt after-sales service across Indore, Dhar, Kukshi, and Badnawar.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 12: OFFERS & FESTIVE SCHEMES                                        */}
      {/* ========================================================================= */}
      {offersModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            <button onClick={() => setOffersModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-3">Current Tata Motors Offers</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-rose-700 font-bold block">Curvv Coupe SUV Launch Benefit</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Priority Delivery + ₹25,000 Exchange Upgrade</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-blue-700 font-bold block">Nexon &amp; Harrier Festive Drive</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Up to ₹65,000 Benefits (Cash + Exchange Bonus)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-emerald-700 font-bold block">Green EV Rebate</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Free 7.2 kW Home Fast Charger with Tiago.ev, Punch.ev &amp; Nexon.ev</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 13: LEGAL & POLICIES                                                */}
      {/* ========================================================================= */}
      {policyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full border border-slate-200 p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />
            <button onClick={() => setPolicyModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 uppercase mb-2">{currentPolicy}</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              {currentPolicy === 'privacy' && <p>Shyam Automotive respects user privacy. No personal phone numbers or identification details are shared or leased to third-party telemarketing networks.</p>}
              {currentPolicy === 'disclaimer' && <p>All vehicle specifications, features, and prices shown are indicative and subject to change by Tata Motors Limited without prior notice.</p>}
              {currentPolicy === 'refund' && <p>New car reservation refunds are processed within 7 working days via RTGS/NEFT as per standard Tata Motors guidelines.</p>}
              {currentPolicy === 'terms' && <p>Vehicle delivery is subject to realization of full payment and completion of RTO registration formality as required by MP Motor Vehicles Department regulations.</p>}
              {currentPolicy === 'shipping' && <p>Complimentary doorstep vehicle pickup &amp; drop service is available within Indore municipal limits.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 14: GLOBAL SEARCH                                                   */}
      {/* ========================================================================= */}
      {globalSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center p-3 pt-16">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 p-4 shadow-2xl relative">
            <button onClick={() => setGlobalSearchOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search cars, services, hubs, RSA, or tips..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <button onClick={() => { setGlobalSearchOpen(false); setServiceBookingModalOpen(true); }} className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-600" /> Book Doorstep Service</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => { setGlobalSearchOpen(false); setStatusBoardType('RTO'); setStatusBoardModalOpen(true); }} className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><Compass className="w-4 h-4 text-cyan-600" /> RTO Status Board (MP-09)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => { setGlobalSearchOpen(false); setRsaModalOpen(true); }} className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-rose-600" /> 24x7 Roadside Assistance</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => { setGlobalSearchOpen(false); setExchangeModalOpen(true); }} className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-purple-600" /> TMA Exchange Car Valuation</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 15: VEHICLE VARIANT DECISION HUB & ON-ROAD CALCULATOR               */}
      {/* ========================================================================= */}
      {variantModalOpen && (
        <VehicleDetailVariantModal
          vehicleId={selectedCarForDetail?.id}
          onClose={() => setVariantModalOpen(false)}
          onBookTestDrive={(car) => {
            setVariantModalOpen(false);
            setSelectedCarForTD(car);
            setTestDriveModalOpen(true);
          }}
          onOpenEmi={(car) => {
            setVariantModalOpen(false);
            setSelectedCarForEMI(car);
            setLoanPrice(car.priceStarting);
            setEmiModalOpen(true);
          }}
        />
      )}

    </div>
  );
}
