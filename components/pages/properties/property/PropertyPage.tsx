'use client'

// React imports
import { useCallback, useEffect, useState } from "react";

// Libraries imports
import { Button, Tabs } from "pg-components";
import { faFileLines, faNoteSticky, faReceipt, faUserGroup, faWarehouse, faTrash, faXmark, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Form, {
    GroupItem, Item
} from 'devextreme-react/form';

// Local imports
import { ApiCallError } from "@/lib/utils/errors";
import { PropertyData } from "@/lib/types/propertyInfo";
import PropertiesOwnersDatagrid from "./PropertiesOwnersDatagrid";
import PropertyTextArea from "@/components/textArea/PropertyTextArea";
import PropertySidePropertiesDatagrid from "./PropertySidePropertiesDatagrid";
import ConfirmDeletePopup from "@/components/popups/ConfirmDeletePopup";
import { updateErrorToast, updateSuccessToast } from "@/lib/utils/customToasts";
import SimpleLinkCard from "@/components/cards/SimpleLinkCard";
import { SelectData } from "@/lib/types/selectData";
import { TokenRes } from '@/lib/types/token';
import { Locale } from '@/i18n-config';
import { customError } from "@/lib/utils/customError";
import { apiDelete } from "@/lib/utils/apiDelete";
import { apiPatch } from "@/lib/utils/apiPatch";

interface Props {
    propertyData: PropertyData;
    contacts: SelectData[];
    token: TokenRes;
    lang: Locale;
};

const PropertyPage = ({ propertyData, contacts, token, lang }: Props): React.ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [countries, setCountries] = useState<SelectData[] | undefined>(undefined);
    const [states, setStates] = useState<SelectData[] | undefined>(undefined);
    // Importante para que no se copie por referencia
    const [initialValues, setInitialValues] = useState<PropertyData>(structuredClone(propertyData));

    const router = useRouter();

    // Use effect for getting countries when editing
    useEffect(() => {
        if (isEditing) {
            fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries?languageCode=${lang}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store'
            })
                .then((resp) => resp.json())
                .then((data: any) => {
                    let countries = [];
                    for (const country of data) {
                        countries.push({
                            label: country.name,
                            value: country.id
                        })
                    }
                    setCountries(countries)
                })
                .catch((e) => console.error('Error while getting the countries'))
        }
    }, [isEditing])

    const handleCountryChange = useCallback((countryId: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/countries/countries/${countryId}/states?languageCode=${lang}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token.token_type} ${token.access_token}`,
            },
            cache: 'no-store'
        })
            .then((resp) => resp.json())
            .then((data: any) => {
                let states = [];
                for (const state of data) {
                    states.push({
                        label: state.name,
                        value: state.id
                    })
                }
                setStates(states)
            })
            .catch((e) => console.error('Error while getting the states'))
    }, [lang, token])

    const handleSubmit = useCallback(
        async () => {
            const values = structuredClone(propertyData);
            console.log("Valores a enviar: ", values)

            if (JSON.stringify(values) === JSON.stringify(initialValues)) {
                toast.warning('Change at least one field')
                return;
            }

            setIsLoading(true)
            const toastId = toast.loading("Updating property...");

            try {
                const data = await apiPatch(`/properties/properties/${propertyData.id}`, values, token, 'Error while updating a property');

                console.log('TODO CORRECTO, valores de vuelta: ', data)
                updateSuccessToast(toastId, "Property updated correctly!");

            } catch (error: unknown) {
                customError(error, toastId);
            } finally {
                setIsLoading(false);
            }
        }, [propertyData]
    )

    const handleDelete = useCallback(
        async () => {
            const toastId = toast.loading("Deleting property...");
            try {
                await apiDelete(`/properties/properties/${propertyData.id}`, token, 'Error while deleting a property')

                updateSuccessToast(toastId, "Property deleted correctly!");
                router.push('/private/properties')

            } catch (error: unknown) {
                customError(error, toastId);
            }
        }, [propertyData, router]
    )

    return (
        <div className='mt-4'>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this property?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='flex my-6 w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='flex ml-5 gap-5 items-center'>
                    <span className='text-4xl tracking-tight text-zinc-900'>
                        {propertyData.name}
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
                <div className='flex flex-row self-center gap-4'>
                    <Button
                        elevated
                        onClick={() => setIsEditing(prev => !prev)}
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
                <GroupItem colCount={4} caption="Property Information">
                    <Item dataField="name" label={{ text: "Name" }} />
                    <Item dataField="type" label={{ text: "Type" }} />
                    <Item dataField="cadastreRef" label={{ text: "Catastral Reference" }} />
                    <Item
                        dataField="mainOwnerId"
                        label={{ text: "Main Owner" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: contacts,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true
                        }}
                    />
                </GroupItem>
                <GroupItem colCount={4} caption="Address Information">
                    <Item dataField="address.addressLine1" label={{ text: "Address line" }} />
                    <Item dataField="address.addressLine2" label={{ text: "Address line 2" }} />
                    <Item
                        dataField="address.country"
                        label={{ text: "Country" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: countries,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true,
                            onValueChanged: (e: any) => handleCountryChange(e.value)
                        }}
                    />
                    <Item
                        dataField="address.state"
                        label={{ text: "State" }}
                        editorType='dxSelectBox'
                        editorOptions={{
                            items: states,
                            displayExpr: "label",
                            valueExpr: "value",
                            searchEnabled: true
                        }}
                    />
                    <Item dataField="address.city" label={{ text: "City" }} />
                    <Item dataField="address.postalCode" label={{ text: "Postal code" }} />
                </GroupItem>
            </Form>
            <div className='h-[2rem]'>
                <div className='flex justify-end'>
                    <div className='flex flex-row justify-between gap-2'>
                        {
                            isEditing &&
                            <Button
                                elevated
                                type='button'
                                text='Submit Changes'
                                disabled={isLoading}
                                isLoading={isLoading}
                                onClick={handleSubmit}
                            />
                        }
                    </div>
                </div>
            </div>
            {/* Tabs */}
            <Tabs
                dataSource={[
                    {
                        children: <PropertiesOwnersDatagrid dataSource={propertyData} contactData={contacts} />,
                        icon: faUserGroup,
                        title: 'Owners'
                    },
                    {
                        children: <PropertySidePropertiesDatagrid dataSource={propertyData} />,
                        icon: faWarehouse,
                        title: 'Side properties'
                    },
                    {
                        children: <PropertyTextArea propertyData={propertyData} token={token} lang={lang} />,
                        icon: faNoteSticky,
                        title: 'Comments'
                    }
                ]}
            />
        </div>
    )
}

export default PropertyPage