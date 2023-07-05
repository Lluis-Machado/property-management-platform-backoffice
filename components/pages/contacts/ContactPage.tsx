'use client'

// Libraries imports
import { Alert, Button, Input, alertType } from 'pg-components';
import { Formik, Form, FormikHelpers } from 'formik';

// Local imports
import GroupItem from '@/components/layoutComponent/GroupItem';
import DatePicker from '@/components/datepicker/DatePicker';
import { ContactData } from '@/app/[lang]/private/contacts/[id]/contact/page';
import { memo, useCallback, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiCallError } from '@/lib/utils/errors';
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { useRouter } from 'next/navigation';

interface Props {
    initialValues: ContactData;
    contactId: string;
}

interface AlertConfig {
    isVisible: boolean;
    type: alertType;
    message: string;
}

const ContactPage = ({ contactId, initialValues }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const router = useRouter();

    const handleSubmit = useCallback(
        async (values: ContactData, { setSubmitting }: FormikHelpers<ContactData>) => {
            console.log("Valores a enviar: ", values)

            if (values === initialValues) {
                setAlertConfig({
                    isVisible: true,
                    type: 'warning',
                    message: 'Change at least one field'
                })
                return;
            }

            setIsLoading(true)

            try {

                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts/${contactId}`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify(values),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while updating a contact');
                const data: ContactData = await resp.json();

                console.log('TODO CORRECTO, valores de vuelta: ', data)

                setAlertConfig({
                    isVisible: true,
                    type: 'success',
                    message: 'Contact updated correctly!'
                })
            } catch (error) {
                console.error(error)
                setAlertConfig({
                    isVisible: true,
                    type: 'danger',
                    message: 'CHECK CONSOLE'
                })
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        }, [contactId]
    )

    const handleDelete = useCallback(
        async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts/${contactId}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while deleting a contact');

                setAlertConfig({
                    isVisible: true,
                    type: 'success',
                    message: 'Contact deleted correctly!'
                })

                router.push('/private/contacts/')
            } catch (error) {
                console.error(error)
                setAlertConfig({
                    isVisible: true,
                    type: 'danger',
                    message: 'CHECK CONSOLE'
                })
            }
        }, [contactId]
    )

    const onHiding = useCallback(
        () => {
            setAlertConfig({
                ...alertConfig,
                isVisible: false,
            });
        }, []
    )

    return (
        <div className='m-2'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this contact?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='absolute right-8'>
                <Alert
                    body={alertConfig.message}
                    isVisible={alertConfig.isVisible}
                    onHidden={onHiding}
                    type={alertConfig.type}
                    duration={3000}
                />
            </div>
            <div className='flex w-full justify-end'>
                <div className='w-10'>
                    <Button
                        elevated
                        onClick={() => setConfirmationVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='outline'
                    />
                </div>
            </div>
            <div>
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
                                defaultValue={new Date(initialValues.birthDay) ?? undefined}
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
                                name="addressLine1"
                                label={"Address line"}
                                readOnly={isLoading}
                            />
                            <Input
                                name="addressLine2"
                                label={"Address line 2"}
                                readOnly={isLoading}
                            />
                            <Input
                                name="city"
                                label={"City"}
                                readOnly={isLoading}
                            />
                            <Input
                                name="state"
                                label={"State"}
                                readOnly={isLoading}
                            />
                            <Input
                                name="postalCode"
                                label={"Postal code"}
                                readOnly={isLoading}
                            />
                            <Input
                                name="country"
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
                                    style='outline'
                                    type='reset'
                                    text='Reset'
                                    disabled={isLoading}
                                />
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
            </div>
        </div>
    );
};

export default memo(ContactPage);