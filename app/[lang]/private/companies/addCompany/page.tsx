// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddCompanyPage from '@/components/pages/companies/AddCompanyPage';
import { Locale } from '@/i18n-config';
import { CompanyCreate } from '@/lib/types/companyData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

const initialValues: CompanyCreate = {
    name: '',
    nif: null,
    email: '',
    phoneNumber: '',
    addresses: [
        {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: null,
            country: null,
            postalCode: '',
            addressType: undefined,
        },
    ],
};

interface Props {
    params: { lang: Locale };
}

const AddCompany = async ({ params: { lang } }: Props) => {
    const [user, countries] = await Promise.all([
        getUser(),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

    return (
        <>
            <Breadcrumb />
            <AddCompanyPage
                companyData={initialValues}
                countries={countries}
                lang={lang}
                token={user.token}
            />
        </>
    );
};

export default AddCompany;
