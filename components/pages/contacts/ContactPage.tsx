'use client'

// Libraries imports
import { Button, Input, Select } from 'pg-components';
import { Formik, Form, FormikHelpers } from 'formik';

// Local imports
import GroupItem from '@/components/layoutComponent/GroupItem';
import DatePicker from '@/components/datepicker/DatePicker';

interface contactValues {
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

const handleSubmit = async (
    values: contactValues,
    { setSubmitting }: FormikHelpers<contactValues>
) => {
    console.log("PINGA: ", values)
    // values.dateOfBirth = `${values.dateOfBirth.}`
    setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
    }, 500);
};

const ContactPage = ({ initialValues }: { initialValues: contactValues }) => {
    return (
        <div className='m-2'>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form>
                    <GroupItem cols={3} caption={'Contact Information'} >
                        <Input
                            name="firstName"
                            label={"First name"}
                        />
                        <Input
                            name="lastName"
                            label={"Last name"}
                        />
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
                            inputsList={[
                                { label: 'Germany', value: 'de' },
                                { label: 'Spain', value: 'es' },
                                { label: 'France', value: 'fr' },
                                { label: 'Russia', value: 'ru' },
                                { label: 'Italy', value: 'it' },
                            ]}
                            defaultValue={{ label: 'Germany', value: 'de' }}
                        />
                        <Input
                            name="idCardNum"
                            label={"ID card number"}
                        />
                        <DatePicker
                            name="idCardExpDate"
                            label={"ID card expiration date"}
                            defaultValue={initialValues.idCardExpDate ?? undefined}
                            isClearable
                        />
                        <Input
                            name="passportNum"
                            label={"Passport Number"}
                        />
                        <DatePicker
                            name='passportExpDate'
                            label={"Passport expiration date"}
                            defaultValue={initialValues.passportExpDate ?? undefined}
                            isClearable
                        />
                        <Input
                            name="nif"
                            label={"NIF"}
                        />
                        <Input
                            name="companyNumber"
                            label={"Company number"}
                        />
                    </GroupItem>
                    <GroupItem cols={3} caption={'Adress Information'} >
                        <Input
                            name="addressLine"
                            label={"Address line"}
                        />
                        <Input
                            name="city"
                            label={"City"}
                        />
                        <Input
                            name="region"
                            label={"Region"}
                        />
                        <Input
                            name="state"
                            label={"State"}
                        />
                        <Input
                            name="postalCode"
                            label={"Postal Code"}
                        />
                        <Input
                            name="country"
                            label={"Country"}
                        />

                        <Input
                            name="email"
                            label={"Email"}
                        />
                        <Input
                            name="telephoneNum"
                            label={"Telephone number"}
                        />
                        <Input
                            name="cellphoneNum"
                            label={"Cellphone Number"}
                        />
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
        </div >
    );
};
export default ContactPage;