// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import { ApiCallError } from '@/lib/utils/errors';

const Contacts = async () => {

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts`, { cache: 'no-store' })
    if(!resp.ok) throw new ApiCallError('Error while getting contacts');
    const data = await resp.json();

    return (
        <ContactsPage dataSource={data} />
    )
};

export default Contacts;