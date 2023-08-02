// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

const initialValues: ContactData = {
    firstName: '',
    lastName: '',
    birthDay: null,
    nif: null,
    email: '',
    secondaryEmail: '',
    phoneNumber: '',
    mobilePhoneNumber: '',
    otherPhoneNumber: '',
    birthPlace: '',
    faxNumber: '',
    maritalStatus: 0,
    nifExpirationDate: null,
    passportExpirationDate: null,
    passportNumber: '',
    scanMail: '',
    socialSecurityNumber: '',
    taxId: '',
    addresses: [
        {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: null,
            postalCode: '',
            country: null,
        },
    ],
};

interface Props {
    params: { lang: Locale };
}

const AddContact = async ({ params: { lang } }: Props) => {
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
            <AddContactPage
                contactData={initialValues}
                countries={countries}
                lang={lang}
                token={user.token}
            />
        </>
    );
};

export default AddContact;
