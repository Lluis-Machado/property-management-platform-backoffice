'use client';
// React imports
import { memo, useCallback, useRef, useState } from 'react';
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
import { countriesMaskItems } from '@/lib/utils/selectBoxItems';
import { ContactData } from '@/lib/types/contactData';
import { AddressInfoTab, BankTab, ContactsTab } from '@/components/Tabs';

interface Props {
    companyData: CompanyData;
    countriesData: CountryData[];
    contactsData: ContactData[];
    initialStates: StateData[];
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

    const formRef = useRef<Form>(null);

    const router = useRouter();

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

    const getMaskValueChange = (e: ValueChangedEvent) => {
        const result = countriesMaskItems.filter((obj) => obj.id === e.value);
        formRef
            .current!.instance.getEditor('phoneNumber')!
            .option('mask', result[0].mask);
    };

    // CHANGES FIELDS
    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        document.getElementsByName(e.dataField!)[0].classList.add('styling');
    };
    const changeSelectbox = (e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    };

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
                onFieldDataChanged={changeCssFormElement}
            >
                {/* Main Information */}
                <GroupItem colCount={5}>
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
                        <Tab title={`Address Information`}>
                            <AddressInfoTab
                                dataSource={companyData}
                                initialStates={initialStates}
                                countriesData={countriesData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                                lang={lang}
                                token={token}
                            />
                        </Tab>
                        <Tab title={`Contacts`}>
                            <ContactsTab
                                dataSource={companyData}
                                contactsData={contactsData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                dataSource={companyData}
                                contactsData={contactsData}
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
