'use client';

// React imports
import { memo, useCallback, useState } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, {
    GroupItem,
    Item,
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';

//local imports
import { PropertyCreate } from '@/lib/types/propertyInfo';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { SelectData } from '@/lib/types/selectData';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { Button } from 'pg-components';
import './addProperty.css';

interface Props {
    propertyData: PropertyCreate;
    contacts: SelectData[];
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
}
const typeOfUse: any[] = [
    { label: 'Private', value: 0 },
    { label: 'Vacational Rent', value: 1 },
    { label: 'Long Term Rent', value: 2 },
];

const AddPropertyPage = ({
    propertyData,
    contacts,
    countries,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<PropertyCreate>(
        structuredClone(propertyData)
    );

    const router = useRouter();

    const handleCountryChange = useCallback(
        (countryId: number) => {
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
                .then((data: StateData[]) => setStates(data))
                .catch((e) => console.error('Error while getting the states'));
        },
        [lang, token]
    );

    const handleSubmit = useCallback(async () => {
        const values = structuredClone(propertyData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating property...');

        try {
            console.log('Valores a enviar: ', values);
            console.log('Valores a enviar JSON: ', JSON.stringify(values));
            const data = await apiPost(
                '/properties/properties',
                values,
                token,
                'Error while creating a property'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Property created correctly!');
            router.push('/private/properties');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [router, propertyData, initialValues, token]);

    return (
        <div>
            <Form
                formData={propertyData}
                readOnly={isLoading}
                labelLocation='left'
            >
                <GroupItem colCount={3}>
                    <GroupItem caption='Property Information'>
                        <Item dataField='name' label={{ text: 'Name' }} />
                        <Item dataField='type' label={{ text: 'Type' }} />
                        <Item
                            dataField='typeOfUse'
                            label={{ text: 'Type of use' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                items: typeOfUse,
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                            }}
                        />
                        <Item
                            dataField='cadastreRef'
                            label={{ text: 'Catastral Reference' }}
                        />
                    </GroupItem>
                    <GroupItem>
                        <GroupItem caption='Contact Information'>
                            <Item
                                dataField='contactPersonId'
                                label={{ text: 'Contact Person' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: contacts,
                                    displayExpr: 'label',
                                    valueExpr: 'value',
                                    searchEnabled: true,
                                }}
                            />
                            <Item
                                dataField='billingContactId'
                                label={{ text: 'Billing Contact' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: contacts,
                                    displayExpr: 'label',
                                    valueExpr: 'value',
                                    searchEnabled: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </GroupItem>
                <GroupItem colCount={2} caption='Address Information'>
                    <GroupItem>
                        <Item
                            dataField='address.addressLine1'
                            label={{ text: 'Address line' }}
                        />
                        <Item
                            dataField='address.addressLine2'
                            label={{ text: 'Address line 2' }}
                        />
                        <GroupItem colCount={2}>
                            <Item
                                dataField='address.postalCode'
                                label={{ text: 'Postal code' }}
                            />
                            <Item
                                dataField='address.city'
                                label={{ text: 'City' }}
                            />
                        </GroupItem>
                        <GroupItem colCount={2}>
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
                                    displayExpr: 'name',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </GroupItem>
                <GroupItem caption='Aditional Information'>
                    <TabbedItem>
                        <TabPanelOptions deferRendering={false} />
                        <Tab title='Cadastre Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='cadastreNumber'
                                    label={{ text: 'Cadastre Number' }}
                                />
                                <Item
                                    dataField='cadastreUrl'
                                    label={{ text: 'Cadastre Url' }}
                                />
                                <Item
                                    dataField='cadastreValue'
                                    label={{ text: 'Cadastre Value' }}
                                />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='loanPrice.value'
                                    label={{ text: 'Loan price' }}
                                />
                                <Item
                                    dataField='buildingPrice.value'
                                    label={{ text: 'Building price' }}
                                />
                                <Item
                                    dataField='totalPrice.value'
                                    label={{ text: 'Total price' }}
                                />
                                <Item
                                    dataField='plotPrice.value'
                                    label={{ text: 'Plot price' }}
                                />
                                <Item
                                    dataField='ibiAmount'
                                    label={{ text: 'IBI Amount' }}
                                />
                                <Item
                                    dataField='ibiCollection'
                                    label={{ text: 'IBI Collection' }}
                                />
                                <Item
                                    dataField='year'
                                    label={{ text: 'Year' }}
                                />
                                <Item
                                    dataField='propertyScanMail'
                                    label={{ text: 'Property Scan Mail' }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Purchase Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='purchaseDate'
                                    label={{ text: 'Purchase Date' }}
                                    editorType='dxDateBox'
                                />
                                <Item
                                    dataField='purchasePrice.value'
                                    label={{ text: 'Purchase price' }}
                                />
                                <Item
                                    dataField='purchasePriceTax.value'
                                    label={{ text: 'Purchase Price Tax' }}
                                />
                                <Item
                                    dataField='purchasePriceAJD.value'
                                    label={{ text: 'Purchase Price AJD' }}
                                />
                                <Item
                                    dataField='purchasePriceTPO.value'
                                    label={{ text: 'Purchase Price TPO' }}
                                />
                                <Item
                                    dataField='purchasePriceTotal.value'
                                    label={{ text: 'Purchase Price Total' }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Furniture Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='furniturePrice.value'
                                    label={{ text: 'Furniture Price' }}
                                />
                                <Item
                                    dataField='furniturePriceIVA'
                                    label={{ text: 'Furniture Price IVA' }}
                                />
                                <Item
                                    dataField='furniturePriceTPO.value'
                                    label={{ text: 'Furniture Price TPO' }}
                                />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='garbageCollection'
                                    label={{ text: 'Garbage Collection' }}
                                />
                                <Item
                                    dataField='garbagePriceAmount'
                                    label={{ text: 'Garbage Price Amount' }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Sale Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='saleDate'
                                    label={{ text: 'Sale Date' }}
                                    editorType='dxDateBox'
                                />
                                <Item
                                    dataField='salePrice.value'
                                    label={{ text: 'Sale Price' }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Other Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='bedNumber'
                                    label={{ text: 'Bed Number' }}
                                />
                                <Item
                                    dataField='comments'
                                    label={{ text: 'Comments' }}
                                />
                            </GroupItem>
                        </Tab>
                    </TabbedItem>
                </GroupItem>
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

export default memo(AddPropertyPage);
