// Local imports
import CompanyPage from '@/components/pages/companies/CompanyPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const Company = async ({ params: { lang, id } }: Props) => {
    const [user, companyData] = await Promise.all([
        getUser(),
        getApiData<CompanyData>(
            `/companies/companies/${id}`,
            'Error while getting company info'
        ),
        // getApiDataWithCache<CountryData[]>(
        //     `/countries/countries?languageCode=${lang}`,
        //     'Error while getting countries'
        // ),
    ]);

    // let statesData: StateData[] = [];
    // if (contactData.address.country) {
    //     statesData = await getApiDataWithCache(
    //         `/countries/countries/${contactData.address.country}/states?languageCode=${lang}`,
    //         'Error while getting states'
    //     );
    // }

    return (
        <CompanyPage
            companyData={companyData}
            countriesData={undefined}
            initialStates={undefined}
            token={user.token}
            lang={lang}
        />
    );
};

export default Company;
