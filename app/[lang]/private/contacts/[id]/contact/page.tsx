// Local imports
import ContactPage from '@/components/pages/contacts/ContactPage';

interface Props {
    params: { id: string };
};

// TODO: Fetching de datos desde el backend
const initialValues = {
    firstName: 'Peter',
    lastName: 'Pan',
    dateOfBirth: undefined,
    taxResidence: 'Germany',
    idCardNum: 'L7MJ28WPT',
    idCardExpDate: undefined,
    passportNum: 'IUT034536O',
    passportExpDate: new Date('2023-06-29'),
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

const Contact = async ({ params: { id } }: Props): Promise<React.ReactElement> => (
    <>
        <div className='text-lg text-secondary-500'>
            Contacts / Contact Info
        </div>
        <ContactPage initialValues={initialValues} />
    </>
);

export default Contact