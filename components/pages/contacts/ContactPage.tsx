'use client'

// Libraries imports
import { Button, Input, Select } from 'pg-components';
import { Formik, Form, FormikHelpers } from 'formik';

// Local imports
import DatePicker from '@/components/datepicker/DatePicker';
import GroupItem from '../../layoutComponent/GroupItem';

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

const handleSubmit = async (
    values: ContactValues,
    { setSubmitting }: FormikHelpers<ContactValues>
) => {
    setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
    }, 500);
};

const taxResidenceSelectorInputs: { label: string, value: string }[] = [
    { label: 'Germany', value: 'de' },
    { label: 'Spain', value: 'es' },
    { label: 'France', value: 'fr' },
    { label: 'Russia', value: 'ru' },
    { label: 'Italy', value: 'it' },
];

interface Inputs {
    name: string;
    label: string
};

const contactInformationInputs: Inputs[] = [
    { name: 'firstName', label: 'First name' },
    { name: 'lastName', label: 'Last name' },
    { name: 'idCardNum', label: 'ID card number' },
    { name: 'idCardExpDate', label: 'ID card expiration date' },
    { name: 'passportNum', label: 'Passport Number' },
    { name: 'passportExpDate', label: 'Passport expiration date' },
    { name: 'nif', label: 'NIF' },
    { name: 'companyNumber', label: 'Company number' },
];

const addressInformationInputs: Inputs[] = [
    { name: 'addressLine', label: 'Address line' },
    { name: 'city', label: 'City' },
    { name: 'region', label: 'Region' },
    { name: 'state', label: 'State' },
    { name: 'postalCode', label: 'Postal Code' },
    { name: 'country', label: 'Country' },
    { name: 'email', label: 'Email' },
    { name: 'telephoneNum', label: 'Telephone number' },
    { name: 'cellphoneNum', label: 'Cellphone Number' },
];

const ContactPage = ({ initialValues }: { initialValues: ContactValues }) => {
    return (
        <div className='m-2'>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form>
                    <GroupItem cols={3} caption='Contact Information' >
                        {
                            ...contactInformationInputs.slice(0, 2).map(input => <Input key={input.name} {...input} />)
                        }
                        <DatePicker
                            name='dateOfBirth'
                            label='Date of birth'
                            defaultValue={initialValues.dateOfBirth ?? undefined}
                            isClearable
                        />
                        <Select
                            name='taxResidence'
                            label='Tax residence'
                            size='large'
                            inputsList={taxResidenceSelectorInputs}
                            defaultValue={taxResidenceSelectorInputs[0]}
                        />
                        {
                            ...contactInformationInputs.slice(3).map(input => <Input key={input.name} {...input} />)
                        }
                    </GroupItem>
                    <GroupItem cols={3} caption='Address Information' >
                        {
                            ...addressInformationInputs.map(input => <Input key={input.name} {...input} />)
                        }
                    </GroupItem>
                    <div className='flex justify-end py-4'>
                        <div className='flex flex-row justify-between gap-2'>
                            <Button
                                elevated
                                style='outline'
                                type='reset'
                                text='Reset'
                            />
                            <Button
                                elevated
                                type='submit'
                                text='Submit Changes'
                            />
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
export default ContactPage;