'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'pg-components';
import {
    faFileLines,
    faPencil,
    faReceipt,
    faSave,
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
import DataSource from 'devextreme/data/data_source';

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

function Group() {
    return <></>;
}

const countriesMaskItems = [
    { id: 1, mask: '+34 000-00-00-00', name: 'Spain' },
    { id: 2, mask: '+49 0000-000000', name: 'Germany' },
    { id: 3, mask: '+1 (000) 000-0000', name: 'United States' },
];

const identificationItems = [
    {
        id: 1,
        name: 'NIE',
    },
    {
        id: 2,
        name: 'DNI',
    },
    {
        id: 3,
        name: 'Passport',
    },
    {
        id: 4,
        name: 'SSN',
    },
    {
        id: 5,
        name: 'Tax Id',
    },
    {
        id: 6,
        name: 'Other',
    },
];

const genderItems = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' },
];

const titleItems = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Ms.' },
    { id: 3, name: 'Mrs.' },
    { id: 4, name: 'Miss' },
    { id: 5, name: 'Lord' },
    { id: 6, name: 'Lady' },
    { id: 7, name: 'Dr.' },
    { id: 8, name: 'Professor' },
];

const maritalStatusItems = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Married' },
    { id: 3, name: 'Divorced' },
    { id: 4, name: 'Widowed' },
];

const addressTypeItems = [
    {
        id: 1,
        name: 'Physical Address',
    },
    {
        id: 2,
        name: 'Billing Address',
    },
];

const phoneTypeItems = [
    {
        id: 1,
        name: 'Mobile phone',
    },
    {
        id: 2,
        name: 'Landline phone',
    },
    { id: 3, name: 'Fax' },
    {
        id: 4,
        name: 'Other',
    },
];

const phoneType2Items = [
    {
        id: 1,
        name: 'Business',
    },
    {
        id: 2,
        name: 'Private',
    },
];

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
    const [confirmationVisible, setConfirmationVisible] =
        useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData)
    );
    const [addressOptions, setAddressOptions] = useState({});
    const [countryDataSource, setCountryDataSource] = useState({});

    const { getFilteredStates, handleCountryChange, isStateLoading } =
        useCountryChange(lang, token, initialStates);

    const formRef = useRef<Form>(null);

    const router = useRouter();

    useEffect(() => {
        // Set DataSource for DevExtreme select box grouping
        setCountryDataSource(
            new DataSource({
                store: {
                    type: 'array',
                    data: countriesData,
                    key: 'id',
                },
                group: 'category',
            })
        );
    }, [countriesData]);

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

        try {
            // Format dates from ISO 8601 to DateOnly
            if (values.identifications.length > 0) {
                for (const id of values.identifications) {
                    if (id.emissionDate)
                        id.emissionDate = formatDate(id.emissionDate);
                    if (id.expirationDate)
                        id.expirationDate = formatDate(id.expirationDate);
                }
            }
            const valuesToSend: ContactData = {
                ...values,
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
    }, [contactData, initialValues, token]);

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

    const getMaskFromDataSource = (index: number) =>
        countriesMaskItems.filter(
            (obj) => obj.id === contactData.phones[index].countryMaskId
        )[0]?.mask || countriesMaskItems[0].mask;

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
                        onClick={handleSubmit}
                        type='button'
                        icon={faSave}
                        disabled={!isEditing || isLoading}
                        isLoading={isLoading}
                    />
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
                        dataField={'title'}
                        label={{ text: 'Title' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: titleItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                        }}
                    />
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
                        dataField={'gender'}
                        label={{ text: 'Gender' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: genderItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                        }}
                    />
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
                    <Item
                        dataField={'maritalStatus'}
                        label={{ text: 'Marital Status' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: maritalStatusItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                        }}
                    />
                </GroupItem>
                {/* Tabs */}
                <GroupItem cssClass='mt-4'>
                    <TabbedItem>
                        <TabPanelOptions
                            deferRendering={false}
                            height={'60vh'}
                        />
                        <Tab title={`Properties`}>
                            <ContactPropertiesDG
                                ownershipData={ownershipData}
                            />
                        </Tab>
                        <Tab title={`Identification Documents`}>
                            <GroupItem colCount={1}>
                                {contactData.identifications.map(
                                    (identification, index) => {
                                        return (
                                            <GroupItem
                                                key={`GroupItem3-${index}`}
                                                colCount={6}
                                            >
                                                <Item
                                                    key={`type${index}`}
                                                    dataField={`identifications[${index}].type`}
                                                    label={{
                                                        text: 'Identification Type',
                                                    }}
                                                    editorType='dxSelectBox'
                                                    editorOptions={{
                                                        items: identificationItems,
                                                        valueExpr: 'id',
                                                        displayExpr: 'name',
                                                    }}
                                                />
                                                <Item
                                                    key={`number${index}`}
                                                    dataField={`identifications[${index}].number`}
                                                    label={{
                                                        text: 'Document Number',
                                                    }}
                                                />
                                                <Item
                                                    key={`emissionDate${index}`}
                                                    dataField={`identifications[${index}].emissionDate`}
                                                    label={{
                                                        text: 'Emission Date',
                                                    }}
                                                    editorType='dxDateBox'
                                                    editorOptions={{
                                                        displayFormat:
                                                            dateFormat,
                                                        showClearButton: true,
                                                    }}
                                                />
                                                <Item
                                                    key={`expirationDate${index}`}
                                                    dataField={`identifications[${index}].expirationDate`}
                                                    label={{
                                                        text: 'Expiration Date',
                                                    }}
                                                    editorType='dxDateBox'
                                                    editorOptions={{
                                                        displayFormat:
                                                            dateFormat,
                                                        showClearButton: true,
                                                    }}
                                                />
                                                <Item
                                                    key={`identificationShortComment${index}`}
                                                    dataField={`identifications[${index}].shortComment`}
                                                    label={{
                                                        text: 'Short Comment',
                                                    }}
                                                    editorOptions={{
                                                        maxLength: 30,
                                                    }}
                                                />
                                                <Item
                                                    key={`button3-${index}`}
                                                    itemType='button'
                                                    horizontalAlignment='left'
                                                    verticalAlignment='bottom'
                                                    buttonOptions={{
                                                        icon: 'trash',
                                                        text: undefined,
                                                        disabled: !isEditing,
                                                        type: 'danger',
                                                        onClick: () => {
                                                            // Set a new empty address
                                                            contactData.identifications.splice(
                                                                index,
                                                                1
                                                            );
                                                            // Trick to force react update
                                                            setAddressOptions(
                                                                []
                                                            );
                                                        },
                                                    }}
                                                />
                                            </GroupItem>
                                        );
                                    }
                                )}
                            </GroupItem>
                            <Item
                                itemType='button'
                                horizontalAlignment='left'
                                buttonOptions={{
                                    icon: 'add',
                                    text: undefined,
                                    disabled: !isEditing,
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.identifications.push({
                                            type: null,
                                            number: '',
                                            emissionDate: null,
                                            expirationDate: null,
                                            shortComment: '',
                                        });
                                        // Trick to force react update
                                        setAddressOptions([]);
                                    },
                                }}
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
                                                    items: addressTypeItems,
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
                                                    dataSource:
                                                        countryDataSource,
                                                    displayExpr: 'name',
                                                    valueExpr: 'id',
                                                    grouped: true,
                                                    groupRender: Group,
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
                                                verticalAlignment='bottom'
                                                buttonOptions={{
                                                    icon: 'trash',
                                                    text: undefined,
                                                    disabled: !isEditing,
                                                    type: 'danger',
                                                    onClick: () => {
                                                        // Set a new empty address
                                                        contactData.addresses.splice(
                                                            index,
                                                            1
                                                        );
                                                        // Trick to force react update
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
                                    text: undefined,
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
                                            addressType: null,
                                        });
                                        // Trick to force react update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                        <Tab title={`Phones`}>
                            <GroupItem colCount={1}>
                                {contactData.phones.map((phone, index) => {
                                    return (
                                        <GroupItem
                                            key={`GroupItem2-${index}`}
                                            colCount={6}
                                        >
                                            <Item
                                                key={`phoneType${index}`}
                                                dataField={`phones[${index}].phoneType`}
                                                label={{ text: 'Phone Type' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: phoneTypeItems,
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                key={`type${index}`}
                                                dataField={`phones[${index}].type`}
                                                label={{ text: 'Type' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: phoneType2Items,
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                key={`countryMaskId${index}`}
                                                dataField={`phones[${index}].countryMaskId`}
                                                label={{ text: 'Country' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: countriesMaskItems,
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                    defaultValue:
                                                        countriesMaskItems[0],
                                                    onValueChanged:
                                                        setAddressOptions, // Trick to force react update
                                                }}
                                            >
                                                <RequiredRule />
                                            </Item>
                                            <Item
                                                key={`phoneNumber${index}`}
                                                dataField={`phones[${index}].phoneNumber`}
                                                label={{ text: 'Phone Number' }}
                                                editorOptions={{
                                                    mask: getMaskFromDataSource(
                                                        index
                                                    ),
                                                }}
                                            />
                                            <Item
                                                key={`phoneShortComment${index}`}
                                                dataField={`phones[${index}].shortComment`}
                                                label={{
                                                    text: 'Short Comment',
                                                }}
                                                editorOptions={{
                                                    maxLength: 30,
                                                }}
                                            />
                                            <Item
                                                key={`button2-${index}`}
                                                itemType='button'
                                                horizontalAlignment='left'
                                                verticalAlignment='bottom'
                                                buttonOptions={{
                                                    icon: 'trash',
                                                    text: undefined,
                                                    disabled: !isEditing,
                                                    type: 'danger',
                                                    onClick: () => {
                                                        // Set a new empty address
                                                        contactData.phones.splice(
                                                            index,
                                                            1
                                                        );
                                                        // Trick to force react update
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
                                    text: undefined,
                                    disabled: !isEditing,
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.phones.push({
                                            phoneType: null,
                                            type: null,
                                            countryMaskId:
                                                countriesMaskItems[0].id,
                                            phoneNumber: '',
                                            shortComment: '',
                                        });
                                        // Trick to force react update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                        <Tab title={`Other`}>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='email'
                                    label={{ text: 'Email' }}
                                >
                                    <EmailRule message='Email is invalid' />
                                </Item>
                                <Item
                                    dataField='iban'
                                    label={{ text: 'IBAN' }}
                                />
                            </GroupItem>
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
        </div>
    );
};

export default memo(ContactPage);
