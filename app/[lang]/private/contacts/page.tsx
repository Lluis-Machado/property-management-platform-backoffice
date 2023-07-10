// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import { getApiData } from '@/lib/utils/apiCalls';

const Contacts = async () => {
    const data = await getApiData('/contacts/contacts', 'Error while getting contacts');

    return (
        <>
            <div className='text-lg text-secondary-500 mt-4'>
                Select a contact
            </div>
            <ContactsPage dataSource={data} />
        </>
    )
};

export default Contacts;