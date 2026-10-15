const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DB_DIR = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.join(__dirname, '../data');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'naturexpress.db');

// If running in Vercel serverless, copy pre-seeded database to /tmp if available
if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
  const seedDbPath = path.join(__dirname, '../data/naturexpress.db');
  if (fs.existsSync(seedDbPath)) {
    try {
      fs.copyFileSync(seedDbPath, DB_PATH);
    } catch (copyErr) {
      console.warn('Could not copy seed DB to /tmp:', copyErr.message);
    }
  }
}

const db = new Database(DB_PATH);

// Enable WAL mode for high concurrency across tablets
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT NOT NULL,
      gstin TEXT NOT NULL,
      bays_count INTEGER DEFAULT 18,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      branch_id TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL, -- 'SERVICE_ADVISOR', 'FLOOR_TECHNICIAN', 'PARTS_MANAGER', 'BILLING_CASHIER', 'SECURITY_GUARD', 'DEALER_PRINCIPAL'
      pin TEXT NOT NULL,  -- 4-digit rapid floor PIN
      phone TEXT,
      email TEXT,
      avatar TEXT,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (branch_id) REFERENCES branches(id)
    );

    CREATE TABLE IF NOT EXISTS vehicle_master (
      reg_no TEXT PRIMARY KEY,
      vin TEXT UNIQUE,
      model TEXT NOT NULL,
      fuel_type TEXT NOT NULL,
      year_mfg INTEGER,
      engine_no TEXT,
      color TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      customer_address TEXT,
      last_service_date TEXT,
      last_service_km INTEGER,
      vip_flag INTEGER DEFAULT 0,
      active_extended_warranty INTEGER DEFAULT 0,
      open_recalls TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_cards (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL, -- UUID for customer zero-install direct web approval
      branch_id TEXT NOT NULL,
      reg_no TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      model TEXT NOT NULL,
      fuel_type TEXT NOT NULL,
      odometer_in INTEGER NOT NULL,
      odometer_photo TEXT,
      fuel_level INTEGER DEFAULT 50, -- 0 to 100 percentage
      service_type TEXT NOT NULL,
      complaints TEXT, -- JSON array of strings
      inventory_checklist TEXT, -- JSON object
      scratch_markers TEXT, -- JSON array of 360 scratch points
      customer_signature TEXT, -- Base64 data URL
      sa_id TEXT NOT NULL,
      sa_name TEXT NOT NULL,
      tech_id TEXT,
      tech_name TEXT,
      bay_number INTEGER,
      status TEXT DEFAULT 'INTAKE', -- 'INTAKE', 'INSPECTION', 'ESTIMATE_PENDING', 'BAY_WORK', 'WASHING', 'ROAD_TEST', 'BILL_READY', 'PAID', 'GATE_PASSED'
      estimated_amount REAL DEFAULT 0,
      final_amount REAL DEFAULT 0,
      road_test_completed INTEGER DEFAULT 0,
      gate_pass_qr TEXT,
      gate_exit_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (branch_id) REFERENCES branches(id),
      FOREIGN KEY (reg_no) REFERENCES vehicle_master(reg_no),
      FOREIGN KEY (sa_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS job_card_items (
      id TEXT PRIMARY KEY,
      job_card_id TEXT NOT NULL,
      item_type TEXT NOT NULL, -- 'LABOR', 'PART', 'CONSUMABLE'
      code TEXT NOT NULL,      -- SAC or Part SKU
      description TEXT NOT NULL,
      qty REAL DEFAULT 1,
      unit_price REAL NOT NULL,
      gst_rate REAL NOT NULL,   -- 18 or 28
      total_price REAL NOT NULL,
      is_mandatory INTEGER DEFAULT 1, -- 1 for initial PMS, 0 for recommended additional
      approval_status TEXT DEFAULT 'APPROVED', -- 'APPROVED', 'PENDING', 'DECLINED'
      inspection_video_url TEXT,
      inspection_notes TEXT,
      bin_location TEXT,
      issued_at DATETIME,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS parts_inventory (
      sku TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      bin_location TEXT NOT NULL, -- e.g. Aisle 2 - Rack B - Bin 14
      hsn_code TEXT NOT NULL,
      cost_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      gst_rate REAL DEFAULT 28,
      stock_qty INTEGER DEFAULT 0,
      min_buffer_qty INTEGER DEFAULT 5,
      is_consumable INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_card_id TEXT,
      actor_role TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Phase 3: Workshop Bay Floor & SRT Labor Timers
    CREATE TABLE IF NOT EXISTS bay_operations (
      id TEXT PRIMARY KEY,
      job_card_id TEXT NOT NULL,
      tech_id TEXT NOT NULL,
      tech_name TEXT NOT NULL,
      operation_code TEXT NOT NULL,
      description TEXT NOT NULL,
      srt_hours REAL NOT NULL,
      status TEXT DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED'
      started_at DATETIME,
      paused_at DATETIME,
      completed_at DATETIME,
      actual_minutes_spent INTEGER DEFAULT 0,
      defect_video_url TEXT,
      tech_notes TEXT,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE
    );

    -- Phase 3: Parts Requisitions & Anti-Cannibalization Queue
    CREATE TABLE IF NOT EXISTS parts_requisitions (
      id TEXT PRIMARY KEY,
      job_card_id TEXT NOT NULL,
      bay_number INTEGER NOT NULL,
      tech_id TEXT NOT NULL,
      tech_name TEXT NOT NULL,
      sku TEXT NOT NULL,
      part_name TEXT NOT NULL,
      qty REAL DEFAULT 1,
      bin_location TEXT NOT NULL,
      status TEXT DEFAULT 'REQUESTED', -- 'REQUESTED', 'ISSUED', 'RETURNED'
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      issued_at DATETIME,
      issued_by TEXT,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
      FOREIGN KEY (sku) REFERENCES parts_inventory(sku)
    );

    -- Phase 4: Statutory GST Invoicing & Payment Reference Audit (Zero Interception)
    CREATE TABLE IF NOT EXISTS billing_settlements (
      id TEXT PRIMARY KEY,
      job_card_id TEXT UNIQUE NOT NULL,
      invoice_no TEXT UNIQUE NOT NULL,
      reg_no TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      taxable_labor REAL NOT NULL,
      labor_cgst REAL NOT NULL,
      labor_sgst REAL NOT NULL,
      taxable_spares REAL NOT NULL,
      spares_cgst REAL NOT NULL,
      spares_sgst REAL NOT NULL,
      grand_total REAL NOT NULL,
      payment_mode TEXT NOT NULL, -- 'CARD_EDC', 'BANK_RTGS_NEFT', 'CASH', 'FLEET_CREDIT'
      payment_ref TEXT NOT NULL,  -- Terminal RRN, Bank UTR, Cash Receipt #
      cashier_id TEXT NOT NULL,
      cashier_name TEXT NOT NULL,
      settled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id)
    );

    -- Phase 4: Physical Security Gate Pass (Dynamic QR)
    CREATE TABLE IF NOT EXISTS gate_passes (
      id TEXT PRIMARY KEY,
      pass_code TEXT UNIQUE NOT NULL,
      job_card_id TEXT UNIQUE NOT NULL,
      invoice_no TEXT NOT NULL,
      reg_no TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      model TEXT NOT NULL,
      gate_status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'EXITED'
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      exited_at DATETIME,
      guard_id TEXT,
      guard_name TEXT,
      guard_notes TEXT,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id)
    );

    -- Phase 2: Valet Identity & Pickup Module
    CREATE TABLE IF NOT EXISTS pickup_assignments (
      id TEXT PRIMARY KEY,
      job_card_id TEXT,           -- linked after JC creation (can be null initially)
      valet_id TEXT NOT NULL,    -- user id of the valet employee
      valet_name TEXT NOT NULL,
      valet_phone TEXT,
      valet_employee_id TEXT NOT NULL,  -- e.g. SHY-SA-042
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      vehicle_model TEXT NOT NULL,
      vehicle_reg TEXT NOT NULL,
      scheduled_at DATETIME NOT NULL,
      pickup_token TEXT UNIQUE NOT NULL,  -- UUID for customer tracking link
      status TEXT DEFAULT 'SCHEDULED',    -- 'SCHEDULED','VALET_DISPATCHED','VEHICLE_COLLECTED','REACHED_SHOWROOM','CANCELLED'
      photo_front TEXT,
      photo_rear TEXT,
      photo_left TEXT,
      photo_right TEXT,
      photo_odometer TEXT,
      photo_fuel TEXT,
      video_walkaround TEXT,
      odometer_reading INTEGER,
      fuel_level INTEGER,
      customer_signature TEXT,
      pickup_notes TEXT,
      dispatched_at DATETIME,
      collected_at DATETIME,
      reached_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (valet_id) REFERENCES users(id)
    );

    -- Phase 5: AI Zero-Rejection Warranty Fortress & 4-Angle Audit
    CREATE TABLE IF NOT EXISTS warranty_claims (
      id TEXT PRIMARY KEY,
      job_card_id TEXT NOT NULL,
      reg_no TEXT NOT NULL,
      vin TEXT NOT NULL,
      part_sku TEXT NOT NULL,
      part_name TEXT NOT NULL,
      dtc_code TEXT NOT NULL,
      dtc_freeze_frame TEXT, -- JSON
      photo_odo TEXT,
      photo_vin TEXT,
      photo_part_mounted TEXT,
      photo_part_removed TEXT,
      status TEXT DEFAULT 'PENDING_PRE_AUDIT', -- 'PENDING_PRE_AUDIT', 'PRE_AUDIT_PASS', 'SUBMITTED_TO_OEM'
      claim_amount REAL NOT NULL,
      pre_audit_score INTEGER DEFAULT 0,
      oem_submission_deadline DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_card_id) REFERENCES job_cards(id)
    );

    -- Phase 3/4: Public Showroom Test Drive Leads Table (ACID Persistence)
    CREATE TABLE IF NOT EXISTS leads_test_drive (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      vehicle_model TEXT NOT NULL,
      preferred_date TEXT,
      preferred_slot TEXT,
      branch TEXT,
      notes TEXT,
      status TEXT DEFAULT 'HOT_LEAD_PENDING_CALLBACK',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Phase 4: Public Multipurpose Leads & Booking Table
    CREATE TABLE IF NOT EXISTS leads_enquiries (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL, -- 'SERVICE_BOOKING', 'SALES_BOOKING', 'INSURANCE_RENEWAL', 'EXTENDED_WARRANTY', 'VALUE_CARE_AMC', 'ROADSIDE_ASSISTANCE', 'EXCHANGE_EVALUATION', 'CONTACT_US', 'ACCESSORY_ORDER'
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      vehicle_model TEXT,
      vehicle_reg TEXT,
      preferred_date TEXT,
      preferred_slot TEXT,
      branch TEXT,
      notes TEXT,
      payload_json TEXT,
      status TEXT DEFAULT 'PENDING_CONTACT',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Phase 8: Tata Motors e-DMS Siebel Shadow Sync Queue
    CREATE TABLE IF NOT EXISTS dms_sync_records (
      id TEXT PRIMARY KEY,
      job_card_id TEXT,
      reg_no TEXT NOT NULL,
      sync_type TEXT NOT NULL, -- 'PMS_RO_SYNC', 'PARTS_ISSUE_SYNC', 'GATE_EXIT_SYNC', 'WARRANTY_CLAIM_SYNC'
      dms_ro_number TEXT,
      status TEXT DEFAULT 'SYNCED', -- 'PENDING', 'SYNCED', 'RECONCILED'
      payload_json TEXT,
      synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ack_code TEXT
    );
  `);
}

// Seed default enterprise data if empty
function seedEnterpriseData() {
  const branchCount = db.prepare('SELECT COUNT(*) as count FROM branches').get().count;
  const opCount = db.prepare('SELECT COUNT(*) as count FROM bay_operations').get().count;

  if (opCount === 0) {
    const ops = [
      { id: 'op-01', jcId: 'JC-2026-8899', code: 'PMS-OIL-FLT', desc: 'Engine Oil Drain & Filter Replacement (SRT: 0.6 hr)', srt: 0.6, status: 'COMPLETED', mins: 32 },
      { id: 'op-02', jcId: 'JC-2026-8899', code: 'BRK-INSP-PAD', desc: 'Brake Caliper Inspection & Pad Measurement (SRT: 0.8 hr)', srt: 0.8, status: 'IN_PROGRESS', mins: 25 },
      { id: 'op-03', jcId: 'JC-2026-8899', code: 'WHL-BAL-ALIGN', desc: '4-Wheel High-Speed Balancing & Alignment (SRT: 0.8 hr)', srt: 0.8, status: 'PENDING', mins: 0 }
    ];
    const insertOp = db.prepare(`
      INSERT OR IGNORE INTO bay_operations (id, job_card_id, tech_id, tech_name, operation_code, description, srt_hours, status, actual_minutes_spent)
      VALUES (?, ?, 'usr-tech-1', 'Amit Verma (Master Tech)', ?, ?, ?, ?, ?)
    `);
    ops.forEach(o => insertOp.run(o.id, o.jcId, o.code, o.desc, o.srt, o.status, o.mins));

    const reqs = [
      { id: 'req-01', jcId: 'JC-2026-8899', bay: 4, sku: '287018100109', name: 'Engine Oil Filter Cartridge', qty: 1, bin: 'Aisle 1 - Rack A - Bin 04', status: 'ISSUED' },
      { id: 'req-02', jcId: 'JC-2026-8899', bay: 4, sku: '542442100108', name: 'Front Disc Brake Pad Kit', qty: 1, bin: 'Aisle 2 - Rack B - Bin 14', status: 'REQUESTED' }
    ];
    const insertReq = db.prepare(`
      INSERT OR IGNORE INTO parts_requisitions (id, job_card_id, bay_number, tech_id, tech_name, sku, part_name, qty, bin_location, status)
      VALUES (?, ?, ?, 'usr-tech-1', 'Amit Verma (Master Tech)', ?, ?, ?, ?, ?)
    `);
    reqs.forEach(r => insertReq.run(r.id, r.jcId, r.bay, r.sku, r.name, r.qty, r.bin, r.status));

    db.prepare(`
      INSERT OR IGNORE INTO warranty_claims (
        id, job_card_id, reg_no, vin, part_sku, part_name, dtc_code, dtc_freeze_frame,
        photo_odo, photo_vin, photo_part_mounted, photo_part_removed, status, claim_amount, pre_audit_score
      ) VALUES (
        'claim-01', 'JC-2026-8899', 'MP-09-WA-9011', 'MAT622154N4K99211', '542442100108',
        'Electronic Steering Rack Sensor / Brake Actuator', 'P0AC0',
        '{"engine_rpm": 1820, "coolant_temp_c": 88, "vehicle_speed_kmh": 0, "battery_voltage": 12.6, "freeze_frame_locked": true}',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
        'PRE_AUDIT_PASS', 14250, 100
      )
    `).run();
  }

  // Seed Phase 2: Pickup Assignments if empty
  const pickupCount = db.prepare('SELECT COUNT(*) as count FROM pickup_assignments').get().count;
  if (pickupCount === 0) {
    const insertPickup = db.prepare(`
      INSERT OR IGNORE INTO pickup_assignments (
        id, job_card_id, valet_id, valet_name, valet_phone, valet_employee_id,
        customer_name, customer_phone, customer_address, vehicle_model, vehicle_reg,
        scheduled_at, pickup_token, status, dispatched_at, collected_at, reached_at,
        photo_front, photo_rear, photo_odometer, odometer_reading, fuel_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPickup.run(
      'PKP-101', null, 'usr-sa-1', 'Ramesh Sharma', '+91 98260 11223', 'SHY-VALET-042',
      'Dr. Anand Maheshwari', '+91 98270 55102', 'Bungalow 42, Saket Nagar, Near Anand Hospital, Indore',
      'Tata Nexon EV Empowered Plus', 'MP-09-EB-8820',
      new Date(Date.now() + 3600000).toISOString(),
      'demo-pickup-token', 'VALET_DISPATCHED', new Date().toISOString(), null, null,
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600',
      24350, 82
    );

    insertPickup.run(
      'PKP-102', null, 'usr-sa-2', 'Vikram Patel', '+91 98260 22334', 'SHY-VALET-088',
      'Devendra Rathore', '+91 94250 88991', 'Flat 402, Royal Palms, Race Course Road, Indore',
      'Tata Harrier Dark Edition Fearless+', 'MP-09-CZ-4412',
      new Date(Date.now() - 7200000).toISOString(),
      'harrier-pickup-4412', 'VEHICLE_COLLECTED',
      new Date(Date.now() - 7200000).toISOString(), new Date(Date.now() - 3600000).toISOString(), null,
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600',
      31200, 65
    );

    insertPickup.run(
      'PKP-103', 'JC-2026-8899', 'usr-sa-1', 'Ramesh Sharma', '+91 98260 11223', 'SHY-VALET-042',
      'Pooja Choudhary', '+91 98270 55102', 'Sector B, Scheme No 140, Indore',
      'Tata Nexon Creative Plus 1.2', 'MP-09-WA-9011',
      new Date(Date.now() - 18000000).toISOString(),
      'safari-pickup-9011', 'REACHED_SHOWROOM',
      new Date(Date.now() - 18000000).toISOString(), new Date(Date.now() - 14400000).toISOString(), new Date(Date.now() - 10800000).toISOString(),
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600',
      24200, 70
    );
  }

  if (branchCount > 0) return;

  console.log('🌱 [DB] Seeding enterprise dealership master records for Shyam Automotive...');

  // 1. Branch
  db.prepare(`
    INSERT INTO branches (id, name, code, location, phone, gstin, bays_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'shyam-scheme-140',
    'Shyam Automotive (Tata Motors Authorized Dealership)',
    'TAT-MP09-140',
    'Scheme No 140 Main Rd, Bicholi Mardana, Indore, MP 452016',
    '+91 88798 97825',
    '23AABCS8899K1Z4',
    18
  );

  // 2. Users (With rapid floor PINs)
  const users = [
    { id: 'usr-sa-1', name: 'Ramesh Sharma', role: 'SERVICE_ADVISOR', pin: '1111', phone: '+91 98260 11223', email: 'ramesh.sa@shyamautomotive.com', avatar: '👨‍💼' },
    { id: 'usr-sa-2', name: 'Vikram Patel', role: 'SERVICE_ADVISOR', pin: '1122', phone: '+91 98260 22334', email: 'vikram.sa@shyamautomotive.com', avatar: '👨‍💼' },
    { id: 'usr-tech-1', name: 'Amit Verma (Master Tech)', role: 'FLOOR_TECHNICIAN', pin: '2222', phone: '+91 98260 33445', email: 'amit.tech@shyamautomotive.com', avatar: '🔧' },
    { id: 'usr-tech-2', name: 'Sanjay Kumar (Diag Tech)', role: 'FLOOR_TECHNICIAN', pin: '2233', phone: '+91 98260 44556', email: 'sanjay.tech@shyamautomotive.com', avatar: '⚡' },
    { id: 'usr-store-1', name: 'Rajesh Malviya', role: 'PARTS_MANAGER', pin: '3333', phone: '+91 98260 55667', email: 'rajesh.parts@shyamautomotive.com', avatar: '📦' },
    { id: 'usr-cashier-1', name: 'Sunita Chouhan', role: 'BILLING_CASHIER', pin: '4444', phone: '+91 98260 66778', email: 'sunita.cash@shyamautomotive.com', avatar: '🧾' },
    { id: 'usr-guard-1', name: 'Ram Singh (Security Gate 1)', role: 'SECURITY_GUARD', pin: '5555', phone: '+91 98260 77889', email: 'guard.gate1@shyamautomotive.com', avatar: '🛡️' },
    { id: 'usr-dp-1', name: 'Shyam Singhal (Dealer Principal)', role: 'DEALER_PRINCIPAL', pin: '9999', phone: '+91 88798 97825', email: 'md@shyamautomotive.com', avatar: '👑' }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, branch_id, name, role, pin, phone, email, avatar)
    VALUES (?, 'shyam-scheme-140', ?, ?, ?, ?, ?, ?)
  `);
  users.forEach(u => insertUser.run(u.id, u.name, u.role, u.pin, u.phone, u.email, u.avatar));

  // 3. Vehicle Master (Real Tata PV & EV models in Indore)
  const vehicles = [
    {
      reg_no: 'MP-09-WA-9011',
      vin: 'MAT622154N4K99211',
      model: 'Tata Nexon Creative Plus 1.2 Turbo Petrol',
      fuel_type: 'Petrol',
      year_mfg: 2023,
      engine_no: 'REV12T98721',
      color: 'Calgary White / Foliage Green',
      customer_name: 'Pooja Choudhary',
      customer_phone: '+91 98270 55102',
      customer_email: 'pooja.choudhary@gmail.com',
      customer_address: 'Flat 402, Treasure Fantasy, CAT Road, Indore',
      last_service_date: '2025-10-14',
      last_service_km: 19800,
      vip_flag: 1,
      active_extended_warranty: 1,
      open_recalls: 'None'
    },
    {
      reg_no: 'MP-09-CZ-4412',
      vin: 'MAT622188P5M11094',
      model: 'Tata Harrier Fearless Plus Dark Edition 2.0 Kryotec',
      fuel_type: 'Diesel',
      year_mfg: 2024,
      engine_no: 'KRY20D54321',
      color: 'Oberon Black',
      customer_name: 'Devendra Rathore',
      customer_phone: '+91 98930 11440',
      customer_email: 'devendra.rathore@indoretextiles.in',
      customer_address: 'Bunglow 12, Saket Nagar, Indore',
      last_service_date: '2025-12-05',
      last_service_km: 12400,
      vip_flag: 1,
      active_extended_warranty: 1,
      open_recalls: 'ECU Reflash TSB-2024-H08'
    },
    {
      reg_no: 'MP-09-EB-8820',
      vin: 'MAT622210E6N77319',
      model: 'Tata Nexon EV Empowered Plus LR 40.5 kWh',
      fuel_type: 'EV',
      year_mfg: 2024,
      engine_no: 'ZIPTRON40K5512',
      color: 'Empowered Oxide',
      customer_name: 'Dr. Anand Maheshwari',
      customer_phone: '+91 94250 88990',
      customer_email: 'dranand.m@choh.org',
      customer_address: '74, Silver Springs, Bypass Rd, Indore',
      last_service_date: '2026-01-20',
      last_service_km: 25400,
      vip_flag: 0,
      active_extended_warranty: 1,
      open_recalls: 'None'
    },
    {
      reg_no: 'MP-09-UK-3032',
      vin: 'MAT622099K3J55410',
      model: 'Tata Punch Accomplished Dazzle MT',
      fuel_type: 'Petrol',
      year_mfg: 2022,
      engine_no: 'REV12P33219',
      color: 'Tropical Mist',
      customer_name: 'Sunil Agrawal',
      customer_phone: '+91 98270 33441',
      customer_email: 'sunil.agrawal@indoregrain.com',
      customer_address: 'Scheme 78, Vijay Nagar, Indore',
      last_service_date: '2025-08-11',
      last_service_km: 38200,
      vip_flag: 0,
      active_extended_warranty: 0,
      open_recalls: 'None'
    }
  ];

  const insertVehicle = db.prepare(`
    INSERT INTO vehicle_master (
      reg_no, vin, model, fuel_type, year_mfg, engine_no, color,
      customer_name, customer_phone, customer_email, customer_address,
      last_service_date, last_service_km, vip_flag, active_extended_warranty, open_recalls
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  vehicles.forEach(v => insertVehicle.run(
    v.reg_no, v.vin, v.model, v.fuel_type, v.year_mfg, v.engine_no, v.color,
    v.customer_name, v.customer_phone, v.customer_email, v.customer_address,
    v.last_service_date, v.last_service_km, v.vip_flag, v.active_extended_warranty, v.open_recalls
  ));

  // 4. Parts Inventory (Tata OEM Genuine Spares with Bin Locations)
  const parts = [
    { sku: '287018100109', name: 'Engine Oil Filter Cartridge (Revotron)', category: 'Filters', bin: 'Aisle 1 - Rack A - Bin 04', hsn: '8421', cost: 180, price: 345, gst: 18, stock: 45, is_consumable: 0 },
    { sku: '287009100144', name: 'Engine Air Filter Element (Nexon)', category: 'Filters', bin: 'Aisle 1 - Rack A - Bin 09', hsn: '8421', cost: 260, price: 490, gst: 18, stock: 32, is_consumable: 0 },
    { sku: '542442100108', name: 'Front Disc Brake Pad Kit (Nexon/Altroz)', category: 'Brakes', bin: 'Aisle 2 - Rack B - Bin 14', hsn: '8708', cost: 1350, price: 2450, gst: 28, stock: 18, is_consumable: 0 },
    { sku: '542442100199', name: 'Front Brake Disc Rotor Pair (Harrier)', category: 'Brakes', bin: 'Aisle 2 - Rack C - Bin 02', hsn: '8708', cost: 3800, price: 6800, gst: 28, stock: 8, is_consumable: 0 },
    { sku: 'LUB-SYN-5W30-35', name: 'Castrol Magnatec Pro Tata 5W30 (3.5L Can)', category: 'Lubricants', bin: 'Aisle 4 - Rack A - Drum 01', hsn: '2710', cost: 1450, price: 2350, gst: 18, stock: 60, is_consumable: 0 },
    { sku: 'CONS-BRK-CLN-400', name: 'Wurth Professional Brake Cleaner 400ml', category: 'Consumables', bin: 'Aisle 5 - Rack D - Bin 01', hsn: '3402', cost: 180, price: 350, gst: 18, stock: 85, is_consumable: 1 },
    { sku: 'CONS-CAL-GRS-50', name: 'High-Temp Synthetic Caliper Pin Grease 50g', category: 'Consumables', bin: 'Aisle 5 - Rack D - Bin 05', hsn: '2710', cost: 90, price: 180, gst: 18, stock: 70, is_consumable: 1 },
    { sku: 'CONS-WSH-FLUID-1L', name: 'Tata Genuine Windshield Washer Fluid 1L', category: 'Consumables', bin: 'Aisle 5 - Rack D - Bin 12', hsn: '3402', cost: 65, price: 140, gst: 18, stock: 95, is_consumable: 1 },
    { sku: '542435100112', name: 'Cabin AC Pollen Filter (PM 2.5)', category: 'Filters', bin: 'Aisle 1 - Rack B - Bin 11', hsn: '8421', cost: 320, price: 650, gst: 18, stock: 24, is_consumable: 0 }
  ];

  const insertPart = db.prepare(`
    INSERT INTO parts_inventory (sku, name, category, bin_location, hsn_code, cost_price, selling_price, gst_rate, stock_qty, is_consumable)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  parts.forEach(p => insertPart.run(p.sku, p.name, p.category, p.bin, p.hsn, p.cost, p.price, p.gst, p.stock, p.is_consumable));

  // 5. Active Seed Job Card (Demonstrating Phase 1 and Phase 2)
  const jcToken = 'demo-token-nexon-9011';
  db.prepare(`
    INSERT INTO job_cards (
      id, token, branch_id, reg_no, customer_name, customer_phone, model, fuel_type,
      odometer_in, odometer_photo, fuel_level, service_type, complaints,
      inventory_checklist, scratch_markers, sa_id, sa_name, tech_id, tech_name, bay_number,
      status, estimated_amount, final_amount
    ) VALUES (
      'JC-2026-8899', ?, 'shyam-scheme-140', 'MP-09-WA-9011', 'Pooja Choudhary', '+91 98270 55102',
      'Tata Nexon Creative Plus 1.2 Turbo Petrol', 'Petrol', 24200,
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400', 65,
      '30,000 KM Periodic Maintenance Service (PMS)',
      ?, ?, ?, 'usr-sa-1', 'Ramesh Sharma', 'usr-tech-1', 'Amit Verma (Master Tech)', 4,
      'ESTIMATE_PENDING', 7640, 7640
    )
  `).run(
    jcToken,
    JSON.stringify([
      'Scheduled 30,000 KM Periodic Maintenance Service',
      'Front right wheel metallic squeal noise when applying brakes at 40 km/h',
      'AC blower speed 2 vibrates slightly'
    ]),
    JSON.stringify({
      spareWheel: true,
      toolKit: true,
      dashcamSdRemoved: true,
      fastagChecked: true,
      valuablesDeclared: false
    }),
    JSON.stringify([
      { id: 'sc-1', view: 'left', x: 74, y: 52, type: 'scratch', panel: 'Left Rear Door Lower Edge', severity: 'minor', notes: 'Pre-existing 3cm scratch near door handle' },
      { id: 'sc-2', view: 'front', x: 28, y: 76, type: 'dent', panel: 'Front Bumper Lower Lip', severity: 'moderate', notes: 'Minor stone chip dent under fog lamp bezel' }
    ])
  );

  // 6. Job Card Line Items (Mandatory PMS + Recommended Brake Pads with Video Proof)
  const items = [
    {
      id: 'item-1',
      job_card_id: 'JC-2026-8899',
      item_type: 'LABOR',
      code: 'SAC-9987-PMS30K',
      desc: '30,000 KM Periodic Maintenance Labor (Tata Standard Repair Time 2.2 hrs)',
      qty: 1,
      price: 2200,
      gst: 18,
      total: 2596,
      is_mandatory: 1,
      status: 'APPROVED',
      video: null,
      notes: 'Standard 42-point scheduled inspection & torque check'
    },
    {
      id: 'item-2',
      job_card_id: 'JC-2026-8899',
      item_type: 'PART',
      code: 'LUB-SYN-5W30-35',
      desc: 'Castrol Magnatec Pro Tata 5W30 Fully Synthetic Engine Oil (3.5L)',
      qty: 1,
      price: 2350,
      gst: 18,
      total: 2773,
      is_mandatory: 1,
      status: 'APPROVED',
      video: null,
      notes: 'OEM engine oil replacement per maintenance schedule'
    },
    {
      id: 'item-3',
      job_card_id: 'JC-2026-8899',
      item_type: 'PART',
      code: '287018100109',
      desc: 'OEM Engine Oil Filter Cartridge',
      qty: 1,
      price: 345,
      gst: 18,
      total: 407.1,
      is_mandatory: 1,
      status: 'APPROVED',
      video: null,
      notes: 'Replaced with fresh washer seal'
    },
    {
      id: 'item-4',
      job_card_id: 'JC-2026-8899',
      item_type: 'PART',
      code: '542442100108',
      desc: 'Front Brake Pad Set (Recommended - 2.1mm pad thickness remaining, critical safety wear)',
      qty: 1,
      price: 2450,
      gst: 28,
      total: 3136,
      is_mandatory: 0, // RECOMMENDED UPSELL REQUIRING CUSTOMER APPROVAL
      status: 'PENDING',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-car-mechanic-checking-the-front-wheel-brake-41908-large.mp4',
      notes: 'Vernier caliper measurement showed 2.1mm (OEM limit is 3.0mm). Risk of disc rotor scoring if not replaced.'
    },
    {
      id: 'item-5',
      job_card_id: 'JC-2026-8899',
      item_type: 'LABOR',
      code: 'SAC-9987-BRK-LAB',
      desc: 'Front Brake Disc & Caliper Overhaul Labor',
      qty: 1,
      price: 650,
      gst: 18,
      total: 767,
      is_mandatory: 0,
      status: 'PENDING',
      video: null,
      notes: 'Cleaning, caliper slide pin degreasing, and pad bedding'
    }
  ];

  const insertItem = db.prepare(`
    INSERT INTO job_card_items (
      id, job_card_id, item_type, code, description, qty, unit_price, gst_rate, total_price,
      is_mandatory, approval_status, inspection_video_url, inspection_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  items.forEach(it => insertItem.run(
    it.id, it.job_card_id, it.item_type, it.code, it.desc, it.qty, it.price, it.gst, it.total,
    it.is_mandatory, it.status, it.video, it.notes
  ));

  // 7. Seed initial Bay Operations for JC-2026-8899
  const ops = [
    { id: 'op-01', jcId: 'JC-2026-8899', code: 'PMS-OIL-FLT', desc: 'Engine Oil Drain & Filter Replacement (SRT: 0.6 hr)', srt: 0.6, status: 'COMPLETED', mins: 32 },
    { id: 'op-02', jcId: 'JC-2026-8899', code: 'BRK-INSP-PAD', desc: 'Brake Caliper Inspection & Pad Measurement (SRT: 0.8 hr)', srt: 0.8, status: 'IN_PROGRESS', mins: 25 },
    { id: 'op-03', jcId: 'JC-2026-8899', code: 'WHL-BAL-ALIGN', desc: '4-Wheel High-Speed Balancing & Alignment (SRT: 0.8 hr)', srt: 0.8, status: 'PENDING', mins: 0 }
  ];
  const insertOp = db.prepare(`
    INSERT OR IGNORE INTO bay_operations (id, job_card_id, tech_id, tech_name, operation_code, description, srt_hours, status, actual_minutes_spent)
    VALUES (?, ?, 'usr-tech-1', 'Amit Verma (Master Tech)', ?, ?, ?, ?, ?)
  `);
  ops.forEach(o => insertOp.run(o.id, o.jcId, o.code, o.desc, o.srt, o.status, o.mins));

  // 8. Seed initial Parts Requisitions
  const reqs = [
    { id: 'req-01', jcId: 'JC-2026-8899', bay: 4, sku: '287018100109', name: 'Engine Oil Filter Cartridge', qty: 1, bin: 'Aisle 1 - Rack A - Bin 04', status: 'ISSUED' },
    { id: 'req-02', jcId: 'JC-2026-8899', bay: 4, sku: '542442100108', name: 'Front Disc Brake Pad Kit', qty: 1, bin: 'Aisle 2 - Rack B - Bin 14', status: 'REQUESTED' }
  ];
  const insertReq = db.prepare(`
    INSERT OR IGNORE INTO parts_requisitions (id, job_card_id, bay_number, tech_id, tech_name, sku, part_name, qty, bin_location, status)
    VALUES (?, ?, ?, 'usr-tech-1', 'Amit Verma (Master Tech)', ?, ?, ?, ?, ?)
  `);
  reqs.forEach(r => insertReq.run(r.id, r.jcId, r.bay, r.sku, r.name, r.qty, r.bin, r.status));

  // 9. Seed initial Warranty Claim (Zero-Rejection Fortress)
  db.prepare(`
    INSERT OR IGNORE INTO warranty_claims (
      id, job_card_id, reg_no, vin, part_sku, part_name, dtc_code, dtc_freeze_frame,
      photo_odo, photo_vin, photo_part_mounted, photo_part_removed, status, claim_amount, pre_audit_score
    ) VALUES (
      'claim-01', 'JC-2026-8899', 'MP-09-WA-9011', 'MAT622154N4K99211', '542442100108',
      'Electronic Steering Rack Sensor / Brake Actuator', 'P0AC0',
      '{"engine_rpm": 1820, "coolant_temp_c": 88, "vehicle_speed_kmh": 0, "battery_voltage": 12.6, "freeze_frame_locked": true}',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
      'PRE_AUDIT_PASS', 14250, 100
    )
  `).run();

  console.log('✅ [DB] Enterprise Master Database initialized and seeded successfully.');
}

initSchema();
seedEnterpriseData();

module.exports = {
  db,
  getBranch: (id) => db.prepare('SELECT * FROM branches WHERE id = ?').get(id),
  getAllUsers: () => db.prepare('SELECT id, branch_id, name, role, phone, email, avatar FROM users WHERE is_active = 1').all(),
  getUserByPin: (pin) => db.prepare('SELECT * FROM users WHERE pin = ? AND is_active = 1').get(pin),
  getUserById: (id) => db.prepare('SELECT id, branch_id, name, role, phone, email, avatar FROM users WHERE id = ?').get(id),
  
  // Vehicles
  lookupVehicle: (query) => {
    if (!query) return null;
    const raw = query.trim().toUpperCase();
    const clean = raw.replace(/[^A-Za-z0-9]/g, '');
    const qRaw = `%${raw}%`;
    const directMatch = db.prepare('SELECT * FROM vehicle_master WHERE UPPER(reg_no) LIKE ? OR UPPER(vin) LIKE ? LIMIT 1').get(qRaw, qRaw);
    if (directMatch) return directMatch;
    // Normalized comparison across vehicle master
    const all = db.prepare('SELECT * FROM vehicle_master').all();
    return all.find(v => (v.reg_no || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase() === clean || (v.vin || '').toUpperCase().includes(clean));
  },
  
  // Job Cards
  getJobCards: (branchId = 'shyam-scheme-140') => {
    return db.prepare(`
      SELECT jc.*, 
        (SELECT COUNT(*) FROM job_card_items WHERE job_card_id = jc.id AND approval_status = 'PENDING') as pending_approvals_count
      FROM job_cards jc
      WHERE jc.branch_id = ?
      ORDER BY jc.created_at DESC
    `).all(branchId);
  },
  
  getJobCardById: (id) => {
    const jc = db.prepare('SELECT * FROM job_cards WHERE id = ?').get(id);
    if (!jc) return null;
    jc.complaints = jc.complaints ? JSON.parse(jc.complaints) : [];
    jc.inventory_checklist = jc.inventory_checklist ? JSON.parse(jc.inventory_checklist) : {};
    jc.scratch_markers = jc.scratch_markers ? JSON.parse(jc.scratch_markers) : [];
    jc.items = db.prepare('SELECT * FROM job_card_items WHERE job_card_id = ?').all(id);
    return jc;
  },

  getJobCardByToken: (token) => {
    const jc = db.prepare('SELECT * FROM job_cards WHERE token = ?').get(token);
    if (!jc) return null;
    jc.complaints = jc.complaints ? JSON.parse(jc.complaints) : [];
    jc.inventory_checklist = jc.inventory_checklist ? JSON.parse(jc.inventory_checklist) : {};
    jc.scratch_markers = jc.scratch_markers ? JSON.parse(jc.scratch_markers) : [];
    jc.items = db.prepare('SELECT * FROM job_card_items WHERE job_card_id = ?').all(jc.id);
    return jc;
  },

  createJobCard: (data) => {
    const token = crypto.randomUUID();
    const id = `JC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const insert = db.prepare(`
      INSERT INTO job_cards (
        id, token, branch_id, reg_no, customer_name, customer_phone, model, fuel_type,
        odometer_in, odometer_photo, fuel_level, service_type, complaints,
        inventory_checklist, scratch_markers, customer_signature, sa_id, sa_name,
        status, estimated_amount, final_amount
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        'INTAKE', ?, ?
      )
    `);

    insert.run(
      id,
      token,
      data.branch_id || 'shyam-scheme-140',
      data.reg_no,
      data.customer_name,
      data.customer_phone,
      data.model,
      data.fuel_type || 'Petrol',
      parseInt(data.odometer_in || 0, 10),
      data.odometer_photo || null,
      parseInt(data.fuel_level || 50, 10),
      data.service_type || 'Periodic Maintenance Service',
      JSON.stringify(data.complaints || []),
      JSON.stringify(data.inventory_checklist || {}),
      JSON.stringify(data.scratch_markers || []),
      data.customer_signature || null,
      data.sa_id,
      data.sa_name,
      data.estimated_amount || 0,
      data.estimated_amount || 0
    );

    // If initial items provided, insert them
    if (Array.isArray(data.items)) {
      const insertItem = db.prepare(`
        INSERT INTO job_card_items (
          id, job_card_id, item_type, code, description, qty, unit_price, gst_rate, total_price,
          is_mandatory, approval_status, inspection_video_url, inspection_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      data.items.forEach((it, idx) => {
        insertItem.run(
          `item-${Date.now()}-${idx}`,
          id,
          it.item_type || 'LABOR',
          it.code || 'SAC-9987',
          it.description,
          it.qty || 1,
          it.unit_price,
          it.gst_rate || 18,
          it.total_price || (it.qty * it.unit_price * (1 + (it.gst_rate || 18)/100)),
          it.is_mandatory !== undefined ? it.is_mandatory : 1,
          it.approval_status || 'APPROVED',
          it.inspection_video_url || null,
          it.inspection_notes || null
        );
      });
    }

    return { id, token };
  },

  updateItemApproval: (itemId, approvalStatus) => {
    db.prepare('UPDATE job_card_items SET approval_status = ? WHERE id = ?').run(approvalStatus, itemId);
    
    // Recalculate job card total
    const item = db.prepare('SELECT job_card_id FROM job_card_items WHERE id = ?').get(itemId);
    if (item) {
      const sum = db.prepare(`
        SELECT COALESCE(SUM(total_price), 0) as total 
        FROM job_card_items 
        WHERE job_card_id = ? AND approval_status = 'APPROVED'
      `).get(item.job_card_id).total;
      
      db.prepare('UPDATE job_cards SET estimated_amount = ?, final_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(sum, sum, item.job_card_id);
    }
    return true;
  },

  // ==========================================
  // PHASE 3: WORKSHOP BAY FLOOR & TIMERS
  // ==========================================
  getBayOperations: (jobCardId) => {
    return db.prepare('SELECT * FROM bay_operations WHERE job_card_id = ? ORDER BY started_at ASC').all(jobCardId);
  },

  getAllActiveBayOperations: () => {
    return db.prepare(`
      SELECT bo.*, jc.reg_no, jc.model, jc.customer_name, jc.bay_number
      FROM bay_operations bo
      JOIN job_cards jc ON bo.job_card_id = jc.id
      ORDER BY bo.status = 'IN_PROGRESS' DESC, bo.started_at DESC
    `).all();
  },

  startBayOperation: (opId) => {
    db.prepare(`
      UPDATE bay_operations 
      SET status = 'IN_PROGRESS', started_at = COALESCE(started_at, CURRENT_TIMESTAMP)
      WHERE id = ?
    `).run(opId);
    return true;
  },

  pauseBayOperation: (opId) => {
    db.prepare(`
      UPDATE bay_operations 
      SET status = 'PAUSED', paused_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(opId);
    return true;
  },

  completeBayOperation: (opId, notes, videoUrl) => {
    db.prepare(`
      UPDATE bay_operations 
      SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP, 
          tech_notes = COALESCE(?, tech_notes),
          defect_video_url = COALESCE(?, defect_video_url)
      WHERE id = ?
    `).run(notes || null, videoUrl || null, opId);
    return true;
  },

  createBayOperation: (data) => {
    const id = `op-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO bay_operations (
        id, job_card_id, tech_id, tech_name, operation_code, description, srt_hours, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `).run(
      id, data.job_card_id, data.tech_id || 'usr-tech-1', data.tech_name || 'Amit Verma',
      data.operation_code, data.description, parseFloat(data.srt_hours || 1.0)
    );
    return id;
  },

  // ==========================================
  // PHASE 3: SPARES REQUISITION & BIN INVENTORY
  // ==========================================
  getInventory: () => {
    return db.prepare('SELECT * FROM parts_inventory ORDER BY category ASC, name ASC').all();
  },

  getPartsRequisitions: () => {
    return db.prepare(`
      SELECT pr.*, pi.cost_price, pi.selling_price, pi.stock_qty as available_stock
      FROM parts_requisitions pr
      LEFT JOIN parts_inventory pi ON pr.sku = pi.sku
      ORDER BY pr.status = 'REQUESTED' DESC, pr.requested_at DESC
    `).all();
  },

  requestPart: (data) => {
    const id = `req-${Date.now()}`;
    const part = db.prepare('SELECT * FROM parts_inventory WHERE sku = ?').get(data.sku);
    const binLocation = part?.bin_location || 'Aisle 1 - General Rack';
    const partName = part?.name || data.part_name || 'OEM Genuine Part';

    db.prepare(`
      INSERT INTO parts_requisitions (
        id, job_card_id, bay_number, tech_id, tech_name, sku, part_name, qty, bin_location, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'REQUESTED')
    `).run(
      id, data.job_card_id, data.bay_number || 1, data.tech_id || 'usr-tech-1',
      data.tech_name || 'Amit Verma', data.sku, partName, data.qty || 1, binLocation
    );
    return { id, binLocation, partName };
  },

  issuePart: (requisitionId, issuedBy) => {
    const req = db.prepare('SELECT * FROM parts_requisitions WHERE id = ?').get(requisitionId);
    if (!req) return false;

    // 1. Decrement stock
    db.prepare('UPDATE parts_inventory SET stock_qty = MAX(0, stock_qty - ?) WHERE sku = ?')
      .run(req.qty, req.sku);

    // 2. Mark requisition issued
    db.prepare("UPDATE parts_requisitions SET status = 'ISSUED', issued_at = CURRENT_TIMESTAMP, issued_by = ? WHERE id = ?")
      .run(issuedBy || 'Rajesh Malviya (Parts Store)', requisitionId);

    // 3. Add billable line item to job card
    const part = db.prepare('SELECT * FROM parts_inventory WHERE sku = ?').get(req.sku);
    if (part) {
      const itemId = `item-part-${Date.now()}`;
      const totalPrice = req.qty * part.selling_price * (1 + (part.gst_rate / 100));
      db.prepare(`
        INSERT INTO job_card_items (
          id, job_card_id, item_type, code, description, qty, unit_price, gst_rate, total_price,
          is_mandatory, approval_status, bin_location, issued_at
        ) VALUES (?, ?, 'PART', ?, ?, ?, ?, ?, ?, 1, 'APPROVED', ?, CURRENT_TIMESTAMP)
      `).run(
        itemId, req.job_card_id, part.sku, part.name, req.qty, part.selling_price,
        part.gst_rate, totalPrice, req.bin_location
      );

      // Recalculate job card total
      const sum = db.prepare(`
        SELECT COALESCE(SUM(total_price), 0) as total 
        FROM job_card_items 
        WHERE job_card_id = ? AND approval_status = 'APPROVED'
      `).get(req.job_card_id).total;
      db.prepare('UPDATE job_cards SET estimated_amount = ?, final_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(sum, sum, req.job_card_id);
    }
    return true;
  },

  autoLinkConsumables: (jobCardId) => {
    const consumables = [
      { sku: 'CONS-BRK-CLN-400', qty: 1 },
      { sku: 'CONS-CAL-GRS-50', qty: 1 }
    ];

    consumables.forEach(c => {
      const part = db.prepare('SELECT * FROM parts_inventory WHERE sku = ?').get(c.sku);
      if (part) {
        const itemId = `item-cons-${Date.now()}-${c.sku}`;
        const totalPrice = c.qty * part.selling_price * (1 + (part.gst_rate / 100));
        db.prepare(`
          INSERT INTO job_card_items (
            id, job_card_id, item_type, code, description, qty, unit_price, gst_rate, total_price,
            is_mandatory, approval_status, bin_location, issued_at
          ) VALUES (?, ?, 'CONSUMABLE', ?, ?, ?, ?, ?, ?, 1, 'APPROVED', ?, CURRENT_TIMESTAMP)
        `).run(
          itemId, jobCardId, part.sku, `[Consumable] ${part.name}`, c.qty, part.selling_price,
          part.gst_rate, totalPrice, part.bin_location
        );

        db.prepare('UPDATE parts_inventory SET stock_qty = MAX(0, stock_qty - ?) WHERE sku = ?').run(c.qty, c.sku);
      }
    });

    const sum = db.prepare(`
      SELECT COALESCE(SUM(total_price), 0) as total 
      FROM job_card_items 
      WHERE job_card_id = ? AND approval_status = 'APPROVED'
    `).get(jobCardId).total;
    db.prepare('UPDATE job_cards SET estimated_amount = ?, final_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(sum, sum, jobCardId);

    return true;
  },

  // ==========================================
  // PHASE 4: STATUTORY GST & GATE PASS
  // ==========================================
  computeGstSummary: (jobCardId) => {
    const items = db.prepare("SELECT * FROM job_card_items WHERE job_card_id = ? AND approval_status = 'APPROVED'").all(jobCardId);
    
    let taxableLabor = 0;
    let taxableSpares = 0;
    let laborGst = 0;
    let sparesGst = 0;

    items.forEach(it => {
      const base = it.qty * it.unit_price;
      if (it.item_type === 'LABOR') {
        taxableLabor += base;
        laborGst += base * 0.18;
      } else {
        taxableSpares += base;
        sparesGst += base * (it.gst_rate / 100);
      }
    });

    const laborCgst = taxableLabor * 0.09;
    const laborSgst = taxableLabor * 0.09;
    const sparesCgst = sparesGst / 2;
    const sparesSgst = sparesGst / 2;
    const grandTotal = taxableLabor + laborGst + taxableSpares + sparesGst;

    return {
      taxableLabor: Math.round(taxableLabor * 100) / 100,
      laborCgst: Math.round(laborCgst * 100) / 100,
      laborSgst: Math.round(laborSgst * 100) / 100,
      taxableSpares: Math.round(taxableSpares * 100) / 100,
      sparesCgst: Math.round(sparesCgst * 100) / 100,
      sparesSgst: Math.round(sparesSgst * 100) / 100,
      totalGst: Math.round((laborGst + sparesGst) * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      items
    };
  },

  settleInvoiceAndGenerateGatePass: (jobCardId, paymentMode, paymentRef, cashierId, cashierName) => {
    const jc = db.prepare('SELECT * FROM job_cards WHERE id = ?').get(jobCardId);
    if (!jc) return null;

    // Direct computation
    const items = db.prepare("SELECT * FROM job_card_items WHERE job_card_id = ? AND approval_status = 'APPROVED'").all(jobCardId);
    let taxableLabor = 0;
    let taxableSpares = 0;
    let laborGst = 0;
    let sparesGst = 0;

    items.forEach(it => {
      const base = it.qty * it.unit_price;
      if (it.item_type === 'LABOR') {
        taxableLabor += base;
        laborGst += base * 0.18;
      } else {
        taxableSpares += base;
        sparesGst += base * (it.gst_rate / 100);
      }
    });

    const laborCgst = Math.round(taxableLabor * 0.09 * 100) / 100;
    const laborSgst = Math.round(taxableLabor * 0.09 * 100) / 100;
    const sparesCgst = Math.round((sparesGst / 2) * 100) / 100;
    const sparesSgst = Math.round((sparesGst / 2) * 100) / 100;
    const grandTotal = Math.round((taxableLabor + laborGst + taxableSpares + sparesGst) * 100) / 100;

    const invoiceNo = `INV-TAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const settlementId = `settle-${Date.now()}`;

    // 1. Record Settlement
    db.prepare(`
      INSERT OR REPLACE INTO billing_settlements (
        id, job_card_id, invoice_no, reg_no, customer_name,
        taxable_labor, labor_cgst, labor_sgst, taxable_spares, spares_cgst, spares_sgst,
        grand_total, payment_mode, payment_ref, cashier_id, cashier_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      settlementId, jobCardId, invoiceNo, jc.reg_no, jc.customer_name,
      taxableLabor, laborCgst, laborSgst,
      taxableSpares, sparesCgst, sparesSgst,
      grandTotal, paymentMode, paymentRef, cashierId || 'usr-cashier-1', cashierName || 'Sunita Chouhan'
    );

    // 2. Update Job Card Status
    db.prepare("UPDATE job_cards SET status = 'PAID', final_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(grandTotal, jobCardId);

    // 3. Generate Tamper-Proof Security Gate Pass Code
    const passCode = `GP-${jc.reg_no.replace(/[^A-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const gatePassId = `gp-${Date.now()}`;

    db.prepare(`
      INSERT OR REPLACE INTO gate_passes (
        id, pass_code, job_card_id, invoice_no, reg_no, customer_name, model, gate_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      gatePassId, passCode, jobCardId, invoiceNo, jc.reg_no, jc.customer_name, jc.model
    );

    return {
      invoiceNo,
      passCode,
      grandTotal,
      taxableLabor,
      taxableSpares,
      totalGst: laborGst + sparesGst,
      paymentMode,
      paymentRef,
      customerName: jc.customer_name,
      regNo: jc.reg_no
    };
  },

  getAllGatePasses: () => {
    return db.prepare('SELECT * FROM gate_passes ORDER BY generated_at DESC').all();
  },

  getGatePassByCode: (code) => {
    return db.prepare('SELECT * FROM gate_passes WHERE pass_code = ?').get(code);
  },

  verifyAndClearGatePass: (passCode, guardId, guardName, guardNotes) => {
    const pass = db.prepare('SELECT * FROM gate_passes WHERE pass_code = ?').get(passCode);
    if (!pass) return { valid: false, message: 'Invalid Gate Pass Code' };
    if (pass.gate_status === 'EXITED') {
      return { valid: false, message: `Vehicle already exited at ${pass.exited_at} (Logged by ${pass.guard_name})` };
    }

    db.prepare(`
      UPDATE gate_passes 
      SET gate_status = 'EXITED', exited_at = CURRENT_TIMESTAMP, guard_id = ?, guard_name = ?, guard_notes = ?
      WHERE pass_code = ?
    `).run(guardId || 'usr-guard-1', guardName || 'Ram Singh', guardNotes || 'Physical inspection OK', passCode);

    db.prepare("UPDATE job_cards SET status = 'GATE_PASSED', gate_exit_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(pass.job_card_id);

    return {
      valid: true,
      message: 'Gate Clearance Granted. Vehicle Allowed to Exit.',
      pass: { ...pass, gate_status: 'EXITED', exited_at: new Date().toISOString() }
    };
  },

  // ==========================================
  // PHASE 5: AI WARRANTY FORTRESS & EXECUTIVE P&L
  // ==========================================
  getWarrantyClaims: () => {
    return db.prepare('SELECT * FROM warranty_claims ORDER BY created_at DESC').all();
  },

  submitWarrantyClaim: (data) => {
    const id = `claim-${Date.now()}`;
    let score = 0;
    if (data.photo_odo) score += 25;
    if (data.photo_vin) score += 25;
    if (data.photo_part_mounted) score += 25;
    if (data.photo_part_removed) score += 25;

    const status = score === 100 ? 'PRE_AUDIT_PASS' : 'PENDING_PRE_AUDIT';
    const deadline = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

    db.prepare(`
      INSERT INTO warranty_claims (
        id, job_card_id, reg_no, vin, part_sku, part_name, dtc_code, dtc_freeze_frame,
        photo_odo, photo_vin, photo_part_mounted, photo_part_removed, status, claim_amount,
        pre_audit_score, oem_submission_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.job_card_id, data.reg_no, data.vin || 'MAT622154N4K99211',
      data.part_sku || '542442100108', data.part_name || 'Front Brake Pad / Sensor', data.dtc_code || 'P0AC0',
      JSON.stringify(data.dtc_freeze_frame || { rpm: 1850, coolantTemp: '89C', throttlePos: '22%' }),
      data.photo_odo || null, data.photo_vin || null,
      data.photo_part_mounted || null, data.photo_part_removed || null,
      status, parseFloat(data.claim_amount || 4800), score, deadline
    );

    return { id, score, status, deadline };
  },

  check30DayRepeatComplaints: () => {
    return [
      {
        reg_no: 'MP-09-CZ-4412',
        customer_name: 'Devendra Rathore',
        model: 'Tata Harrier Fearless Plus Dark Edition',
        previousVisitDate: '2026-09-18 (22 days ago)',
        previousKm: 11950,
        currentKm: 12400,
        kmDiff: 450,
        complaint: 'Clutch pedal shudder / vibration during 1st gear release',
        riskLevel: 'CRITICAL_HIGH',
        worksManagerAlert: 'Risk of Consumer Court Notice. Prior repair was "Clutch line bleeding". Works Manager mandatory test drive required.'
      }
    ];
  },

  getDailyExecutiveLedger: (branchId = 'shyam-scheme-140') => {
    const settlements = db.prepare('SELECT * FROM billing_settlements').all();
    
    let totalInvoiced = 0;
    let totalLaborBilled = 0;
    let totalSparesBilled = 0;
    let totalGstCollected = 0;

    settlements.forEach(s => {
      totalInvoiced += s.grand_total;
      totalLaborBilled += s.taxable_labor;
      totalSparesBilled += s.taxable_spares;
      totalGstCollected += (s.labor_cgst + s.labor_sgst + s.spares_cgst + s.spares_sgst);
    });

    const laborRevenue = totalLaborBilled > 0 ? totalLaborBilled : 36400;
    const sparesRevenue = totalSparesBilled > 0 ? totalSparesBilled : 48250;
    const invoiced = totalInvoiced > 0 ? totalInvoiced : 84650;

    const laborCost = Math.round(laborRevenue * 0.28);
    const laborMargin = laborRevenue - laborCost;
    const laborMarginPct = Math.round((laborMargin / laborRevenue) * 100);

    const sparesCost = Math.round(sparesRevenue * 0.68);
    const sparesMargin = sparesRevenue - sparesCost;
    const sparesMarginPct = Math.round((sparesMargin / sparesRevenue) * 100);

    const activeBays = 18;
    const bayYieldPerHour = Math.round(invoiced / (activeBays * 7.5));

    return {
      branchId,
      branchName: 'Shyam Automotive (Tata Motors, Indore)',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalInvoiced: invoiced,
      totalLaborBilled: laborRevenue,
      laborGrossMargin: laborMargin,
      laborGrossMarginPercent: laborMarginPct,
      totalSparesBilled: sparesRevenue,
      sparesGrossMargin: sparesMargin,
      sparesGrossMarginPercent: sparesMarginPct,
      totalGstCollected: totalGstCollected || 15200,
      activeBays,
      bayYieldPerHour,
      settledCount: settlements.length || 6,
      settlements
    };
  },

  // Pickup Assignment methods
  getAllPickups: () => db.prepare('SELECT * FROM pickup_assignments ORDER BY created_at DESC').all(),
  getPickupById: (id) => db.prepare('SELECT * FROM pickup_assignments WHERE id = ?').get(id),
  getPickupByToken: (token) => db.prepare('SELECT * FROM pickup_assignments WHERE pickup_token = ?').get(token),
  getPickupsByDate: (date) => db.prepare("SELECT * FROM pickup_assignments WHERE date(scheduled_at) = date(?)").all(date),
  createPickup: (data) => {
    const id = 'PKP-' + Date.now();
    const token = require('crypto').randomUUID();
    db.prepare(`INSERT INTO pickup_assignments 
      (id, job_card_id, valet_id, valet_name, valet_phone, valet_employee_id, customer_name, customer_phone, customer_address, vehicle_model, vehicle_reg, scheduled_at, pickup_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')
    `).run(id, data.job_card_id || null, data.valet_id, data.valet_name, data.valet_phone || null, data.valet_employee_id, data.customer_name, data.customer_phone, data.customer_address, data.vehicle_model, data.vehicle_reg, data.scheduled_at, token);
    return { id, token };
  },
  updatePickupStatus: (id, status, extras = {}) => {
    const sets = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const vals = [status];
    const colMap = {
      photo_front: 'photo_front', photo_rear: 'photo_rear', photo_left: 'photo_left',
      photo_right: 'photo_right', photo_odometer: 'photo_odometer', photo_fuel: 'photo_fuel',
      video_walkaround: 'video_walkaround', odometer_reading: 'odometer_reading', fuel_level: 'fuel_level',
      customer_signature: 'customer_signature', pickup_notes: 'pickup_notes', job_card_id: 'job_card_id'
    };
    const tsMap = { VALET_DISPATCHED: 'dispatched_at', VEHICLE_COLLECTED: 'collected_at', REACHED_SHOWROOM: 'reached_at' };
    Object.entries(extras).forEach(([k, v]) => { if (colMap[k] && v !== undefined) { sets.push(`${colMap[k]} = ?`); vals.push(v); } });
    if (tsMap[status]) { sets.push(`${tsMap[status]} = CURRENT_TIMESTAMP`); }
    vals.push(id);
    // Add updated_at column if not there
    try { db.prepare('ALTER TABLE pickup_assignments ADD COLUMN updated_at DATETIME').run(); } catch(e) {}
    db.prepare(`UPDATE pickup_assignments SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return db.prepare('SELECT * FROM pickup_assignments WHERE id = ?').get(id);
  },

  // Test Drive Leads & CRE CRM Engine
  createTestDriveLead: (data) => {
    const id = data.id || ('LEAD-TD-' + Date.now().toString().slice(-6));
    db.prepare(`
      INSERT INTO leads_test_drive (id, customer_name, customer_phone, customer_email, vehicle_model, preferred_date, preferred_slot, branch, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'HOT_LEAD_PENDING_CALLBACK')
    `).run(id, data.customerName, data.customerPhone, data.customerEmail || null, data.model, data.preferredDate || null, data.preferredSlot || null, data.branch || null, data.notes || null);
    return { id };
  },
  getAllTestDriveLeads: () => db.prepare('SELECT * FROM leads_test_drive ORDER BY created_at DESC').all(),

  createEnquiryLead: (data) => {
    const id = data.id || ('ENQ-' + Date.now().toString().slice(-6));
    db.prepare(`
      INSERT INTO leads_enquiries (id, type, customer_name, customer_phone, customer_email, vehicle_model, vehicle_reg, preferred_date, preferred_slot, branch, notes, payload_json, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_CONTACT')
    `).run(
      id,
      data.type || 'GENERAL_ENQUIRY',
      data.customerName,
      data.customerPhone,
      data.customerEmail || null,
      data.vehicleModel || null,
      data.vehicleReg || null,
      data.preferredDate || null,
      data.preferredSlot || null,
      data.branch || null,
      data.notes || null,
      data.payload ? JSON.stringify(data.payload) : null
    );
    return { id };
  },
  getAllEnquiryLeads: () => db.prepare('SELECT * FROM leads_enquiries ORDER BY created_at DESC').all(),

  // Phase 4: CRE Telecaller Enriched Vehicle History
  getVehicleServiceHistory: (regNo) => {
    const cleanReg = (regNo || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const allJcs = db.prepare('SELECT * FROM job_cards ORDER BY created_at DESC').all();
    const history = allJcs.filter(j => (j.reg_no || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().includes(cleanReg));
    
    // For each past job card, attach items & operations
    return history.map(jc => {
      const items = db.prepare('SELECT * FROM job_card_items WHERE job_card_id = ?').all(jc.id);
      const ops = db.prepare('SELECT * FROM bay_operations WHERE job_card_id = ?').all(jc.id);
      return {
        ...jc,
        items,
        operations: ops
      };
    });
  },
  getVehiclePastRecommendations: (regNo) => {
    const cleanReg = (regNo || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const allJcs = db.prepare('SELECT * FROM job_cards').all();
    const matchingJcIds = allJcs.filter(j => (j.reg_no || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().includes(cleanReg)).map(j => j.id);
    
    if (matchingJcIds.length === 0) return [];
    const placeholders = matchingJcIds.map(() => '?').join(',');
    return db.prepare(`SELECT * FROM job_card_items WHERE job_card_id IN (${placeholders}) AND (approval_status = 'DECLINED' OR (is_mandatory = 0 AND approval_status != 'APPROVED'))`).all(...matchingJcIds);
  },

  // Phase 5: Dealership Data Ingestion (Bulk Vehicles & History Import)
  bulkImportVehicles: (vehicles) => {
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO vehicle_master (
        reg_no, vin, model, fuel_type, year_mfg, customer_name, customer_phone,
        customer_email, customer_address, last_service_date, last_service_km,
        vip_flag, active_extended_warranty, open_recalls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let importedCount = 0;
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        if (!row.reg_no || !row.customer_name) continue;
        insertStmt.run(
          row.reg_no.trim().toUpperCase(),
          row.vin || `MAT${Date.now().toString().slice(-8)}${Math.floor(Math.random()*900+100)}`,
          row.model || 'Tata Nexon',
          row.fuel_type || 'Petrol',
          parseInt(row.year_mfg) || 2023,
          row.customer_name.trim(),
          row.customer_phone || '+91 98000 00000',
          row.customer_email || null,
          row.customer_address || 'Indore, MP',
          row.last_service_date || new Date().toISOString().split('T')[0],
          parseInt(row.last_service_km) || 15000,
          row.vip_flag ? 1 : 0,
          row.active_extended_warranty ? 1 : 0,
          row.open_recalls || 'None'
        );
        importedCount++;
      }
    });

    insertMany(vehicles);
    return { success: true, count: importedCount };
  },

  getAllVehicles: (limit = 100) => {
    return db.prepare('SELECT * FROM vehicle_master ORDER BY created_at DESC LIMIT ?').all(limit);
  },

  // Phase 8: Tata Motors e-DMS Siebel Shadow Sync Queue
  getDmsSyncRecords: () => {
    return db.prepare('SELECT * FROM dms_sync_records ORDER BY synced_at DESC LIMIT 50').all();
  },

  recordDmsSync: (jobCardId, regNo, syncType, dmsRoNumber, payload) => {
    const id = `dms-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const ackCode = `ACK-TATA-${Date.now().toString().slice(-6)}`;
    db.prepare(`
      INSERT INTO dms_sync_records (id, job_card_id, reg_no, sync_type, dms_ro_number, status, payload_json, ack_code)
      VALUES (?, ?, ?, ?, ?, 'SYNCED', ?, ?)
    `).run(id, jobCardId || null, regNo, syncType, dmsRoNumber || `RO-${Date.now().toString().slice(-5)}`, JSON.stringify(payload || {}), ackCode);
    return { id, ackCode, status: 'SYNCED' };
  },

  // Customer Mobile Super-App & Garage Hub
  getCustomerGarage: (queryIdentifier) => {
    if (!queryIdentifier) return [];
    const clean = queryIdentifier.trim();
    const cleanDigits = clean.replace(/[^0-9]/g, '');
    
    // Search by email, phone, reg_no, or customer name
    const vehicles = db.prepare(`
      SELECT * FROM vehicle_master 
      WHERE customer_email = ? 
         OR (length(?) >= 8 AND customer_phone LIKE ?)
         OR reg_no = ?
         OR customer_name LIKE ?
      ORDER BY created_at DESC
    `).all(clean, cleanDigits, `%${cleanDigits}%`, clean.toUpperCase(), `%${clean}%`);

    return vehicles.map(v => {
      const activeJc = db.prepare(`
        SELECT * FROM job_cards 
        WHERE reg_no = ? AND status != 'DELIVERED'
        ORDER BY created_at DESC LIMIT 1
      `).get(v.reg_no);

      const pastHistory = db.prepare(`
        SELECT id, created_at, service_type, odometer_in, status, final_amount, estimated_amount 
        FROM job_cards 
        WHERE reg_no = ?
        ORDER BY created_at DESC LIMIT 5
      `).all(v.reg_no);

      const mfgYear = v.year_mfg || 2023;
      const warrantyEndYear = mfgYear + (v.active_extended_warranty ? 5 : 3);
      const isWarrantyActive = warrantyEndYear >= new Date().getFullYear();

      return {
        ...v,
        activeJobCard: activeJc ? {
          ...activeJc,
          complaints: activeJc.complaints ? JSON.parse(activeJc.complaints) : []
        } : null,
        serviceHistory: pastHistory,
        warranty: {
          isActive: isWarrantyActive,
          type: v.active_extended_warranty ? 'Tata Care+ Extended Warranty (5-Year / 1,00,000 KM)' : 'Tata Standard Factory Warranty (3-Year / 1,00,000 KM)',
          expiryDate: `30 Nov ${warrantyEndYear}`,
          coverage: 'Engine, Transmission, Suspension, Electricals, High-Voltage Battery & Motor (EV)'
        },
        rsa: {
          isActive: true,
          policyNumber: `TATA-RSA-${v.reg_no.replace(/[^A-Za-z0-9]/g, '')}`,
          validTill: `31 Dec ${mfgYear + 5}`,
          tollFree: '1800 209 8282',
          dealershipHotline: '+91 88798 97825'
        },
        insurance: {
          provider: 'Tata AIG General Insurance',
          policyNumber: `016${Math.floor(100000000 + Math.random() * 900000000)}`,
          coverage: 'Comprehensive 1-Yr OD + 3-Yr TP (Zero Depreciation)',
          validTill: '18 Dec 2026',
          idv: v.model.includes('Harrier') ? 2250000 : v.model.includes('Nexon EV') ? 1780000 : 1150000
        },
        puc: {
          valid: true,
          validTill: '14 Jan 2027',
          emissionNorm: 'BS-VI OBD-II Compliant'
        }
      };
    });
  },

  linkVehicleToCustomer: (regNo, customerEmail, customerPhone) => {
    const cleanReg = (regNo || '').trim().toUpperCase();
    const existing = db.prepare('SELECT * FROM vehicle_master WHERE reg_no = ?').get(cleanReg);
    if (existing) {
      db.prepare(`
        UPDATE vehicle_master 
        SET customer_email = COALESCE(?, customer_email),
            customer_phone = COALESCE(?, customer_phone)
        WHERE reg_no = ?
      `).run(customerEmail || null, customerPhone || null, cleanReg);
      return { success: true, vehicle: existing };
    }
    return { success: false, error: 'Vehicle registration not found in master records' };
  }
};

