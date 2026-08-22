import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { RedistributionTransfer } from '../types';

const TRANSFERS_COLLECTION = 'transfers';
const FACILITY_OVERRIDES_COLLECTION = 'facilityOverrides';
const OUTBREAK_PROTOCOLS_COLLECTION = 'outbreakProtocols';
const USERS_COLLECTION = 'users';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  role: 'STATE_NODAL_OFFICER' | 'DISTRICT_CHIEF_MEDICAL_OFFICER' | 'PHC_MEDICAL_OFFICER' | 'EPIDEMIOLOGY_DIRECTOR';
  designatedState?: string;
  lastActive: string;
}

// Helper to get auth token
async function getAuthHeader(): Promise<Record<string, string>> {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    } catch {
      return {};
    }
  }
  return {};
}

// 1. Redistribution Transfers
export async function saveTransferToFirestore(transfer: RedistributionTransfer): Promise<void> {
  const path = `${TRANSFERS_COLLECTION}/${transfer.id}`;
  try {
    const docRef = doc(db, TRANSFERS_COLLECTION, transfer.id);
    await setDoc(docRef, {
      ...transfer,
      createdBy: auth.currentUser?.uid || 'anonymous_officer',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  // Also sync to Cloud SQL backend
  try {
    const headers = await getAuthHeader();
    await fetch('/api/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(transfer),
    });
  } catch (e) {
    console.warn('PostgreSQL backend transfer sync failed (handled silently):', e);
  }
}

export async function updateTransferStatusInFirestore(
  transferId: string,
  newStatus: RedistributionTransfer['transitStatus']
): Promise<void> {
  const path = `${TRANSFERS_COLLECTION}/${transferId}`;
  try {
    const docRef = doc(db, TRANSFERS_COLLECTION, transferId);
    await updateDoc(docRef, {
      transitStatus: newStatus,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  // Also sync status update to Cloud SQL backend
  try {
    const headers = await getAuthHeader();
    await fetch(`/api/transfers/${transferId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ transitStatus: newStatus }),
    });
  } catch (e) {
    console.warn('PostgreSQL backend transfer status sync failed (handled silently):', e);
  }
}

export function subscribeToTransfers(
  onUpdate: (transfers: RedistributionTransfer[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, TRANSFERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: RedistributionTransfer[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as RedistributionTransfer);
      });
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore transfers listener fallback:', error.message);
      if (onError) onError(error);
    }
  );
}

// 2. Facility Telemetry Overrides (Stock, Beds, Oxygen)
export async function saveFacilityOverride(
  facilityId: string,
  data: {
    occupiedBeds?: number;
    oxygenHoursRemaining?: number;
    medicineStocks?: string;
    notes?: string;
  }
): Promise<void> {
  const path = `${FACILITY_OVERRIDES_COLLECTION}/${facilityId}`;
  try {
    const docRef = doc(db, FACILITY_OVERRIDES_COLLECTION, facilityId);
    await setDoc(
      docRef,
      {
        facilityId,
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'officer',
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  // Also sync to Cloud SQL backend
  try {
    const headers = await getAuthHeader();
    await fetch('/api/facility-telemetry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ facilityId, ...data }),
    });
  } catch (e) {
    console.warn('PostgreSQL facility telemetry sync failed (handled silently):', e);
  }
}

export function subscribeToFacilityOverrides(
  onUpdate: (overrides: Record<string, any>) => void
) {
  const colRef = collection(db, FACILITY_OVERRIDES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const map: Record<string, any> = {};
      snapshot.forEach((d) => {
        map[d.id] = d.data();
      });
      onUpdate(map);
    },
    (error) => {
      console.warn('Firestore facilityOverrides listener fallback:', error.message);
    }
  );
}

// 3. Outbreak Protocol Actions
export async function updateOutbreakActionInFirestore(
  outbreakId: string,
  diseaseName: string,
  emergencyActionStatus: 'ACTIVE_RESPONSE' | 'CONTAINMENT_PHASE' | 'ASSESSMENT_TRIGGERED',
  protocols: string[]
): Promise<void> {
  const path = `${OUTBREAK_PROTOCOLS_COLLECTION}/${outbreakId}`;
  try {
    const docRef = doc(db, OUTBREAK_PROTOCOLS_COLLECTION, outbreakId);
    await setDoc(
      docRef,
      {
        id: outbreakId,
        outbreakId,
        diseaseName,
        emergencyActionStatus,
        containmentProtocolsDeployed: JSON.stringify(protocols),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || 'epidemiologist',
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  // Also sync to Cloud SQL backend
  try {
    const headers = await getAuthHeader();
    await fetch('/api/outbreak-protocols', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        id: outbreakId,
        diseaseName,
        emergencyActionStatus,
        containmentProtocols: JSON.stringify(protocols),
      }),
    });
  } catch (e) {
    console.warn('PostgreSQL outbreak protocol sync failed (handled silently):', e);
  }
}

export function subscribeToOutbreakProtocols(
  onUpdate: (protocols: Record<string, any>) => void
) {
  const colRef = collection(db, OUTBREAK_PROTOCOLS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const map: Record<string, any> = {};
      snapshot.forEach((d) => {
        map[d.id] = d.data();
      });
      onUpdate(map);
    },
    (error) => {
      console.warn('Firestore outbreakProtocols listener fallback:', error.message);
    }
  );
}

// 4. User Profiles
export async function syncUserProfile(user: any): Promise<void> {
  if (!user?.uid) return;
  const path = `${USERS_COLLECTION}/${user.uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, user.uid);
    await setDoc(
      docRef,
      {
        uid: user.uid,
        email: user.email || 'officer@mohfw.gov.in',
        displayName: user.displayName || 'Health Nodal Officer',
        role: 'STATE_NODAL_OFFICER',
        lastActive: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  // Also sync user profile to Cloud SQL backend
  try {
    const headers = await getAuthHeader();
    await fetch('/api/users/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email || 'officer@mohfw.gov.in',
        displayName: user.displayName || 'Health Nodal Officer',
      }),
    });
  } catch (e) {
    console.warn('PostgreSQL user sync failed (handled silently):', e);
  }
}
