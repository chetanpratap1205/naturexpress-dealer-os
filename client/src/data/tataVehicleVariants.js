// Comprehensive Tata Motors Vehicle & Variant Intelligence Database
// Configured with official Ex-Showroom prices and Indore (MP09) RTO tax structures

export const TATA_VEHICLE_VARIANTS_DB = {
  'nexon-ice': {
    id: 'nexon-ice',
    name: 'Tata Nexon (ICE)',
    tagline: 'India’s #1 Compact SUV • 5-Star BNCAP Certified',
    segment: 'Compact SUV',
    startingPrice: 799000,
    rtoRatePct: 8.0, // MP RTO Private Petrol/Diesel slab
    insuranceBase: 38000,
    fuelOptions: ['Petrol (1.2L Turbo)', 'Diesel (1.5L Revotorq)', 'iCNG (Dual-Cylinder)'],
    transmissions: ['6-Speed Manual (MT)', '6-Speed AMT', '7-Speed Dual Clutch (DCA) with Paddles'],
    colors: [
      { name: 'Creative Ocean', hex: '#1e3a5f' },
      { name: 'Fearless Purple', hex: '#4a2c5a' },
      { name: 'Flame Red', hex: '#c0262d' },
      { name: 'Daytona Grey', hex: '#4b5563' },
      { name: 'Pristine White', hex: '#f8fafc' },
      { name: 'Atlas Black (Dark Edition)', hex: '#0f172a' }
    ],
    specs: {
      engine: '1.2L Turbo Revotron Petrol / 1.5L Turbo Revotorq Diesel',
      power: '120 PS @ 5500 RPM (Petrol) / 115 PS @ 3750 RPM (Diesel)',
      torque: '170 Nm @ 1750-4000 RPM (Petrol) / 260 Nm @ 1500-2750 RPM (Diesel)',
      mileage: '17.4 kmpl (Petrol) / 23.2 kmpl (Diesel) ARAI',
      lengthWidthHeight: '3995 mm × 1804 mm × 1620 mm',
      wheelbase: '2498 mm',
      groundClearance: '208 mm (Class-Leading)',
      bootSpace: '382 Litres (Expandable with 60:40 Split)',
      fuelTank: '44 Litres',
      safety: '5-Star Bharat NCAP (Highest Adult & Child Protection) • 6 Airbags Standard'
    },
    decoderInfo: {
      title: 'How to Read Tata Nexon Variant Names:',
      rules: [
        { code: 'Smart / Pure / Creative / Fearless', desc: 'Core Persona tier (from essential safety to full luxury)' },
        { code: '+', desc: 'Technology & Infotainment Upgrade Pack (High-res screens & cameras)' },
        { code: 'S', desc: 'Voice-Assisted Electric Sunroof with anti-pinch' },
        { code: 'DCA', desc: '7-Speed Dual Clutch Automatic Transmission with Wet-Clutch technology' },
        { code: 'Dark', desc: 'Oberon Black exterior, Charcoal 16" alloys & black interior styling' }
      ]
    },
    buyerPersonas: [
      {
        profile: 'Family First / High Value for Money',
        recommendation: 'Creative+ S (Petrol MT / DCA)',
        reason: 'Gives you 360° 3D camera, 10.25" Cinematic Harman screen, electric sunroof, and auto headlamps without paying the premium for leatherette seats.'
      },
      {
        profile: 'Strict Budget Conscious',
        recommendation: 'Smart+ S or Pure S',
        reason: 'Gets 6 Airbags, ESP, LED headlamps, 7" touchscreen with Apple CarPlay, and electric sunroof under ₹10 Lakhs on-road.'
      },
      {
        profile: 'Tech Lover / Daily Highway Cruiser',
        recommendation: 'Fearless+ LUX S (DCA)',
        reason: 'Ventilated front cooling seats, JBL subwoofer audio, air purifier, paddle shifters, and wireless charging for zero fatigue.'
      }
    ],
    variants: [
      {
        id: 'nexon-smart',
        name: 'Smart',
        price: 799000,
        fuel: 'Petrol',
        transmission: 'Manual',
        badge: 'BUDGET FRIENDLY',
        highlights: ['6 Airbags (Standard)', 'Electronic Stability Program (ESP)', 'LED Headlamps & DRLs', 'Multi-Drive Modes (Eco, City, Sport)', 'Front Power Windows'],
        addedOverPrevious: 'Baseline Standard Safety Platform'
      },
      {
        id: 'nexon-smart-plus-s',
        name: 'Smart+ S',
        price: 939000,
        fuel: 'Petrol',
        transmission: 'Manual',
        badge: 'POPULAR ENTRY',
        highlights: ['Voice-Assisted Electric Sunroof', '7" Touchscreen Infotainment', 'Wireless Android Auto & Apple CarPlay', 'Shark Fin Antenna', 'Steering Mounted Controls'],
        addedOverPrevious: 'Adds Sunroof, 7" Touchscreen, Smartphone Connectivity & Steering Controls over Smart'
      },
      {
        id: 'nexon-pure-s',
        name: 'Pure S',
        price: 1029000,
        fuel: 'Petrol',
        transmission: 'Manual',
        badge: 'SENSIBLE UPGRADE',
        highlights: ['Voice Sunroof', 'Bi-Function Full LED Headlamps', 'Rear AC Vents', 'Wheel Covers & Roof Rails', 'Rear USB-C Fast Charger'],
        addedOverPrevious: 'Adds Rear AC Vents, Bi-Function LED Headlamps, Roof Rails, and Comfort Pack over Smart+'
      },
      {
        id: 'nexon-creative',
        name: 'Creative',
        price: 1109000,
        fuel: 'Petrol / Diesel',
        transmission: 'Manual / AMT / DCA',
        badge: 'CORE SWEET SPOT',
        highlights: ['10.25" Floating Harman Touchscreen', 'Sequential LED Indicators', '16" Diamond Cut Alloy Wheels', 'Reverse Parking Camera', 'Automatic Climate Control', 'Push Button Start/Stop'],
        addedOverPrevious: 'Major upgrade: 10.25" HD Screen, 16" Alloy Wheels, Reverse Cam, Auto AC, Sequential Turn Signals'
      },
      {
        id: 'nexon-creative-plus-s',
        name: 'Creative+ S',
        price: 1229000,
        fuel: 'Petrol / Diesel',
        transmission: 'Manual / DCA Dual Clutch',
        badge: '★ BEST VALUE FOR MONEY (VFM)',
        highlights: ['360° Surround Camera with Blind View Monitor', 'Voice-Assisted Sunroof', 'Front Parking Sensors', 'Wireless Smartphone Charger', 'Auto Headlamps & Rain Sensing Wipers', 'Tyre Pressure Monitoring (TPMS)'],
        addedOverPrevious: 'Adds 360° 3D Camera, Blind Spot Monitor, Wireless Charger, Auto Rain/Light Sensors, Front Sensors over Creative'
      },
      {
        id: 'nexon-fearless-plus-s',
        name: 'Fearless+ S',
        price: 1379000,
        fuel: 'Petrol / Diesel',
        transmission: 'Manual / DCA Dual Clutch',
        badge: 'PREMIUM LUXURY',
        highlights: ['Ventilated Front Seats (Cooling)', 'Air Purifier with AQI Display', 'JBL™ 8-Speaker Audio with Subwoofer', 'Leatherette Grand Console', 'Connected Car Technology (iRA 2.0)'],
        addedOverPrevious: 'Adds Ventilated Seats, Air Purifier, JBL Subwoofer Sound, iRA 2.0 Connected Tech over Creative+'
      },
      {
        id: 'nexon-fearless-plus-lux-s',
        name: 'Fearless+ LUX S (Top Model)',
        price: 1479000,
        fuel: 'Petrol / Diesel',
        transmission: '7-Speed DCA Automatic',
        badge: 'FLAGSHIP TECH',
        highlights: ['Dual-Tone Contrast Roof', 'Full Benecke-Kaliko™ Leatherette Upholstery', 'E-Shifter with Paddle Shifters', 'Navigation on Driver Instrument Cluster', 'Express Cooling'],
        addedOverPrevious: 'Top-of-the-line: Full Leatherette Cabin, In-Cluster Navigation, E-Shifter, Luxury Acoustic Glass'
      }
    ]
  },

  'curvv-ice': {
    id: 'curvv-ice',
    name: 'Tata Curvv (Coupe SUV)',
    tagline: 'Shaped to Stun • India’s 1st Coupe SUV • 5-Star BNCAP',
    segment: 'Coupe SUV',
    startingPrice: 999000,
    rtoRatePct: 8.5,
    insuranceBase: 44000,
    fuelOptions: ['1.2L Revotron Petrol', '1.2L Hyperion Turbo GDi Petrol', '1.5L Kryojet Diesel'],
    transmissions: ['6-Speed Manual', '7-Speed Wet-Clutch DCA Dual Clutch'],
    colors: [
      { name: 'Virtual Sunrise', hex: '#d97706' },
      { name: 'Gold Essence', hex: '#ca8a04' },
      { name: 'Cosmic Gold', hex: '#b45309' },
      { name: 'Daytona Grey', hex: '#4b5563' },
      { name: 'Pristine White', hex: '#f8fafc' },
      { name: 'Opera White', hex: '#f1f5f9' }
    ],
    specs: {
      engine: '1.2L Hyperion GDi Turbo (125 PS) / 1.5L Kryojet Diesel (118 PS)',
      power: '125 PS @ 5000 RPM (Hyperion) / 118 PS @ 4000 RPM (Diesel)',
      torque: '225 Nm @ 1750-3000 RPM (Hyperion) / 260 Nm (Diesel)',
      mileage: '15.6 kmpl (Petrol) / 19.8 kmpl (Diesel) ARAI',
      lengthWidthHeight: '4308 mm × 1810 mm × 1630 mm',
      wheelbase: '2560 mm',
      groundClearance: '208 mm (Best in Segment)',
      bootSpace: '500 Litres (Segment Largest with Powered Tailgate)',
      fuelTank: '44 Litres',
      safety: '5-Star Bharat NCAP Certified • Level 2 ADAS (20 Functions)'
    },
    decoderInfo: {
      title: 'Tata Curvv Variant Hierarchy:',
      rules: [
        { code: 'Smart', desc: 'Entry coupe stance with 6 Airbags & flush door handles' },
        { code: 'Pure+ / Pure+ S', desc: 'Adds 10.25" touchscreen, cruise control and sunroof' },
        { code: 'Creative / Creative+ S', desc: 'Adds 17" alloy wheels, 360° camera and dual-tone styling' },
        { code: 'Accomplished S / Accomplished+ A', desc: 'Adds Level 2 ADAS, gesture tailgate, ventilated seats and 12.3" Cinematic display' }
      ]
    },
    buyerPersonas: [
      {
        profile: 'Urban Executive / Style Conscious',
        recommendation: 'Creative+ S (Hyperion GDi DCA)',
        reason: 'Unbeatable road presence with 17" alloys, panoramic sunroof, 360° camera and 7-speed dual clutch response.'
      },
      {
        profile: 'Highway Cruiser / Safety First',
        recommendation: 'Accomplished+ A (Diesel / GDi)',
        reason: 'Comes with full Level 2 ADAS suite (Adaptive Cruise, AEB, Lane Keep) and gesture-controlled tailgate.'
      }
    ],
    variants: [
      {
        id: 'curvv-smart',
        name: 'Smart',
        price: 999000,
        fuel: 'Petrol',
        transmission: 'Manual',
        badge: 'COUPE STANCE ENTRY',
        highlights: ['6 Airbags (Standard)', 'Flush Door Handles with Welcome Light', 'LED Headlamps & DRLs', 'Multi-Drive Modes', 'Electronic Stability Program (ESP)'],
        addedOverPrevious: 'Baseline Coupe Platform'
      },
      {
        id: 'curvv-pure-plus-s',
        name: 'Pure+ S',
        price: 1169000,
        fuel: 'Petrol / Diesel',
        transmission: 'Manual / DCA',
        badge: 'POPULAR CHOICE',
        highlights: ['Voice-Assisted Panoramic Sunroof', '10.25" Floating Harman Display', 'Wireless Android Auto & Apple CarPlay', 'Cruise Control', 'Paddle Shifters (DCA)'],
        addedOverPrevious: 'Adds Panoramic Sunroof, 10.25" Touchscreen, Cruise Control & Paddle Shifters'
      },
      {
        id: 'curvv-creative-plus-s',
        name: 'Creative+ S',
        price: 1369000,
        fuel: 'Petrol / Diesel',
        transmission: 'Manual / DCA',
        badge: '★ BEST VALUE FOR MONEY (VFM)',
        highlights: ['360° 3D Surround Camera with Blind View Monitor', '17" Hyper-Style Alloy Wheels', 'Sequential LED DRLs', 'Tyre Pressure Monitoring (TPMS)', 'Auto Dimming IRVM'],
        addedOverPrevious: 'Adds 360° Camera, 17" Alloys, Sequential DRLs, TPMS, Auto Dimming Mirror'
      },
      {
        id: 'curvv-accomplished-plus-a',
        name: 'Accomplished+ A (Top Model)',
        price: 1769000,
        fuel: '1.2L Hyperion GDi / Diesel',
        transmission: '7-Speed DCA Dual Clutch',
        badge: 'FLAGSHIP ADAS',
        highlights: ['Level 2 ADAS (20 Autonomous Features)', 'Gesture-Controlled Powered Tailgate', '12.3" Cinematic Touchscreen', 'Ventilated Front Seats', 'JBL 9-Speaker Audio with Subwoofer'],
        addedOverPrevious: 'Top Flagship: Full Level 2 ADAS, Powered Gesture Tailgate, 12.3" Screen, Ventilated Seats, JBL Subwoofer'
      }
    ]
  },

  'harrier': {
    id: 'harrier',
    name: 'Tata Harrier',
    tagline: 'Born of Land Rover D8 OMEGARC Pedigree • 5-Star BNCAP Highest Score',
    segment: 'Mid-Size Luxury SUV',
    startingPrice: 1499000,
    rtoRatePct: 9.0,
    insuranceBase: 58000,
    fuelOptions: ['2.0L Kryotec Turbo Diesel (170 PS)'],
    transmissions: ['6-Speed Manual', '6-Speed Torque Converter AT with E-Shifter'],
    colors: [
      { name: 'Sunlit Yellow', hex: '#eab308' },
      { name: 'Oberon Black (Dark Edition)', hex: '#0f172a' },
      { name: 'Seaweed Green', hex: '#166534' },
      { name: 'Ash Grey', hex: '#4b5563' },
      { name: 'Pristine White', hex: '#f8fafc' }
    ],
    specs: {
      engine: '2.0L Kryotec Turbocharged Diesel Engine',
      power: '170 PS @ 3750 RPM',
      torque: '350 Nm @ 1750-2500 RPM',
      mileage: '16.8 kmpl (ARAI Certified)',
      lengthWidthHeight: '4605 mm × 1922 mm × 1718 mm',
      wheelbase: '2741 mm',
      groundClearance: '205 mm',
      bootSpace: '445 Litres (Expandable to 815 Litres)',
      fuelTank: '50 Litres',
      safety: '5-Star Bharat NCAP (Highest Ever Safety Score in India) • 7 Airbags Standard on Top Tiers'
    },
    decoderInfo: {
      title: 'Harrier Persona Architecture:',
      rules: [
        { code: 'Smart', desc: 'D8 platform base with 6 Airbags and 17" alloy wheels' },
        { code: 'Pure+ S', desc: 'Adds Panoramic Sunroof and 10.25" touchscreen' },
        { code: 'Adventure+ / Dark', desc: 'Adds 18" Diamond Cut alloys, 360° camera, E-Shifter and Terrain modes' },
        { code: 'Fearless+ / Dark', desc: 'Adds Level 2 ADAS with Stop & Go, 7 Airbags, JBL 10-speaker system and dual-zone climate' }
      ]
    },
    buyerPersonas: [
      {
        profile: 'Power & Status / Long Distance Cruiser',
        recommendation: 'Adventure+ Dark (AT)',
        reason: 'Gives the iconic Dark Edition blacked-out stance, 18" wheels, 360° camera and E-Shifter automatic at an optimum price.'
      },
      {
        profile: 'Executive Flagship / Zero Compromise',
        recommendation: 'Fearless+ Dark (AT)',
        reason: 'Level 2 ADAS (Adaptive Cruise Control), ventilated seating, 10-speaker JBL audio with subwoofer, and 7 airbags.'
      }
    ],
    variants: [
      {
        id: 'harrier-smart',
        name: 'Smart',
        price: 1499000,
        fuel: 'Diesel',
        transmission: 'Manual',
        badge: 'LAND ROVER GENES',
        highlights: ['6 Airbags Standard', 'Electronic Stability Program (ESP)', 'All-Wheel Disc Brakes', 'LED Projector Headlamps', 'Tilt & Telescopic Steering'],
        addedOverPrevious: 'Baseline OMEGARC D8 Platform'
      },
      {
        id: 'harrier-pure-plus-s',
        name: 'Pure+ S',
        price: 1749000,
        fuel: 'Diesel',
        transmission: 'Manual / AT',
        badge: 'POPULAR UPGRADE',
        highlights: ['Voice-Controlled Panoramic Sunroof with Mood Lighting', '10.25" Harman Touchscreen Display', 'Wireless Apple CarPlay & Android Auto', 'Reverse Parking Camera', 'Electrically Foldable ORVMs'],
        addedOverPrevious: 'Adds Panoramic Sunroof, 10.25" Touchscreen, Wireless Phone Mirroring & Reverse Camera'
      },
      {
        id: 'harrier-adventure-plus',
        name: 'Adventure+ (or Dark)',
        price: 2019000,
        fuel: 'Diesel',
        transmission: '6-Speed AT with E-Shifter',
        badge: '★ BEST VALUE FOR MONEY (VFM)',
        highlights: ['360° 3D Surround Camera with Blind View', '18" Diamond Cut Alloys (Charcoal on Dark)', 'Terrain Response Modes (Normal, Rough, Wet)', 'Electronic Shifter with Paddle Shifters', 'Front Parking Sensors'],
        addedOverPrevious: 'Adds 360° 3D Camera, 18" Alloys, Terrain Modes, E-Shifter Automatic, Front Sensors'
      },
      {
        id: 'harrier-fearless-plus',
        name: 'Fearless+ Dark (Top Flagship)',
        price: 2449000,
        fuel: 'Diesel',
        transmission: '6-Speed AT',
        badge: 'ULTIMATE LUXURY & ADAS',
        highlights: ['Level 2 ADAS (11 Autonomous Functions with Stop & Go)', '7 Airbags (including Driver Knee Airbag)', 'JBL 10-Speaker Audio with Subwoofer', 'Ventilated Front Seats with Memory', 'Dual-Zone Fully Automatic AC', 'Gesture Powered Tailgate'],
        addedOverPrevious: 'Top Flagship: Full Level 2 ADAS, 7 Airbags, JBL 10-Speaker, Ventilated Memory Seats, Gesture Tailgate'
      }
    ]
  },

  'punch-ice': {
    id: 'punch-ice',
    name: 'Tata Punch',
    tagline: 'Vibes with Your Vibe • Sub-Compact SUV • 5-Star BNCAP',
    segment: 'Sub-Compact SUV',
    startingPrice: 612000,
    rtoRatePct: 7.5,
    insuranceBase: 28000,
    fuelOptions: ['1.2L Revotron Petrol', 'Dual-Cylinder iCNG'],
    transmissions: ['5-Speed Manual', '5-Speed AMT Automatic with Traction Pro'],
    colors: [
      { name: 'Atomic Orange', hex: '#ea580c' },
      { name: 'Tropical Mist', hex: '#0d9488' },
      { name: 'Daytona Grey', hex: '#4b5563' },
      { name: 'Orcus White', hex: '#f8fafc' },
      { name: 'Calypso Red', hex: '#b91c1c' }
    ],
    specs: {
      engine: '1.2L Revotron 3-Cylinder Petrol / Twin-Cylinder iCNG',
      power: '88 PS @ 6000 RPM (Petrol) / 73.5 PS (CNG)',
      torque: '115 Nm @ 3250 RPM (Petrol) / 103 Nm (CNG)',
      mileage: '18.8 kmpl (Petrol) / 26.99 km/kg (iCNG) ARAI',
      lengthWidthHeight: '3827 mm × 1742 mm × 1615 mm',
      wheelbase: '2445 mm',
      groundClearance: '187 mm (SUV Ground Clearance)',
      bootSpace: '366 Litres (210L in iCNG with uncompromised boot floor)',
      fuelTank: '37 Litres / 60 Litres Water Capacity CNG',
      safety: '5-Star Bharat NCAP Certified • ALFA Architecture'
    },
    decoderInfo: {
      title: 'Tata Punch Variant Guide:',
      rules: [
        { code: 'Pure', desc: 'Essential 5-star SUV platform with dual airbags & ABS' },
        { code: 'Adventure', desc: 'Adds 4 speakers, steering controls, remote key & all power windows' },
        { code: 'Accomplished', desc: 'Adds 10.25" touchscreen, reverse camera, push start and cruise control' },
        { code: 'Creative', desc: 'Adds 16" diamond-cut alloys, projector lamps, auto wipers and climate control' },
        { code: 'Sunroof', desc: 'Voice-assisted electric sunroof available across Adventure, Accomplished & Creative' }
      ]
    },
    buyerPersonas: [
      {
        profile: 'Daily City Commuter / First Time Car Buyer',
        recommendation: 'Adventure Rhythm (Petrol MT / AMT)',
        reason: 'Most balanced package under ₹7.5 Lakhs: 7" Harman screen, reverse camera, steering controls, and 5-star crash safety.'
      },
      {
        profile: 'Feature-Packed Family Cruiser',
        recommendation: 'Accomplished Dazzle Sunroof',
        reason: 'Includes electric voice sunroof, 16" alloy wheels, 10.25" display, reverse camera, and cruise control.'
      }
    ],
    variants: [
      {
        id: 'punch-pure',
        name: 'Pure',
        price: 612000,
        fuel: 'Petrol',
        transmission: 'Manual',
        badge: 'MOST ACCESSIBLE 5-STAR',
        highlights: ['Dual Airbags (Standard)', 'ABS with EBD & Corner Stability Control', 'Front Power Windows', 'Tilt Steering', '90° Wide Opening Doors'],
        addedOverPrevious: 'Baseline ALFA Platform'
      },
      {
        id: 'punch-adventure-rhythm',
        name: 'Adventure Rhythm',
        price: 729000,
        fuel: 'Petrol / iCNG',
        transmission: 'Manual / AMT',
        badge: '★ BEST BUDGET SWEET SPOT',
        highlights: ['7" Touchscreen Infotainment', 'Reverse Parking Camera', '4 Speakers + 2 Tweeters', 'Steering Mounted Controls', 'All 4 Power Windows & Remote Key'],
        addedOverPrevious: 'Adds 7" Screen, Reverse Cam, Steering Controls, All Power Windows over Pure'
      },
      {
        id: 'punch-accomplished-sunroof',
        name: 'Accomplished Sunroof',
        price: 849000,
        fuel: 'Petrol / iCNG',
        transmission: 'Manual / AMT',
        badge: 'POPULAR VFM WITH SUNROOF',
        highlights: ['Voice-Assisted Electric Sunroof', '10.25" Floating Harman Touchscreen', 'Cruise Control', 'Push Button Engine Start/Stop', 'Height Adjustable Driver Seat'],
        addedOverPrevious: 'Adds Voice Sunroof, 10.25" Screen, Push Button Start, Cruise Control over Adventure'
      },
      {
        id: 'punch-creative-flagship',
        name: 'Creative Flagship (Top Model)',
        price: 959000,
        fuel: 'Petrol / iCNG',
        transmission: 'Manual / AMT',
        badge: 'TOP LUXURY PUNCH',
        highlights: ['16" Diamond Cut Alloy Wheels', 'Projector Headlamps with LED DRLs', 'Automatic Climate Control', 'Rain Sensing Wipers & Auto Headlamps', 'Cooled Glovebox & Leather Wrapped Steering'],
        addedOverPrevious: 'Top Model: 16" Alloys, Projector Lamps, Auto Climate Control, Rain/Light Sensors'
      }
    ]
  },

  'curvv-ev': {
    id: 'curvv-ev',
    name: 'Tata Curvv.ev (Pure Electric)',
    tagline: 'Born Electric Coupe SUV • acti.ev Platform • 502 km Range',
    segment: 'Electric Coupe SUV',
    startingPrice: 1749000,
    rtoRatePct: 4.0, // MP EV incentive RTO
    insuranceBase: 48000,
    fuelOptions: ['100% Electric (45 kWh & 55 kWh Battery Packs)'],
    transmissions: ['Single-Speed Intelligent E-Drive'],
    colors: [
      { name: 'Empowered Oxide', hex: '#64748b' },
      { name: 'Pure Grey', hex: '#94a3b8' },
      { name: 'Virtual Sunrise', hex: '#d97706' },
      { name: 'Pristine White', hex: '#f8fafc' }
    ],
    specs: {
      engine: 'Permanent Magnet Synchronous Motor (PMSM)',
      power: '167 PS (55 kWh) / 150 PS (45 kWh)',
      torque: '215 Nm Instantaneous Torque',
      mileage: '502 km (55 kWh) / 430 km (45 kWh) ARAI Certified Range',
      lengthWidthHeight: '4310 mm × 1810 mm × 1637 mm',
      wheelbase: '2560 mm',
      groundClearance: '190 mm',
      bootSpace: '500 Litres + 35L Front Trunk (Frunk)',
      fuelTank: 'N/A (Liquid-Cooled IP67 Battery)',
      safety: '5-Star Bharat NCAP • 6 Airbags Standard • Level 2 ADAS'
    },
    decoderInfo: {
      title: 'Curvv.ev Model Decoder:',
      rules: [
        { code: 'Creative 45', desc: '45 kWh battery, 430 km range with 10.25" screen' },
        { code: 'Accomplished 55', desc: '55 kWh long range, V2L/V2V vehicle powerbank, panoramic sunroof' },
        { code: 'Empowered+ A 55', desc: '55 kWh, Level 2 ADAS, Arcade.ev gaming, ventilated seats & gesture tailgate' }
      ]
    },
    buyerPersonas: [
      {
        profile: 'Long Range Highway Electric Traveler',
        recommendation: 'Accomplished 55',
        reason: '502 km real-world range capability, 70kW DC ultra-fast charging, and V2L vehicle-to-load powerbank.'
      },
      {
        profile: 'Maximum Autonomous Safety & Tech',
        recommendation: 'Empowered+ A 55',
        reason: 'Complete Level 2 ADAS suite, gesture tailgate, ventilated front seats, and JBL acoustic audio.'
      }
    ],
    variants: [
      {
        id: 'curvv-ev-creative-45',
        name: 'Creative 45',
        price: 1749000,
        fuel: 'Electric (45 kWh)',
        transmission: 'E-Drive',
        badge: 'ACCESSIBLE COUPE EV',
        highlights: ['430 km ARAI Certified Range', '10.25" Cinematic Harman Display', 'Paddle Regenerative Braking', '6 Airbags (Standard)', 'V2L & V2V Capable'],
        addedOverPrevious: 'Baseline acti.ev Platform'
      },
      {
        id: 'curvv-ev-accomplished-55',
        name: 'Accomplished 55',
        price: 1929000,
        fuel: 'Electric (55 kWh)',
        transmission: 'E-Drive',
        badge: '★ BEST VALUE FOR MONEY (VFM)',
        highlights: ['502 km ARAI Long Range', 'Voice-Assisted Panoramic Sunroof', '17" Aero Alloy Wheels', '360° 3D Surround Camera', 'Wireless Smartphone Charger'],
        addedOverPrevious: 'Adds 55 kWh Battery (502 km Range), Panoramic Sunroof, 17" Aero Alloys, 360° Camera'
      },
      {
        id: 'curvv-ev-empowered-plus-a-55',
        name: 'Empowered+ A 55 (Top Model)',
        price: 2199000,
        fuel: 'Electric (55 kWh)',
        transmission: 'E-Drive',
        badge: 'FLAGSHIP ADAS EV',
        highlights: ['Level 2 ADAS (20 Autonomous Functions)', 'Gesture-Controlled Powered Tailgate', '12.3" Touchscreen + Arcade.ev Suite', 'Ventilated Front Seats', 'JBL 9-Speaker Audio with Subwoofer'],
        addedOverPrevious: 'Top Flagship: Level 2 ADAS, Gesture Tailgate, 12.3" Screen, Ventilated Seats, JBL Subwoofer'
      }
    ]
  }
};

// Helper function to calculate exact Indore On-Road price
export function calculateIndoreOnRoadPrice(vehicleId, variantId, options = {}) {
  const vehicle = TATA_VEHICLE_VARIANTS_DB[vehicleId] || TATA_VEHICLE_VARIANTS_DB['nexon-ice'];
  const variant = vehicle.variants.find(v => v.id === variantId) || vehicle.variants[0];

  const exShowroom = variant.price;
  
  // MP09 RTO Registration Charges
  const rtoTax = Math.round(exShowroom * (vehicle.rtoRatePct / 100));
  
  // Comprehensive 1+3 Year Tata Care Zero-Dep Insurance
  const insurance = Math.round(vehicle.insuranceBase + (exShowroom * 0.015));
  
  // Mandatory FASTag & HSRP Plate charges
  const fastagHsrp = 1500;
  
  // Tax Collected at Source (TCS) 1% if Ex-Showroom > 10 Lakhs
  const tcs = exShowroom > 1000000 ? Math.round(exShowroom * 0.01) : 0;
  
  // Optional Extended Warranty & Accessories
  const extendedWarranty = options.includeEW ? 18500 : 0;
  const accessoriesPack = options.includeAccessories ? 14999 : 0;
  
  const totalOnRoad = exShowroom + rtoTax + insurance + fastagHsrp + tcs + extendedWarranty + accessoriesPack;
  
  // Monthly EMI estimation: 20% down payment, 8.5% interest, 5 years (60 months)
  const principal = totalOnRoad * 0.8;
  const monthlyRate = 0.085 / 12;
  const emiMonths = options.tenureMonths || 60;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, emiMonths)) /
    (Math.pow(1 + monthlyRate, emiMonths) - 1)
  );

  return {
    vehicleName: vehicle.name,
    variantName: variant.name,
    exShowroom,
    rtoTax,
    insurance,
    fastagHsrp,
    tcs,
    extendedWarranty,
    accessoriesPack,
    totalOnRoad,
    downPayment20Pct: Math.round(totalOnRoad * 0.2),
    estimatedMonthlyEmi: emi,
    badge: variant.badge
  };
}
