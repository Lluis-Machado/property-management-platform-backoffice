'use client';

// React imports
import { memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, {
    EmailRule,
    GroupItem,
    Item,
    NumericRule,
    RequiredRule,
    StringLengthRule,
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
import { Locale } from '@/i18n-config';
import { SelectData } from '@/lib/types/selectData';
import { customError } from '@/lib/utils/customError';
import { apiPost } from '@/lib/utils/apiPost';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { Button } from 'pg-components';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { PurchaseAddProperty } from '@/components/Tabs/PurchaseAddProperty';

let propertyData: PropertyData = {
    autonomousRegion: '',
    bedNumber: null,
    billingContactId: null,
    buildingPrice: {
        currency: '',
        value: 0,
    },
    cadastreNumber: '',
    cadastreRef: '',
    cadastreUrl: '',
    cadastreValue: {
        currency: '',
        value: 0,
    },
    comments: '',
    contactPersonId: null,
    federalState: '',
    garbageCollection: 0,
    garbageCollectionDate: null,
    garbagePriceAmount: {
        currency: '',
        value: 0,
    },
    ibiAmount: {
        currency: '',
        value: 0,
    },
    ibiCollection: 0,
    ibiCollectionDate: null,
    id: '',
    loanPrice: {
        currency: '',
        value: 0,
    },
    mainOwnerId: null,
    mainOwnerType: null,
    mainPropertyId: null,
    municipality: '',
    name: '',
    plotPrice: {
        currency: '',
        value: 0,
    },
    propertyAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: null,
        postalCode: '',
        country: null,
        addressType: null,
        shortComment: '',
    },
    propertyScanMail: '',
    purchaseDate: null,
    purchasePriceNet: {
        currency: '',
        value: 0,
    },
    purchasePriceGross: {
        currency: '',
        value: 0,
    },
    purchasePriceAJDPercentage: null,
    purchasePriceAJD: {
        currency: '',
        value: 0,
    },
    purchasePriceTPOPercentage: 0,
    purchasePriceTPO: {
        currency: '',
        value: 0,
    },
    purchasePriceTaxPercentage: null,
    purchasePriceTax: {
        currency: '',
        value: 0,
    },
    purchasePriceTotal: {
        currency: '',
        value: 0,
    },
    priceTotal: {
        currency: '',
        value: 0,
    },
    furniturePrice: {
        currency: '',
        value: 0,
    },
    furniturePriceIVA: {
        currency: '',
        value: 0,
    },
    furniturePriceIVAPercentage: 21,
    furniturePriceTPO: {
        currency: '',
        value: 0,
    },
    furniturePriceTPOPercentage: 0,
    furniturePriceTotal: {
        currency: '',
        value: 0,
    },
    furniturePriceGross: {
        currency: '',
        value: 0,
    },
    saleDate: null,
    salePrice: {
        currency: '',
        value: 0,
    },
    totalPrice: {
        currency: '',
        value: 0,
    },
    type: null,
    typeOfUse: [],
    year: null,
};

interface Props {
    properties: PropertyData[];
    contacts: SelectData[];
    countries: CountryData[];
    lang: Locale;
    totalContactsList: any[];
}

const AddPropertyPage = ({
    properties,
    contacts,
    countries,
    lang,
    totalContactsList,
}: Props) => {
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(undefined);
    const [initialValues, _] = useState<PropertyData>(
        structuredClone(propertyData) // Important to not be copied by reference
    );
    // Refs
    const formRef = useRef<Form>(null);

    const router = useRouter();

    const changeSelectbox = useCallback((e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    }, []);

    const changeCssFormElement = useCallback(
        ({ dataField, element }: FieldDataChangedEvent) => {
            if (!dataField) {
                document
                    .getElementById(element.attributes[1].nodeValue!)
                    ?.classList.add('styling');
            } else {
                document
                    .getElementsByName(dataField!)[0]
                    .classList.add('styling');
            }
        },
        []
    );

    const handleCountryChange = useCallback(
        (countryId: number) => {
            fetch(`/api/countries?countryId=${countryId}&lang=${lang}`)
                .then((resp) => resp.json())
                .then((data: StateData[]) => setStates(data))
                .catch((e) =>
                    console.error('Error while getting the states: ', e)
                );
        },
        [lang]
    );

    const handleSubmit = useCallback(async () => {
        let contactType;
        const res = formRef.current!.instance.validate();
        if (!res.isValid) {
            toast.warning('Validation error detected, check all fields');
            return;
        }
        const values = structuredClone(propertyData);

        if (values.mainOwnerId) {
            contactType = totalContactsList?.find(
                (item) => item.id == values.mainOwnerId
            );
        }

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        if (values.propertyAddress.country == null) {
            toast.warning('Add a country');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating property...');

        try {
            const dataToSend: PropertyData = {
                ...values,
                purchaseDate: formatDate(values.purchaseDate),
                saleDate: formatDate(values.saleDate),
                ibiCollectionDate: formatDate(values.ibiCollectionDate),
                garbageCollectionDate: formatDate(values.garbageCollectionDate),
                mainOwnerType: contactType.type,
            };
            console.log('Valores a enviar: ', values);
            console.log('Valores a enviar JSON: ', JSON.stringify(values));
            const data = await apiPost('/api/properties', dataToSend);

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Property created correctly!');
            // Clear contact data
            propertyData = structuredClone(initialValues);
            // Pass the ID to reload the page
            router.push(`/private/properties?createdId=${data.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [router, initialValues, totalContactsList]);

    const calculateCadastreValue = useCallback(() => {
        propertyData.cadastreValue.value =
            propertyData.buildingPrice.value + propertyData.plotPrice.value;
        formRef.current!.instance.updateData(propertyData);
    }, [
        propertyData.buildingPrice.value,
        propertyData.plotPrice.value,
        formRef,
    ]);

    return (
        <>
            <Form
                formData={propertyData}
                readOnly={isLoading}
                labelMode='floating'
                ref={formRef}
                onFieldDataChanged={changeCssFormElement}
            >
                <GroupItem colCount={3}>
                    <GroupItem>
                        <Item dataField='name' label={{ text: 'Name' }}>
                            <RequiredRule />
                            <StringLengthRule
                                min={3}
                                message='The property name has to have at least 3 letters'
                            />
                        </Item>
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
                            >
                                <NumericRule />
                            </Item>
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
                            >
                                <RequiredRule />
                            </Item>
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
                        <GroupItem>
                            <Item
                                dataField='mainOwnerId'
                                label={{ text: 'Main Owner' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: totalContactsList,
                                    displayExpr: 'label',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                }}
                            >
                                <RequiredRule />
                            </Item>
                            <Item
                                dataField='contactPersonId'
                                label={{ text: 'Contact Person' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: contacts,
                                    displayExpr: 'label',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                }}
                            />
                            <Item
                                dataField='propertyScanMail'
                                label={{ text: 'Property Scan Mail' }}
                            >
                                <EmailRule />
                            </Item>
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
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='ibiCollection'
                                    label={{ text: 'IBI Collection' }}
                                    editorType='dxSelectBox'
                                    editorOptions={{
                                        elementAttr: {
                                            id: `ibiCollection`,
                                        },
                                        items: [
                                            { label: 'None', value: 0 },
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 2 },
                                        ],
                                        displayExpr: 'label',
                                        valueExpr: 'value',
                                        searchEnabled: true,
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='ibiAmount.value'
                                    label={{ text: 'IBI Amount' }}
                                    editorOptions={{
                                        elementAttr: {
                                            id: `addProperty-ibiAmount`,
                                        },
                                        format: {
                                            type: 'currency',
                                            currency: 'EUR',
                                            precision: 2,
                                        },
                                    }}
                                />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='garbageCollection'
                                    label={{ text: 'Garbage Collection' }}
                                    editorType='dxSelectBox'
                                    editorOptions={{
                                        elementAttr: {
                                            id: `garbageCollection`,
                                        },
                                        items: [
                                            { label: 'None', value: 0 },
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 2 },
                                        ],
                                        displayExpr: 'label',
                                        valueExpr: 'value',
                                        searchEnabled: true,
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
                                    }}
                                />

                                <Item
                                    dataField='garbagePriceAmount.value'
                                    label={{ text: 'Garbage Price Amount' }}
                                    editorOptions={{
                                        format: {
                                            type: 'currency',
                                            currency: 'EUR',
                                            precision: 2,
                                        },
                                    }}
                                />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='cadastreRef'
                                    label={{ text: 'Catastral Nr.' }}
                                />
                                <GroupItem>
                                    <Item
                                        dataField='buildingPrice.value'
                                        label={{ text: 'Building price' }}
                                        editorOptions={{
                                            elementAttr: {
                                                id: `addProperty-buildingPrice`,
                                            },
                                            onValueChanged: (
                                                e: ValueChangedEvent
                                            ) => {
                                                changeSelectbox(e);
                                                calculateCadastreValue();
                                            },
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                    <Item
                                        dataField='plotPrice.value'
                                        label={{ text: 'Plot price' }}
                                        editorOptions={{
                                            elementAttr: {
                                                id: `addProperty-plotPrice`,
                                            },
                                            onValueChanged: (
                                                e: ValueChangedEvent
                                            ) => {
                                                changeSelectbox(e);
                                                calculateCadastreValue();
                                            },
                                            format: {
                                                type: 'currency',
                                                currency: 'EUR',
                                                precision: 2,
                                            },
                                        }}
                                    />
                                    <Item
                                        dataField='cadastreValue.value'
                                        label={{ text: 'Cadastre Value' }}
                                        editorOptions={{
                                            onValueChanged: (
                                                e: ValueChangedEvent
                                            ) => changeSelectbox(e),
                                            elementAttr: {
                                                id: `addpropertyCadastreValue`,
                                            },
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
                        <Tab title='Purchase'>
                            <PurchaseAddProperty propertyData={propertyData} />
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
                                    editorOptions={{
                                        format: {
                                            type: 'currency',
                                            currency: 'EUR',
                                            precision: 2,
                                        },
                                    }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Other Information'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='bedNumber'
                                    label={{ text: 'Bed Number' }}
                                >
                                    <NumericRule />
                                </Item>
                                <Item dataField='year' label={{ text: 'Year' }}>
                                    <NumericRule />
                                </Item>
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
            <div className='my-6'>
                <div className='flex justify-end'>
                    <div className='flex flex-row self-center'>
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
        </>
    );
};

export default memo(AddPropertyPage);
