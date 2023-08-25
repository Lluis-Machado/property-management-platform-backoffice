// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddCompanyPage from '@/components/pages/companies/AddCompanyPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

const initialValues: CompanyData = {
    name: '',
    nif: null,
    email: '',
    countryMaskId: 1,
    phoneNumber: '',
    companyPurpose: '',
    foundingDate: null,
    germanTaxOffice: '',
    taxNumber: '',
    uStIDNumber: '',
    addresses: [],
    bankInformation: [],
    contacts: [],
    comments: '',
};

interface Props {
    params: { lang: Locale };
}

const AddCompany = async ({ params: { lang } }: Props) => {
    const [user, countriesData, contactsData] = await Promise.all([
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
    for (const country of countriesData) {
        if (country.id === 56 || country.id === 67) {
            country.category = 'Main Countries';
        } else {
            country.category = 'Other Countries';
        }
    }

    return (
        <>
            <Breadcrumb />
            <AddCompanyPage
                companyData={initialValues}
                contactsData={contactsData}
                countries={countriesData}
                lang={lang}
                token={user.token}
            />
        </>
    );
};

export default AddCompany;
