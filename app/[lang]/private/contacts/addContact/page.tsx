// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale };
}

const AddContact = async ({ params: { lang } }: Props) => {
    const [user, countries, contactsData] = await Promise.all([
        getUser(),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
        getApiData<ContactData[]>(
            `/contacts/contacts`,
            'Error while getting contacts info'
        ),
    ]);

    // Categorize countries, 56 and 67 are DE and ES. It can be done on backend?
    for (const country of countries) {
        if (country.id === 56 || country.id === 67) {
            country.category = 'Main Countries';
        } else {
            country.category = 'Other Countries';
        }
    }

    return (
        <>
            <Breadcrumb />
            <AddContactPage
                countries={countries}
                contactsData={contactsData}
                lang={lang}
                token={user.token}
            />
        </>
    );
};

export default AddContact;
