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
    const [user, companyData, countriesData] = await Promise.all([
        getUser(),
        getApiData<CompanyData>(
            `/companies/companies/${id}`,
            'Error while getting company info'
        ),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

    let statesData: StateData[] = [];
    if (companyData.addresses) {
        let promises: Promise<StateData[]>[] = [];
        // For every address check if it has a country and then store the promise on the array
        for (const address of companyData.addresses) {
            if (!address.country) continue;
            promises.push(
                getApiDataWithCache<StateData[]>(
                    `/countries/countries/${address.country}/states?languageCode=${lang}`,
                    'Error while getting states'
                )
            );
        }
        // Await all promises and flat the response to one array only
        if (promises) statesData = (await Promise.all(promises)).flat();
    }

    return (
        <CompanyPage
            companyData={companyData}
            countriesData={countriesData}
            initialStates={statesData}
            token={user.token}
            lang={lang}
        />
    );
};

export default Company;
