'use client';

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'pg-components';
import { memo, useCallback, useRef, useState } from 'react';
import {
    faFileLines,
    faPencil,
    faReceipt,
    faTrash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Form, {
    EmailRule,
    GroupItem,
    Item,
    RequiredRule,
    StringLengthRule,
} from 'devextreme-react/form';
import TextBox, { Button as TextBoxButton } from 'devextreme-react/text-box';

// Local imports
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { ContactData } from '@/lib/types/contactData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { CountryData, StateData } from '@/lib/types/countriesData';

interface Props {
    contactData: ContactData;
    countriesData: CountryData[];
    initialStates: StateData[];
    token: TokenRes;
    lang: Locale;
}

const ContactPage = ({
    contactData,
    countriesData,
    initialStates,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>(
        contactData.phoneNumber
    );
    const [mobilePhoneNumber, setMobilePhoneNumber] = useState<string>(
        contactData.mobilePhoneNumber
    );
    const [confirmationVisible, setConfirmationVisible] =
        useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(
        initialStates
    );
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData)
    );

    const formRef = useRef<Form>(null);

    const router = useRouter();

    const handleCountryChange = useCallback(
        (countryId: number) => {
            fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${token.token_type} ${token.access_token}`,
                    },
                    cache: 'no-store',
                }
            )
                .then((resp) => resp.json())
                .then((data: StateData[]) => setStates(data))
                .catch((e) => console.error('Error while getting the states'));
            // Ensure state is removed
            contactData.address.state = null;
        },
        [lang, token, contactData.address]
    );

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        const values = structuredClone(contactData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating contact...');

        if (!values.nif) values.nif = null;

        try {
            const valuesToSend: ContactData = {
                ...values,
                birthDay: formatDate(values.birthDay),
                phoneNumber,
                mobilePhoneNumber,
            };

            console.log('Valores a enviar: ', valuesToSend);
            console.log(JSON.stringify(valuesToSend));

            const data = await apiPatch(
                `/contacts/contacts/${contactData.id}`,
                valuesToSend,
                token,
                'Error while updating a contact'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'Contact updated correctly!');
            setInitialValues(data);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [contactData, initialValues, token, mobilePhoneNumber, phoneNumber]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting contact...');
        try {
            await apiDelete(
                `/contacts/contacts/${contactData.id}`,
                token,
                'Error while deleting a contact'
            );

            updateSuccessToast(toastId, 'Contact deleted correctly!');
            router.push('/private/contacts');
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [contactData, router, token]);

    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this contact?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='my-6 flex w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='ml-5 flex items-center gap-5'>
                    <Image
                        className='select-none rounded-full'
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
                        href={`/private/documents?contactId=${contactData.id}`}
                        text='Documents'
                        faIcon={faFileLines}
                    />
                    <SimpleLinkCard
                        href={`/private/taxes/${contactData.id}/declarations`}
                        text='Declarations'
                        faIcon={faReceipt}
                    />
                </div>
                {/* Button toolbar */}
                <div className='flex flex-row gap-4 self-center'>
                    <Button
                        elevated
                        onClick={() => setIsEditing((prev) => !prev)}
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
                showValidationSummary
            >
                <GroupItem colCount={4} caption='Contact Information'>
                    <Item
                        dataField='firstName'
                        label={{ text: 'First name' }}
                    />
                    <Item dataField='lastName' label={{ text: 'Last name' }}>
                        <RequiredRule message='Last name is required' />
                        <StringLengthRule
                            min={3}
                            message='Last name have at least 2 letters'
                        />
                    </Item>
                    <Item
                        dataField='birthDay'
                        label={{ text: 'Birth date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                        }}
                    />
                    <Item dataField='nif' label={{ text: 'NIF' }} />
                </GroupItem>
                <GroupItem colCount={4} caption='Address Information'>
                    <Item
                        dataField='address.addressLine1'
                        label={{ text: 'Address line' }}
                    />
                    <Item
                        dataField='address.addressLine2'
                        label={{ text: 'Address line 2' }}
                    />
                    <Item
                        dataField='address.country'
                        label={{ text: 'Country' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countriesData,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            searchEnabled: true,
                            onValueChanged: (e: any) =>
                                handleCountryChange(e.value),
                        }}
                    />
                    <Item
                        dataField='address.state'
                        label={{ text: 'State' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: states,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            searchEnabled: true,
                        }}
                    />
                    <Item dataField='address.city' label={{ text: 'City' }} />
                    <Item
                        dataField='address.postalCode'
                        label={{ text: 'Postal code' }}
                    />
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item>
                        <TextBox
                            value={phoneNumber}
                            label='Phone number'
                            onValueChange={(e) => setPhoneNumber(e)}
                            mask='+(0000) 000-00-00-00'
                            readOnly={isLoading || !isEditing}
                        >
                            <TextBoxButton
                                name='catasterBtn'
                                location='after'
                                options={{
                                    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="phoneNumberIcon" height="0.8em" viewBox="0 0 512 512"><style>.phoneNumberIcon{fill:#ffffff}</style><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>',
                                    type: 'default',
                                    onClick: () =>
                                        contactData.phoneNumber &&
                                        window.open(
                                            `tel:${contactData.phoneNumber}`,
                                            '_self'
                                        ),
                                    disabled: contactData.phoneNumber
                                        ? false
                                        : true,
                                }}
                            />
                        </TextBox>
                    </Item>
                    <Item>
                        <TextBox
                            value={mobilePhoneNumber}
                            label='Mobile phone number'
                            onValueChange={(e) => setMobilePhoneNumber(e)}
                            mask='+(0000) 000-00-00-00'
                            readOnly={isLoading || !isEditing}
                        >
                            <TextBoxButton
                                name='catasterBtn'
                                location='after'
                                options={{
                                    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="phoneNumberIcon" height="0.8em" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>',
                                    type: 'default',
                                    onClick: () =>
                                        contactData.mobilePhoneNumber &&
                                        window.open(
                                            `tel:+${contactData.mobilePhoneNumber}`,
                                            '_self'
                                        ),
                                    disabled: contactData.mobilePhoneNumber
                                        ? false
                                        : true,
                                }}
                            />
                        </TextBox>
                    </Item>
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        {isEditing && (
                            <Button
                                elevated
                                type='button'
                                text='Submit Changes'
                                disabled={isLoading}
                                isLoading={isLoading}
                                onClick={handleSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ContactPage);
