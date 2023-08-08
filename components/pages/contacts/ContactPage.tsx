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
    Tab,
    TabPanelOptions,
    TabbedItem,
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
import useCountryChange from '@/lib/hooks/useCountryChange';
import ContactPropertiesDG from './ContactPropertiesDG';
import { OwnershipData } from '@/lib/types/ownershipData';

interface Props {
    contactData: ContactData;
    countriesData: CountryData[];
    initialStates: StateData[];
    ownershipData: OwnershipData[];
    token: TokenRes;
    lang: Locale;
}

const ContactPage = ({
    contactData,
    countriesData,
    ownershipData,
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
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData)
    );
    const [addressOptions, setAddressOptions] = useState({});

    const { getFilteredStates, handleCountryChange, isStateLoading } =
        useCountryChange(lang, token, initialStates);

    const formRef = useRef<Form>(null);

    const router = useRouter();

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
                phoneNumber,
                mobilePhoneNumber,
                birthDay: formatDate(values.birthDay),
            };

            console.log('Valores a enviar: ', valuesToSend);
            console.log(JSON.stringify(valuesToSend));

            const data = await apiPatch(
                `/contacts/contacts/${contactData.id}`,
                valuesToSend,
                token,
                'Error while updating this contact'
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
                'Error while deleting this contact'
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
                {/* Main Information */}
                <GroupItem colCount={4}>
                    <Item
                        dataField='firstName'
                        label={{ text: 'First name' }}
                    />
                    <Item dataField='lastName' label={{ text: 'Last name' }}>
                        <RequiredRule />
                        <StringLengthRule
                            min={3}
                            message='Last name have at least 2 letters'
                        />
                    </Item>
                    <Item
                        dataField='birthPlace'
                        label={{ text: 'Birth Place' }}
                    />
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
                    <Item
                        dataField='nifExpirationDate'
                        label={{ text: 'NIF Expiration Date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                        }}
                    />
                    <Item
                        dataField='passportNumber'
                        label={{ text: 'Passport Number' }}
                    />
                    <Item
                        dataField='passportExpirationDate'
                        label={{ text: 'Passport Expiration Date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                        }}
                    />
                    <Item
                        dataField={'maritalStatus'}
                        label={{ text: 'Marital Status' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: [
                                { id: 1, name: 'Single' },
                                { id: 2, name: 'Married' },
                                { id: 3, name: 'Divorced' },
                                { id: 4, name: 'Widowed' },
                            ],
                            valueExpr: 'id',
                            displayExpr: 'name',
                        }}
                    />

                    <Item
                        dataField='socialSecurityNumber'
                        label={{ text: 'Social Security Number' }}
                    />
                    <Item dataField='taxId' label={{ text: 'Tax Id' }} />
                </GroupItem>
                {/* Tabs */}
                <GroupItem cssClass='mt-4'>
                    <TabbedItem>
                        <TabPanelOptions deferRendering={false} />
                        <Tab title={`Properties`}>
                            <ContactPropertiesDG
                                ownershipData={ownershipData}
                            />
                        </Tab>
                        <Tab title={`Address Information`}>
                            <GroupItem colCount={1}>
                                {contactData.addresses.map((address, index) => {
                                    return (
                                        <GroupItem
                                            key={`GroupItem-${index}`}
                                            colCount={8}
                                        >
                                            <Item
                                                key={`addressType${index}`}
                                                dataField={`addresses[${index}].addressType`}
                                                label={{ text: 'Address Type' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: [
                                                        {
                                                            id: 1,
                                                            name: 'Physical Address',
                                                        },
                                                        {
                                                            id: 2,
                                                            name: 'Billing Address',
                                                        },
                                                    ],
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                key={`addressLine1${index}`}
                                                dataField={`addresses[${index}].addressLine1`}
                                                label={{ text: 'Address line' }}
                                            />
                                            <Item
                                                key={`addressLine2${index}`}
                                                dataField={`addresses[${index}].addressLine2`}
                                                label={{
                                                    text: 'Address line 2',
                                                }}
                                            />
                                            <Item
                                                key={`country${index}`}
                                                dataField={`addresses[${index}].country`}
                                                label={{ text: 'Country' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: countriesData,
                                                    displayExpr: 'name',
                                                    valueExpr: 'id',
                                                    searchEnabled: true,
                                                    onValueChanged: (
                                                        e: any
                                                    ) => {
                                                        handleCountryChange(
                                                            e.value
                                                        );
                                                        // Ensure state is removed
                                                        contactData.addresses[
                                                            index
                                                        ].state = null;
                                                    },
                                                }}
                                            />
                                            <Item
                                                key={`state${index}`}
                                                dataField={`addresses[${index}].state`}
                                                label={{ text: 'State' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: getFilteredStates(
                                                        index,
                                                        contactData
                                                    ),
                                                    displayExpr: 'name',
                                                    valueExpr: 'id',
                                                    searchEnabled: true,
                                                    readOnly:
                                                        !isEditing ||
                                                        isStateLoading,
                                                }}
                                            />
                                            <Item
                                                key={`city${index}`}
                                                dataField={`addresses[${index}].city`}
                                                label={{ text: 'City' }}
                                            />
                                            <Item
                                                key={`postalCode${index}`}
                                                dataField={`addresses[${index}].postalCode`}
                                                label={{ text: 'Postal code' }}
                                            />
                                            <Item
                                                key={`button${index}`}
                                                itemType='button'
                                                horizontalAlignment='left'
                                                buttonOptions={{
                                                    icon: 'trash',
                                                    text: 'Remove address',
                                                    disabled: !isEditing,
                                                    onClick: () => {
                                                        // Set a new empty address
                                                        contactData.addresses.splice(
                                                            index,
                                                            1
                                                        );
                                                        // Trick to force react to update
                                                        setAddressOptions([]);
                                                    },
                                                }}
                                            />
                                        </GroupItem>
                                    );
                                })}
                            </GroupItem>
                            <Item
                                itemType='button'
                                horizontalAlignment='left'
                                buttonOptions={{
                                    icon: 'add',
                                    text: 'Add address',
                                    disabled: !isEditing,
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.addresses.push({
                                            addressLine1: '',
                                            addressLine2: '',
                                            city: '',
                                            state: null,
                                            country: null,
                                            postalCode: '',
                                            addressType: undefined,
                                        });
                                        // Trick to force react to update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                        <Tab title={`Emails`}>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='email'
                                    label={{ text: 'Email' }}
                                >
                                    <EmailRule message='Email is invalid' />
                                </Item>
                                <Item
                                    dataField='secondaryEmail'
                                    label={{ text: 'Secondary Email' }}
                                >
                                    <EmailRule message='Email is invalid' />
                                </Item>
                                <Item
                                    dataField='scanMail'
                                    label={{ text: 'Scan Mail' }}
                                >
                                    <EmailRule message='Email is invalid' />
                                </Item>
                            </GroupItem>
                        </Tab>
                        <Tab title={`Phones`}>
                            <GroupItem colCount={1}>
                                {contactData.phones.map((phone, index) => {
                                    return (
                                        <GroupItem
                                            key={`GroupItem2-${index}`}
                                            colCount={3}
                                        >
                                            <Item
                                                key={`phoneType${index}`}
                                                dataField={`phones[${index}].phoneType`}
                                                label={{ text: 'Address Type' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: [
                                                        {
                                                            id: 1,
                                                            name: 'Mobile phone',
                                                        },
                                                        {
                                                            id: 2,
                                                            name: 'Landline phone',
                                                        },
                                                        { id: 3, name: 'Fax' },
                                                    ],
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                dataField={`phones[${index}].number`}
                                                label={{ text: 'Phone Number' }}
                                                editorOptions={{
                                                    mask: '+(0000) 000-00-00-00',
                                                }}
                                            />
                                            <Item
                                                key={`button${index}`}
                                                itemType='button'
                                                horizontalAlignment='left'
                                                buttonOptions={{
                                                    icon: 'trash',
                                                    text: 'Remove phone',
                                                    disabled: !isEditing,
                                                    onClick: () => {
                                                        // Set a new empty address
                                                        contactData.phones.splice(
                                                            index,
                                                            1
                                                        );
                                                        // Trick to force react to update
                                                        setAddressOptions([]);
                                                    },
                                                }}
                                            />
                                        </GroupItem>
                                    );
                                })}
                            </GroupItem>
                            <Item
                                itemType='button'
                                horizontalAlignment='left'
                                buttonOptions={{
                                    icon: 'add',
                                    text: 'Add number',
                                    disabled: !isEditing,
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.phones.push({
                                            phoneType: undefined,
                                            number: undefined,
                                        });
                                        // Trick to force react to update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
            <div className='mt-4 h-[2rem]'>
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
