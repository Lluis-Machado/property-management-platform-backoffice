// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import ContactPage from '@/components/pages/contacts/ContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipData } from '@/lib/types/ownershipData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const ContactForm = async ({ params: { lang, id } }: Props) => {
    const [user, contactData, countriesData, ownershipData, contactsData] =
        await Promise.all([
            getUser(),
            getApiData<ContactData>(
                `/contacts/contacts/${id}`,
                'Error while getting contact info'
            ),
            getApiDataWithCache<CountryData[]>(
                `/countries/countries?languageCode=${lang}`,
                'Error while getting countries'
            ),
            getApiData<OwnershipData[]>(
                `/ownership/ownership/${id}/contact`,
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
    if (contactData.addresses) {
        let promises: Promise<StateData[]>[] = [];
        // For every address check if it has a country and then store the promise on the array
        for (const address of contactData.addresses) {
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
        <>
            <Breadcrumb />
            <ContactPage
                contactData={contactData}
                ownershipData={ownershipData}
                contactsData={contactsData}
                countriesData={countriesData}
                initialStates={statesData}
                token={user.token}
                lang={lang}
            />
        </>
    );
};

export default ContactForm;
