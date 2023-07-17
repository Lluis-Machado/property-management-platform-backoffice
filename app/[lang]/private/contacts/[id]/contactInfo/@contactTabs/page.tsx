import ContactsTabs from '@/components/pages/contacts/ContactsTabs';
import { Locale } from '@/i18n-config';

interface Props {
    params: { lang: Locale, id: string }
};

const ContactTabs = async ({ params: { lang, id } }: Props) => {
    // const properties = await getApiData(`/properties/properties`, 'Error while getting properties info');
    // const ownerships = await getApiData(`/ownership/ownership`, 'Error while getting ownerships info');

    // const filteredOwnerships = ownerships.filter((obj: any) => obj.contactId === id);

    return (
        <ContactsTabs lang={lang} />
    )
};

export default ContactTabs