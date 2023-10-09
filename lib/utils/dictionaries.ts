// Libraries imports
import 'server-only';

// local imports
import type { Locale } from '@/i18n-config';

/**
 * A collection of locale-specific dictionary loading functions.
 * Each function dynamically imports a JSON dictionary based on the provided locale code.
 */
const dictionaries = {
    en: () => import('../dictionaries/en.json').then((m) => m),
    de: () => import('../dictionaries/de.json').then((m) => m),
    es: () => import('../dictionaries/es.json').then((m) => m),
};

/**
 * Retrieves a dictionary based on the provided locale code.
 *
 * @param {Locale} locale - The locale code (e.g., 'en', 'de', 'es').
 * @returns {Promise<object>} - A promise that resolves to the imported dictionary object.
 */
export const getDictionary = async (locale: Locale) => dictionaries[locale]();
