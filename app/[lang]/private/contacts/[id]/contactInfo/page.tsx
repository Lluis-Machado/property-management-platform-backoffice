// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import ContactPage from '@/components/pages/contacts/ContactPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale, id: string }
};

const Contact = async ({ params: { lang, id } }: Props) => {
    const data = await getApiData(`/contacts/contacts/${id}`, 'Error while getting contact info');
    const user = await getUser();

    return (
        <>
            <Breadcrumb />
            <ContactPage initialValues={data} contactId={id} token={user.token} lang={lang} />
            {/* <Suspense fallback={<>LOADING SOME SHIT...</>}>
                <ContactPropertiesPage id={id} lang={lang} />
            </Suspense> */}
        </>
    )
};

export default Contact