import ContactsPage from '@/components/pages/ContactsPage';
import data from '@/components/pages/contactsPage.json';

export default async function Contacts() {
    return (
        <>
            <ContactsPage dataSource={data} />
        </>
    )
}