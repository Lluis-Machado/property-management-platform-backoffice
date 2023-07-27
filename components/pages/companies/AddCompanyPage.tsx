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
import { CompanyCreate } from '@/lib/types/companyData';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData, StateData } from '@/lib/types/countriesData';

interface Props {
    companyData: CompanyCreate;
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
}

const AddCompanyPage = ({ companyData, countries, token, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<CompanyCreate>(
        structuredClone(companyData)
    );
    const [addressOptions, setAddressOptions] = useState({});
    const [countriedLoaded, setCountriedLoaded] = useState<number[]>([]);

    const formRef = useRef<Form>(null);

    const router = useRouter();

    const handleCountryChange = useCallback(
        (countryId: number) => {
            // Check if this country was previously loaded
            if (countriedLoaded.includes(countryId)) return;
            else setCountriedLoaded((prev) => [...prev, countryId]);

            // Fetch states for this country
            fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${token.token_type} ${token.access_token}`,
                    },
                    cache: 'no-store',
                }
            )
                .then((resp) => resp.json())
                .then((data: StateData[]) =>
                    setStates((prev) => (prev ? [...prev, ...data] : data))
                )
                .catch((e) => console.error('Error while getting the states'));
        },
        [lang, token, countriedLoaded]
    );

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        const values = structuredClone(companyData);

        console.log('Valores a enviar: ', values);
        console.log('Valores a enviar en JSON: ', JSON.stringify(values));

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating company...');

        if (!values.nif) values.nif = null;

        try {
            const data = await apiPost(
                '/companies/companies',
                values,
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

    const updateAdresses = () => {
        const options = [];
        for (let i = 0; i < companyData.addresses.length; i += 1) {
            options.push(generateNewAddress(i));
        }
        setAddressOptions(options);
        console.log(companyData);
    };

    console.log('companyData: ', companyData);

    const generateNewAddress = (index: number) => {};

    const getFilteredStates = (index: number) => {
        console.log('states: ', states);
        console.log(index);
        return states?.filter(
            (state) => state.countryId === companyData.addresses[index].country
        );
    };

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
                                        onValueChanged: (e: any) =>
                                            handleCountryChange(e.value),
                                    }}
                                />
                                <Item
                                    key={`state${index}`}
                                    dataField={`addresses[${index}].state`}
                                    label={{ text: 'State' }}
                                    editorType='dxSelectBox'
                                    editorOptions={{
                                        items: getFilteredStates(index),
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        searchEnabled: true,
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
                                            updateAdresses();
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
                                addressType: undefined,
                            });
                            // Update address fields
                            updateAdresses();
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
