// Guide and document types
export interface Guide {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: Step[];
}

export interface Step {
  id: string;
  text: string;
}

// Phrasebook types (will be removed)
export interface Phrase {
  id: string;
  category: string;
  original: string;
  translated: string;
}

// Map types
export interface HelpCenter {
  id: string;
  name: string;
  type: 'mfc' | 'hospital' | 'police' | 'legal';
  address: string;
  workingHours: string;
  lat: number;
  lng: number;
}

// Restaurant types
export interface RestaurantPrices {
  KZT: number;
  USD: number;
  RUB: number;
  UZS: number;
  TJS: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  prices: RestaurantPrices;
  budget: 'budget' | 'medium' | 'premium';
  phone?: string;
  website?: string;
  lat: number;
  lng: number;
  rating?: number;
  image?: string;
}

// Document procedures
export interface DocumentProcedure {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: DocumentStep[];
  processingTime: string;
  requiredDocuments: string[];
  cost?: {
    amount: number;
    currency: 'KZT' | 'USD';
  };
}

export interface DocumentStep {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
}

// Language types
export type Language = 'ru' | 'kk' | 'en' | 'uz' | 'tj' | 'zh' | 'tr' | 'ky';

export interface Translations {
  [key: string]: string | Translations;
}
