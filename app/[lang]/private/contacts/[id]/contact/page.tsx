import ContactPage from "@/components/pages/contacts/ContactPage";

interface Props {
    params: { id: string }
}

interface ContactValues {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    taxResidence?: string;
    idCardNum?: string;
    idCardExpDate?: Date;
    passportNum?: string;
    passportExpDate?: Date;
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

const Contact = async ({ params: { id } }: Props): Promise<React.ReactElement> => {

    // TODO: Fetching de datos desde el backend
    const initialValues: ContactValues = {
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

    return (
        <>
            <div className='text-lg text-secondary-500'>{`Contacts / Contact Info`}</div>
            <ContactPage initialValues={initialValues} />
        </>
    )
}

export default Contact