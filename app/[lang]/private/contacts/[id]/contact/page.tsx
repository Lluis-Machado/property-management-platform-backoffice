// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';
import { ApiCallError } from '@/lib/utils/errors';

export interface ContactData {
    id: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    nif: string;
    email: string;
    phoneNumber: string;
    mobilePhoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface Props {
    params: { id: string };
};

const Contact = async ({ params: { id } }: Props): Promise<React.ReactElement> => {

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts/${id}`, { cache: 'no-cache' })
    if (!resp.ok) throw new ApiCallError('Error while getting contact info');
    const data: ContactData = await resp.json();

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