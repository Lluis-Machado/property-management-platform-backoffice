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

interface Props {
    companyData: CompanyData;
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
}

const AddCompanyPage = ({ companyData, countries, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<CompanyData>(
        structuredClone(companyData)
    );
    const [addressOptions, setAddressOptions] = useState({});

    const { states, handleCountryChange, isStateLoading, getFilteredStates } =
        useCountryChange(lang, token);

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
            router.push('/private/companies');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [companyData, initialValues, token, router]);

    return (
        <div>
            <Form
                ref={formRef}
                formData={companyData}
                labelMode={'floating'}
                readOnly={isLoading}
                showValidationSummary
            >
                <GroupItem colCount={4} caption='Company Information'>
                    <Item dataField='name' label={{ text: 'Company name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='nif' label={{ text: 'NIF' }} />
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <EmailRule message='Email is invalid' />
                    </Item>
                    <Item
                        dataField='phoneNumber'
                        label={{ text: 'Phone number' }}
                        editorOptions={{ mask: '+(0000) 000-00-00-00' }}
                    />
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
                </GroupItem>
                <GroupItem colCount={1} caption={`Address Information`}>
                    {companyData.addresses.map((address, index) => {
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
                                            companyData.addresses[index].state =
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
                                    buttonOptions={{
                                        icon: 'trash',
                                        text: 'Remove address',
                                        onClick: () => {
                                            // Set a new empty address
                                            companyData.addresses.splice(
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
                            companyData.addresses.push({
                                addressLine1: '',
                                addressLine2: '',
                                city: '',
                                state: null,
                                country: null,
                                postalCode: '',
                                addressType: null,
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

export default memo(AddCompanyPage);
