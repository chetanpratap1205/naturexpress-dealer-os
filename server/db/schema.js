import { pgTable, text, serial, integer, timestamp, jsonb, boolean, numeric, varchar } from 'drizzle-orm/pg-core';

// 1. Dealership Branches Cluster
export const dealershipBranches = pgTable('dealership_branches', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  baysCount: integer('bays_count').default(18),
  activeJobCards: integer('active_job_cards').default(0),
  dailyTargetRevenue: numeric('daily_target_revenue', { precision: 12, scale: 2 }).default('850000.00'),
  gstin: varchar('gstin', { length: 32 }).default('23AABCT9988K1Z5'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Job Cards / Repair Orders
export const jobCards = pgTable('job_cards', {
  id: varchar('id', { length: 64 }).primaryKey(),
  branchId: varchar('branch_id', { length: 64 }).references(() => dealershipBranches.id),
  vehicleModel: text('vehicle_model').notNull(),
  registrationNumber: varchar('reg_no', { length: 32 }).notNull(),
  vin: varchar('vin', { length: 32 }),
  customerName: text('customer_name').notNull(),
  customerPhone: varchar('customer_phone', { length: 32 }),
  serviceType: text('service_type').notNull(),
  status: varchar('status', { length: 32 }).default('in_progress'),
  bayAssigned: integer('bay_assigned'),
  technician: text('technician'),
  serviceAdvisor: text('service_advisor'),
  estimatedAmount: numeric('estimated_amount', { precision: 10, scale: 2 }),
  finalAmount: numeric('final_amount', { precision: 10, scale: 2 }),
  edmsSynced: boolean('edms_synced').default(false),
  edmsJobCardNumber: varchar('edms_ro_number', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Daily Revenue Opportunities & Recovery Actions
export const revenueOpportunities = pgTable('revenue_opportunities', {
  id: varchar('id', { length: 64 }).primaryKey(),
  branchId: varchar('branch_id', { length: 64 }).references(() => dealershipBranches.id),
  jobCardId: varchar('job_card_id', { length: 64 }),
  category: varchar('category', { length: 32 }).notNull(), // 'insurance', 'accessories', 'warranty', 'overdue_service', 'unapproved_estimate'
  title: text('title').notNull(),
  customerName: text('customer_name'),
  vehicleModel: text('vehicle_model'),
  potentialRevenue: numeric('potential_revenue', { precision: 10, scale: 2 }).notNull(),
  dealerMargin: numeric('dealer_margin', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 32 }).default('pending'), // 'pending', 'sent', 'recovered', 'declined'
  lastActionAt: timestamp('last_action_at'),
  actionLog: jsonb('action_log').default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. SHA-256 Cryptographic Audit Ledger
export const auditLedger = pgTable('audit_ledger', {
  id: serial('id').primaryKey(),
  branchId: varchar('branch_id', { length: 64 }),
  eventType: varchar('event_type', { length: 64 }).notNull(),
  recordId: varchar('record_id', { length: 64 }),
  serviceAdvisor: text('service_advisor'),
  details: text('details'),
  previousHash: varchar('previous_hash', { length: 128 }).notNull(),
  currentHash: varchar('current_hash', { length: 128 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. AI Warranty Claims (Zero-Rejection Engine)
export const warrantyClaims = pgTable('warranty_claims', {
  id: varchar('id', { length: 64 }).primaryKey(),
  branchId: varchar('branch_id', { length: 64 }),
  jobCardId: varchar('job_card_id', { length: 64 }),
  vin: varchar('vin', { length: 32 }),
  failedPartNumber: varchar('part_number', { length: 64 }),
  partDescription: text('part_description'),
  claimAmount: numeric('claim_amount', { precision: 10, scale: 2 }),
  ocrMatchScore: numeric('ocr_match_score', { precision: 5, scale: 2 }),
  dtcCode: varchar('dtc_code', { length: 32 }),
  dtcFreezeFrame: jsonb('dtc_freeze_frame'),
  photosVerified: boolean('photos_verified').default(false),
  status: varchar('status', { length: 32 }).default('verified_ready_for_edms'),
  createdAt: timestamp('created_at').defaultNow(),
});
