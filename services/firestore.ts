import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Guide, HelpCenter, Restaurant, DocumentProcedure } from '../types';

// Collection names
const COLLECTIONS = {
  GUIDES: 'guides',
  HELP_CENTERS: 'helpCenters',
  RESTAURANTS: 'restaurants',
  PROCEDURES: 'procedures',
  USERS: 'users',
  SETTINGS: 'settings',
};

// ============ GUIDES ============
export const getGuides = async (): Promise<Guide[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.GUIDES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guide));
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
};

export const getGuide = async (id: string): Promise<Guide | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.GUIDES, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Guide;
    }
    return null;
  } catch (error) {
    console.error('Error fetching guide:', error);
    return null;
  }
};

export const addGuide = async (guide: Omit<Guide, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.GUIDES), guide);
  return docRef.id;
};

export const updateGuide = async (id: string, guide: Partial<Guide>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.GUIDES, id);
  await updateDoc(docRef, guide);
};

export const deleteGuide = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.GUIDES, id));
};

// ============ HELP CENTERS ============
export const getHelpCenters = async (): Promise<HelpCenter[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.HELP_CENTERS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HelpCenter));
  } catch (error) {
    console.error('Error fetching help centers:', error);
    return [];
  }
};

export const getHelpCenter = async (id: string): Promise<HelpCenter | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HELP_CENTERS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HelpCenter;
    }
    return null;
  } catch (error) {
    console.error('Error fetching help center:', error);
    return null;
  }
};

export const addHelpCenter = async (center: Omit<HelpCenter, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.HELP_CENTERS), center);
  return docRef.id;
};

export const updateHelpCenter = async (id: string, center: Partial<HelpCenter>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.HELP_CENTERS, id);
  await updateDoc(docRef, center);
};

export const deleteHelpCenter = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.HELP_CENTERS, id));
};

// ============ RESTAURANTS ============
export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.RESTAURANTS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};

export const getRestaurant = async (id: string): Promise<Restaurant | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.RESTAURANTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Restaurant;
    }
    return null;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
};

export const addRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.RESTAURANTS), restaurant);
  return docRef.id;
};

export const updateRestaurant = async (id: string, restaurant: Partial<Restaurant>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.RESTAURANTS, id);
  await updateDoc(docRef, restaurant);
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.RESTAURANTS, id));
};

// ============ DOCUMENT PROCEDURES ============
export const getProcedures = async (): Promise<DocumentProcedure[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROCEDURES));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentProcedure));
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
};

export const getProcedure = async (id: string): Promise<DocumentProcedure | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.PROCEDURES, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DocumentProcedure;
    }
    return null;
  } catch (error) {
    console.error('Error fetching procedure:', error);
    return null;
  }
};

export const addProcedure = async (procedure: Omit<DocumentProcedure, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.PROCEDURES), procedure);
  return docRef.id;
};

export const updateProcedure = async (id: string, procedure: Partial<DocumentProcedure>): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.PROCEDURES, id);
  await updateDoc(docRef, procedure);
};

export const deleteProcedure = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.PROCEDURES, id));
};

// ============ BATCH OPERATIONS (for seeding) ============
export const seedGuides = async (guides: Guide[]): Promise<void> => {
  const batch = writeBatch(db);
  guides.forEach((guide) => {
    const docRef = doc(db, COLLECTIONS.GUIDES, guide.id);
    batch.set(docRef, guide);
  });
  await batch.commit();
};

export const seedHelpCenters = async (centers: HelpCenter[]): Promise<void> => {
  const batch = writeBatch(db);
  centers.forEach((center) => {
    const docRef = doc(db, COLLECTIONS.HELP_CENTERS, center.id);
    batch.set(docRef, center);
  });
  await batch.commit();
};

export const seedRestaurants = async (restaurants: Restaurant[]): Promise<void> => {
  const batch = writeBatch(db);
  restaurants.forEach((restaurant) => {
    const docRef = doc(db, COLLECTIONS.RESTAURANTS, restaurant.id);
    batch.set(docRef, restaurant);
  });
  await batch.commit();
};

export const seedProcedures = async (procedures: DocumentProcedure[]): Promise<void> => {
  const batch = writeBatch(db);
  procedures.forEach((procedure) => {
    const docRef = doc(db, COLLECTIONS.PROCEDURES, procedure.id);
    batch.set(docRef, procedure);
  });
  await batch.commit();
};

// ============ STATISTICS ============
export const getStatistics = async () => {
  try {
    const [guides, helpCenters, restaurants, procedures, users] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.GUIDES)),
      getDocs(collection(db, COLLECTIONS.HELP_CENTERS)),
      getDocs(collection(db, COLLECTIONS.RESTAURANTS)),
      getDocs(collection(db, COLLECTIONS.PROCEDURES)),
      getDocs(collection(db, COLLECTIONS.USERS)),
    ]);

    const adminCount = users.docs.filter(doc => doc.data().isAdmin).length;

    return {
      guides: guides.size,
      helpCenters: helpCenters.size,
      restaurants: restaurants.size,
      procedures: procedures.size,
      users: users.size,
      admins: adminCount,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      guides: 0,
      helpCenters: 0,
      restaurants: 0,
      procedures: 0,
      users: 0,
      admins: 0,
    };
  }
};

export { COLLECTIONS };
