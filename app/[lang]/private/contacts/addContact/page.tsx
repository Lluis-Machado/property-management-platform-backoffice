// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';

const initialValues: ContactData = {
    id: '',
    firstName: '',
    lastName: '',
    birthDay: null,
    nif: '',
    email: '',
    phoneNumber: '',
    mobilePhoneNumber: '',
    address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    }
}

interface Props {
    params: { lang: Locale }
};

const AddContact = () => {
    return (
        <>
            <Breadcrumb />
            <AddContactPage initialValues={initialValues} />
        </>
    )
};

export default AddContact