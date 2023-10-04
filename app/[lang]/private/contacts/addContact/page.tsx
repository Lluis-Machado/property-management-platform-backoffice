// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { CountryData } from '@/lib/types/countriesData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';

interface Props {
    params: { lang: Locale };
}

const AddContact = async ({ params: { lang } }: Props) => {
    const countries = await getApiDataWithCache<CountryData[]>(
        `/countries/countries?languageCode=${lang}`,
        'Error while getting countries'
    );

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
            <AddContactPage countriesData={countries} lang={lang} />
        </>
    );
};

export default AddContact;
