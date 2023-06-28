import ContactsPage from '@/components/pages/contacts/ContactsPage';
import data from '@/components/pages/contacts/contactsPage.json';

export default async function Contacts() {
    return (
        <>
            <ContactsPage dataSource={data} />
        </>
    )
}