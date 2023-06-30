// Local imports
import ContactPage from '@/components/pages/contacts/contact/ContactPage';

interface Props {
    params: { id: string };
};

interface ContactValues {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    taxResidence?: string;
    idCardNum?: string;
    idCardExpDate?: string;
    passportNum?: string;
    passportExpDate?: string;
    nif: string;
    companyNumber?: string;
    addressLine?: string;
    city?: string;
    region?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    email?: string;
    telephoneNum?: string;
    cellphoneNum?: string;
};

// TODO: Fetching de datos desde el backend
const initialValues: ContactValues = {
    firstName: 'Peter',
    lastName: 'Pan',
    dateOfBirth: undefined,
    taxResidence: 'Germany',
    idCardNum: 'L7MJ28WPT',
    idCardExpDate: '21/07/2026',
    passportNum: 'IUT034536O',
    passportExpDate: '14/02/2025',
    nif: '07626053N',
    companyNumber: '8765434767',

    addressLine: 'Magnus-Gerlach-Ring 1',
    city: 'Hoyerswerda',
    region: 'Hessen',
    state: 'Hessen',
    postalCode: '24420',
    country: 'Germany',

    email: 'peter.pan@berg.net',
    telephoneNum: '(02552) 453615',
    cellphoneNum: '4915751628512'
};
const page = ({ params: { id } }: Props): React.ReactElement => (
    <>
        <div className='text-lg text-secondary-500'>{`Contacts / Contact Info`}</div>
        <ContactPage initialValues={initialValues} />
    </>
);

export default page;