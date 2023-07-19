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
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';

interface Props {
    companyData: CompanyData;
    token: TokenRes;
    lang: Locale;
}

const AddCompanyPage = ({ companyData, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [states, setStates] = useState<SelectData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<CompanyData>(
        structuredClone(companyData)
    );

    const formRef = useRef<Form>(null);

    const router = useRouter();

    // const handleCountryChange = useCallback(
    //     (countryId: number) => {
    //         fetch(
    //             `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     Authorization: `${token.token_type} ${token.access_token}`,
    //                 },
    //                 cache: 'no-store',
    //             }
    //         )
    //             .then((resp) => resp.json())
    //             .then((data: any) => {
    //                 let states = [];
    //                 for (const state of data) {
    //                     states.push({
    //                         label: state.name,
    //                         value: state.id,
    //                     });
    //                 }
    //                 setStates(states);
    //             })
    //             .catch((e) => console.error('Error while getting the states'));
    //     },
    //     [lang, token]
    // );

    const handleSubmit = useCallback(async () => {
        // const res = formRef.current!.instance.validate();
        // if (!res.isValid) return;

        const values = structuredClone(companyData);

        console.log('Valores a enviar: ', values);
        console.log('Valores a enviar en JSON: ', JSON.stringify(values));

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating contact...');

        if (!values.nif) values.nif = null;

        try {
            const data = await apiPost(
                '/contacts/contacts',
                values,
                token,
                'Error while creating a property'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact created correctly!');
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
                        <RequiredRule message='Company name is required' />
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
                </GroupItem>
                {/* <GroupItem colCount={4} caption='Address Information'>
                    <Item
                        dataField='address.addressLine1'
                        label={{ text: 'Address line' }}
                    />
                    <Item
                        dataField='address.addressLine2'
                        label={{ text: 'Address line 2' }}
                    />
                    <Item
                        dataField='address.country'
                        label={{ text: 'Country' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countries,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            searchEnabled: true,
                            onValueChanged: (e: any) =>
                                handleCountryChange(e.value),
                        }}
                    />
                    <Item
                        dataField='address.state'
                        label={{ text: 'State' }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: states,
                            displayExpr: 'label',
                            valueExpr: 'value',
                            searchEnabled: true,
                        }}
                    />
                    <Item dataField='address.city' label={{ text: 'City' }} />
                    <Item
                        dataField='address.postalCode'
                        label={{ text: 'Postal code' }}
                    />
                    <Item dataField='email' label={{ text: 'Email' }}>
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
                </GroupItem> */}
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
