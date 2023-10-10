'use client';
// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from 'pg-components';
import {
    faArrowUpRightFromSquare,
    faClockRotateLeft,
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
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { ValueChangedEvent } from 'devextreme/ui/text_area';
// Local imports
import '@/lib/styles/highlightFields.css';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { Locale } from '@/i18n-config';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { CompanyData } from '@/lib/types/companyData';
import { countriesMaskItems } from '@/lib/utils/selectBoxItems';
import { ContactData } from '@/lib/types/contactData';
import { AddressInfoTab, BankTab, ContactsTab } from '@/components/Tabs';
import RelatedPropertiesDG from '../../datagrid/RelatedPropertiesDG';
import ToolbarTooltips from '@/components/tooltips/ToolbarTooltips';
import { useAtom } from 'jotai';
import { logOpened } from '@/lib/atoms/logOpened';
import { selectedObjId, selectedObjName } from '@/lib/atoms/selectedObj';
import { AddressInfoTabMethods } from '@/components/Tabs/AddressInfoTab';
import { BankTabMethods } from '@/components/Tabs/BankTab';
import { ContactsTabMethods } from '@/components/Tabs/ContactsTab';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';

interface Props {
    companyData: CompanyData;
    countriesData: CountryData[];
    contactsData: ContactData[];
    ownershipData: OwnershipPropertyData[];
    initialStates: StateData[];
    lang: Locale;
}

const CompanyPage = ({
    companyData,
    countriesData,
    ownershipData,
    contactsData,
    initialStates,
    lang,
}: Props) => {
    // Atoms
    const [_, setIsLogOpened] = useAtom(logOpened);
    const [__, setCompanyId] = useAtom(selectedObjId);
    const [___, setObjName] = useAtom(selectedObjName);
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [unsavedVisible, setUnsavedVisible] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<CompanyData>(
        structuredClone(companyData) // Important to not be copied by reference
    );
    // Refs
    const formRef = useRef<Form>(null);
    const addressTabRef = useRef<AddressInfoTabMethods>(null);
    const contactsTabRef = useRef<ContactsTabMethods>(null);
    const bankTabRef = useRef<BankTabMethods>(null);

    // Used for audit log calls
    useEffect(() => {
        setObjName('company');
    }, [setObjName]);

    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (
            !res.isValid ||
            !addressTabRef.current?.isValid() ||
            !contactsTabRef.current?.isValid() ||
            !bankTabRef.current?.isValid()
        ) {
            toast.warning('Validation error detected, check all fields');
            return;
        }

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
                `/api/companies/${companyData.id!}`,
                valuesToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Company updated correctly!');
            setInitialValues(data);
            setIsEditing(false);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [companyData, initialValues]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting company...');
        try {
            await apiDelete(`/api/companies/${companyData.id!}`);

            updateSuccessToast(toastId, 'Company deleted correctly!');
            // Pass the ID to reload the page
            router.push(`/private/companies?deletedId=${companyData.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [companyData, router]);

    const getMaskFromDataSource = useCallback(() => {
        return (
            countriesMaskItems.find(
                (obj) => obj.id === companyData.countryMaskId
            )?.mask || countriesMaskItems[0].mask
        );
    }, [companyData.countryMaskId]);

    const getMaskValueChange = useCallback(
        (e: ValueChangedEvent) => {
            const result = countriesMaskItems.filter(
                (obj) => obj.id === e.value
            );
            const value = result[0]?.mask;
            if (value) {
                formRef
                    .current!.instance.getEditor('phoneNumber')!
                    .option('mask', value);
            }
        },
        [formRef]
    );

    // CHANGES FIELDS
    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        document.getElementsByName(e.dataField!)[0].classList.add('styling');
    };
    const changeSelectbox = (e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    };

    const handleEditingButton = () => {
        const values = structuredClone(companyData);
        if (
            isEditing &&
            JSON.stringify(values) !== JSON.stringify(initialValues)
        ) {
            setUnsavedVisible(true);
        } else {
            setIsEditing((prev) => !prev);
        }
    };

    return (
        <div className='mt-4'>
            {/* Popups */}
            <ConfirmationPopup
                message='Are you sure you want to delete this company?'
                isVisible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
            />
            <ConfirmationPopup
                message='Are you sure you want to exit without saving changes?'
                isVisible={unsavedVisible}
                onClose={() => setUnsavedVisible(false)}
                onConfirm={() => router.refresh()}
            />
            {/* Toolbar tooltips */}
            <ToolbarTooltips isEditing={isEditing} />
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
                        href={`/private/documents/files?archiveId=${companyData.archiveId}`}
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
                        id='auditButton'
                        elevated
                        onClick={() => {
                            setCompanyId(companyData.id!);
                            setIsLogOpened(true);
                        }}
                        type='button'
                        icon={faClockRotateLeft}
                    />
                    <Button
                        id='crmButton'
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
                        id='saveButton'
                        elevated
                        onClick={handleSubmit}
                        type='button'
                        icon={faSave}
                        disabled={!isEditing || isLoading}
                        isLoading={isLoading}
                    />
                    <Button
                        id='editButton'
                        elevated
                        onClick={() => handleEditingButton()}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                    <Button
                        id='deleteButton'
                        elevated
                        onClick={() => setDeleteVisible(true)}
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
                onFieldDataChanged={changeCssFormElement}
            >
                {/* Main Information */}
                <GroupItem colCount={4}>
                    <Item dataField='name' label={{ text: 'Company name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='nif' label={{ text: 'NIF' }} />
                    <Item
                        dataField='uStIDNumber'
                        label={{ text: 'USt. ID Number' }}
                    />
                    <Item
                        dataField='germanTaxOffice'
                        label={{ text: 'German Tax Office' }}
                    />
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='foundingDate'
                        label={{ text: 'Founding Date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                            onValueChanged: (e: ValueChangedEvent) => {
                                changeSelectbox(e);
                            },
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
                            onValueChanged: (e: ValueChangedEvent) => {
                                getMaskValueChange(e);
                                changeSelectbox(e);
                            },
                        }}
                    >
                        <RequiredRule />
                    </Item>
                    <Item
                        dataField={`phoneNumber`}
                        label={{ text: 'Phone Number' }}
                        editorOptions={{
                            mask: getMaskFromDataSource(),
                            useMaskedValue: true,
                            onValueChanged: (e: ValueChangedEvent) => {
                                changeSelectbox(e);
                            },
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
                            <RelatedPropertiesDG
                                ownershipData={ownershipData}
                            />
                        </Tab>
                        <Tab title={`Address Information`}>
                            <AddressInfoTab
                                ref={addressTabRef}
                                dataSource={companyData}
                                initialStates={initialStates}
                                countriesData={countriesData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                                lang={lang}
                            />
                        </Tab>
                        <Tab title={`Contacts`}>
                            <ContactsTab
                                ref={contactsTabRef}
                                dataSource={companyData}
                                contactsData={contactsData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                ref={bankTabRef}
                                dataSource={companyData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Company Purpose`}>
                            <Item
                                dataField='companyPurpose'
                                label={{ text: 'Company Purpose' }}
                                editorType='dxTextArea'
                                editorOptions={{
                                    minHeight: 200,
                                    autoResizeEnabled: true,
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
