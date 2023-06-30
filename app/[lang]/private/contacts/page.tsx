// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import data from '@/components/pages/contacts/contactsPage.json';

export default function Contacts(): React.ReactElement {
    return (
        <ContactsPage dataSource={data} />
    );
};