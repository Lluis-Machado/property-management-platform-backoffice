// local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PropertyPage from '@/components/pages/properties/property/PropertyPage';
import { Locale } from '@/i18n-config';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const Property = async ({ params: { id, lang } }: Props) => {
    const [user, propertyData, contactData, countriesData] = await Promise.all([
        getUser(),
        getApiData(
            `/properties/properties/${id}`,
            'Error while getting property info'
        ),
        getApiData('/contacts/contacts', 'Error while getting contacts'),
        getApiData(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            value: contact.id,
        });
    }

    return (
        <>
            <Breadcrumb />
            <PropertyPage
                propertyData={propertyData}
                lang={lang}
                token={user.token}
                contacts={contacts}
                countries={countriesData}
            />
        </>
    );
};

export default Property;
