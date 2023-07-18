// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const ContactForm = async ({ params: { lang, id } }: Props) => {
    const data = await getApiData(
        `/contacts/contacts/${id}`,
        'Error while getting contact info'
    );
    const user = await getUser();

    return <ContactPage contactData={data} token={user.token} lang={lang} />;
};

export default ContactForm;
