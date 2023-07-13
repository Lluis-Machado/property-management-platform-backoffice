'use client'

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Input, Select } from 'pg-components';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { faFileLines, faReceipt, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Local imports
import GroupItem from '@/components/layoutComponent/GroupItem';
import DatePicker from '@/components/datepicker/DatePicker';
import { ApiCallError } from '@/lib/utils/errors';
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { ContactData } from '@/lib/types/contactData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import EditButton from '@/components/buttons/EditButton';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';

interface Props {
    initialValues: ContactData;
    contactId: string;
    token: TokenRes;
    lang: Locale;
}

interface SelectInput {
    label: string;
    value: string;
}

const ContactPage = ({ contactId, initialValues, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [countries, setCountries] = useState<SelectInput[] | undefined>(undefined);
    const [states, setStates] = useState<SelectInput[] | undefined>(undefined);
    const [selectedCountry, setSelectedCountry] = useState(initialValues.address.country)

    const formikRef = useRef<FormikProps<ContactData>>(null);

    const router = useRouter();

    // Use effect for getting countries when editing
    useEffect(() => {
        if (isEditing) {
            fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries?languageCode=${lang}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store'
            })
                .then((resp) => resp.json())
                .then((data: any) => {
                    let countries = [];
                    for (const country of data) {
                        countries.push({
                            label: country.name,
                            value: country.id
                        })
                    }
                    setCountries(countries)
                })
                .catch((e) => console.error('Error while getting the countries'))
        }
    }, [isEditing])

    useEffect(() => {
        if (isEditing) {
            fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${selectedCountry}/states?languageCode=${lang}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store'
            })
                .then((resp) => resp.json())
                .then((data: any) => {
                    console.log('bruh: ', data)
                    let states = [];
                    for (const state of data) {
                        states.push({
                            label: state.name,
                            value: state.id
                        })
                    }
                    setStates(states)
                })
                .catch((e) => console.error('Error while getting the states'))
        }
    }, [selectedCountry])

    const handleChangeCountry = (country: string) => {
        setSelectedCountry(country);
        return true;
    }

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
                    <EditButton
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
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
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        {handleChangeCountry(values.address.country)}
                        <GroupItem cols={3} caption={'Contact Information'} >
                            <Input
                                name="firstName"
                                label={"First name"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="lastName"
                                label={"Last name"}
                                readOnly={isLoading || !isEditing}
                            />
                            <DatePicker
                                name='birthDay'
                                label='Birth date'
                                defaultValue={initialValues.birthDay ?? undefined}
                                isClearable
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="nif"
                                label={"NIF"}
                                readOnly={isLoading || !isEditing}
                            />
                        </GroupItem>
                        <GroupItem cols={3} caption={'Address Information'} >
                            <Input
                                name="address.addressLine1"
                                label={"Address line"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="address.addressLine2"
                                label={"Address line 2"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Select
                                name='address.country'
                                label={"Country"}
                                size='large'
                                inputsList={countries}
                                defaultValue={{ label: initialValues.address.country, value: initialValues.address.country }}
                                readOnly={isLoading || !isEditing}
                                isSearchable
                            />
                            <Select
                                name='address.state'
                                label={"State"}
                                size='large'
                                inputsList={states}
                                defaultValue={{ label: initialValues.address.state, value: initialValues.address.state }}
                                readOnly={isLoading || !isEditing}
                                isSearchable
                            />
                            <Input
                                name="address.city"
                                label={"City"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="address.postalCode"
                                label={"Postal code"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="email"
                                label={"Email"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="phoneNumber"
                                label={"Phone number"}
                                readOnly={isLoading || !isEditing}
                            />
                            <Input
                                name="mobilePhoneNumber"
                                label={"Mobile phone number"}
                                readOnly={isLoading || !isEditing}
                            />
                        </GroupItem>
                        <div className='flex justify-end py-4'>
                            <div className='flex flex-row justify-between gap-2'>
                                {
                                    isEditing &&
                                    <Button
                                        elevated
                                        type='submit'
                                        text='Submit Changes'
                                        disabled={isLoading}
                                        isLoading={isLoading}
                                    />
                                }
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default memo(ContactPage);