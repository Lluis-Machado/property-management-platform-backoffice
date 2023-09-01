'use client';

// React imports
import { memo, useCallback, useRef, useState } from 'react';

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
import 'devextreme-react/text-area';
import 'devextreme-react/tag-box';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { faSave } from '@fortawesome/free-solid-svg-icons';

//local imports
import { PropertyData } from '@/lib/types/propertyInfo';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { SelectData } from '@/lib/types/selectData';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { Button } from 'pg-components';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';

interface Props {
    propertyData: PropertyData;
    properties: PropertyData[];
    contacts: SelectData[];
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
}

const AddPropertyPage = ({
    propertyData,
    properties,
    contacts,
    countries,
    token,
    lang,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );
    const formRef = useRef<Form>(null);

    const router = useRouter();
    // CSS CHANGES
    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        document.getElementsByName(e.dataField!)[0].classList.add('styling');
    };

    const changeSelectbox = (e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    };
    const changeTagbox = (e: ValueChangedEvent) => {
        if (e.event !== undefined) {
            e.element.classList.add('stylingForm');
        }
    };
    // calculate Property
    const calculatePurchase = (e: ValueChangedEvent) => {
        propertyData.purchasePriceNet.value = e.value || 0;
        if (propertyData.purchasePriceTaxPercentage === 1) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value! / 100) * 10;
            //AJD CALCULATION
            propertyData.purchasePriceAJD.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceAJDPercentage!;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
        } else if (propertyData.purchasePriceTaxPercentage === 2) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value! / 100) * 21;
            // AJD CALCULATION
            propertyData.purchasePriceAJD.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceAJDPercentage!;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
        } else {
            propertyData.purchasePriceTax.value = 0;
            //TPO CALCULATION
            propertyData.purchasePriceTPO.value =
                (propertyData.purchasePriceNet.value / 100) *
                propertyData.purchasePriceTPOPercentage!;
            propertyData.purchasePriceAJD.value = 0;
            propertyData.purchasePriceAJDPercentage = 0;
        }
        calculateBruttoValue();
        calculateTotalPrice();
        calculatePurchasePrice();
    };
    const calculatePriceTax = (e: ValueChangedEvent) => {
        if (e.value == 1) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value / 100) * 10;
            propertyData.purchasePriceTaxPercentage = e.value;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
        } else if (e.value == 2) {
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value / 100) * 21;
            propertyData.purchasePriceTaxPercentage = e.value;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
        } else {
            propertyData.purchasePriceTax.value = 0;
            propertyData.purchasePriceTaxPercentage = 0;
            propertyData.purchasePriceGross.value =
                propertyData.purchasePriceNet.value;
            propertyData.purchasePriceAJD.value = 0;
            propertyData.purchasePriceAJDPercentage = 0;
            calculateTotalPrice();
            calculatePurchasePrice();
        }
    };

    const calculateBruttoValue = () => {
        propertyData.purchasePriceGross.value =
            propertyData.purchasePriceNet.value +
            propertyData.purchasePriceTax.value;
    };

    const calculateTPOValue = (e: ValueChangedEvent) => {
        propertyData.purchasePriceTPO.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceAJD.value = 0;
        propertyData.purchasePriceAJDPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateAJDValue = (e: ValueChangedEvent) => {
        propertyData.purchasePriceAJD.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceTPO.value = 0;
        propertyData.purchasePriceTPOPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateTotalPrice = () => {
        propertyData.purchasePriceTotal.value =
            propertyData.purchasePriceGross.value +
            propertyData.purchasePriceTPO.value +
            propertyData.purchasePriceAJD.value;
    };
    // Furniture
    const calculateNet = (e: ValueChangedEvent) => {
        propertyData.furniturePriceIVA.value =
            (e.value / 100) * propertyData.furniturePriceIVAPercentage;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculatePriceTaxFurniture = (e: ValueChangedEvent) => {
        propertyData.furniturePriceIVA.value =
            (propertyData.furniturePrice.value / 100) * e.value;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculateBruttoValueFurniture = () => {
        propertyData.furniturePriceGross.value =
            propertyData.furniturePrice.value +
            propertyData.furniturePriceIVA.value;
    };
    const calculateTPOValueFurniture = () => {
        propertyData.furniturePriceTPO.value =
            (propertyData.furniturePrice.value / 100) * 2;
    };
    const calculateTotalPriceFurniture = () => {
        propertyData.furniturePriceTotal.value =
            propertyData.furniturePriceGross.value +
            propertyData.furniturePriceTPO.value;
    };
    // TOTAL PURCHASE CALCULATION
    const calculatePurchasePrice = () => {
        propertyData.priceTotal.value =
            propertyData.furniturePriceTotal.value +
            propertyData.purchasePriceTotal.value;
        formRef.current!.instance.updateData(propertyData);
    };

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
            const dataToSend: PropertyData = {
                ...values,
                purchaseDate: formatDate(values.purchaseDate),
                saleDate: formatDate(values.saleDate),
            };
            console.log('Valores a enviar: ', values);
            console.log('Valores a enviar JSON: ', JSON.stringify(values));
            const data = await apiPost(
                '/properties/properties',
                dataToSend,
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
                labelMode='floating'
                ref={formRef}
            >
                <GroupItem colCount={3}>
                    <GroupItem caption='Property Information'>
                        <Item dataField='name' label={{ text: 'Name' }} />
                        <Item
                            dataField='type'
                            label={{ text: 'Type' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                items: [
                                    { label: 'Apartment', value: '0' },
                                    { label: 'Rural property', value: '1' },
                                    {
                                        label: 'Residential property',
                                        value: '2',
                                    },
                                    { label: 'Plot', value: '3' },
                                    { label: 'Parking', value: '4' },
                                    { label: 'Storage room', value: '5' },
                                    { label: 'Mooring', value: '6' },
                                ],
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                            }}
                        />
                        <Item
                            dataField='typeOfUse'
                            label={{ text: 'Type of use' }}
                            editorType='dxTagBox'
                            editorOptions={{
                                items: [
                                    { label: 'Private', value: 0 },
                                    { label: 'Vacational Rent', value: 1 },
                                    { label: 'Long Term Rent', value: 2 },
                                ],
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                            }}
                        />
                        <Item
                            dataField='propertyAddress.addressLine1'
                            label={{ text: 'Address line' }}
                        />
                        <Item
                            dataField='propertyAddress.addressLine2'
                            label={{ text: 'Address line 2' }}
                        />
                        <GroupItem colCount={2}>
                            <Item
                                dataField='propertyAddress.postalCode'
                                label={{ text: 'Postal code' }}
                            />
                            <Item
                                dataField='propertyAddress.city'
                                label={{ text: 'City' }}
                            />
                        </GroupItem>
                        <GroupItem colCount={2}>
                            <Item
                                dataField='propertyAddress.country'
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
                                dataField='propertyAddress.state'
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
                    <GroupItem>
                        <GroupItem caption='Contact Information'>
                            <Item
                                dataField='mainOwnerId'
                                label={{ text: 'Main Owner' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: contacts,
                                    displayExpr: 'label',
                                    valueExpr: 'value',
                                    searchEnabled: true,
                                }}
                            />
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
                            <Item
                                dataField='propertyScanMail'
                                label={{ text: 'Property Scan Mail' }}
                            />
                            <Item
                                dataField='mainPropertyId'
                                label={{ text: 'Main Property' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: properties,
                                    displayExpr: 'name',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                }}
                            />
                        </GroupItem>
                    </GroupItem>
                </GroupItem>
                <GroupItem>
                    <TabbedItem>
                        <TabPanelOptions deferRendering={false} />
                        <Tab title='Cadastre'>
                            <GroupItem colCount={5}>
                                <Item
                                    dataField='cadastreRef'
                                    label={{ text: 'Catastral Reference' }}
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
                            <GroupItem colCount={5}>
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
                                    dataField='purchaseDate'
                                    label={{ text: 'Purchase Date' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        displayFormat: dateFormat,
                                        showClearButton: true,
                                    }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Purchase'>
                            <GroupItem>
                                <GroupItem colCount={3}>
                                    <GroupItem caption='Property'>
                                        <Item
                                            dataField='purchasePriceNet.value'
                                            label={{ text: 'Netto' }}
                                            editorType='dxNumberBox'
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => {
                                                    changeSelectbox(e);
                                                    calculatePurchase(e);
                                                },
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='purchasePriceTax.value'
                                                label={{ text: 'IVA' }}
                                                editorOptions={{
                                                    onValueChanged: (
                                                        e: ValueChangedEvent
                                                    ) => changeSelectbox(e),
                                                    readOnly: true,
                                                    format: {
                                                        type: 'currency',
                                                        currency: 'EUR',
                                                        precision: 2,
                                                    },
                                                }}
                                            />
                                            <Item
                                                dataField='purchasePriceTaxPercentage'
                                                label={{ text: 'IVA %' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: [
                                                        {
                                                            label: 'Sin IVA',
                                                            value: 0,
                                                        },
                                                        {
                                                            label: '10%',
                                                            value: 1,
                                                        },
                                                        {
                                                            label: '21%',
                                                            value: 2,
                                                        },
                                                    ],
                                                    displayExpr: 'label',
                                                    valueExpr: 'value',
                                                    searchEnabled: true,
                                                    onValueChanged: (
                                                        e: ValueChangedEvent
                                                    ) => {
                                                        changeSelectbox(e);
                                                        calculatePriceTax(e);
                                                    },
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='purchasePriceGross.value'
                                            label={{ text: 'Brutto' }}
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => changeSelectbox(e),
                                                readOnly: true,
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                        {propertyData.purchasePriceTaxPercentage ===
                                            0 && (
                                            <GroupItem colCount={2}>
                                                <Item
                                                    dataField='purchasePriceTPO.value'
                                                    label={{ text: 'TPO' }}
                                                    editorOptions={{
                                                        readOnly: true,
                                                        format: {
                                                            type: 'currency',
                                                            currency: 'EUR',
                                                            precision: 2,
                                                        },
                                                    }}
                                                />
                                                <Item
                                                    dataField='purchasePriceTPOPercentage'
                                                    label={{ text: 'TPO %' }}
                                                    editorOptions={{
                                                        onValueChanged: (
                                                            e: ValueChangedEvent
                                                        ) => {
                                                            calculateTPOValue(
                                                                e
                                                            );
                                                            changeSelectbox(e);
                                                        },
                                                        format: "#0.##'%'",
                                                    }}
                                                />
                                            </GroupItem>
                                        )}
                                        {propertyData.purchasePriceTaxPercentage !==
                                            0 && (
                                            <GroupItem colCount={2}>
                                                <Item
                                                    dataField='purchasePriceAJD.value'
                                                    label={{ text: 'AJD' }}
                                                    editorOptions={{
                                                        onValueChanged: (
                                                            e: ValueChangedEvent
                                                        ) => changeSelectbox(e),
                                                        readOnly: true,
                                                        format: {
                                                            type: 'currency',
                                                            currency: 'EUR',
                                                            precision: 2,
                                                        },
                                                    }}
                                                />
                                                <Item
                                                    dataField='purchasePriceAJDPercentage'
                                                    label={{ text: 'AJD %' }}
                                                    editorOptions={{
                                                        onValueChanged: (
                                                            e: ValueChangedEvent
                                                        ) => {
                                                            calculateAJDValue(
                                                                e
                                                            );
                                                            changeSelectbox(e);
                                                        },
                                                        format: "#0.##'%'",
                                                    }}
                                                />
                                            </GroupItem>
                                        )}
                                        <Item
                                            dataField='purchasePriceTotal.value'
                                            label={{
                                                text: 'Total Purchase Price',
                                            }}
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => changeSelectbox(e),
                                                readOnly: true,
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                    </GroupItem>
                                    <GroupItem caption='Furniture'>
                                        <Item
                                            dataField='furniturePrice.value'
                                            label={{ text: 'Netto' }}
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => {
                                                    changeSelectbox(e);
                                                    calculateNet(e);
                                                },
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='furniturePriceIVA.value'
                                                label={{ text: 'IVA' }}
                                                editorOptions={{
                                                    onValueChanged: (
                                                        e: ValueChangedEvent
                                                    ) => {
                                                        changeSelectbox(e);
                                                    },
                                                    readOnly: true,
                                                    format: {
                                                        type: 'currency',
                                                        currency: 'EUR',
                                                        precision: 2,
                                                    },
                                                }}
                                            />
                                            <Item
                                                dataField='furniturePriceIVAPercentage'
                                                label={{ text: 'IVA %' }}
                                                editorOptions={{
                                                    onValueChanged: (
                                                        e: ValueChangedEvent
                                                    ) => {
                                                        calculatePriceTaxFurniture(
                                                            e
                                                        );
                                                        changeSelectbox(e);
                                                    },
                                                    format: "#0.##'%'",
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='furniturePriceGross.value'
                                            label={{ text: 'Brutto' }}
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => changeSelectbox(e),
                                                readOnly: true,
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='furniturePriceTPO.value'
                                                label={{ text: 'TPO/ ITP' }}
                                                editorOptions={{
                                                    onValueChanged: (
                                                        e: ValueChangedEvent
                                                    ) => changeSelectbox(e),
                                                    readOnly: true,
                                                    format: {
                                                        type: 'currency',
                                                        currency: 'EUR',
                                                        precision: 2,
                                                    },
                                                }}
                                            />
                                            <Item
                                                dataField='furniturePriceTPOPercentage'
                                                label={{ text: 'TPO/ITP %' }}
                                                editorType='dxSelectBox'
                                                editorOptions={{
                                                    items: [
                                                        {
                                                            label: '2%',
                                                            value: 0,
                                                        },
                                                    ],
                                                    displayExpr: 'label',
                                                    valueExpr: 'value',
                                                    onValueChanged: () =>
                                                        calculateTPOValueFurniture(),
                                                    readOnly: true,
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='furniturePriceTotal.value'
                                            label={{
                                                text: 'Total Furniture Price',
                                            }}
                                            editorOptions={{
                                                onValueChanged: (
                                                    e: ValueChangedEvent
                                                ) => changeSelectbox(e),
                                                readOnly: true,
                                                format: {
                                                    type: 'currency',
                                                    currency: 'EUR',
                                                    precision: 2,
                                                },
                                            }}
                                        />
                                    </GroupItem>
                                </GroupItem>
                                <GroupItem colCount={3}>
                                    <Item
                                        dataField='priceTotal.value'
                                        label={{ text: 'Total Price' }}
                                        colSpan={2}
                                        editorOptions={{
                                            onValueChanged: (
                                                e: ValueChangedEvent
                                            ) => changeSelectbox(e),
                                            readOnly: true,
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                </GroupItem>
                            </GroupItem>
                        </Tab>
                        <Tab title='Sale'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='saleDate'
                                    label={{ text: 'Sale Date' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        displayFormat: dateFormat,
                                        showClearButton: true,
                                    }}
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
                            </GroupItem>
                        </Tab>
                        <Tab title='Comments'>
                            <Item
                                dataField='comments'
                                label={{ text: 'Additional Comments' }}
                                editorType='dxTextArea'
                                editorOptions={{
                                    minHeight: '100',
                                    autoResizeEnabled: true,
                                }}
                            />
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='mt-2 flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            type='button'
                            icon={faSave}
                            text='Save Property'
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
