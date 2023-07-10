// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
}

const AddContact = () => {
    return (
        <>
            <Breadcrumb />
            <AddContactPage initialValues={initialValues} />
        </>
    )
};

export default AddContact