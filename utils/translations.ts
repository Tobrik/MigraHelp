import { TRANSLATIONS } from '../data';
import { Language } from '../types';

export const getTranslation = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = TRANSLATIONS[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      // Fallback to Russian if translation not found
      value = TRANSLATIONS.ru;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object') {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
};

export const t = (key: string, language: Language): string => {
  return getTranslation(key, language);
};
