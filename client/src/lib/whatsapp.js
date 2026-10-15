/**
 * NatureXpress DealerOS - 1-Tap Smart WhatsApp Engine
 * Official Production Domain: https://automotive.naturexpress.in
 * 100% Free - Zero Meta Cloud API Keys Required
 * Uses Universal wa.me Deep-Linking with Pre-Filled Professional Dealership Templates
 */

export const DEFAULT_APP_URL = (typeof window !== 'undefined' && window.location?.origin) 
  || import.meta.env?.VITE_APP_URL 
  || 'https://automotive.naturexpress.in';

/**
 * Normalizes Indian phone numbers to 91XXXXXXXXXX format
 */
export function sanitizePhoneNumber(phone) {
  if (!phone) return '919826012345';
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length > 10) return digits;
  return '919826012345';
}

/**
 * Triggers 1-Tap WhatsApp Web / Mobile App with prefilled message
 */
export function openWhatsApp({ phone, message, newTab = true }) {
  const cleanPhone = sanitizePhoneNumber(phone);
  const encodedText = encodeURIComponent(message.trim());
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  
  if (typeof window !== 'undefined') {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }
  return url;
}

/**
 * 1. Insurance Renewal Quote Template
 */
export function buildInsuranceQuoteMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Nexon EV',
  regNo = 'MP-09-CX-1234',
  expiringDays = 12,
  idvValue = '₹12.4 Lakh',
  premiumAmount = 14200,
  dealerCashback = 1500,
  advisorName = 'Amit Verma (Shyam Tata Scheme 140)',
  appUrl = DEFAULT_APP_URL
}) {
  return `🚗 *TATA MOTORS OFFICIAL INSURANCE RENEWAL NOTICE*
Namaste ${customerName} ji,

Your vehicle policy for *${vehicleModel} (${regNo})* is expiring in *${expiringDays} days*.

📋 *Policy Renewal Summary:*
• Insured Declared Value (IDV): ${idvValue}
• Comprehensive 0-Dep Coverage: ₹${premiumAmount.toLocaleString('en-IN')}
• Shyam Dealer Loyalty Rebate: -₹${dealerCashback.toLocaleString('en-IN')}
• *Net Payable Amount: ₹${(premiumAmount - dealerCashback).toLocaleString('en-IN')}*

🔒 *Cashless Guarantee:* 100% cashless claims & OEM Genuine Parts guarantee across all 18 Shyam Tata workshop bays.

🔗 *View Policy Details & Renew Online:*
${appUrl}/#/app

Tap above for instant 1-tap policy renewal or reply *YES* to speak with your dedicated advisor ${advisorName}.`;
}

/**
 * 2. 15-Second Video Estimate Approval Template
 */
export function buildVideoApprovalMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Harrier Dark Edition',
  regNo = 'MP-09-ZA-8821',
  itemTitle = 'Front Brake Pad Replacement & Rotor Truing',
  estimateAmount = 8500,
  wearPercentage = '85% Worn',
  advisorName = 'Amit Verma (Service Advisor)',
  estimateToken = 'demo-token-nexon-9011',
  appUrl = DEFAULT_APP_URL
}) {
  const approvalLink = `${appUrl}/#/view/estimate/${estimateToken}`;
  return `📹 *TATA SERVICE ESTIMATE DIGITAL AUTHORIZATION*
Namaste ${customerName} ji,

During inspection of your *${vehicleModel} (${regNo})*, our technician noticed *${itemTitle}* (${wearPercentage}).

🔍 *Safety Recommendation:*
• Estimated Parts & Labor: *₹${estimateAmount.toLocaleString('en-IN')}*
• 15-Second Inspection Video & Digital Proof: ${approvalLink}
• Technician Note: Immediate replacement recommended to prevent disc damage.

📲 *Review Video Proof & Tap to Authorize:*
👉 ${approvalLink}

Please reply:
✅ *APPROVE* — to add to today's job card
❌ *HOLD* — to defer until next service

Thank you,
${advisorName} | Shyam Automotive Tata Motors (Scheme 140)`;
}

/**
 * 3. Extended Warranty (Tata Care+) Proposal Template
 */
export function buildEWProposalMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Safari',
  regNo = 'MP-09-UB-4490',
  planName = 'Tata Care+ 2-Year Extended Mechanical Warranty',
  totalAmount = 24500,
  noCostEmi = 2041,
  advisorName = 'Shyam Tata Care Team (Scheme 140)',
  appUrl = DEFAULT_APP_URL
}) {
  return `🛡️ *TATA MOTORS EXTENDED WARRANTY PROTECTION*
Namaste ${customerName} ji,

Protect your *${vehicleModel} (${regNo})* with *${planName}*.

✨ *Coverage Highlights:*
• Engine, Automatic Gearbox, ECU & High-Voltage Battery components
• Zero Out-of-Pocket labor charges nationwide
• *No-Cost EMI: Just ₹${noCostEmi.toLocaleString('en-IN')}/month* (or ₹${totalAmount.toLocaleString('en-IN')} one-time)

🔗 *Review Full Warranty Coverage Online:*
${appUrl}/#/app

Reply *1* for 1-click EMI activation link or *2* to request a callback.
${advisorName}`;
}

/**
 * 4. Overdue Service Drip Template
 */
export function buildServiceDueMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Punch',
  regNo = 'MP-09-WD-1102',
  overdueDays = 45,
  serviceStage = '2nd Periodic Minor Service (15,000 KM)',
  advisorName = 'Shyam Tata Service (Scheme 140)',
  appUrl = DEFAULT_APP_URL
}) {
  return `🔔 *PERIODIC SERVICE OVERDUE REMINDER*
Namaste ${customerName} ji,

Your *${vehicleModel} (${regNo})* is overdue by *${overdueDays} days* for its *${serviceStage}*.

⚠️ *Why Timely Service Matters:*
• Maintains 100% factory warranty eligibility
• Ensures optimal engine oil lubrication & fuel economy
• Complimentary 32-point computerised health scan included

📅 *Book Your VIP Bay in 1-Tap:*
${appUrl}/#/app

Reply with your preferred date (e.g. *Tomorrow 10 AM*) to reserve your VIP Priority Bay.
${advisorName}`;
}

/**
 * 5. 8:00 AM MD / Dealer Principal Executive Briefing
 */
export function buildMDBriefingMessage({
  recipientName = 'Shyam Sir',
  branchName = 'Shyam Automotive Tata (Scheme 140 Flagship)',
  date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }),
  expectedRevenue = 842500,
  yesterdayRevenue = 242500,
  bayUtilization = '84%',
  todayBookings = 42,
  criticalPartsCount = 2,
  escalationsCount = 1,
  recoveredToday = 42600,
  identifiedLeakage = 472500,
  appUrl = DEFAULT_APP_URL
}) {
  return `🌅 *EXECUTIVE MORNING BRIEFING — ${branchName.toUpperCase()}*
📅 *Date:* ${date}
📍 *Location:* Scheme 140 Bicholi Mardana Hub (4.9★ 1,237 Reviews)

📊 *Today's Operations Pulse:*
• Expected Workshop Revenue: *₹${(expectedRevenue / 100000).toFixed(2)}L*
• Yesterday Labor Revenue: *₹${yesterdayRevenue.toLocaleString('en-IN')}*
• Bay Utilization Forecast: *${bayUtilization}* (18 Active Bays)
• Confirmed Service Bookings: *${todayBookings} Vehicles*

💰 *Daily Revenue Leakage Radar:*
• Identified Opportunity at Risk: *₹${(identifiedLeakage / 100000).toFixed(2)}L*
• Total Margin Recovered Today: *+₹${recoveredToday.toLocaleString('en-IN')}*

⚠️ *Management Attention Required:*
• *${escalationsCount} Customer Agitation Alert* (Bay 5 under intervention)
• *${criticalPartsCount} Critical Inter-Dealer Parts* en-route from Shyam Dewas Depot

📊 *Open Live Dealership Cockpit:*
${appUrl}/#/portal

Top Action: Service Advisor team dispatched 1-tap WhatsApp quotes.
— NatureXpress DealerOS Core`;
}

/**
 * 6. Official GST Tax Invoice with Dynamic UPI QR Link
 */
export function buildGSTInvoiceMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Harrier',
  regNo = 'MP-09-CX-1234',
  invoiceNo = 'INV/2026/NX-0042',
  totalAmount = 24650,
  upiVpa = 'shyamautomotive@icici',
  advisorName = 'Shyam Automotive Tata Motors (Scheme 140)',
  appUrl = DEFAULT_APP_URL
}) {
  const upiIntent = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=ShyamAutomotiveIndore&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(invoiceNo)}`;
  return `🧾 *OFFICIAL TATA MOTORS SERVICE INVOICE*
Namaste ${customerName} ji,

The service for your *${vehicleModel} (${regNo})* is completed and quality-checked.

📋 *Invoice Details:*
• Invoice Number: *${invoiceNo}*
• Total Amount Payable: *₹${totalAmount.toLocaleString('en-IN')}* (Inc. GST)
• 32-Point Quality Gate: 100% Passed

💳 *1-Tap Instant UPI Payment Link:*
${upiIntent}

📄 *Download Digital Tax Invoice & Gate Pass:*
${appUrl}/#/track/${invoiceNo}

Thank you for trusting Shyam Automotive Tata Motors (Scheme 140, Indore)!
${advisorName}`;
}

/**
 * 7. Post-Service CSI Feedback Survey
 */
export function buildCSISurveyMessage({
  customerName = 'Valued Customer',
  vehicleModel = 'Tata Safari',
  regNo = 'MP-09-UB-4490',
  advisorName = 'Amit Sharma',
  appUrl = DEFAULT_APP_URL
}) {
  return `🌟 *TATA MOTORS SERVICE SATISFACTION SURVEY*
Namaste ${customerName} ji,

Thank you for servicing your *${vehicleModel} (${regNo})* today with ${advisorName} at Shyam Automotive Scheme 140 Flagship.

How was your overall workshop experience?
⭐⭐⭐⭐⭐ *5 Star - Excellent* (Reply 5)
⭐⭐⭐⭐ *4 Star - Good* (Reply 4)
⚠️ *Needs Improvement* (Reply 1)

📲 *Rate Experience & Track Vehicle Health Online:*
${appUrl}/#/app

Your feedback helps us maintain our 4.9★ Google Rating and deliver flawless Tata service!
Shyam Automotive Tata Motors (Scheme 140 Main Rd, Opp Agarwal Public School, Indore)`;
}
