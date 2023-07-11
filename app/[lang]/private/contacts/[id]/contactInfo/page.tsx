// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import ContactPage from '@/components/pages/contacts/ContactPage';
import ContactPropertiesPage from '@/components/pages/contacts/ContactPropertiesPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';
import { Suspense } from 'react';

interface Props {
    params: { lang: Locale, id: string }
};

const Contact = async ({ params: { lang, id } }: Props) => {
    const data = await getApiData(`/contacts/contacts/${id}`, 'Error while getting contact info');

    return (
        <>
            <Breadcrumb />
            <ContactPage initialValues={data} contactId={id} />
            <Suspense fallback={<>LOADING SOME SHIT...</>}>
                <ContactPropertiesPage id={id} lang={lang} />
            </Suspense>
        </>
    )
};

export default Contact