import ContactPropertiesDG from '@/components/pages/contacts/ContactPropertiesDG';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale, id: string }
};

const ContactTabs = async ({ params: { lang, id } }: Props) => {
    // const properties = await getApiData(`/properties/properties`, 'Error while getting properties info');
    // const ownerships = await getApiData(`/ownership/ownership`, 'Error while getting ownerships info');
  
    // const filteredOwnerships = ownerships.filter((obj: any) => obj.contactId === id);
  
    return (
        <h1>YES I RENDERED</h1>
    //   <ContactPropertiesDG ownershipData={filteredOwnerships} propertiesData={properties} />
    )
};

export default ContactTabs