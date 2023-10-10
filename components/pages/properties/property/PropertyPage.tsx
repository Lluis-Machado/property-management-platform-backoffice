'use client';
// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';
// Libraries imports
import { Button } from 'pg-components';
import {
    faFileLines,
    faReceipt,
    faTrash,
    faXmark,
    faPencil,
    faSave,
    faArrowUpRightFromSquare,
    faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, {
    EmailRule,
    GroupItem,
    Item,
    NumericRule,
    RequiredRule,
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import 'devextreme-react/tag-box';
import 'devextreme-react/text-area';
import { ValueChangedEvent } from 'devextreme/ui/text_box';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { useAtom } from 'jotai';
import { logOpened } from '@/lib/atoms/logOpened';

// Local imports
import '@/lib/styles/highlightFields.css';
import { PropertyData } from '@/lib/types/propertyInfo';
import PropertiesOwnersDatagrid, {
    PODatagridProps,
} from './PropertiesOwnersDatagrid';
import PropertySidePropertiesDatagrid from './PropertySidePropertiesDatagrid';
import ConfirmDeletePopup from '@/components/popups/ConfirmationPopup';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import SimpleLinkCard from '@/components/cards/SimpleLinkCard';
import { Locale } from '@/i18n-config';
import { customError } from '@/lib/utils/customError';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { ContactData } from '@/lib/types/contactData';
import { formatDate } from '@/lib/utils/formatDateFromJS';
import PropertyPageTitle from './PropertyPageTitle';
import { Purchase } from '@/components/Tabs/PurchaseTab';
import Cadastre from '@/components/Tabs/CadastreTab';
import OtherInformatiom, {
    OtherInformationProps,
} from '@/components/Tabs/OtherInformationTab';
import Sale from '@/components/Tabs/SalesTab';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import ToolbarTooltips from '@/components/tooltips/ToolbarTooltips';
import { selectedObjId, selectedObjName } from '@/lib/atoms/selectedObj';

interface Props {
    propertyData: PropertyData;
    propertiesData: PropertyData[];
    totalContactsList: any[];
    contacts: ContactData[];
    ownershipData: OwnershipPropertyData[];
    countries: CountryData[];
    initialStates: StateData[];
    lang: Locale;
}

const PropertyPage = ({
    propertyData,
    propertiesData,
    totalContactsList,
    contacts,
    ownershipData,
    countries,
    initialStates,
    lang,
}: Props): React.ReactElement => {
    //////////// Atoms ////////////
    const [_, setIsLogOpened] = useAtom(logOpened);
    const [__, setPropertyId] = useAtom(selectedObjId);
    const [___, setObjName] = useAtom(selectedObjName);

    //////////// States ////////////
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [unsavedVisible, setUnsavedVisible] = useState<boolean>(false);
    const [cadastreRef, ____] = useState<string>(propertyData.cadastreRef);
    const [initialValues, setInitialValues] = useState<PropertyData>(
        structuredClone(propertyData)
    );

    //////////// Refs ////////////
    const dataGridRef = useRef<PODatagridProps>(null);
    const formRef = useRef<Form>(null);
    const statesRef = useRef<Item>(null);
    const otherInfoTabRef = useRef<OtherInformationProps>(null);

    //////////// Custom Hooks ////////////
    const router = useRouter();

    // Used for audit log calls
    useEffect(() => {
        setObjName('property');
    }, [setObjName]);

    // function name property
    const callbackFunction = (name: string) => {
        propertyData.name = name;
    };

    const handleCountryChange = useCallback(
        (countryId: number) => {
            fetch(`/api/countries?countryId=${countryId}&lang=${lang}`)
                .then((resp) => resp.json())
                .then((data: StateData[]) =>
                    formRef
                        .current!.instance.getEditor('propertyAddress.state')!
                        .option('items', data)
                )
                .catch((e) =>
                    console.error('Error while getting the states', e)
                );
            // Ensure state is removed
            propertyData.propertyAddress.state = null;
        },
        [lang, propertyData.propertyAddress]
    );

    const handleSubmit = async () => {
        const res = formRef.current!.instance.validate();

        if (!res.isValid || !otherInfoTabRef.current?.isValid()) {
            toast.warning('Validation error detected, check all fields');
            return;
        }

        const ownershipsDGhasChanged = dataGridRef.current!.hasEditData();

        // CHANGES PROPERTY FORM
        const values = structuredClone(propertyData);

        if (
            JSON.stringify(values) === JSON.stringify(initialValues) &&
            ownershipsDGhasChanged === false
        ) {
            toast.warning('Change at least one field');
            return;
        } else if (ownershipsDGhasChanged) {
            await dataGridRef.current!.saveEditData();
            const dataOwnersDG = dataGridRef
                .current!.getDataSource()
                .items() as OwnershipPropertyData[];

            // Check if shares are not equal to 100. Complexity O(n)
            let sumofShares: number = 0;
            for (const item of dataOwnersDG) {
                sumofShares += item.share;
                if (sumofShares > 100) {
                    break;
                }
            }

            if (sumofShares !== 100) {
                toast.warning(
                    'The sum of shares is less or more then 100% in the Owners Tab'
                );
                return;
            }

            // Check if there are repeated owners. Complexity O(n)
            const ownerIdSet = new Set();
            const duplicateOwners = new Set();

            for (const item of dataOwnersDG) {
                const ownerId = item.ownerId;

                if (ownerIdSet.has(ownerId)) {
                    duplicateOwners.add(ownerId);
                } else {
                    ownerIdSet.add(ownerId);
                }
            }

            const duplicateOwnersArray = Array.from(duplicateOwners);
            if (duplicateOwnersArray.length > 0) {
                toast.warning(
                    'You cant add the same owner twice in the Owners Tab'
                );
                return;
            }

            // Check if there are more than one main ownership
            let duplicatesMainOwnerShips: OwnershipPropertyData[] = [];
            dataOwnersDG.forEach((item: OwnershipPropertyData) => {
                if (item.mainOwnership === true) {
                    duplicatesMainOwnerShips.push(item);
                }
            });
            if (duplicatesMainOwnerShips.length !== 1) {
                toast.warning(
                    'You have no main owner / or more then one main owner in the Owners Tab!'
                );
                return;
            }
            // If all OK, send data
            console.log('SE HA GUARDADO');
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating property...');

        // Sending data logic
        try {
            const dataToSend: PropertyData = {
                ...values,
                purchaseDate: formatDate(values.purchaseDate),
                saleDate: formatDate(values.saleDate),
                ibiCollectionDate: formatDate(values.ibiCollectionDate),
                garbageCollectionDate: formatDate(values.garbageCollectionDate),
                cadastreRef,
            };
            console.log('Valores a enviar: ', dataToSend);
            console.log('Valores a enviar JSON: ', JSON.stringify(dataToSend));

            const data = await apiPatch(
                `/api/properties/${propertyData.id!}`,
                dataToSend
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'Property updated correctly!');
            setInitialValues(data);
            setIsEditing(false);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting property...');
        try {
            await apiDelete(`/api/properties/${propertyData.id!}`);

            updateSuccessToast(toastId, 'Property deleted correctly!');
            // Pass the ID to reload the page
            router.push(`/private/properties?deletedId=${propertyData.id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [propertyData, router]);

    // CSS styling form element

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

    const changeSelectbox = (e: ValueChangedEvent) => {
        document
            .getElementById(e.element.attributes[1].nodeValue!)
            ?.classList.add('stylingForm');
    };

    const changeTagbox = (e: ValueChangedEvent) => {
        if (e.event !== undefined) {
            e.element.classList.add('stylingForm');
        }
    };

    const handleEditingButton = () => {
        const values = structuredClone(propertyData);
        if (
            isEditing &&
            JSON.stringify(values) !== JSON.stringify(initialValues)
        ) {
            setUnsavedVisible(true);
        } else {
            setIsEditing((prev) => !prev);
        }
    };

    // LISTADO MAIN PROPERTIES WITHOUT PROPERTY
    let propertiesList: PropertyData[] = [];
    for (const property of propertiesData) {
        if (!property.id.includes(propertyData.id)) {
            propertiesList.push(property);
        }
    }

    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this property?'
                isVisible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
            />
            <ConfirmationPopup
                message='Are you sure you want to exit without saving the changes?'
                isVisible={unsavedVisible}
                onClose={() => setUnsavedVisible(false)}
                onConfirm={() => router.refresh()}
            />
            {/* Toolbar tooltips */}
            <ToolbarTooltips isEditing={isEditing} />
            <div className='my-6 flex w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='grow basis-1/4'>
                    <PropertyPageTitle
                        isLoading={isLoading}
                        isEditing={isEditing}
                        propertyData={propertyData}
                        parentCallback={callbackFunction}
                    />
                </div>
                {/* Cards with actions */}
                <div className='flex basis-2/4 flex-row items-center gap-4'>
                    <SimpleLinkCard
                        href={`/private/documents/files?archiveId=${propertyData.archiveId}`}
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
                <div className='flex flex-row gap-4 self-center'>
                    <Button
                        id='auditButton'
                        elevated
                        onClick={() => {
                            setPropertyId(propertyData.id!);
                            setIsLogOpened(true);
                        }}
                        type='button'
                        icon={faClockRotateLeft}
                    />
                    <Button
                        id='crmButton'
                        elevated
                        onClick={() =>
                            window.open(
                                'https://crm.zoho.com/crm/org57555088/tab/Accounts/1631361000106185043',
                                '_blank'
                            )
                        }
                        type='button'
                        icon={faArrowUpRightFromSquare}
                    />
                    <Button
                        id='saveButton'
                        elevated
                        onClick={handleSubmit}
                        type='button'
                        icon={faSave}
                        disabled={!isEditing || isLoading}
                        isLoading={isLoading}
                    />
                    <Button
                        id='editButton'
                        elevated
                        onClick={() => handleEditingButton()}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                    <Button
                        id='deleteButton'
                        elevated
                        onClick={() => setDeleteVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='danger'
                    />
                </div>
            </div>
            {/* Property form */}
            <Form
                formData={propertyData}
                labelMode='floating'
                readOnly={isLoading || !isEditing}
                onFieldDataChanged={changeCssFormElement}
                ref={formRef}
            >
                <GroupItem colCount={3}>
                    <GroupItem>
                        <Item
                            dataField='type'
                            label={{ text: 'Type' }}
                            editorType='dxSelectBox'
                            editorOptions={{
                                elementAttr: {
                                    id: `propertyType`,
                                },
                                items: [
                                    { label: 'Apartment', value: 0 },
                                    { label: 'Rural property', value: 1 },
                                    { label: 'Residential property', value: 2 },
                                    { label: 'Plot', value: 3 },
                                    { label: 'Parking', value: 4 },
                                    { label: 'Storage room', value: 5 },
                                    { label: 'Mooring', value: 6 },
                                ],
                                displayExpr: 'label',
                                valueExpr: 'value',
                                searchEnabled: true,
                                showClearButton: isEditing,
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeSelectbox(e),
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
                                showClearButton: isEditing,
                                onValueChanged: (e: ValueChangedEvent) =>
                                    changeTagbox(e),
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
                                        elementAttr: {
                                            id: `propertycountry`,
                                        },
                                        items: countries,
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        searchEnabled: true,
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => {
                                            handleCountryChange(e.value);
                                            changeSelectbox(e);
                                        },
                                    }}
                                >
                                    <RequiredRule />
                                </Item>
                                <Item
                                    dataField='propertyAddress.state'
                                    label={{ text: 'State' }}
                                    editorType='dxSelectBox'
                                    name='state'
                                    ref={statesRef}
                                    editorOptions={{
                                        elementAttr: {
                                            id: `propertyState`,
                                        },
                                        items: initialStates,
                                        displayExpr: 'name',
                                        valueExpr: 'id',
                                        searchEnabled: true,
                                        onValueChanged: (
                                            e: ValueChangedEvent
                                        ) => changeSelectbox(e),
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
                                elementAttr: {
                                    id: `propertyContactPerson`,
                                },
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
                                elementAttr: {
                                    id: `propertyMainProperty`,
                                },
                                items: propertiesList,
                                displayExpr: 'name',
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
                                                    `/private/properties/${propertyData.mainPropertyId}/property`
                                                );
                                            },
                                            disabled:
                                                propertyData.mainPropertyId
                                                    ? false
                                                    : true,
                                        },
                                    },
                                ],
                            }}
                        />
                    </GroupItem>
                </GroupItem>
                <GroupItem>
                    <TabbedItem>
                        <TabPanelOptions deferRendering={false} />
                        <Tab title='Owners'>
                            <PropertiesOwnersDatagrid
                                ref={dataGridRef}
                                dataSource={ownershipData}
                                totalContactsList={totalContactsList}
                                isEditing={isEditing}
                            />
                        </Tab>
                        <Tab title='Side Properties'>
                            <PropertySidePropertiesDatagrid
                                dataSource={propertyData}
                            />
                        </Tab>
                        <Tab title='Cadastre'>
                            <Cadastre
                                propertyData={propertyData}
                                isLoading={isLoading}
                                isEditing={isEditing}
                            />
                        </Tab>
                        <Tab title='Purchase'>
                            <Purchase
                                propertyData={propertyData}
                                isLoading={isLoading}
                                isEditing={isEditing}
                            />
                        </Tab>
                        <Tab title='Sale'>
                            <Sale
                                propertyData={propertyData}
                                isLoading={isLoading}
                                isEditing={isEditing}
                            />
                        </Tab>
                        <Tab title='Other Information'>
                            <OtherInformatiom
                                propertyData={propertyData}
                                isLoading={isLoading}
                                isEditing={isEditing}
                                ref={otherInfoTabRef}
                            />
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
        </div>
    );
};
export default memo(PropertyPage);
