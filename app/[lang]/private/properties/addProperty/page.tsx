// Local imports
import AddPropertyPage from '@/components/pages/properties/property/addPropertyPage';
import { PropertyInterface } from '@/lib/types/propertyInfo';
import { ApiCallError } from '@/lib/utils/errors';

const initialValues: PropertyInterface = {
    name: "",
    type: "",
    typeOfUse: [
        0
    ],
    address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    },
    cadastreRef: "",
    comments: "",
    mainContact: {
        firstName: "",
        lastName: "",
        id: ""
    },
    ownerships: [
        {
            id: "",
            contactId: "",
            propertyId: "",
            mainOwnership: true,
            contactDetail: {
                firstName: "",
                lastName: "",
                id: ""
            },
            share: 100,
            deleted: false
        }
    ],
    parentProperty: "",
    id: "",
    childProperties: [],
};
async function getContacts() {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/contacts/contacts`, { cache: 'no-cache' })
    if (!resp.ok) throw new ApiCallError('Error while getting property info');
    return resp.json()
}

const AddProperty = async (): Promise<React.ReactElement> => {
    const contactData = await getContacts();
    return (
        <AddPropertyPage initialValues={initialValues} contactData={contactData} />
    )
};

export default AddProperty;