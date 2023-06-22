// Libraries imports
import { loadMessages, locale } from 'devextreme/localization';
import deMessages from 'devextreme/localization/messages/de.json';
import enMessages from 'devextreme/localization/messages/en.json';
import esMessages from 'devextreme/localization/messages/es.json';

// Local imports
import { Locale } from '@/i18n-config';
  
export const localeDevExtreme = (lang: Locale) => {
    switch (lang) {
        case 'de':
            loadMessages(deMessages)
            locale(lang)
            break;
        case 'es':
            loadMessages(esMessages)
            locale(lang)
            break;
        default:
            loadMessages(enMessages)
            locale('en');
            break;
    }
}