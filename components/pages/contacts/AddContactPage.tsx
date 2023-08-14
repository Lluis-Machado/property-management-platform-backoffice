'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
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

// Local imports
import { ContactData } from '@/lib/types/contactData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData } from '@/lib/types/countriesData';
import useCountryChange from '@/lib/hooks/useCountryChange';
import DataSource from 'devextreme/data/data_source';

interface Props {
    contactData: ContactData;
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
}

const AddContactPage = ({ contactData, countries, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData)
    );
    const [addressOptions, setAddressOptions] = useState({});
    const [countryDataSource, setCountryDataSource] = useState({});

    const { getFilteredStates, handleCountryChange, isStateLoading } =
        useCountryChange(lang, token);

    const formRef = useRef<Form>(null);

    const router = useRouter();

    useEffect(() => {
        // Set DataSource for DevExtreme select box grouping
        setCountryDataSource(
            new DataSource({
                store: {
                    type: 'array',
                    data: countries,
                    key: 'id',
                },
                group: 'category',
            })
        );
    }, [countries]);

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        const values = structuredClone(contactData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating contact...');

        try {
            const valuesToSend: ContactData = {
                ...values,
                birthDay: formatDate(values.birthDay),
            };

            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );

            const data = await apiPost(
                '/contacts/contacts',
                valuesToSend,
                token,
                'Error while creating a contact'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact created correctly!');
            router.push('/private/contacts');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [contactData, initialValues, token, router]);

    return (
        <div>
            <Form
                ref={formRef}
                formData={contactData}
                labelMode={'floating'}
                readOnly={isLoading}
                showValidationSummary
            >
                {/* Main Information */}
                <GroupItem colCount={4}>
                    <Item
                        dataField={'title'}
                        label={{ text: 'Title' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: [
                                { id: 1, name: 'Mr.' },
                                { id: 2, name: 'Ms.' },
                                { id: 3, name: 'Mrs.' },
                                { id: 4, name: 'Miss' },
                                { id: 5, name: 'Lord' },
                                { id: 6, name: 'Lady' },
                                { id: 7, name: 'Dr.' },
                                { id: 8, name: 'Professor' },
                            ],
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
                            items: [
                                { id: 1, name: 'Male' },
                                { id: 2, name: 'Female' },
                                { id: 3, name: 'Other' },
                            ],
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
                </GroupItem>
                {/* Tabs */}
                <GroupItem cssClass='mt-4'>
                    <TabbedItem>
                        <TabPanelOptions
                            deferRendering={false}
                            height={'60vh'}
                        />
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
                                                        items: [
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
                                                        ],
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
                                                        type: 'danger',
                                                        onClick: () => {
                                                            // Set a new empty address
                                                            contactData.identifications.splice(
                                                                index,
                                                                1
                                                            );
                                                            // Trick to force react to update
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
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.identifications.push({
                                            type: null,
                                            number: '',
                                            emissionDate: null,
                                            expirationDate: null,
                                            shortComment: '',
                                        });
                                        // Trick to force react to update
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
                                                    dataSource:
                                                        countryDataSource,
                                                    displayExpr: 'name',
                                                    valueExpr: 'id',
                                                    grouped: true,
                                                    // groupRender: Group,
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
                                                    readOnly: isStateLoading,
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
                                                    type: 'danger',
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
                                    text: undefined,
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
                                        // Trick to force react to update
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
                                            colCount={5}
                                        >
                                            <Item
                                                key={`phoneType${index}`}
                                                dataField={`phones[${index}].phoneType`}
                                                label={{ text: 'Phone Type' }}
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
                                                        {
                                                            id: 4,
                                                            name: 'Other',
                                                        },
                                                    ],
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
                                                    items: [
                                                        {
                                                            id: 1,
                                                            name: 'Business',
                                                        },
                                                        {
                                                            id: 2,
                                                            name: 'Private',
                                                        },
                                                    ],
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                key={`number${index}`}
                                                dataField={`phones[${index}].number`}
                                                label={{ text: 'Phone Number' }}
                                                editorOptions={{
                                                    mask: '+(0000) 000-00-00-00',
                                                }}
                                            />
                                            <Item
                                                key={`phonesShortComment${index}`}
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
                                                    type: 'danger',
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
                                    text: undefined,
                                    onClick: () => {
                                        // Set a new empty address
                                        contactData.phones.push({
                                            phoneType: null,
                                            type: null,
                                            phoneNumber: '',
                                            shortComment: '',
                                        });
                                        // Trick to force react to update
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
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            type='button'
                            text='Submit Changes'
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddContactPage);
