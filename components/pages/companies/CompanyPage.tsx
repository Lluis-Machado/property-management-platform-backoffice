'use client';

// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'pg-components';
import {
    faArrowUpRightFromSquare,
    faFileLines,
    faPencil,
    faReceipt,
    faSave,
    faTrash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import DataSource from 'devextreme/data/data_source';
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
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
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
import { CompanyData } from '@/lib/types/companyData';
import useCountryChange from '@/lib/hooks/useCountryChange';
import {
    addressTypeItems,
    companyContactsTypeItems,
    countriesMaskItems,
    phoneType2Items,
    phoneTypeItems,
} from '@/lib/utils/selectBoxItems';
import { ContactData } from '@/lib/types/contactData';
import { displayContactFullName } from '@/lib/utils/displayContactFullName';

interface Props {
    companyData: CompanyData;
    countriesData?: CountryData[];
    contactsData: ContactData[];
    initialStates?: StateData[];
    token: TokenRes;
    lang: Locale;
}

const CompanyPage = ({
    companyData,
    countriesData,
    contactsData,
    initialStates,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] =
        useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<CompanyData>(
        structuredClone(companyData)
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

        const values = structuredClone(companyData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating company...');

        if (!values.nif) values.nif = null;

        try {
            const valuesToSend: CompanyData = {
                ...values,
                foundingDate: formatDate(values.foundingDate),
            };

            console.log('Valores a enviar: ', valuesToSend);
            console.log(JSON.stringify(valuesToSend));

            const data = await apiPatch(
                `/companies/companies/${companyData.id}`,
                valuesToSend,
                token,
                'Error while updating this company'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Company updated correctly!');
            setInitialValues(data);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [companyData, initialValues, token]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting company...');
        try {
            await apiDelete(
                `/companies/companies/${companyData.id}`,
                token,
                'Error while deleting this company'
            );

            updateSuccessToast(toastId, 'Company deleted correctly!');
            // Pass the ID to reload the page
            router.push(`/private/companies?deletedId=${companyData.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [companyData, router, token]);

    const getMaskFromDataSource = () =>
        countriesMaskItems.filter(
            (obj) => obj.id === companyData.countryMaskId
        )[0]?.mask || countriesMaskItems[0].mask;

    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this company?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='my-6 flex w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='ml-5 flex items-center gap-5'>
                    <Image
                        className='select-none rounded-full'
                        src={`https://ui-avatars.com/api/?name=${initialValues.name}&background=random&size=128`}
                        alt='user avatar with name initials'
                        width={64}
                        height={64}
                    />
                    <span className='text-4xl tracking-tight text-zinc-900'>
                        {initialValues.name}
                    </span>
                </div>
                {/* Cards with actions */}
                <div className='flex flex-row items-center gap-4'>
                    <SimpleLinkCard
                        href={`/private/documents?companyId=${companyData.id}`}
                        text='Documents'
                        faIcon={faFileLines}
                    />
                    <SimpleLinkCard
                        href={`/private/taxes/${companyData.id}/declarations`}
                        text='Declarations'
                        faIcon={faReceipt}
                    />
                </div>
                {/* Button toolbar */}
                <div className='flex flex-row gap-4 self-center'>
                    <Button
                        elevated
                        onClick={() =>
                            window.open(
                                'https://crm.zoho.com/crm/org57555088/tab/Accounts/1631361000106185043',
                                '_blank'
                            )
                        }
                        type='button'
                        icon={faArrowUpRightFromSquare}
                    />
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
                formData={companyData}
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
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
                                    disabled: !isEditing,
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
                                                    disabled: !isEditing,
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
                                    disabled: !isEditing,
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
                                                        disabled: !isEditing,
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
                                    disabled: !isEditing,
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
        </div>
    );
};

export default memo(CompanyPage);
