// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import CompanyPage from '@/components/pages/companies/CompanyPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { sortByProperty } from '@/lib/utils/sortByProperty';

interface Props {
    params: { lang: Locale; id: string };
}

const Company = async ({ params: { lang, id } }: Props) => {
    const [companyData, countriesData, ownershipData, contactsData] =
        await Promise.all([
            getApiData<CompanyData>(
                `/companies/companies/${id}`,
                'Error while getting company info'
            ),
            getApiDataWithCache<CountryData[]>(
                `/countries/countries?languageCode=${lang}`,
                'Error while getting countries'
            ),
            getApiData<OwnershipPropertyData[]>(
                `/ownership/ownership/${id}/company`,
                'Error while getting ownership info'
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

    // Get all states in countries selected on the addresses
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

    sortByProperty(contactsData, 'firstName');

    return (
        <>
            <Breadcrumb />
            <CompanyPage
                companyData={companyData}
                countriesData={countriesData}
                ownershipData={ownershipData}
                contactsData={contactsData}
                initialStates={statesData}
                lang={lang}
            />
        </>
    );
};

export default Company;
