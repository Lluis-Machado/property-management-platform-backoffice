'use client'

import { Formik, Form, FormikHelpers } from 'formik';
import { Button, Input, Select } from 'pg-components';
import GroupItem from '../../layoutComponent/GroupItem';

interface ContactValues {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    taxResidence: string;
    idCardNum: string;
    idCardExpDate: string;
    passportNum: string;
    passportExpDate: string;
    nif: string;
    companyNumber: string;
    addressLine: string;
    city: string;
    region: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    telephoneNum: string;
    cellphoneNum: string;
}

const ContactPage = ({ initialValues }: { initialValues: ContactValues }) => {

    const handleSubmit = async (
        values: ContactValues,
        { setSubmitting }: FormikHelpers<ContactValues>
    ) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className='m-2'>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form >
                    <GroupItem cols={2} caption={'Contact Information'} >
                        <Input
                            name="firstName"
                            label={"First name"}
                        />
                        <Input
                            name="lastName"
                            label={"Last name"}
                        />
                        <Input
                            name="dateOfBirth"
                            label={"Date of birth"}
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
                        <Input
                            name="idCardExpDate"
                            label={"ID card expiration date"}
                        />
                        <Input
                            name="passportNum"
                            label={"Passport Number"}
                        />
                        <Input
                            name="passportExpDate"
                            label={"Passport expiration date"}
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
                    <GroupItem cols={2} caption={'Adress Information'} >
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
    )
}

export default ContactPage