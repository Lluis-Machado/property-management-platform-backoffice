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

    const { getFilteredStates, handleCountryChange, isStateLoading } =
        useCountryChange(lang, token);

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

        if (!values.nif) values.nif = null;

        try {
            const valuesToSend: ContactData = {
                ...values,
                birthDay: formatDate(values.birthDay),
                nifExpirationDate: formatDate(values.birthDay),
                passportExpirationDate: formatDate(values.birthDay),
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
                <GroupItem colCount={4} caption='Contact Information'>
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
                    <Item dataField='nif' label={{ text: 'NIF' }} />
                    <Item
                        dataField='nifExpirationDate'
                        label={{ text: 'NIF Expiration Date' }}
                        editorType='dxDateBox'
                        editorOptions={{
                            displayFormat: dateFormat,
                            showClearButton: true,
                        }}
                    />
                    <Item
                        dataField='passportNumber'
                        label={{ text: 'Passport Number' }}
                    />
                    <Item
                        dataField='passportExpirationDate'
                        label={{ text: 'Passport Expiration Date' }}
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

                    <Item
                        dataField='socialSecurityNumber'
                        label={{ text: 'Social Security Number' }}
                    />
                    <Item dataField='taxId' label={{ text: 'Tax Id' }} />
                </GroupItem>
                <GroupItem colCount={4} caption={`Emails & Phones`}>
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='secondaryEmail'
                        label={{ text: 'Secondary Email' }}
                    >
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item dataField='scanMail' label={{ text: 'Scan Mail' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='phoneNumber'
                        label={{ text: 'Phone number' }}
                        editorOptions={{ mask: '+(0000) 000-00-00-00' }}
                    />
                    <Item
                        dataField='mobilePhoneNumber'
                        label={{ text: 'Mobile phone number' }}
                        editorOptions={{ mask: '+(0000) 000-00-00-00' }}
                    />
                    <Item
                        dataField='otherPhoneNumber'
                        label={{ text: 'Other Phone Number' }}
                        editorOptions={{ mask: '+(0000) 000-00-00-00' }}
                    />
                    <Item
                        dataField='faxNumber'
                        label={{ text: 'Fax Number' }}
                        editorOptions={{ mask: '+(0000) 000-00-00-00' }}
                    />
                </GroupItem>
                <GroupItem colCount={1} caption={`Address Information`}>
                    {contactData.addresses.map((address, index) => {
                        return (
                            <GroupItem key={`GroupItem${index}`} colCount={8}>
                                <Item
                                    key={`addressType${index}`}
                                    dataField={`addresses[${index}].addressType`}
                                    label={{ text: 'Address Type' }}
                                    editorType='dxSelectBox'
                                    editorOptions={{
                                        items: [
                                            { id: 1, name: 'Physical Address' },
                                            { id: 2, name: 'Billing Address' },
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
                                    label={{ text: 'Address line 2' }}
                                />
                                <Item
                                    key={`country${index}`}
                                    dataField={`addresses[${index}].country`}
                                    label={{ text: 'Country' }}
                                    editorType='dxSelectBox'
                                    editorOptions={{
                                        items: countries,
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        searchEnabled: true,
                                        onValueChanged: (e: any) => {
                                            handleCountryChange(e.value);
                                            // Ensure state is removed
                                            contactData.addresses[index].state =
                                                null;
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
                                    buttonOptions={{
                                        icon: 'trash',
                                        text: 'Remove address',
                                        onClick: () => {
                                            // Set a new empty address
                                            contactData.addresses.splice(
                                                index,
                                                1
                                            );
                                            // Update address fields
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
                        text: 'Add address',
                        onClick: () => {
                            // Set a new empty address
                            contactData.addresses.push({
                                addressLine1: '',
                                addressLine2: '',
                                city: '',
                                state: null,
                                country: null,
                                postalCode: '',
                                addressType: undefined,
                            });
                            // Update address fields
                            setAddressOptions([]);
                        },
                    }}
                />
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
