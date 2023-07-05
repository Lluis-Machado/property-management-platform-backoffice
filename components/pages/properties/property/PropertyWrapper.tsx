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
    data: PropertyInterface;
};

const PropertyWrapper = ({ id, data }: Props): React.ReactElement => {
    const handleSubmit = async (
        values: PropertyInterface,
        { setSubmitting }: FormikHelpers<PropertyInterface>
    ) => {
        console.log(values)
        const res = await fetch(`https://stage.plattesapis.net/properties/properties/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                ...values
            })
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