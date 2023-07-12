// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { PropertyCreate } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';

const initialValues: PropertyCreate = {
    name: "",
    type: "",
    typeOfUse: [0],
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
    mainOwnerId: "",
    mainOwnerType: "Contact",
    parentPropertyId: null,
    childProperties: [],
};

interface Props {
    params: { lang: Locale }
};

const AddProperty = async () => {
    const contactData = await getApiData('/contacts/contacts', 'Error while getting contacts');

    return (
        <>
            <Breadcrumb />
            <AddPropertyPage initialValues={initialValues} contactData={contactData} />
        </>
    )
};

export default AddProperty;