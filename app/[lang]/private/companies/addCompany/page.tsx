// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddCompanyPage from '@/components/pages/companies/AddCompanyPage';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

const initialValues: CompanyData = {
    name: '',
    nif: null,
    email: '',
    phoneNumber: '',
};

interface Props {
    params: { lang: Locale };
}

const AddContact = async ({ params: { lang } }: Props) => {
    const [user] = await Promise.all([
        getUser(),
        // getApiDataWithCache<CountryData[]>(
        //     `/countries/countries?languageCode=${lang}`,
        //     'Error while getting countries'
        // ),
    ]);

    return (
        <>
            <Breadcrumb />
            <AddCompanyPage
                companyData={initialValues}
                // countries={countries}
                lang={lang}
                token={user.token}
            />
        </>
    );
};

export default AddContact;
