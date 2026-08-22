import { db } from './index.ts';
import {
  redistributionTransfers,
  facilityTelemetry,
  outbreakProtocols,
  auditLogs,
} from './schema.ts';
import { eq, desc } from 'drizzle-orm';

// Redistribution Transfers
export async function getAllTransfers() {
  try {
    return await db
      .select()
      .from(redistributionTransfers)
      .orderBy(desc(redistributionTransfers.createdAt));
  } catch (error) {
    console.error('Database query getAllTransfers failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function insertTransfer(data: {
  id: string;
  sourceDistrictId: string;
  sourceDistrictName: string;
  targetDistrictId: string;
  targetDistrictName: string;
  itemType: string;
  quantity: number;
  unit: string;
  urgency: string;
  transitStatus: string;
  vehicleType?: string;
  distanceKm?: number;
  etaHours?: number;
  rationale?: string;
  temperatureControlled?: boolean;
  dispatchedAt: string;
  createdByUid?: string;
}) {
  try {
    const result = await db
      .insert(redistributionTransfers)
      .values(data)
      .onConflictDoUpdate({
        target: redistributionTransfers.id,
        set: {
          transitStatus: data.transitStatus,
          etaHours: data.etaHours,
          rationale: data.rationale,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query insertTransfer failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function updateTransferStatus(id: string, transitStatus: string) {
  try {
    const result = await db
      .update(redistributionTransfers)
      .set({ transitStatus })
      .where(eq(redistributionTransfers.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query updateTransferStatus failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

// Facility Telemetry
export async function getFacilityTelemetry() {
  try {
    return await db.select().from(facilityTelemetry);
  } catch (error) {
    console.error('Database query getFacilityTelemetry failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function upsertFacilityTelemetry(data: {
  facilityId: string;
  occupiedBeds?: number;
  oxygenHoursRemaining?: number;
  medicineStocks?: string;
  notes?: string;
  updatedByUid?: string;
}) {
  try {
    const result = await db
      .insert(facilityTelemetry)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: facilityTelemetry.facilityId,
        set: {
          occupiedBeds: data.occupiedBeds,
          oxygenHoursRemaining: data.oxygenHoursRemaining,
          medicineStocks: data.medicineStocks,
          notes: data.notes,
          updatedByUid: data.updatedByUid,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query upsertFacilityTelemetry failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

// Outbreak Protocols
export async function getOutbreakProtocols() {
  try {
    return await db.select().from(outbreakProtocols);
  } catch (error) {
    console.error('Database query getOutbreakProtocols failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function upsertOutbreakProtocol(data: {
  id: string;
  diseaseName: string;
  emergencyActionStatus: string;
  containmentProtocols?: string;
  updatedByUid?: string;
}) {
  try {
    const result = await db
      .insert(outbreakProtocols)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: outbreakProtocols.id,
        set: {
          emergencyActionStatus: data.emergencyActionStatus,
          containmentProtocols: data.containmentProtocols,
          updatedByUid: data.updatedByUid,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query upsertOutbreakProtocol failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

// Audit Logs
export async function logAuditEvent(data: {
  userUid?: string;
  action: string;
  entity: string;
  details?: string;
}) {
  try {
    const result = await db.insert(auditLogs).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database query logAuditEvent failed:', error);
    // Non-fatal, do not throw
    return null;
  }
}
