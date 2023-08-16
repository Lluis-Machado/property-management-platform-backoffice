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
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );
    // function name property
    const [nameProperty, setNameProperty] = useState(initialValues.name);
    const onValueChange = useCallback((v: any) => {
        setNameProperty(v);
    }, []);

    // Importante para que no se copie por referencia

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
            // Ensure state is removed
            propertyData.propertyAddress[0].state = null;
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

    const changeCssTitle = (e: any) => {
        if (e.value != propertyData.name) {
            e.element.classList.add('styling');
        } else {
            e.element.classList.remove('styling');
        }
    };

    const changeCssFormElement = (e: any) => {
        const dataField = e.dataField;
        document.getElementsByName(dataField)[0].classList.add('stylingForm');
    };

    const changeSelectbox = (e: any) => {
        const dataField = e.dataField;
        const value = e.value;
        document.getElementsByName(dataField)[0].classList.add('stylingForm');
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
                        onValueChange={onValueChange}
                        style={{
                            fontWeight: '800',
                            fontSize: '35px',
                            border: 'none',
                            opacity: '1',
                        }}
                        onValueChanged={changeCssTitle}
                    />
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
                            onClick={handleSubmit}
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
                labelMode={'floating'}
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
                                onValueChange: { changeSelectbox },
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
                                onValueChange: { changeCssFormElement },
                            }}
                        />
                        <GroupItem>
                            <Item
                                dataField='propertyAddress[0].addressLine1'
                                label={{ text: 'Address line' }}
                            />
                            <Item
                                dataField='propertyAddress[0].addressLine2'
                                label={{ text: 'Address line 2' }}
                            />
                            <GroupItem colCount={2}>
                                <Item
                                    dataField='propertyAddress[0].postalCode'
                                    label={{ text: 'Postal code' }}
                                />
                                <Item
                                    dataField='propertyAddress[0].city'
                                    label={{ text: 'City' }}
                                />
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <Item
                                    dataField='propertyAddress[0].country'
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
                                    dataField='propertyAddress[0].state'
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
                                        onValueChange={(e) => setCadastreRef(e)}
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
                                />
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
                            </GroupItem>
                        </Tab>
                        <Tab title='Purchase'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='purchaseDate'
                                    label={{ text: 'Purchase Date' }}
                                    editorType='dxDateBox'
                                    editorOptions={{
                                        displayFormat: dateFormat,
                                        showClearButton: true,
                                    }}
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
                        <Tab title='Furniture'>
                            <GroupItem colCount={4}>
                                <Item
                                    dataField='furniturePrice.value'
                                    label={{ text: 'Furniture Price' }}
                                />
                                <Item
                                    dataField='furniturePriceIVA.value'
                                    label={{ text: 'Furniture Price IVA' }}
                                />
                                <Item
                                    dataField='furniturePriceTPO.value'
                                    label={{ text: 'Furniture Price TPO' }}
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
                                    }}
                                />
                                <Item
                                    dataField='salePrice.value'
                                    label={{ text: 'Sale Price' }}
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
