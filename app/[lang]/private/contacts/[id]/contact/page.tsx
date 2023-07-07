// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';
import { getApiData } from '@/lib/utils/apiCalls';

interface Props {
    params: { id: string };
};

const Contact = async ({ params: { id } }: Props): Promise<React.ReactElement> => {
    const data = await getApiData(`/contacts/contacts/${id}`, 'Error while getting contact info');

    return (
        <>
            <div className='text-lg text-secondary-500'>
                Contacts / Contact Info
            </div>
            <ContactPage initialValues={data} contactId={id} />
        </>
    )
};

export default Contact