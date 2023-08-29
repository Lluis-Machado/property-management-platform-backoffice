// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale };
    searchParams: any;
}

const Contacts = async ({ params: { lang }, searchParams }: Props) => {
    const contactData = await getApiData<ContactData[]>(
        '/contacts/contacts',
        'Error while getting contacts'
    );

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a contact
            </div>
            <ContactsPage dataSource={contactData} />
        </>
    );
};

export default Contacts;
