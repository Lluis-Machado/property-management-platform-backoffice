'use client';

import { memo, useCallback, useRef, useState } from 'react';
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
import 'devextreme-react/text-area';
import 'devextreme-react/tag-box';
// Local imports
import { ContactData } from '@/lib/types/contactData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Locale } from '@/i18n-config';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData } from '@/lib/types/countriesData';
import {
    genderItems,
    maritalStatusItems,
    titleItems,
} from '@/lib/utils/selectBoxItems';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import {
    AddressInfoTab,
    BankTab,
    IdDocumentsTab,
    PhonesTab,
} from '@/components/Tabs';
import { IdDocumentsTabMethods } from '@/components/Tabs/IdDocumentsTab';
import { AddressInfoTabMethods } from '@/components/Tabs/AddressInfoTab';
import { PhonesTabMethods } from '@/components/Tabs/PhonesTab';
import { BankTabMethods } from '@/components/Tabs/BankTab';

let contactData: ContactData = {
    title: [],
    firstName: '',
    lastName: '',
    gender: null,
    birthDay: null,
    email: '',
    birthPlace: '',
    maritalStatus: 0,
    bankInformation: [],
    identifications: [],
    addresses: [],
    phones: [],
};

interface Props {
    countriesData: CountryData[];
    lang: Locale;
}

const AddContactPage = ({ countriesData, lang }: Props) => {
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [initialValues, _] = useState<ContactData>(
        structuredClone(contactData) // Important to not be copied by reference
    );

    // Refs
    const formRef = useRef<Form>(null);
    const idDocsTabRef = useRef<IdDocumentsTabMethods>(null);
    const addressTabRef = useRef<AddressInfoTabMethods>(null);
    const phonesTabRef = useRef<PhonesTabMethods>(null);
    const bankTabRef = useRef<BankTabMethods>(null);

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

        const toastId = toast.loading('Creating contact...');

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

            const data = await apiPost('/api/contacts', valuesToSend);

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact created correctly!');
            // Clear contact data
            contactData = structuredClone(initialValues);
            // Pass the ID to reload the page
            router.push(`/private/contacts?createdId=${data.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [initialValues, router, idDocsTabRef]);

    return (
        <div>
            <Form
                ref={formRef}
                formData={contactData}
                labelMode={'floating'}
                readOnly={isLoading}
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
                        <Tab title={`Identification Documents`}>
                            <IdDocumentsTab
                                ref={idDocsTabRef}
                                contactData={contactData}
                                isEditing={true}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Address Information`}>
                            <AddressInfoTab
                                ref={addressTabRef}
                                dataSource={contactData}
                                initialStates={[]}
                                countriesData={countriesData}
                                isEditing={true}
                                isLoading={isLoading}
                                lang={lang}
                            />
                        </Tab>
                        <Tab title={`Phones`}>
                            <PhonesTab
                                ref={phonesTabRef}
                                contactData={contactData}
                                isEditing={true}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                ref={bankTabRef}
                                dataSource={contactData}
                                isEditing={true}
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
            <div className='my-6'>
                <div className='flex justify-end'>
                    <div className='flex flex-row self-center'>
                        <Button
                            elevated
                            type='button'
                            text='Create Contact'
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

export default memo(AddContactPage);
