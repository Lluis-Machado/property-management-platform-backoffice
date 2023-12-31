// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddCompanyPage from '@/components/pages/companies/AddCompanyPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { sortByProperty } from '@/lib/utils/sortByProperty';

interface Props {
    params: { lang: Locale };
}

const AddCompany = async ({ params: { lang } }: Props) => {
    const [countriesData, contactsData] = await Promise.all([
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
    for (const country of countriesData) {
        if (country.id === 56 || country.id === 67) {
            country.category = 'Main Countries';
        } else {
            country.category = 'Other Countries';
        }
    }

    sortByProperty(contactsData, 'firstName');

    return (
        <>
            <Breadcrumb />
            <AddCompanyPage
                contactsData={contactsData}
                countriesData={countriesData}
                lang={lang}
            />
        </>
    );
};

export default AddCompany;
