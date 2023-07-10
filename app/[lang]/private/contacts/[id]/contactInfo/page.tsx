// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import ContactPage from '@/components/pages/contacts/ContactPage';
import { getApiData } from '@/lib/utils/apiCalls';

interface Props {
    params: { id: string };
};

const Contact = async ({ params: { id } }: Props) => {
    const data = await getApiData(`/contacts/contacts/${id}`, 'Error while getting contact info');

    return (
        <>
            <Breadcrumb />
            <ContactPage initialValues={data} contactId={id} />
        </>
    )
};

export default Contact