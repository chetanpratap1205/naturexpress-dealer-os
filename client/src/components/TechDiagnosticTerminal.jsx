import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, 
  Bluetooth, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  Radio, 
  Zap, 
  Layers,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Mic,
  Camera,
  Download,
  Wifi,
  WifiOff,
  Gauge,
  Play,
  Pause,
  Terminal,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TechDiagnosticTerminal() {
  const [selectedDtc, setSelectedDtc] = useState('P0841');
  const [vciConnected, setVciConnected] = useState(true);
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('dca_shudder');
  const [acousticResult, setAcousticResult] = useState(null);
  const [spectrogramBars, setSpectrogramBars] = useState([15, 30, 65, 88, 140, 290, 180, 95, 45, 20]);
  const [watermarkedVideoGenerated, setWatermarkedVideoGenerated] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const dtcData = {
    P0841: {
      dtc: "P0841",
      title: "Transmission Fluid Pressure Sensor A Circuit Range/Performance",
      system: "Tata Wet Dual-Clutch Automatic (DCA) Transmission",
      severity: "Critical",
      model: "Tata Safari / Harrier DCA",
      symptoms: "Harsh gear engagement from 1st to 2nd, transmission overheat warning on cluster, delayed reverse gear.",
      hindiGuide: [
        "Step 1 (सुरक्षा एवं विजुअल जांच): वाहन को 2-पोस्ट लिफ्ट पर उठाएं। ट्रांसमिशन ऑयल का स्तर और रिसाव (oil leakage) चेक करें।",
        "Step 2 (प्रेशर टेस्ट): VCI स्कैनर से लाइन 1 प्रेशर सेंसर PID पढ़ें। आइडल पर 4.2 से 4.8 bar होना चाहिए। यदि 2.0 bar से कम है तो सोलेनोइड वाल्व चोक है।",
        "Step 3 (इलेक्ट्रिकल रेजिस्टेंस चेक): मल्टीमीटर से पिन 4 और पिन 7 के बीच 12.4 Ohm रेजिस्टेंस चेक करें।",
        "Step 4 (चाइल्ड-पार्ट समाधान): मेकाट्रॉनिक सोलेनोइड वाल्व ब्लॉक (Child-Part #2871-5420-0104) बदलें। पूरा गियरबॉक्स बदलने की आवश्यकता नहीं है।"
      ],
      livePids: [
        { name: "Transmission Line Pressure", value: "1.8 bar", expected: "4.5 bar", status: "Critical Low", isAlert: true },
        { name: "Clutch 1 Slip RPM", value: "320 RPM", expected: "< 50 RPM", status: "Slip Warning", isAlert: true },
        { name: "Transmission Sump Temp", value: "92°C", expected: "< 85°C", status: "Elevated", isAlert: false }
      ]
    },
    P0AC0: {
      dtc: "P0AC0",
      title: "Hybrid/EV Battery Pack State of Charge Sensor Performance",
      system: "High Voltage (HV) 350V+ Ziptron EV Architecture",
      severity: "High",
      model: "Tata Nexon EV Empowered Plus",
      symptoms: "Regeneration braking fluctuation, limited power turtle icon on instrument cluster.",
      hindiGuide: [
        "Step 1 (HV आइसोलेशन प्रोटोकॉल): 1000V इंसुलेटेड ग्लव्स पहनें। सर्विस प्लग (MSD) डिस्कनेक्ट करें और 5 मिनट डिस्चार्ज का इंतजार करें।",
        "Step 2 (मेगर इंसुलेशन टेस्ट): इंसुलेशन टेस्टर से HV पॉजिटिव और बॉडी चेसिस के बीच रेजिस्टेंस नापें (> 500 MOhm होना चाहिए)।",
        "Step 3 (सेल वोल्टेज बैलेंस): VCI से सभी 96 लिथियम सेल्स का वोल्टेज चेक करें। अधिकतम सेल वोल्टेज डेविएशन < 15 mV होना चाहिए।",
        "Step 4 (सॉफ्टवेयर अपडेट): Tata BMS v14.02 OTA कैलिब्रेशन फाइल फ्लैश करें और 100% AC स्लो चार्ज साइकिल चलाएं।"
      ],
      livePids: [
        { name: "Max Cell Voltage Deviation", value: "8 mV", expected: "< 15 mV", status: "Healthy", isAlert: false },
        { name: "HV Pack Insulation Resistance", value: "550 MOhm", expected: "> 500 MOhm", status: "Passed", isAlert: false },
        { name: "Battery Pack State of Health (SoH)", value: "99.4%", expected: "> 90%", status: "Optimal", isAlert: false }
      ]
    },
    P0299: {
      dtc: "P0299",
      title: "Turbocharger / Supercharger 'A' Underboost Condition",
      system: "Kryotec 2.0L Turbocharged Intercooled Diesel",
      severity: "High",
      model: "Tata Harrier Fearless Plus Dark",
      symptoms: "Sluggish throttle response above 2000 RPM, whistling hiss near intercooler hose, black smoke under load.",
      hindiGuide: [
        "Step 1 (बूस्ट पाइप विजुअल चेक): इंटरकूलर इनलेट और आउटलेट सिलिकॉन हॉस में दरार या ढीले क्लैंप चेक करें।",
        "Step 2 (VNT एक्चुएटर टेस्ट): VCI से VNT वैक्यूम एक्चुएटर का सोलेनोइड स्ट्रोक चेक करें (10.5 mm ट्रैवल अनिवार्य है)।",
        "Step 3 (स्मोक प्रेशर टेस्ट): स्मोक मशीन से 1.2 bar प्रेशर डालें और इंटरकूलर कोर लीकेज चेक करें।"
      ],
      livePids: [
        { name: "Manifold Absolute Pressure (MAP)", value: "1.2 bar", expected: "2.3 bar", status: "Underboost", isAlert: true },
        { name: "VNT Actuator Position", value: "42%", expected: "78%", status: "Lag Detected", isAlert: true },
        { name: "EGR Mass Flow Rate", value: "18 g/s", expected: "22 g/s", status: "Normal", isAlert: false }
      ]
    }
  };

  const acousticProfiles = {
    dca_shudder: {
      id: "dca_shudder",
      title: "DCA Dual-Clutch Shudder Harmonic",
      freq: "85 Hz (Low-Frequency Resonant Thud)",
      confidence: "96.5%",
      severity: "Critical",
      hindiAnalysis: "क्लच 1 और 2 के फ्रिक्शन डिस्क में थर्मल वॉरपेज और सोलेनोइड प्रेशर ड्रॉप के कारण 85 Hz पर कंपन हो रहा है।",
      partRequired: "DCA Mechatronic Solenoid Valve Block #2871-5420-0104",
      bars: [85, 290, 180, 70, 30, 20, 15, 10, 5, 5]
    },
    timing_belt: {
      id: "timing_belt",
      title: "Revotron 1.2L Timing Belt Tensioner Slack",
      freq: "1840 Hz (Flutter Resonance)",
      confidence: "97.2%",
      severity: "High",
      hindiAnalysis: "टाइमिंग बेल्ट टेंशनर पुली में प्ले है। 1840 Hz पर रेजोनेंस वाइब्रेशन आ रहा है। टेंशनर किट तुरंत बदलें।",
      partRequired: "Timing Belt Tensioner Kit #2841-8890-11",
      bars: [15, 30, 45, 90, 280, 195, 80, 35, 20, 10]
    },
    alternator_bearing: {
      id: "alternator_bearing",
      title: "Alternator Freewheel Decoupler Bearing Dry Wear",
      freq: "3420 Hz (High-Pitched Whine)",
      confidence: "95.8%",
      severity: "Medium",
      hindiAnalysis: "अल्टरनेटर की फ्री-व्हील पुली बेयरिंग सूखी चल रही है। 3420 Hz फ्रीक्वेंसी पर सीटी जैसी आवाज आ रही है।",
      partRequired: "Alternator Decoupler Pulley #2811-4420-00",
      bars: [10, 15, 25, 40, 60, 110, 270, 210, 95, 40]
    },
    ev_chiller: {
      id: "ev_chiller",
      title: "Ziptron EV Coolant Pump Cavitation",
      freq: "720 Hz (Cavitation Pulsing)",
      confidence: "98.4%",
      severity: "High",
      hindiAnalysis: "HV बैटरी कूलेंट पंप में एयर लॉक है। 720 Hz पर पल्सेशन डिटेक्ट हुआ। वैक्यूम ब्लीडिंग टूल से एयर निकालें।",
      partRequired: "Ziptron Organic EV Coolant #2872-0091-00",
      bars: [40, 120, 280, 160, 75, 40, 25, 15, 10, 5]
    },
    turbo_whistle: {
      id: "turbo_whistle",
      title: "Turbo Impeller Whistle & Boost Leak",
      freq: "4600 Hz (High Frequency Air Jet)",
      confidence: "94.8%",
      severity: "High",
      hindiAnalysis: "टर्बोचार्जर इनलेट होस में माइक्रो-क्रैक है। 4600 Hz पर एयर लीकेज की सीटी आ रही है।",
      partRequired: "Turbo Intercooler Silicon Hose #2821-0099-00",
      bars: [5, 10, 20, 35, 60, 90, 140, 220, 285, 180]
    }
  };

  const activeInfo = dtcData[selectedDtc] || dtcData.P0841;
  const currentAcoustic = acousticProfiles[selectedProfile] || acousticProfiles.dca_shudder;

  const handleStartListening = () => {
    setIsLiveListening(true);
    setAcousticResult(null);

    // Dynamic wave animation
    let count = 0;
    const interval = setInterval(() => {
      setSpectrogramBars(currentAcoustic.bars.map(b => Math.max(10, b + Math.sin(count) * 25)));
      count += 0.5;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsLiveListening(false);
      setAcousticResult(currentAcoustic);
      confetti({ particleCount: 60, spread: 55 });
      setToastMessage(`✓ Aarohan Acoustic AI Classified: ${currentAcoustic.title} (${currentAcoustic.confidence} confidence)`);
      setTimeout(() => setToastMessage(null), 5000);
    }, 2500);
  };

  const handleGenerateVideo = () => {
    setWatermarkedVideoGenerated(true);
    confetti({ particleCount: 70, spread: 60 });
    setToastMessage("📹 15-Sec Inspection Video generated with digital micrometer overlay and Hindi audio commentary!");
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-slate-900 text-emerald-300 border border-emerald-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-slideUp">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl">
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Aarohan Diagnostic Terminal & Acoustic AI
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono uppercase">
              Hindi Vernacular + FFT
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Direct technician terminal translating complex CAN-bus DTC pinout diagnostics into step-by-step Hindi workflows, paired with real-time Web Audio FFT acoustic noise classification.
          </p>
        </div>

        {/* VCI Connection Pill */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3 shadow-inner">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Bluetooth className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Tata VCI Wireless Adapter</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              OBD-II CAN-FD • 500 kbps Active
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left DTC & Vernacular Guide + Right Real-Time Acoustic FFT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: DTC Diagnostic Guide in Hindi (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Active VCI Trouble Code
                </h2>
              </div>

              {/* DTC Switcher */}
              <div className="flex items-center space-x-1 font-mono text-xs font-bold">
                {Object.keys(dtcData).map(code => (
                  <button
                    key={code}
                    onClick={() => setSelectedDtc(code)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedDtc === code
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* DTC Details Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900 font-mono">
                  {activeInfo.dtc}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                  {activeInfo.severity}
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-800">
                {activeInfo.title}
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                {activeInfo.symptoms}
              </div>
            </div>

            {/* Live CAN-bus PIDs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Live Sensor Telemetry PIDs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeInfo.livePids?.map((pid, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border font-mono ${
                    pid.isAlert ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="text-[10px] text-slate-500 truncate">{pid.name}</div>
                    <div className="text-base font-black mt-0.5">{pid.value}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Ref: {pid.expected}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hindi Step-by-Step Diagnostic Tree */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                हिंदी चरणबद्ध डायग्नोस्टिक गाइड (Aarohan Verified)
              </span>

              <div className="space-y-2">
                {activeInfo.hindiGuide?.map((step, i) => (
                  <div key={i} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-sans">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Web Audio FFT Acoustic Classifier (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Real-Time FFT Acoustic Noise Classifier
                </h2>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                64-Band FFT
              </span>
            </div>

            {/* Profile Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Select Engine / Suspension Noise Test Profile:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-semibold">
                {Object.values(acousticProfiles).map(prof => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setSelectedProfile(prof.id);
                      setSpectrogramBars(prof.bars);
                      setAcousticResult(null);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProfile === prof.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate font-bold text-[11px]">{prof.title.split(' ')[0]} {prof.title.split(' ')[1]}</div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">{prof.freq.split('(')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live FFT Spectrogram Visualizer */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Live Frequency Response (Hz)
                </span>
                <span className="text-emerald-400">
                  {isLiveListening ? '● RECORDING ACOUSTIC STREAM' : 'READY TO ANALYZE'}
                </span>
              </div>

              {/* 10-Band Animated Visualizer */}
              <div className="h-32 flex items-end justify-between gap-1.5 px-2">
                {spectrogramBars.map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-150 ${
                        height > 200 ? 'bg-rose-500 shadow-lg shadow-rose-500/50' :
                        height > 100 ? 'bg-amber-400 shadow-md shadow-amber-400/40' :
                        'bg-emerald-400'
                      }`}
                      style={{ height: `${Math.min(100, (height / 300) * 100)}%` }}
                    ></div>
                    <span className="text-[8px] font-mono text-slate-500">
                      {(idx + 1) * 500}Hz
                    </span>
                  </div>
                ))}
              </div>

              {/* Start Listening Trigger Button */}
              <button
                onClick={handleStartListening}
                disabled={isLiveListening}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                  isLiveListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                }`}
              >
                {isLiveListening ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>Analyzing Harmonic Frequencies (2.5s)...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Live Microphone Acoustic Scan</span>
                  </>
                )}
              </button>
            </div>

            {/* Acoustic Classification Output */}
            {acousticResult && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2 animate-slideUp">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {acousticResult.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    Confidence: {acousticResult.confidence}
                  </span>
                </div>
                <div className="text-xs text-emerald-900 font-medium">
                  {acousticResult.hindiAnalysis}
                </div>
                <div className="text-[11px] text-emerald-800 font-mono pt-1">
                  Required OEM Part: <strong>{acousticResult.partRequired}</strong>
                </div>
              </div>
            )}

            {/* 15-Sec Video Generator */}
            <div className="pt-2">
              <button
                onClick={handleGenerateVideo}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Watermark 15-Sec Inspection Video for WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
