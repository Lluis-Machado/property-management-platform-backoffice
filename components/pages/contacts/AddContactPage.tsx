'use client'

// Libraries imports
import { Button, Input } from 'pg-components';
import { Formik, Form, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';

// Local imports
import GroupItem from '@/components/layoutComponent/GroupItem';
import DatePicker from '@/components/datepicker/DatePicker';
import { memo, useCallback, useState } from 'react';
import { ApiCallError } from '@/lib/utils/errors';
import { useRouter } from 'next/navigation';
import { ContactData } from '@/lib/types/contactData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';

interface Props {
    initialValues: ContactData;
}

const AddContactPage = ({ initialValues }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = useCallback(
        async (values: ContactData, { setSubmitting }: FormikHelpers<ContactData>) => {
            console.log("Valores a enviar: ", values)
            console.log("Valores a enviar en JSON: ", JSON.stringify(values))

            if (values === initialValues) {
                toast.warning('Change at least one field')
                return;
            }

            setIsLoading(true)

            const toastId = toast.loading("Creating contact...");

            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                );

                if (!resp.ok) {
                    const responseMsg = await resp.text()
                    throw new ApiCallError(responseMsg);
                }
                const data = await resp.json();

                console.log('TODO CORRECTO, valores de vuelta: ', data);

                updateSuccessToast(toastId, "Contact created correctly!");
                router.push('/private/contacts')

            } catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        }, [router]
    )

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <Form>
                <GroupItem cols={3} caption={'Contact Information'} >
                    <Input
                        name="firstName"
                        label={"First name"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="lastName"
                        label={"Last name"}
                        readOnly={isLoading}
                    />
                    <DatePicker
                        name='birthDay'
                        label='Birth date'
                        defaultValue={initialValues.birthDay ?? undefined}
                        isClearable
                        readOnly={isLoading}
                    />
                    {/* <Select
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
                        /> */}
                    {/* <Input
                            name="idCardNumber"
                            label={"ID card number"}
                        /> */}
                    {/* <DatePicker
                            name="idCardExpDate"
                            label={"ID card expiration date"}
                            defaultValue={initialValues.idCardExpDate ?? undefined}
                            isClearable
                        /> */}
                    {/* <Input
                            name="passportNum"
                            label={"Passport Number"}
                            />
                        <DatePicker
                        name='passportExpDate'
                            label={"Passport expiration date"}
                            defaultValue={initialValues.passportExpDate ?? undefined}
                            isClearable
                        /> */}
                    <Input
                        name="nif"
                        label={"NIF"}
                        readOnly={isLoading}
                    />
                    {/* <Input
                            name="companyNumber"
                            label={"Company number"}
                        /> */}
                </GroupItem>
                <GroupItem cols={3} caption={'Adress Information'} >
                    <Input
                        name="address.addressLine1"
                        label={"Address line"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="address.addressLine2"
                        label={"Address line 2"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="address.city"
                        label={"City"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="address.state"
                        label={"State"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="address.postalCode"
                        label={"Postal code"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="address.country"
                        label={"Country"}
                        readOnly={isLoading}
                    />

                    <Input
                        name="email"
                        label={"Email"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="phoneNumber"
                        label={"Phone number"}
                        readOnly={isLoading}
                    />
                    <Input
                        name="mobilePhoneNumber"
                        label={"Mobile phone number"}
                        readOnly={isLoading}
                    />
                </GroupItem>
                <div className='flex justify-end py-4'>
                    <div className='flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            type='submit'
                            text='Submit Changes'
                            disabled={isLoading}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

export default memo(AddContactPage);