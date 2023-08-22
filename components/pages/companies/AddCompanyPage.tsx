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
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import 'devextreme-react/text-area';

// Local imports
import { CompanyData } from '@/lib/types/companyData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData } from '@/lib/types/countriesData';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import useCountryChange from '@/lib/hooks/useCountryChange';
import { ContactData } from '@/lib/types/contactData';
import DataSource from 'devextreme/data/data_source';
import {
    addressTypeItems,
    companyContactsTypeItems,
    countriesMaskItems,
} from '@/lib/utils/selectBoxItems';
import { faSave } from '@fortawesome/free-solid-svg-icons';

interface Props {
    companyData: CompanyData;
    countries: CountryData[];
    contactsData: ContactData[];
    token: TokenRes;
    lang: Locale;
}

const AddCompanyPage = ({
    companyData,
    countries,
    contactsData,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<CompanyData>(
        structuredClone(companyData)
    );
    const [addressOptions, setAddressOptions] = useState({});
    const [countryDataSource, setCountryDataSource] = useState({});

    const { states, handleCountryChange, isStateLoading, getFilteredStates } =
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

        const values = structuredClone(companyData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating company...');

        if (!values.nif) values.nif = null;

        try {
            const valuesToSend: CompanyData = {
                ...values,
                foundingDate: formatDate(values.foundingDate),
            };

            console.log('Valores a enviar: ', valuesToSend);
            console.log(
                'Valores a enviar en JSON: ',
                JSON.stringify(valuesToSend)
            );

            const data = await apiPost(
                '/companies/companies',
                valuesToSend,
                token,
                'Error while creating a company'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Company created correctly!');
            router.push('/private/companies');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [companyData, initialValues, token, router]);

    const getMaskFromDataSource = () =>
        countriesMaskItems.filter(
            (obj) => obj.id === companyData.countryMaskId
        )[0]?.mask || countriesMaskItems[0].mask;

    const displayContactFullName = (item: ContactData) => {
        if (!item) return;
        if (item.firstName) return `${item.firstName} ${item.lastName}`;
        else return `${item.lastName}`;
    };

    return (
        <div>
            <Form
                ref={formRef}
                formData={companyData}
                labelMode={'floating'}
                readOnly={isLoading}
                showValidationSummary
            >
                <GroupItem colCount={4}>
                    <Item dataField='name' label={{ text: 'Company name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='nif' label={{ text: 'NIF' }} />
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='germanTaxOffice'
                        label={{ text: 'German Tax Office' }}
                    />
                    <Item
                        dataField='companyPurpose'
                        label={{ text: 'Company Purpose' }}
                    />
                    <Item
                        dataField='taxNumber'
                        label={{ text: 'Tax Number' }}
                    />
                    <Item
                        dataField='uStIDNumber'
                        label={{ text: 'uSt ID Number' }}
                    />
                    <Item
                        dataField='foundingDate'
                        label={{ text: 'Founding Date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                        }}
                    />
                    <Item
                        dataField={`countryMaskId`}
                        label={{ text: 'Phone Country' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countriesMaskItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                            defaultValue: countriesMaskItems[0],
                            onValueChanged: setAddressOptions, // Trick to force react update
                        }}
                    >
                        <RequiredRule />
                    </Item>
                    <Item
                        dataField={`phoneNumber`}
                        label={{ text: 'Phone Number' }}
                        editorOptions={{
                            mask: getMaskFromDataSource(),
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
                        <Tab title={`Address Information`}>
                            <GroupItem colCount={1}>
                                {companyData.addresses.map((address, index) => {
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
                                                    // groupRender: Group,
                                                    searchEnabled: true,
                                                    onValueChanged: (
                                                        e: any
                                                    ) => {
                                                        handleCountryChange(
                                                            e.value
                                                        );
                                                        // Ensure state is removed
                                                        companyData.addresses[
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
                                                        companyData
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
                                                        companyData.addresses.splice(
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
                                        companyData.addresses.push({
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
                        <Tab title={`Contacts`}>
                            <GroupItem colCount={1}>
                                {companyData.contacts.map((phone, index) => {
                                    return (
                                        <GroupItem
                                            key={`GroupItem2-${index}`}
                                            colCount={6}
                                        >
                                            <Item
                                                key={`contactType${index}`}
                                                dataField={`contacts[${index}].contactType`}
                                                label={{ text: 'Contact Type' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: companyContactsTypeItems,
                                                    valueExpr: 'id',
                                                    displayExpr: 'name',
                                                }}
                                            />
                                            <Item
                                                key={`contactId${index}`}
                                                dataField={`contacts[${index}].contactId`}
                                                label={{ text: 'Contact' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: contactsData,
                                                    valueExpr: 'id',
                                                    displayExpr:
                                                        displayContactFullName,
                                                    searchEnabled: true,
                                                }}
                                            />
                                            <Item
                                                key={`contactsShortComment${index}`}
                                                dataField={`contacts[${index}].shortComment`}
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
                                                        companyData.contacts.splice(
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
                                        companyData.contacts.push({
                                            contactType: null,
                                            contactId: '',
                                            shortComment: '',
                                        });
                                        // Trick to force react to update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <GroupItem colCount={1}>
                                {companyData.bankInformation.map(
                                    (bank, index) => {
                                        return (
                                            <GroupItem
                                                key={`GroupItem3-${index}`}
                                                colCount={5}
                                            >
                                                <Item
                                                    key={`bankName${index}`}
                                                    dataField={`bankInformation[${index}].bankName`}
                                                    label={{
                                                        text: 'Bank Name',
                                                    }}
                                                />
                                                <Item
                                                    key={`iban${index}`}
                                                    dataField={`bankInformation[${index}].iban`}
                                                    label={{
                                                        text: 'IBAN',
                                                    }}
                                                />
                                                <Item
                                                    key={`bic${index}`}
                                                    dataField={`bankInformation[${index}].bic`}
                                                    label={{
                                                        text: 'BIC',
                                                    }}
                                                />
                                                <Item
                                                    key={`contactPerson${index}`}
                                                    dataField={`bankInformation[${index}].contactPerson`}
                                                    label={{
                                                        text: 'Contact Person',
                                                    }}
                                                    editorType='dxSelectBox'
                                                    editorOptions={{
                                                        items: contactsData,
                                                        displayExpr:
                                                            displayContactFullName,
                                                        valueExpr: 'id',
                                                        searchEnabled: true,
                                                        onValueChanged: (
                                                            e: any
                                                        ) =>
                                                            console.log(
                                                                e.value
                                                            ),
                                                    }}
                                                />
                                                <Item
                                                    key={`button4-${index}`}
                                                    itemType='button'
                                                    horizontalAlignment='left'
                                                    verticalAlignment='bottom'
                                                    buttonOptions={{
                                                        icon: 'trash',
                                                        text: undefined,
                                                        type: 'danger',
                                                        onClick: () => {
                                                            // Set a new empty address
                                                            companyData.bankInformation.splice(
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
                                    onClick: () => {
                                        // Set a new empty address
                                        companyData.bankInformation.push({
                                            bankName: '',
                                            iban: undefined,
                                            bic: undefined,
                                            contactPerson: undefined,
                                        });
                                        // Trick to force react update
                                        setAddressOptions([]);
                                    },
                                }}
                            />
                        </Tab>
                        <Tab title={`Comments`}>
                            <Item
                                dataField='comments'
                                label={{ text: 'Additional Comments' }}
                                editorType='dxTextArea'
                                editorOptions={{
                                    minHeight: 200,
                                    autoResizeEnabled: true,
                                }}
                            />
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
            <div className='my-6'>
                <div className='flex justify-end'>
                    <div className='flex flex-row self-center'>
                        <Button
                            elevated
                            type='button'
                            text='Create company'
                            icon={faSave}
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

export default memo(AddCompanyPage);
