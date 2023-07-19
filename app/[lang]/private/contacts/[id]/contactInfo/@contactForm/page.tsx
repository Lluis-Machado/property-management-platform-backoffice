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
    if (contactData.address.country) {
        statesData = await getApiDataWithCache(
            `/countries/countries/${contactData.address.country}/states?languageCode=${lang}`,
            'Error while getting states'
        );
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
