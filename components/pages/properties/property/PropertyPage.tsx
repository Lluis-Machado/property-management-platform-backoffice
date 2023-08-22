'use client';

// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import {
    faFileLines,
    faReceipt,
    faTrash,
    faXmark,
    faPencil,
    faSave,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, {
    GroupItem,
    Item,
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import TextBox, { Button as TextBoxButton } from 'devextreme-react/text-box';
import TagBox from 'devextreme-react/tag-box';
import Tooltip from 'devextreme-react/tooltip';

// Local imports
import { PropertyData } from '@/lib/types/propertyInfo';
import PropertiesOwnersDatagrid from './PropertiesOwnersDatagrid';
import PropertySidePropertiesDatagrid from './PropertySidePropertiesDatagrid';
import ConfirmDeletePopup from '@/components/popups/ConfirmDeletePopup';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { customError } from '@/lib/utils/customError';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { ContactData } from '@/lib/types/contactData';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import './styles.css';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';

interface Props {
    propertyData: PropertyData;
    contacts: ContactData[];
    ownershipData: OwnershipPropertyData[];
    countries: CountryData[];
    initialStates: StateData[];
    token: TokenRes;
    lang: Locale;
}

const PropertyPage = ({
    propertyData,
    contacts,
    ownershipData,
    countries,
    initialStates,
    token,
    lang,
}: Props): React.ReactElement => {
    let priceTax: number;
    const router = useRouter();
    const ref = useRef<null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] =
        useState<boolean>(false);
    const [states, setStates] = useState<StateData[] | undefined>(
        initialStates
    );
    const [cadastreRef, setCadastreRef] = useState<string>(
        propertyData.cadastreRef
    );
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );

    // function name property
    const [nameProperty, setNameProperty] = useState<string>(
        initialValues.name
    );
    const onValueChange = useCallback(
        (e: ValueChangedEvent) => {
            setNameProperty(e.value);
            if (e.value != propertyData.name) {
                e.element.classList.add('styling');
            } else {
                e.element.classList.remove('styling');
            }
        },
        [propertyData]
    );

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
            // Ensure state is removed
            propertyData.propertyAddress.state = null;
        },
        [lang, token, propertyData.propertyAddress]
    );

    const handleSubmit = useCallback(async () => {
        //@ts-ignore
        ref.current.saveEditData();
        // CHANGES PROPERTY FORM
        const values = structuredClone(propertyData);
        if (
            JSON.stringify(values) === JSON.stringify(initialValues) &&
            nameProperty === initialValues.name
        ) {
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating property...');

        try {
            const dataToSend: PropertyData = {
                ...values,
                name: nameProperty,
                purchaseDate: formatDate(values.purchaseDate),
                saleDate: formatDate(values.saleDate),
                cadastreRef,
            };
            console.log('Valores a enviar: ', dataToSend);
            console.log('Valores a enviar JSON: ', JSON.stringify(dataToSend));

            const data = await apiPatch(
                `/properties/properties/${propertyData.id}`,
                dataToSend,
                token,
                'Error while updating a property'
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'Property updated correctly!');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [propertyData, initialValues, token, cadastreRef, nameProperty]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting property...');
        try {
            await apiDelete(
                `/properties/properties/${propertyData.id}`,
                token,
                'Error while deleting a property'
            );

            updateSuccessToast(toastId, 'Property deleted correctly!');
            router.push('/private/properties');
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [propertyData, router, token]);

    // CSS styling form element

    const changeCssFormElement = (e: FieldDataChangedEvent) => {
        document
            .getElementsByName(e.dataField!)[0]
            .classList.add('stylingForm');
    };

    const changeSelectbox = (e: any) => {
        e.element.classList.add('stylingForm');
    };

    // calculate Property
    const calculatePur = (e: any) => {
        //@ts-ignore
        propertyData.purchasePriceNet.value = e.value;
        if (propertyData.purchasePriceTaxPercentage == 1) {
            //@ts-ignore
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value / 100) * 10;
        } else if (propertyData.purchasePriceTaxPercentage == 2) {
            //@ts-ignore
            propertyData.purchasePriceTax.value =
                (propertyData.purchasePriceNet.value / 100) * 21;
        } else {
            propertyData.purchasePriceTax.value =
                propertyData.purchasePriceNet.value;
        }
        calculateBruttoValue();
        calculateTotalPrice();
        calculatePurchasePrice();
    };
    const calculatePriceTax = (e: any) => {
        if (e.value == 1) {
            //@ts-ignore
            priceTax = (propertyData.purchasePriceNet.value / 100) * 10;
            propertyData.purchasePriceTax.value = priceTax;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
            return priceTax;
        } else if (e.value == 2) {
            //@ts-ignore
            priceTax = (propertyData.purchasePriceNet.value / 100) * 21;
            propertyData.purchasePriceTax.value = priceTax;
            propertyData.purchasePriceTPO.value = 0;
            propertyData.purchasePriceTPOPercentage = 0;
            calculateBruttoValue();
            calculateTotalPrice();
            calculatePurchasePrice();
            return priceTax;
        } else {
            propertyData.purchasePriceTax.value = 0;
            propertyData.purchasePriceGross.value =
                propertyData.purchasePriceNet.value;
            propertyData.purchasePriceAJD.value = 0;
            propertyData.purchasePriceAJDPercentage = 0;
            calculateTotalPrice();
            calculatePurchasePrice();
            return priceTax;
        }
    };

    const calculateBruttoValue = () => {
        //@ts-ignore
        propertyData.purchasePriceGross.value =
            propertyData.purchasePriceNet.value +
            propertyData.purchasePriceTax.value;
    };

    const calculateTPOValue = (e: any) => {
        //@ts-ignore
        propertyData.purchasePriceTPO.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceAJD.value = 0;
        propertyData.purchasePriceAJDPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateAJDValue = (e: any) => {
        //@ts-ignore
        propertyData.purchasePriceAJD.value =
            (propertyData.purchasePriceNet.value / 100) * e.value;
        propertyData.purchasePriceTPO.value = 0;
        propertyData.purchasePriceTPOPercentage = 0;
        calculateTotalPrice();
        calculatePurchasePrice();
    };

    const calculateTotalPrice = () => {
        //@ts-ignore
        propertyData.purchasePriceTotal.value =
            propertyData.purchasePriceGross.value +
            propertyData.purchasePriceTPO.value +
            propertyData.purchasePriceAJD.value;
    };
    // Furniture
    const calculateNet = (e: any) => {
        //@ts-ignore
        propertyData.furniturePriceIVA.value =
            (e.value / 100) * propertyData.furniturePriceIVAPercentage;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculatePriceTaxFurniture = (e: any) => {
        //@ts-ignore
        propertyData.furniturePriceIVA.value =
            (propertyData.furniturePrice.value / 100) * e.value;
        calculateBruttoValueFurniture();
        calculateTPOValueFurniture();
        calculateTotalPriceFurniture();
        calculatePurchasePrice();
    };
    const calculateBruttoValueFurniture = () => {
        //@ts-ignore
        propertyData.furniturePriceGross.value =
            propertyData.furniturePrice.value +
            propertyData.furniturePriceIVA.value;
    };
    const calculateTPOValueFurniture = () => {
        //@ts-ignore
        propertyData.furniturePriceTPO.value =
            (propertyData.furniturePrice.value / 100) * 2;
    };
    const calculateTotalPriceFurniture = () => {
        //@ts-ignore
        propertyData.furniturePriceTotal.value =
            propertyData.furniturePriceGross.value +
            propertyData.furniturePriceTPO.value;
    };
    // TOTAL PURCHASE CALCULATION
    const calculatePurchasePrice = () => {
        //@ts-ignore
        propertyData.priceTotal.value =
            propertyData.furniturePriceTotal.value +
            propertyData.purchasePriceTotal.value;
    };
    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this property?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />

            <div className='my-6 flex w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='ml-5 basis-1/4'>
                    <TextBox
                        value={nameProperty}
                        disabled={!isEditing || isLoading}
                        onValueChanged={onValueChange}
                        id='title'
                        style={{
                            fontWeight: '800',
                            fontSize: '35px',
                            border: 'none',
                            opacity: '1',
                        }}
                    >
                        {isEditing && (
                            <Tooltip
                                target='#title'
                                showEvent='mouseenter'
                                hideEvent='mouseleave'
                            >
                                <div
                                    style={{
                                        color: '#b99f6c',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Be carefull you are changing the name of the
                                    property
                                </div>
                            </Tooltip>
                        )}
                    </TextBox>
                </div>
                {/* Cards with actions */}
                <div className='flex basis-2/4 flex-row items-center gap-4'>
                    <SimpleLinkCard
                        href={`/private/documents?propertyId=${propertyData.id}`}
                        text='Documents'
                        faIcon={faFileLines}
                    />
                    <SimpleLinkCard
                        href={`/private/accounting/${propertyData.id}/incomes`}
                        text='AR Invoices'
                        faIcon={faReceipt}
                    />
                    <SimpleLinkCard
                        href={`/private/accounting/${propertyData.id}/expenses`}
                        text='AP Invoices'
                        faIcon={faReceipt}
                    />
                </div>
                {/* Button toolbar */}
                <div className='mr-6 flex flex-row gap-4 self-center'>
                    {isEditing && (
                        <Button
                            elevated
                            onClick={() => handleSubmit()}
                            type='button'
                            icon={faSave}
                            disabled={!isEditing || isLoading}
                            isLoading={isLoading}
                            style='success'
                        />
                    )}
                    <Button
                        elevated
                        onClick={() => (
                            setIsEditing((prev) => !prev),
                            setNameProperty(propertyData.name)
                        )}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                    <Button
                        elevated
                        onClick={() => setConfirmationVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='danger'
                    />
                </div>
            </div>
            {/* Property form */}
            <Form
                formData={propertyData}
                readOnly={isLoading || !isEditing}
                onFieldDataChanged={changeCssFormElement}
            >
                <GroupItem colCount={3}>
                    <GroupItem>
                        <Item
                            dataField='type'
                            label={{ text: 'Type' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                items: [
                                    { label: 'Apartment', value: 0 },
                                    { label: 'Rural property', value: 1 },
                                    { label: 'House', value: 2 },
                                    { label: 'Plot', value: 3 },
                                    { label: 'Parking', value: 4 },
                                    { label: 'Storage room', value: 5 },
                                    { label: 'Mooring', value: 6 },
                                ],
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                                showClearButton: true,
                                onValueChanged: (e: any) => changeSelectbox(e),
                            }}
                        />
                        <Item visible={false}>
                            <TagBox />
                        </Item>
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
                                showClearButton: isEditing && true,
                                onValueChanged: (e: any) => changeSelectbox(e),
                            }}
                        />
                        <GroupItem>
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
                                        onValueChanged: (e: any) => {
                                            handleCountryChange(e.value),
                                                changeSelectbox(e);
                                        },
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
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                            </GroupItem>
                        </GroupItem>
                    </GroupItem>
                    <GroupItem>
                        <Item
                            dataField='contactPersonId'
                            label={{ text: 'Contact Person' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                items: contacts,
                                displayExpr: 'firstName',
                                valueExpr: 'id',
                                searchEnabled: true,
                                onValueChanged: (e: any) => changeSelectbox(e),
                                buttons: [
                                    {
                                        name: 'goto',
                                        location: 'after',
                                        options: {
                                            icon: '<svg xmlns="http://www.w3.org/2000/svg" id="arrowButtonIcon" height="0.8em" viewBox="0 0 512 512"><style>#arrowButtonIcon{fill:#ffffff}</style><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>',
                                            type: 'default',
                                            onClick: () => {
                                                router.push(
                                                    `/private/contacts/${propertyData.contactPersonId}/contactInfo`
                                                );
                                            },
                                            disabled:
                                                propertyData.contactPersonId
                                                    ? false
                                                    : true,
                                        },
                                    },
                                ],
                            }}
                        />
                        <Item
                            dataField='billingContactId'
                            label={{ text: 'Billing Contact' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                items: contacts,
                                displayExpr: 'firstName',
                                valueExpr: 'id',
                                searchEnabled: true,
                                onValueChanged: (e: any) => changeSelectbox(e),
                                buttons: [
                                    {
                                        name: 'goto',
                                        location: 'after',
                                        options: {
                                            icon: '<svg xmlns="http://www.w3.org/2000/svg" id="arrowButtonIcon" height="0.8em" viewBox="0 0 512 512"><style>#arrowButtonIcon{fill:#ffffff}</style><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>',
                                            type: 'default',
                                            onClick: () => {
                                                router.push(
                                                    `/private/contacts/${propertyData.billingContactId}/contactInfo`
                                                );
                                            },
                                            disabled:
                                                propertyData.billingContactId
                                                    ? false
                                                    : true,
                                        },
                                    },
                                ],
                            }}
                        />
                        <Item
                            dataField='propertyScanMail'
                            label={{ text: 'Property Scan Mail' }}
                        />
                    </GroupItem>
                </GroupItem>
                <GroupItem>
                    <TabbedItem>
                        <TabPanelOptions deferRendering={false} />
                        <Tab title='Owners'>
                            <PropertiesOwnersDatagrid
                                dataSource={ownershipData}
                                token={token}
                                contactData={contacts}
                                isEditing={isEditing}
                                ref={ref}
                            />
                        </Tab>
                        <Tab title='Side Properties'>
                            <PropertySidePropertiesDatagrid
                                dataSource={propertyData}
                            />
                        </Tab>
                        <Tab title='Cadastre'>
                            <GroupItem colCount={4}>
                                <Item>
                                    <TextBox
                                        defaultValue={cadastreRef}
                                        onValueChange={(e) => {
                                            setCadastreRef(e);
                                        }}
                                        readOnly={isLoading || !isEditing}
                                        labelMode='floating'
                                        label='Cadastre Nr.'
                                    >
                                        <TextBoxButton
                                            name='catasterBtn'
                                            location='after'
                                            options={{
                                                icon: '<svg xmlns="http://www.w3.org/2000/svg" id="arrowButtonIcon" height="0.8em" viewBox="0 0 512 512"><style>#arrowButtonIcon{fill:#ffffff}</style><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>',
                                                type: 'default',
                                                onClick: () =>
                                                    propertyData.cadastreUrl &&
                                                    window.open(
                                                        propertyData.cadastreUrl,
                                                        '_blank'
                                                    ),
                                                disabled:
                                                    propertyData.cadastreUrl
                                                        ? false
                                                        : true,
                                            }}
                                        />
                                    </TextBox>
                                </Item>
                                <Item
                                    dataField='cadastreValue'
                                    label={{ text: 'Cadastre Value' }}
                                    editorOptions={{
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='loanPrice.value'
                                    label={{ text: 'Loan price' }}
                                    editorOptions={{
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='buildingPrice.value'
                                    label={{ text: 'Building price' }}
                                    editorOptions={{
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='plotPrice.value'
                                    label={{ text: 'Plot price' }}
                                    editorOptions={{
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='ibiAmount'
                                    label={{ text: 'IBI Amount' }}
                                />
                                <Item
                                    dataField='ibiCollection'
                                    label={{ text: 'IBI Collection' }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Purchase'>
                            <GroupItem>
                                <GroupItem colCount={3}>
                                    <Item
                                        dataField='purchaseDate'
                                        label={{ text: 'Purchase Date' }}
                                        editorType='dxDateBox'
                                        colSpan={2}
                                        editorOptions={{
                                            displayFormat: dateFormat,
                                            showClearButton: true,
                                            onValueChanged: (e: any) =>
                                                changeSelectbox(e),
                                        }}
                                    />
                                </GroupItem>
                                <GroupItem colCount={3}>
                                    <GroupItem caption='Property'>
                                        <Item
                                            dataField='purchasePriceNet.value'
                                            label={{ text: 'Netto price' }}
                                            editorOptions={{
                                                onValueChanged: (e: any) => {
                                                    changeSelectbox(e),
                                                        calculatePur(e);
                                                },
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='purchasePriceTax.value'
                                                label={{ text: 'Tax' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        changeSelectbox(e),
                                                    readOnly: true,
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
                                                    showClearButton:
                                                        isEditing && true,
                                                    onValueChanged: (
                                                        e: any
                                                    ) => {
                                                        changeSelectbox(e),
                                                            calculatePriceTax(
                                                                e
                                                            );
                                                    },
                                                    readOnly: false,
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='purchasePriceGross.value'
                                            label={{ text: 'Brutto' }}
                                            editorOptions={{
                                                onValueChanged: (e: any) =>
                                                    calculateTPOValue(e),
                                                readOnly: true,
                                            }}
                                        />
                                        <GroupItem
                                            colCount={2}
                                            visible={
                                                propertyData.purchasePriceTaxPercentage ==
                                                    0 && true
                                            }
                                        >
                                            <Item
                                                dataField='purchasePriceTPO.value'
                                                label={{ text: 'TPO' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        changeSelectbox(e),
                                                    readOnly: true,
                                                }}
                                            />
                                            <Item
                                                dataField='purchasePriceTPOPercentage'
                                                label={{ text: 'TPO %' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        calculateTPOValue(e),
                                                }}
                                            />
                                        </GroupItem>
                                        <GroupItem
                                            colCount={2}
                                            visible={
                                                propertyData.purchasePriceTaxPercentage !==
                                                    0 && true
                                            }
                                        >
                                            <Item
                                                dataField='purchasePriceAJD.value'
                                                label={{ text: 'AJD' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        changeSelectbox(e),
                                                    readOnly: true,
                                                }}
                                            />
                                            <Item
                                                dataField='purchasePriceAJDPercentage'
                                                label={{ text: 'AJD %' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        calculateAJDValue(e),
                                                    readOnly: false,
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='purchasePriceTotal.value'
                                            label={{ text: 'Total Price' }}
                                            editorOptions={{
                                                onValueChanged: (e: any) =>
                                                    changeSelectbox(e),
                                                readOnly: true,
                                            }}
                                        />
                                    </GroupItem>
                                    <GroupItem caption='Furniture'>
                                        <Item
                                            dataField='furniturePrice.value'
                                            label={{ text: 'Netto' }}
                                            editorOptions={{
                                                onValueChanged: (e: any) => {
                                                    changeSelectbox(e),
                                                        calculateNet(e);
                                                },
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='furniturePriceIVA.value'
                                                label={{ text: 'IVA' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        changeSelectbox(e),
                                                    readOnly: true,
                                                }}
                                            />
                                            <Item
                                                dataField='furniturePriceIVAPercentage'
                                                label={{ text: 'IVA %' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        calculatePriceTaxFurniture(
                                                            e
                                                        ),
                                                    readOnly: false,
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='furniturePriceGross.value'
                                            label={{ text: 'Brutto' }}
                                            editorOptions={{
                                                readOnly: true,
                                            }}
                                        />
                                        <GroupItem colCount={2}>
                                            <Item
                                                dataField='furniturePriceTPO.value'
                                                label={{ text: 'TPO/ ITP' }}
                                                editorOptions={{
                                                    onValueChanged: (e: any) =>
                                                        changeSelectbox(e),
                                                    readOnly: true,
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
                                                    searchEnabled: true,
                                                    showClearButton:
                                                        isEditing && true,
                                                    onValueChanged: (
                                                        e: any
                                                    ) => {
                                                        changeSelectbox(e),
                                                            calculateTPOValueFurniture();
                                                    },
                                                    readOnly: true,
                                                }}
                                            />
                                        </GroupItem>
                                        <Item
                                            dataField='furniturePriceTotal.value'
                                            label={{ text: 'Total Price' }}
                                            editorOptions={{
                                                onValueChanged: (e: any) =>
                                                    changeSelectbox(e),
                                                readOnly: true,
                                            }}
                                        />
                                    </GroupItem>
                                </GroupItem>
                                <GroupItem colCount={3}>
                                    <Item
                                        dataField='priceTotal.value'
                                        label={{ text: 'Total Purchase Price' }}
                                        colSpan={2}
                                        editorOptions={{
                                            onValueChanged: (e: any) =>
                                                changeSelectbox(e),
                                            readOnly: true,
                                        }}
                                    />
                                </GroupItem>
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
                        <Tab title='Sale'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='saleDate'
                                    label={{ text: 'Sale Date' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        displayFormat: dateFormat,
                                        showClearButton: true,
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                                <Item
                                    dataField='salePrice.value'
                                    label={{ text: 'Sale Price' }}
                                    editorOptions={{
                                        onValueChanged: (e: any) =>
                                            changeSelectbox(e),
                                    }}
                                />
                            </GroupItem>
                        </Tab>
                        <Tab title='Comments'>
                            <Item
                                dataField='comments'
                                label={{ text: 'Additional Comments' }}
                                editorType='dxTextBox'
                                editorOptions={{
                                    showClearButton: true,
                                    height: '100',
                                }}
                            />
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
        </div>
    );
};

export default PropertyPage;
