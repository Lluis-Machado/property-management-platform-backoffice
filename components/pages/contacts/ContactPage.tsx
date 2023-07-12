'use client'

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Input, Tabs } from 'pg-components';
import { Formik, Form, FormikHelpers } from 'formik';
import { memo, useCallback, useState } from 'react';
import { faFileLines, faHouseChimneyUser, faReceipt, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Local imports
import GroupItem from '@/components/layoutComponent/GroupItem';
import DatePicker from '@/components/datepicker/DatePicker';
import { ApiCallError } from '@/lib/utils/errors';
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { ContactData } from '@/lib/types/contactData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import ContactPropertiesPage from './ContactPropertiesPage';

interface Props {
    initialValues: ContactData;
    contactId: string;
}

const ContactPage = ({ contactId, initialValues }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = useCallback(
        async (values: ContactData, { setSubmitting }: FormikHelpers<ContactData>) => {
            console.log("Valores a enviar: ", values)

            if (values === initialValues) {
                toast.warning('Change at least one field')
                return;
            }

            setIsLoading(true)
            const toastId = toast.loading("Updating contact...");

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
                updateSuccessToast(toastId, "Contact updated correctly!");
                router.refresh();

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
        }, [contactId, initialValues]
    )

    const handleDelete = useCallback(
        async () => {
            const toastId = toast.loading("Deleting contact...");
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts/${contactId}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while deleting a contact');

                updateSuccessToast(toastId, "Contact deleted correctly!");
                router.push('/private/contacts')

            } catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            }
        }, [contactId, router]
    )

    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this contact?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='flex my-6 w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='flex ml-5 gap-5 items-center'>
                    <Image
                        className='rounded-full select-none'
                        src={`https://ui-avatars.com/api/?name=${initialValues.firstName}+${initialValues.lastName}&background=random&size=128`}
                        alt='user avatar with name initials'
                        width={64}
                        height={64}
                    />
                    <span className='text-4xl tracking-tight text-zinc-900'>
                        {initialValues.firstName} {initialValues.lastName}
                    </span>
                </div>
                {/* Cards with actions */}
                <div className='flex flex-row items-center gap-4'>
                    <SimpleLinkCard
                        href={`/private/documents?contactId=${contactId}`}
                        text='Documents'
                        faIcon={faFileLines}
                    />
                    <SimpleLinkCard
                        href={`/private/taxes/${contactId}/declarations`}
                        text='Declarations'
                        faIcon={faReceipt}
                    />
                </div>
                {/* Button toolbar */}
                <div className='flex flex-row self-center gap-4'>
                    <Button
                        elevated
                        onClick={() => router.refresh()}
                        type='button'
                        icon={faRefresh}
                        style='secondary'
                    />
                    <Button
                        elevated
                        onClick={() => setConfirmationVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='danger'
                    />
                </div>
            </div>
            {/* Contact form */}
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize
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
                    <GroupItem cols={3} caption={'Address Information'} >
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
        </div>
    );
};

export default memo(ContactPage);