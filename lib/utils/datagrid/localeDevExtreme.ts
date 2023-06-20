// Libraries imports
import { loadMessages, locale } from 'devextreme/localization';
import { match } from '@formatjs/intl-localematcher';
import deMessages from 'devextreme/localization/messages/de.json';
import enMessages from 'devextreme/localization/messages/en.json';
import esMessages from 'devextreme/localization/messages/es.json';

// Local imports
import { i18n } from '@/i18n-config';

export const localeDevExtreme = () => {
    // @ts-ignore
    const navigatorLanguage = match(navigator.languages, i18n.locales, i18n.defaultLocale);
    switch (navigatorLanguage) {
        case 'de':
            loadMessages(deMessages)
            locale(navigatorLanguage)
            break;
        case 'es':
            loadMessages(esMessages)
            locale(navigatorLanguage)
            break;
        default:
            loadMessages(enMessages)
            locale('en');
            break;
    }
}
