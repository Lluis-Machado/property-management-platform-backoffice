// Local imports
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { ContactData } from '@/lib/types/contactData';

const initialValues: ContactData = {
    id: '',
    firstName: '',
    lastName: '',
    birthDay: '',
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

const AddContact = async (): Promise<React.ReactElement> => {
    return (
        <>
            <div className='text-lg text-secondary-500'>
                Contacts / Add Contact
            </div>
            <AddContactPage initialValues={initialValues} />
        </>
    )
};

export default AddContact