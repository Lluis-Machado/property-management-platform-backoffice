// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const ContactForm = async ({ params: { lang, id } }: Props) => {
    const [user, contactData] = await Promise.all([
        getUser(),
        getApiData<ContactData>(
            `/contacts/contacts/${id}`,
            'Error while getting contact info'
        ),
    ]);

    return (
        <ContactPage contactData={contactData} token={user.token} lang={lang} />
    );
};

export default ContactForm;
