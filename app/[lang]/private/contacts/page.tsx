// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale };
}

const Contacts = async () => {
    const data = await getApiData<ContactData[]>(
        '/contacts/contacts',
        'Error while getting contacts'
    );

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a contact
            </div>
            <ContactsPage dataSource={data} />
        </>
    );
};

export default Contacts;
