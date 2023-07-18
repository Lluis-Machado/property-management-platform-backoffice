// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

const initialValues: ContactData = {
    id: '',
    firstName: '',
    lastName: '',
    birthDay: null,
    nif: null,
    email: '',
    phoneNumber: '',
    mobilePhoneNumber: '',
    address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    },
};

interface Props {
    params: { lang: Locale };
}

const AddContact = async ({ params: { lang } }: Props) => {
    const [user, countries] = await Promise.all([
        getUser(),
        getApiData(
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
