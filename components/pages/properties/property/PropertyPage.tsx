'use client';

// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { Button, Tabs } from 'pg-components';
import {
    faFileLines,
    faNoteSticky,
    faReceipt,
    faUserGroup,
    faWarehouse,
    faTrash,
    faXmark,
    faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Form, { GroupItem, Item } from 'devextreme-react/form';
import TextBox, { Button as TextBoxButton } from 'devextreme-react/text-box';

// Local imports
import { PropertyCreate, PropertyData } from '@/lib/types/propertyInfo';
import PropertiesOwnersDatagrid from './PropertiesOwnersDatagrid';
import PropertyTextArea from '@/components/textArea/PropertyTextArea';
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
            propertyData.address.state = null;
        },
        [lang, token, propertyData.address]
    );

    const handleSubmit = useCallback(async () => {
        const values = structuredClone(propertyData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating property...');

        try {
            const dataToSend: PropertyData = {
                ...values,
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
    }, [propertyData, initialValues, token, cadastreRef]);

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
                <div className='ml-5 flex items-center gap-5'>
                    <span className='text-4xl tracking-tight text-zinc-900'>
                        {initialValues.name}
                    </span>
                </div>
                {/* Cards with actions */}
                <div className='flex flex-row items-center gap-4'>
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
                <div className='flex flex-row gap-4 self-center'>
                    <Button
                        elevated
                        onClick={() => setIsEditing((prev) => !prev)}
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
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
            >
                <GroupItem colCount={4} caption='Property Information'>
                    <Item dataField='name' label={{ text: 'Name' }} />
                    <Item dataField='type' label={{ text: 'Type' }} />
                    <Item>
                        <TextBox
                            defaultValue={cadastreRef}
                            label='Catastral Reference'
                            onValueChange={(e) => setCadastreRef(e)}
                            readOnly={isLoading || !isEditing}
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
                                    disabled: propertyData.cadastreUrl
                                        ? false
                                        : true,
                                }}
                            />
                        </TextBox>
                    </Item>
                </GroupItem>
                <GroupItem colCount={4} caption='Contact Information'>
                    <Item
                        dataField='address.addressLine1'
                        label={{ text: 'Contact Person' }}
                    />
                    <Item
                        dataField='address.addressLine1'
                        label={{ text: 'Billing Contact' }}
                    />
                </GroupItem>
                <GroupItem colCount={4} caption='Address Information'>
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
                            displayExpr: 'name',
                            valueExpr: 'id',
                            searchEnabled: true,
                        }}
                    />
                    <Item dataField='address.city' label={{ text: 'City' }} />
                    <Item
                        dataField='address.postalCode'
                        label={{ text: 'Postal code' }}
                    />
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        {isEditing && (
                            <Button
                                elevated
                                type='button'
                                text='Submit Changes'
                                disabled={isLoading}
                                isLoading={isLoading}
                                onClick={handleSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
            {/* Tabs */}
            <Tabs
                dataSource={[
                    {
                        children: (
                            <PropertiesOwnersDatagrid
                                dataSource={ownershipData}
                                token={token}
                                contactData={contacts}
                            />
                        ),
                        icon: faUserGroup,
                        title: 'Owners',
                    },
                    {
                        children: (
                            <PropertySidePropertiesDatagrid
                                dataSource={propertyData}
                            />
                        ),
                        icon: faWarehouse,
                        title: 'Side properties',
                    },
                    {
                        children: (
                            <PropertyTextArea
                                propertyData={propertyData}
                                token={token}
                                lang={lang}
                            />
                        ),
                        icon: faNoteSticky,
                        title: 'Comments',
                    },
                ]}
            />
        </div>
    );
};

export default PropertyPage;
