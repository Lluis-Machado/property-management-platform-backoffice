// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const ContactForm = async ({ params: { lang, id } }: Props) => {
    const [user, contactData, countriesData] = await Promise.all([
        getUser(),
        getApiData<ContactData>(
            `/contacts/contacts/${id}`,
            'Error while getting contact info'
        ),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

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
        <ContactPage
            contactData={contactData}
            countriesData={countriesData}
            initialStates={statesData}
            token={user.token}
            lang={lang}
        />
    );
};

export default ContactForm;
