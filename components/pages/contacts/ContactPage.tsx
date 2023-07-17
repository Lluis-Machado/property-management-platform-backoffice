'use client'

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'pg-components';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { faFileLines, faPencil, faReceipt, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Form, {
    GroupItem, Item
} from 'devextreme-react/form';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { ContactData } from '@/lib/types/contactData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';

interface Props {
    contactData: ContactData;
    contactId: string;
    token: TokenRes;
    lang: Locale;
}

interface SelectInput {
    label: string;
    value: string;
}

const ContactPage = ({ contactId, contactData, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [countries, setCountries] = useState<SelectInput[] | undefined>(undefined);
    const [states, setStates] = useState<SelectInput[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(structuredClone(contactData));

    const formRef = useRef<Form>(null)

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

    const handleCountryChange = (countryId: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store'
        })
            .then((resp) => resp.json())
            .then((data: any) => {
                console.log('STATES: ', data)
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

    const handleSubmit = useCallback(
        async () => {
            // const values = formRef.current?.props.formData;
            const values = contactData;

            console.log("Valores a enviar: ", values)
            console.log(JSON.stringify(values))

            if (JSON.stringify(values) === JSON.stringify(initialValues)) {
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
                setInitialValues(data);

            } catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            } finally {
                setIsLoading(false);
            }
        }, [contactId, contactData, initialValues]
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
                        onClick={() => setIsEditing(prev => !prev)}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
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
            <Form
                ref={formRef}
                formData={contactData}
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
            >
                <GroupItem colCount={4} caption="Contact Information">
                    <Item dataField="firstName" label={{ text: "First name" }} />
                    <Item dataField="lastName" label={{ text: "Last name" }} />
                    <Item
                        dataField="birthDay"
                        label={{ text: 'Birth date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true
                        }}
                    />
                    <Item dataField="nif" label={{ text: "NIF" }} />
                </GroupItem>
                <GroupItem colCount={4} caption="Address Information">
                    <Item dataField="address.addressLine1" label={{ text: "Address line" }} />
                    <Item dataField="address.addressLine2" label={{ text: "Address line 2" }} />
                    <Item
                        dataField="address.country"
                        label={{ text: "Country" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countries,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true,
                            onValueChanged: (e: any) => handleCountryChange(e.value)
                        }}
                    />
                    <Item
                        dataField="address.state"
                        label={{ text: "State" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: states,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true
                        }}
                    />
                    <Item dataField="address.city" label={{ text: "City" }} />
                    <Item dataField="address.postalCode" label={{ text: "Postal code" }} />
                    <Item dataField="email" label={{ text: "Email" }} />
                    <Item dataField="phoneNumber" label={{ text: "Phone number" }} />
                    <Item dataField="mobilePhoneNumber" label={{ text: "Mobile phone number" }} />
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
            <div className='flex justify-end'>
                <div className='flex flex-row justify-between gap-2'>
                    {
                    isEditing &&
                        <Button
                            elevated
                            type='button'
                            text='Submit Changes'
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                            />
                    }
                </div>
            </div>
                            </div>
        </div>
    );
};

export default memo(ContactPage);