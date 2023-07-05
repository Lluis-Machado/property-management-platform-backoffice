"use client"
// React imports

// Libraries imports
import { Tabs } from "pg-components";
import { faFileLines, faNoteSticky, faReceipt, faUserGroup, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Local imports
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo"
import { PropertyInterface } from "@/lib/types/propertyInfo";
import PropertiesOwnersDatagrid from "./PropertiesOwnersDatagrid";
import PropertyTextArea from "@/components/textArea/PropertyTextArea";
import PropertySidePropertiesDatagrid from "./PropertySidePropertiesDatagrid";
import { FormikHelpers } from "formik";
interface Props {
    id: string;
    data: any;
};

const PropertyWrapper = ({ id, data }: Props): React.ReactElement => {
    const handleSubmit = async (
        values: PropertyInterface,
        { setSubmitting }: FormikHelpers<PropertyInterface>
    ) => {
        const res = await fetch(`https://stage.plattesapis.net/properties/properties/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "name": values.name,
                "type": values.type,
                "typeOfUse": [
                  data.typeOfUse
                ],
                "address": {
                    "addressLine1": values.address.addressLine1,
                    "addressLine2": values.address.addressLine2,
                    "city": values.address.city,
                    "state": values.address.state,
                    "postalCode": values.address.postalCode,
                    "country": values.address.country
                },
                "cadastreRef": values.cadastreRef,
                "comments": data.comments,
                "ownerships": [
                  {
                    "id": data.ownerships[0].id,
                    "contactId": data.ownerships[0].contactId,
                    "propertyId": data.ownerships[0].propertyId,
                    "mainOwnership": data.ownerships[0].mainOwnership,
                    "share": data.ownerships[0].share
                  }
                ]
              }),
        })
        await res.json();
        setSubmitting(false);
    };

    return (
        <>
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
            <PropertyFormInfo initialValues={data} handleSubmit={handleSubmit} />
            <Tabs
                dataSource={[
                    {
                        children: <PropertiesOwnersDatagrid dataSource={data} />,
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
                        title: 'Notes'
                    }
                ]}
            />
        </>
    )
}

export default PropertyWrapper