// Libraries imports
import 'server-only';

// local imports
import type { Locale } from '@/i18n-config';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then(m => m),
  de: () => import('../dictionaries/de.json').then(m => m),
  es: () => import('../dictionaries/es.json').then(m => m),
};
 
export const getDictionary = async (locale: Locale) => dictionaries[locale]();