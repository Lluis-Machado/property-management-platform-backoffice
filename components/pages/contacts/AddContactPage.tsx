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
import {
    countriesMaskItems,
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

let contactData: ContactData = {
    title: null,
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
    contactsData: ContactData[];
    token: TokenRes;
    lang: Locale;
}

const AddContactPage = ({
    countriesData,
    contactsData,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<ContactData>(
        structuredClone(contactData)
    );

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

            const data = await apiPost(
                '/contacts/contacts',
                valuesToSend,
                token,
                'Error while creating a contact'
            );

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
    }, [initialValues, token, router]);

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
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
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
                                contactData={contactData}
                                isEditing={true}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Address Information`}>
                            <AddressInfoTab
                                dataSource={contactData}
                                initialStates={[]}
                                countriesData={countriesData}
                                isEditing={true}
                                isLoading={isLoading}
                                lang={lang}
                                token={token}
                            />
                        </Tab>
                        <Tab title={`Phones`}>
                            <PhonesTab
                                contactData={contactData}
                                isEditing={true}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                dataSource={contactData}
                                contactsData={contactsData}
                                isEditing={true}
                                isLoading={isLoading}
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
