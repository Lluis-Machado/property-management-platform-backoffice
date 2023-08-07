// Local imports
import PropertiesPage from '@/components/pages/properties/PropertiesPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { PropertyData } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale };
}

export default async function Properties() {
    const [propertyData, contactData] = await Promise.all([
        getApiData<PropertyData[]>(
            '/properties/properties',
            'Error while getting property info'
        ),
        getApiData<ContactData[]>(
            '/contacts/contacts',
            'Error while getting contacts'
        ),
    ]);

    let contacts: ContactData[] = [];
    for (const contact of contactData) {
        contacts.push({
            ...contact,
            firstName: `${contact.firstName} ${contact.lastName}`,
        });
    }

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a property
            </div>
            <PropertiesPage
                propertyData={propertyData}
                contactData={contacts}
            />
        </>
    );
}
