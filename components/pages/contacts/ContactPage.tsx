'use client';
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
    StringLengthRule,
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import 'devextreme-react/text-area';
import 'devextreme-react/tag-box';
import { useAtom } from 'jotai';
// Local imports
import '@/lib/styles/highlightFields.css';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import { ContactData } from '@/lib/types/contactData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { Locale } from '@/i18n-config';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { CountryData, StateData } from '@/lib/types/countriesData';
import RelatedPropertiesDG from '../../datagrid/RelatedPropertiesDG';
import {
    genderItems,
    maritalStatusItems,
    titleItems,
} from '@/lib/utils/selectBoxItems';
import {
    AddressInfoTab,
    BankTab,
    IdDocumentsTab,
    PhonesTab,
} from '@/components/Tabs';
import { logOpened } from '@/lib/atoms/logOpened';
import { selectedObjId, selectedObjName } from '@/lib/atoms/selectedObj';
import ToolbarTooltips from '@/components/tooltips/ToolbarTooltips';
import { IdDocumentsTabMethods } from '@/components/Tabs/IdDocumentsTab';
import { AddressInfoTabMethods } from '@/components/Tabs/AddressInfoTab';
import { PhonesTabMethods } from '@/components/Tabs/PhonesTab';
import { BankTabMethods } from '@/components/Tabs/BankTab';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';

interface Props {
    contactData: ContactData;
    countriesData: CountryData[];
    initialStates: StateData[];
    ownershipData: OwnershipPropertyData[];
    lang: Locale;
}

//////// TODOOOOOOO: https://github.com/run4w4y/nextjs-router-events
const ContactPage = ({
    contactData,
    countriesData,
    ownershipData,
    initialStates,
    lang,
}: Props) => {
    // Atoms
    const [_, setIsLogOpened] = useAtom(logOpened);
    const [__, setUserId] = useAtom(selectedObjId);
    const [___, setObjName] = useAtom(selectedObjName);
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [unsavedVisible, setUnsavedVisible] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData) // Important to not be copied by reference
    );
    // Refs
    const formRef = useRef<Form>(null);
    const idDocsTabRef = useRef<IdDocumentsTabMethods>(null);
    const addressTabRef = useRef<AddressInfoTabMethods>(null);
    const phonesTabRef = useRef<PhonesTabMethods>(null);
    const bankTabRef = useRef<BankTabMethods>(null);

    // Used for audit log calls
    useEffect(() => {
        setObjName('contact');
    }, [setObjName]);

    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (
            !res.isValid ||
            !idDocsTabRef.current?.isValid() ||
            !addressTabRef.current?.isValid() ||
            !phonesTabRef.current?.isValid() ||
            !bankTabRef.current?.isValid()
        ) {
            toast.warning('Validation error detected, check all fields');
            return;
        }

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
                `/api/contacts${contactData.id!}`,
                valuesToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact updated correctly!');
            setInitialValues(data);
            setIsEditing(false);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [contactData, initialValues]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting contact...');
        try {
            await apiDelete(`/api/contacts${contactData.id!}`);

            updateSuccessToast(toastId, 'Contact deleted correctly!');
            // Pass the ID to reload the page
            router.push(`/private/contacts?deletedId=${contactData.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [contactData, router]);

    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        document.getElementsByName(e.dataField!)[0].classList.add('styling');
    };

    const changeSelectbox = (e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    };

    const handleEditingButton = () => {
        const values = structuredClone(contactData);
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
            <ConfirmationPopup
                message='Are you sure you want to delete this contact?'
                isVisible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
            />
            <ConfirmationPopup
                message='Are you sure you want to exit without saving?'
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
                        href={`/private/documents/files?archiveId=${contactData.archiveId}`}
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
                        id='auditButton'
                        elevated
                        onClick={() => {
                            setUserId(contactData.id!);
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
                                'https://crm.zoho.com/crm/org57555088/tab/Contacts/1631361000011416026',
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
                formData={contactData}
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
                onFieldDataChanged={changeCssFormElement}
            >
                {/* Main Information */}
                <GroupItem colCount={5}>
                    <Item
                        dataField={'gender'}
                        label={{ text: 'Gender' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: genderItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                            onValueChanged: (e: ValueChangedEvent) =>
                                changeSelectbox(e),
                        }}
                    />
                    <Item
                        dataField={'title'}
                        label={{ text: 'Title' }}
                        editorType='dxTagBox'
                        editorOptions={{
                            items: titleItems,
                            valueExpr: 'id',
                            displayExpr: 'name',
                            onValueChanged: (e: ValueChangedEvent) =>
                                changeSelectbox(e),
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
                            onValueChanged: (e: ValueChangedEvent) =>
                                changeSelectbox(e),
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
                            onValueChanged: (e: ValueChangedEvent) =>
                                changeSelectbox(e),
                        }}
                    />
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='salutation'
                        label={{ text: 'Email Salutation' }}
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
                        <Tab title={`Identification Documents`}>
                            <IdDocumentsTab
                                ref={idDocsTabRef}
                                contactData={contactData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Address Information`}>
                            <AddressInfoTab
                                ref={addressTabRef}
                                dataSource={contactData}
                                initialStates={initialStates}
                                countriesData={countriesData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                                lang={lang}
                            />
                        </Tab>
                        <Tab title={`Phones`}>
                            <PhonesTab
                                ref={phonesTabRef}
                                contactData={contactData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                ref={bankTabRef}
                                dataSource={contactData}
                                isEditing={isEditing}
                                isLoading={isLoading}
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

export default memo(ContactPage);
