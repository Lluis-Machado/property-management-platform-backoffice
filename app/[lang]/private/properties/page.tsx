// Local imports
import PropertiesPage from '@/components/pages/properties/PropertiesPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { PropertyData } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { sortByProperty } from '@/lib/utils/sortByProperty';

interface Props {
    params: { lang: Locale };
}

export default async function Properties({ params: { lang } }: Props) {
    const [propertyData, contactData, countryData] = await Promise.all([
        getApiData<PropertyData[]>(
            '/properties/properties',
            'Error while getting property info'
        ),
        getApiData<ContactData[]>(
            '/contacts/contacts',
            'Error while getting contacts'
        ),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

    let contacts: ContactData[] = [];
    for (const contact of contactData) {
        contacts.push({
            ...contact,
            firstName: `${contact.firstName} ${contact.lastName}`,
        });
    }

    sortByProperty(propertyData, 'name');

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a property
            </div>
            <PropertiesPage
                propertyData={propertyData}
                contactData={contacts}
                countryData={countryData}
                lang={lang}
            />
        </>
    );
}
