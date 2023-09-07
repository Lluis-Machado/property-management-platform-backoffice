'use client';

// React imports
import { memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, {
    EmptyItem,
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
import { Switch } from 'devextreme-react/switch';
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
import { PurchaseAddProperty } from '@/components/Tabs/PurchaseAddProperty';
import { ContentReadyEvent } from 'devextreme/ui/switch';

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
    contactPersonId: '',
    federalState: '',
    garbageCollectionDate: null,
    garbagePriceAmount: {
        currency: '',
        value: 0,
    },
    ibiAmount: {
        currency: '',
        value: 0,
    },
    ibiCollectionDate: null,
    id: '',
    loanPrice: {
        currency: '',
        value: 0,
    },
    mainOwnerId: '',
    mainOwnerType: '',
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
    type: '',
    typeOfUse: [],
    year: null,
};
interface Props {
    properties: PropertyData[];
    contacts: SelectData[];
    countries: CountryData[];
    token: TokenRes;
    lang: Locale;
    totalContactsList: any[];
}

const AddPropertyPage = ({
    properties,
    contacts,
    countries,
    token,
    lang,
    totalContactsList,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );
    const [switchGarbage, setSwitchGarbage] = useState<boolean>(false);

    const valueChanged = () => {
        setSwitchGarbage(!switchGarbage);
        formRef.current!.instance.updateData(propertyData);
    };

    const changeTextSwitch = (e: ContentReadyEvent) => {
        let switchOn = e.element.querySelector('.dx-switch-on');
        switchOn!.innerHTML = 'Yes';
        let switchOff = e.element.querySelector('.dx-switch-off');
        switchOff!.innerHTML = 'No';
    };

    const formRef = useRef<Form>(null);

    const router = useRouter();

    // CSS CHANGES
    const changeSelectbox = (e: ValueChangedEvent) => {
        e.element.classList.add('stylingForm');
    };
    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        if (!e.dataField) {
            document
                .getElementById(e.element.attributes[1].nodeValue!)
                ?.classList.add('styling');
        } else {
            document
                .getElementsByName(e.dataField!)[0]
                .classList.add('styling');
        }
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

        const contactType: any = totalContactsList?.find(
            (item) => item.id == values.mainOwnerId
        );

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
                ibiCollectionDate: formatDate(values.ibiCollectionDate),
                garbageCollectionDate: formatDate(values.garbageCollectionDate),
                mainOwnerType: contactType.type,
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
            // Clear contact data
            propertyData = structuredClone(initialValues);
            // Pass the ID to reload the page
            router.push(`/private/properties?createdId=${data.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [router, initialValues, token, totalContactsList]);

    const calculateCadastreValue = () => {
        propertyData.cadastreValue.value =
            propertyData.buildingPrice.value + propertyData.plotPrice.value;
        formRef.current!.instance.updateData(propertyData);
    };

    return (
        <div>
            <Form
                formData={propertyData}
                readOnly={isLoading}
                labelMode='floating'
                ref={formRef}
                onFieldDataChanged={changeCssFormElement}
            >
                <GroupItem colCount={3}>
                    <GroupItem>
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
                            />
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
                            {/* <Item
                                dataField='billingContactId'
                                label={{ text: 'Billing Contact' }}
                                editorType='dxSelectBox'
                                editorOptions={{
                                    items: contacts,
                                    displayExpr: 'label',
                                    valueExpr: 'id',
                                    searchEnabled: true,
                                }}
                            />  */}
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
                            <GroupItem colCount={4}>
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
                                <Item
                                    dataField='ibiCollectionDate'
                                    label={{ text: 'IBI Collection' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        elementAttr: {
                                            id: `ibiCollection`,
                                        },
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
                                    }}
                                />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <GroupItem>
                                    <Item>
                                        <div>
                                            <p className='text-gray-400'>
                                                Garbage Collection
                                            </p>
                                            <Switch
                                                value={switchGarbage}
                                                onValueChanged={valueChanged}
                                                onContentReady={
                                                    changeTextSwitch
                                                }
                                            />
                                        </div>
                                    </Item>
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='garbagePriceAmount.value'
                                    label={{ text: 'Garbage Price Amount' }}
                                    editorOptions={{
                                        format: {
                                            type: 'currency',
                                            currency: 'EUR',
                                            precision: 2,
                                        },
                                        visible: true && switchGarbage == true,
                                    }}
                                ></Item>
                                <Item
                                    dataField='garbageCollectionDate'
                                    label={{ text: 'Garbage Collection' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        displayFormat: dateFormat,
                                        showClearButton: true,
                                        visible: true && switchGarbage == true,
                                    }}
                                />
                                <EmptyItem
                                    visible={true && switchGarbage == false}
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
                        <Tab title='Accounting'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='loanPrice.value'
                                    label={{ text: 'Loan' }}
                                    editorOptions={{
                                        elementAttr: {
                                            id: `loanPrice`,
                                        },
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
                                        format: {
                                            type: 'currency',
                                            currency: 'EUR',
                                            precision: 2,
                                        },
                                    }}
                                />
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
                                />
                                <Item
                                    dataField='year'
                                    label={{ text: 'Year' }}
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
