// Local imports
import ContactsPage from '@/components/pages/contacts/ContactsPage';
import data from '@/components/pages/contacts/contactsPage.json';

const Contacts = (): React.ReactElement => (
    <ContactsPage dataSource={data} />
);

export default Contacts;