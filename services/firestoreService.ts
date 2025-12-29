import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Restaurant, DocumentProcedure, HelpCenter } from '../types';

// Restaurants Service
export const restaurantsService = {
  // Get all restaurants
  async getAll(): Promise<Restaurant[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'restaurants'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  // Get restaurant by ID
  async getById(id: string): Promise<Restaurant | null> {
    try {
      const docRef = doc(db, 'restaurants', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Restaurant;
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
  },

  // Get restaurants by budget
  async getByBudget(budget: string): Promise<Restaurant[]> {
    try {
      const constraints: QueryConstraint[] = [where('budget', '==', budget)];
      const q = query(collection(db, 'restaurants'), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
    } catch (error) {
      console.error('Error fetching restaurants by budget:', error);
      return [];
    }
  },

  // Add restaurant (admin only)
  async add(restaurant: Omit<Restaurant, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'restaurants'), restaurant);
      return docRef.id;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  },

  // Update restaurant (admin only)
  async update(id: string, data: Partial<Restaurant>): Promise<void> {
    try {
      const docRef = doc(db, 'restaurants', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },

  // Delete restaurant (admin only)
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'restaurants', id));
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  },
};

// Document Procedures Service
export const documentProceduresService = {
  // Get all document procedures
  async getAll(): Promise<DocumentProcedure[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'documentProcedures'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DocumentProcedure[];
    } catch (error) {
      console.error('Error fetching document procedures:', error);
      return [];
    }
  },

  // Get procedure by ID
  async getById(id: string): Promise<DocumentProcedure | null> {
    try {
      const docRef = doc(db, 'documentProcedures', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DocumentProcedure;
      }
      return null;
    } catch (error) {
      console.error('Error fetching document procedure:', error);
      return null;
    }
  },

  // Add procedure (admin only)
  async add(procedure: Omit<DocumentProcedure, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'documentProcedures'), procedure);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document procedure:', error);
      throw error;
    }
  },

  // Update procedure (admin only)
  async update(id: string, data: Partial<DocumentProcedure>): Promise<void> {
    try {
      const docRef = doc(db, 'documentProcedures', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating document procedure:', error);
      throw error;
    }
  },

  // Delete procedure (admin only)
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'documentProcedures', id));
    } catch (error) {
      console.error('Error deleting document procedure:', error);
      throw error;
    }
  },
};

// Help Centers Service
export const helpCentersService = {
  // Get all help centers
  async getAll(): Promise<HelpCenter[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'helpCenters'));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HelpCenter[];
    } catch (error) {
      console.error('Error fetching help centers:', error);
      return [];
    }
  },

  // Get help centers by type
  async getByType(type: string): Promise<HelpCenter[]> {
    try {
      const constraints: QueryConstraint[] = [where('type', '==', type)];
      const q = query(collection(db, 'helpCenters'), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HelpCenter[];
    } catch (error) {
      console.error('Error fetching help centers by type:', error);
      return [];
    }
  },
};

// User Data Service
export const userDataService = {
  // Save user document
  async saveUserDocument(userId: string, documentData: any): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'documents', documentData.id);
      await updateDoc(docRef, documentData).catch(async () => {
        // Document doesn't exist, create it
        await addDoc(collection(db, 'users', userId, 'documents'), documentData);
      });
    } catch (error) {
      console.error('Error saving user document:', error);
      throw error;
    }
  },

  // Get user documents
  async getUserDocuments(userId: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'users', userId, 'documents')
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }
  },

  // Delete user document
  async deleteUserDocument(userId: string, docId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId, 'documents', docId));
    } catch (error) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  },

  // Save user preferences
  async saveUserPreferences(userId: string, preferences: any): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'preferences', 'settings');
      await updateDoc(docRef, preferences).catch(async () => {
        // Document doesn't exist, create it
        await setDoc(
          doc(db, 'users', userId, 'preferences', 'settings'),
          preferences
        );
      });
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  },
};

// Import setDoc for userDataService
import { setDoc } from 'firebase/firestore';
