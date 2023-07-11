// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import ContactPropertiesPage from '@/components/pages/contacts/ContactPropertiesPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale, id: string }
};

const ContactProperties = async ({ params: { id } }: Props) => {
    const properties = await getApiData(`/properties/properties`, 'Error while getting properties info');
    const ownerships = await getApiData(`/ownership/ownership`, 'Error while getting ownerships info');

    const filteredOwnerships = ownerships.filter((obj: any) => obj.contactId === id);

    return (
        <>
            <Breadcrumb />
            <ContactPropertiesPage ownershipData={filteredOwnerships} propertiesData={properties} />
        </>
    )
}

export default ContactProperties