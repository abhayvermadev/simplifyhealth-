import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Users table (authenticated via Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('STATE_NODAL_OFFICER'),
  designatedState: text('designated_state'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
});

// Inter-district supply transfers
export const redistributionTransfers = pgTable('redistribution_transfers', {
  id: text('id').primaryKey(),
  sourceDistrictId: text('source_district_id').notNull(),
  sourceDistrictName: text('source_district_name').notNull(),
  targetDistrictId: text('target_district_id').notNull(),
  targetDistrictName: text('target_district_name').notNull(),
  itemType: text('item_type').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  urgency: text('urgency').notNull(),
  transitStatus: text('transit_status').notNull(),
  vehicleType: text('vehicle_type'),
  distanceKm: integer('distance_km'),
  etaHours: integer('eta_hours'),
  rationale: text('rationale'),
  temperatureControlled: boolean('temperature_controlled').default(true),
  dispatchedAt: text('dispatched_at').notNull(),
  createdByUid: text('created_by_uid'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Facility live telemetry overrides (PHC/CHC inventory & beds)
export const facilityTelemetry = pgTable('facility_telemetry', {
  id: serial('id').primaryKey(),
  facilityId: text('facility_id').notNull().unique(),
  occupiedBeds: integer('occupied_beds'),
  oxygenHoursRemaining: integer('oxygen_hours_remaining'),
  medicineStocks: text('medicine_stocks'),
  notes: text('notes'),
  updatedByUid: text('updated_by_uid'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Outbreak protocol response tracking
export const outbreakProtocols = pgTable('outbreak_protocols', {
  id: text('id').primaryKey(),
  diseaseName: text('disease_name').notNull(),
  emergencyActionStatus: text('emergency_action_status').notNull(),
  containmentProtocols: text('containment_protocols'),
  updatedByUid: text('updated_by_uid'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Clinical and Resource Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  transfers: many(redistributionTransfers),
  auditLogs: many(auditLogs),
}));

export const redistributionTransfersRelations = relations(
  redistributionTransfers,
  ({ one }) => ({
    author: one(users, {
      fields: [redistributionTransfers.createdByUid],
      references: [users.uid],
    }),
  })
);
