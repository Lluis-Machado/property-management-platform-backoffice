"use client"
// React imports

// Libraries imports
import { Tabs } from "pg-components";

// Local imports
import PropertyFormInfo from "@/components/forms/propertyFormInfo/PropertyFormInfo"
import { PropertyFormInterface } from "@/lib/types/propertyInfo";
import PropertiesOwnersDatagrid from "./PropertiesOwnersDatagrid";
import data from "./data.json"
import PropertyTextArea from "@/components/textArea/PropertyTextArea";
import { faFileLines, faNoteSticky, faReceipt, faUserGroup, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    id: string;
};

const PropertyWrapper = ({id} : Props) : React.ReactElement => {

    const initialValues: PropertyFormInterface = {
        name: 'Villa Sonnenschein',
        type: 'Apartment',
        catastralRef: '13 077 A 018 00039 0000 FP',
        mainContact: 'Sr. Schaller',
        addressLine1: 'Calle...',
        city: 'Palma',
        state: 'Illes Balears',
        postalCode: '07010',
        country: 'España',
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
            <PropertyFormInfo initialValues={initialValues} />
            <Tabs
                dataSource={[
                    {
                        children: <PropertiesOwnersDatagrid dataSource={data} />,
                        icon: faUserGroup,
                        title: 'Owners'
                    },
                    {
                        children: <div>Side properties</div>,
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