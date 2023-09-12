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
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { faSave } from '@fortawesome/free-solid-svg-icons';
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
import { ContactData } from '@/lib/types/contactData';
import { countriesMaskItems } from '@/lib/utils/selectBoxItems';
import { AddressInfoTab, BankTab, ContactsTab } from '@/components/Tabs';

let companyData: CompanyData = {
    name: '',
    nif: null,
    email: '',
    countryMaskId: 1,
    phoneNumber: '',
    companyPurpose: '',
    foundingDate: null,
    germanTaxOffice: '',
    taxNumber: '',
    uStIDNumber: '',
    addresses: [],
    bankInformation: [],
    contacts: [],
    comments: '',
};

interface Props {
    countriesData: CountryData[];
    contactsData: ContactData[];
    token: TokenRes;
    lang: Locale;
}

const AddCompanyPage = ({
    countriesData,
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
            // Clear company data
            companyData = structuredClone(initialValues);
            // Pass the ID to reload the page
            router.push(`/private/companies?createdId=${data.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [initialValues, token, router]);

    const getMaskFromDataSource = () =>
        countriesMaskItems.filter(
            (obj) => obj.id === companyData.countryMaskId
        )[0]?.mask || countriesMaskItems[0].mask;

    return (
        <div>
            <Form
                ref={formRef}
                formData={companyData}
                labelMode={'floating'}
                readOnly={isLoading}
                showValidationSummary
            >
                {/* Main Information */}
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
                        dataField='uStIDNumber'
                        label={{ text: 'USt. ID Number' }}
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
                            useMaskedValue: true,
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
                                initialStates={[]}
                                countriesData={countriesData}
                                isEditing={true}
                                isLoading={isLoading}
                                lang={lang}
                                token={token}
                            />
                        </Tab>
                        <Tab title={`Contacts`}>
                            <ContactsTab
                                dataSource={companyData}
                                contactsData={contactsData}
                                isEditing={true}
                                isLoading={isLoading}
                            />
                        </Tab>
                        <Tab title={`Bank`}>
                            <BankTab
                                dataSource={companyData}
                                contactsData={contactsData}
                                isEditing={true}
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
