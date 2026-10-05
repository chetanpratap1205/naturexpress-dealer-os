# NatureXpress Enterprise Dealership OS
**Connected Workshop & High-Margin Revenue Engine for Tata Motors Authorized Dealerships**  
**Founder:** Chetan (NatureXpress Technologies)  

---

## 🌟 Overview
**NatureXpress Dealership OS** is a purpose-built enterprise operating system designed to eliminate daily workshop chaos, recover lost warranty revenue, boost high-margin Extended Warranty (EW) sales, and transform customer trust across Tata Motors dealerships.

---

## 🚀 Key Features by Phase

### 📱 Phase 1: Core Foundation & WhatsApp Thread OS
* **Customer WhatsApp Cockpit (Zero App Download):** Real-time 6-stage visual progress tracker, 15-second video inspection cards with 1-tap itemized approvals, and instant UPI/Card payments.
* **Service Advisor (SA) Digital Tablet:** Fast 60-second intake, voice-to-text notes in Hindi/English, and unified WhatsApp desk (eliminates the 50-group limit).
* **CCM Early-Warning Radar:** Automated alerts for 36h+ vehicle dwell time, repeat visits, and customer anger detection.
* **AI Telephony CRM (CRE Suite):** Dynamic caller cheat cards with predicted odometer and past uncompleted repair advisories.

### 💰 Phase 2: High-Margin Revenue Engines
* **Extended Warranty (EW) Predictive Configurator:** Silver, Gold, Platinum tiering with 0% No-Cost EMI checkout, adding +₹4.20L/mo in net dealer margin.
* **Automated Marketing Drives:** Opt-in WhatsApp campaign broadcast engine for Monsoon safety, EV health, and post-warranty drives.
* **Staff Gamification Leaderboard:** Daily commission payouts and FTR rankings for SAs, Master Techs, and Calling Staff.
* **Indore Value Club:** Dedicated retention program for Year 4+ out-of-warranty Tata vehicles.

### 🛡️ Phase 3: AI Diagnostic & Zero-Rejection Warranty Shield
* **AI Warranty Pre-Auditor:** Mandatory 4-point photo validation (VIN plate, odometer, part label) and CAN-bus ECU freeze-frame lock before DTCs are cleared.
* **Technician Vernacular Guided Terminal:** Step-by-step Hindi/Hinglish diagnostic trees for complex DCA transmission and High-Voltage EV faults.
* **Acoustic AI Spectrum Analyzer:** Tablet microphone noise analysis isolating bearing wear from belt slap.

### 🌐 Phase 4: Inter-Dealer Swarm Logistics
* **Indore Virtual Parts Pool:** Connects Sanghi Brothers, Shyam Automotive, Jagdish Motors, and TASS satellite centers with a 90-minute intra-city runner network.
* **Dead-Stock Liquidation Engine:** Auto-matches idle parts (> 180 days) with active repair demand across Indore dealerships.

---

## 🛠️ Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
* **Backend:** Node.js, Express, WebSockets (`ws`), REST APIs.
* **Data Layer:** ACID JSON/SQLite persistent store with real-time broadcast.
* **Protocols:** ISO 14229 (UDS), CAN-Bus OBD-II, WhatsApp Cloud API.

---

## 🏁 Quick Start & Installation

### Windows (1-Click Launch)
Double-click `start.bat` in the project root directory. It will start both backend server (`http://localhost:5000`) and frontend client (`http://localhost:3000`) and open your default browser.

### Manual Launch
```bash
# 1. Install root dependencies
npm install

# 2. Start Backend Server (Port 5000)
cd server
npm install
node index.js

# 3. Start Frontend Client (Port 3000) (In a new terminal)
cd client
npm install
npm run dev
```

---

## 📊 Live Endpoints & Port Reference
* **Frontend WebApp:** [http://localhost:3000](http://localhost:3000)
* **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
* **WebSocket Server:** `ws://localhost:5000/ws`
