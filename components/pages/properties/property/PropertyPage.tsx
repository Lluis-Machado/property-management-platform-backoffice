'use client'

// React imports
import { useCallback, useState } from "react";

// Libraries imports
import { Button, Tabs } from "pg-components";
import { faFileLines, faNoteSticky, faReceipt, faUserGroup, faWarehouse, faTrash, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormikHelpers } from "formik";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

// Local imports
import { ApiCallError } from "@/lib/utils/errors";
import { PropertyInterface } from "@/lib/types/propertyInfo";
import PropertiesOwnersDatagrid from "./PropertiesOwnersDatagrid";
import PropertyTextArea from "@/components/textArea/PropertyTextArea";
import PropertySidePropertiesDatagrid from "./PropertySidePropertiesDatagrid";
import ConfirmDeletePopup from "@/components/popups/ConfirmDeletePopup";
import { ContactData } from "@/lib/types/contactData";
import { updateErrorToast, updateSuccessToast } from "@/lib/utils/customToasts";
import PropertyFormInfo from "@/components/pages/properties/property/PropertyFormInfo"
import SimpleLinkCard from "@/components/cards/SimpleLinkCard";

interface Props {
    id: string;
    initialValues: PropertyInterface;
    contactData: ContactData[];
};

const PropertyPage = ({ id, initialValues, contactData }: Props): React.ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = useCallback(
        async (values: PropertyInterface, { setSubmitting }: FormikHelpers<PropertyInterface>) => {
            console.log("Valores a enviar: ", values)

            if (values === initialValues) {
                toast.warning('Change at least one field')
                return;
            }

            setIsLoading(true)
            const toastId = toast.loading("Updating property...");

            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties/${id}`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({
                            ...values,
                            // FOR EACH 
                            "ownerships": [

                                {
                                    "contactId": values.mainContact,
                                    "mainOwnership": true,
                                    "share": 100
                                }
                            ],
                        }),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while updating a property');
                const data: PropertyInterface = await resp.json();

                console.log('TODO CORRECTO, valores de vuelta: ', data)
                updateSuccessToast(toastId, "Property updated correctly!");
                router.refresh();

            } catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        }, [id, initialValues]
    )

    const handleDelete = useCallback(
        async () => {
            const toastId = toast.loading("Deleting property...");
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties/${id}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while deleting a property');

                updateSuccessToast(toastId, "Property deleted correctly!");
                router.push('/private/properties')

            }catch (error: unknown) {
                console.error(error)
                if (error instanceof ApiCallError) {
                    updateErrorToast(toastId, error.message);
                } else {
                    updateErrorToast(toastId, "There was an unexpected error, contact admin");
                }
            }
        }, [id, router]
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
                        {initialValues.name}
                    </span>
                </div>
                {/* Cards with actions */}
                <div className='flex flex-row items-center gap-4'>
                    <SimpleLinkCard
                        href={`/private/documents?propertyId=${id}`}
                        text='Documents'
                        faIcon={faFileLines}
                    />
                    <SimpleLinkCard
                        href={`/private/accounting/${id}/incomes`}
                        text='AR Invoices'
                        faIcon={faReceipt}
                    />
                    <SimpleLinkCard
                        href={`/private/accounting/${id}/expenses`}
                        text='AP Invoices'
                        faIcon={faReceipt}
                    />
                </div>
                {/* Button toolbar */}
                <div className='flex flex-row self-center gap-4'>
                    <Button
                        elevated
                        onClick={() => router.refresh()}
                        type='button'
                        icon={faRefresh}
                        style='secondary'
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
            <PropertyFormInfo initialValues={initialValues} contactData={contactData} handleSubmit={handleSubmit} isLoading={isLoading} />
            <Tabs
                dataSource={[
                    {
                        children: <PropertiesOwnersDatagrid dataSource={initialValues} contactData={contactData} />,
                        icon: faUserGroup,
                        title: 'Owners'
                    },
                    {
                        children: <PropertySidePropertiesDatagrid dataSource={initialValues} />,
                        icon: faWarehouse,
                        title: 'Side properties'
                    },
                    {
                        children: <PropertyTextArea />,
                        icon: faNoteSticky,
                        title: 'Comments'
                    }
                ]}
            />
        </div>
    )
}

export default PropertyPage