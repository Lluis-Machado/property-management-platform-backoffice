// local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PropertyPage from '@/components/pages/properties/property/PropertyPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { PropertyData } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const Property = async ({ params: { id, lang } }: Props) => {
    const [user, propertyData, contactData, ownershipData, countriesData] =
        await Promise.all([
            getUser(),
            getApiData<PropertyData>(
                `/properties/properties/${id}`,
                'Error while getting property info'
            ),
            getApiData<ContactData[]>(
                '/contacts/contacts',
                'Error while getting contacts'
            ),
            getApiData<OwnershipPropertyData[]>(
                `/ownership/ownership/${id}/property`,
                'Error while getting ownerships'
            ),
            getApiDataWithCache<CountryData[]>(
                `/countries/countries?languageCode=${lang}`,
                'Error while getting countries'
            ),
        ]);

    let statesData: StateData[] = [];
    if (propertyData.address.country) {
        statesData = await getApiDataWithCache(
            `/countries/countries/${propertyData.address.country}/states?languageCode=${lang}`,
            'Error while getting states'
        );
    }

    let contacts: ContactData[] = [];
    for (const contact of contactData) {
        contacts.push({
            ...contact,
            firstName: `${contact.firstName} ${contact.lastName}`,
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
                ownershipData={ownershipData}
                countries={countriesData}
                initialStates={statesData}
            />
        </>
    );
};

export default Property;
