'use client'
// React imports
import { useCallback, useState } from "react";

// Libraries imports
import { Alert, Button, Tabs } from "pg-components";
import { faFileLines, faNoteSticky, faReceipt, faUserGroup, faWarehouse, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormikHelpers } from "formik";
import { useRouter } from 'next/navigation';

// Local imports
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo"
import { PropertyInterface } from "@/lib/types/propertyInfo";
import PropertiesOwnersDatagrid from "./PropertiesOwnersDatagrid";
import PropertyTextArea from "@/components/textArea/PropertyTextArea";
import PropertySidePropertiesDatagrid from "./PropertySidePropertiesDatagrid";
import { AlertConfig } from "../../contacts/ContactPage";
import { ApiCallError } from "@/lib/utils/errors";
import ConfirmDeletePopup from "@/components/popups/ConfirmDeletePopup";
import { ContactData } from "@/lib/types/contactData";

interface Props {
    id: string;
    data: PropertyInterface;
    contactData: ContactData[];
};

const PropertyWrapper = ({ id, data, contactData }: Props): React.ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const router = useRouter();

    const handleSubmit = useCallback(
        async (values: PropertyInterface, { setSubmitting }: FormikHelpers<PropertyInterface>) => {
            console.log("Valores a enviar: ", values)
            if (values === data) {
                setAlertConfig({
                    isVisible: true,
                    type: 'warning',
                    message: 'Change at least one field'
                })
                return;
            }
            setIsLoading(true)
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

                setAlertConfig({
                    isVisible: true,
                    type: 'success',
                    message: 'Property updated correctly!'
                })

            } catch (error) {
                console.error(error)
                setAlertConfig({
                    isVisible: true,
                    type: 'danger',
                    message: 'CHECK CONSOLE'
                })
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        }, [data, id]
    )
    const handleDelete = useCallback(
        async () => {
            try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties/${id}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    }
                )

                if (!resp.ok) throw new ApiCallError('Error while deleting a property');

                setAlertConfig({
                    isVisible: true,
                    type: 'success',
                    message: 'Property deleted correctly!'
                })

                router.push('/private/properties/')
            } catch (error) {
                console.error(error)
                setAlertConfig({
                    isVisible: true,
                    type: 'danger',
                    message: 'CHECK CONSOLE'
                })
            }
        }, [id, router]
    )
    const onAlertHiding = useCallback(
        () => {
            setAlertConfig({
                ...alertConfig,
                isVisible: false,
            });
        }, [alertConfig]
    )

    return (
        <>
            <ConfirmDeletePopup
                message='Are you sure you want to delete this property?'
                isVisible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={handleDelete}
            />
            <div className='absolute right-8'>
                <Alert
                    body={alertConfig.message}
                    isVisible={alertConfig.isVisible}
                    onHidden={onAlertHiding}
                    type={alertConfig.type}
                    duration={3000}
                />
            </div>
            <div className="flex justify-between">
                <div></div>
                <div className="flex justify-center">
                    <div className="flex gap-4">
                        <Link href={`/private/documents?propertyId=${id}`} className="flex gap-2 items-center border-2 rounded-md p-2">
                            <FontAwesomeIcon
                                icon={faFileLines}
                                className='text-primary-500 row-focused-state hover:scale-125 transition-transform'
                            />
                            <p className="text-secondary-500">Documents</p>
                        </Link>

                        <Link href={`/private/accounting/${id}/incomes`} className="flex gap-2 items-center border-2 rounded-md p-2">
                            <FontAwesomeIcon
                                icon={faReceipt}
                                className='text-primary-500 row-focused-state hover:scale-125 transition-transform'
                            />
                            <p className="text-secondary-500"> AR Invoices</p>
                        </Link>
                        <Link href={`/private/accounting/${id}/expenses`} className="flex gap-2 items-center border-2 rounded-md p-2">
                            <FontAwesomeIcon
                                icon={faReceipt}
                                className='text-primary-500 row-focused-state hover:scale-125 transition-transform'
                            />
                            <p className="text-secondary-500"> AP Invoices</p>
                        </Link>
                    </div>
                </div>
                <div className='w-10 mr-4'>
                    <Button
                        elevated
                        onClick={() => setConfirmationVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='outline'
                    />
                </div>
            </div>
            <PropertyFormInfo initialValues={data} contactData={contactData} handleSubmit={handleSubmit} isLoading={isLoading} />
            <Tabs
                dataSource={[
                    {
                        children: <PropertiesOwnersDatagrid dataSource={data} contactData={contactData} />,
                        icon: faUserGroup,
                        title: 'Owners'
                    },
                    {
                        children: <PropertySidePropertiesDatagrid dataSource={data} />,
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
        </>
    )
}

export default PropertyWrapper