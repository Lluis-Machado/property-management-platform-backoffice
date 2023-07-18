// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { PropertyCreate } from '@/lib/types/propertyInfo';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

const initialValues: PropertyCreate = {
    name: '',
    type: '',
    typeOfUse: [0],
    address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: null,
        postalCode: '',
        country: null,
    },
    cadastreRef: '',
    comments: '',
    mainOwnerId: '',
    mainOwnerType: 'Contact',
    parentPropertyId: null,
    childProperties: [],
};

interface Props {
    params: { lang: Locale };
}

const AddProperty = async ({ params: { lang } }: Props) => {
    const [user, contactData, countriesData] = await Promise.all([
        getUser(),
        getApiData('/contacts/contacts', 'Error while getting contacts'),
        getApiData(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);

    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            value: contact.id,
        });
    }

    return (
        <>
            <Breadcrumb />
            <AddPropertyPage
                propertyData={initialValues}
                contacts={contacts}
                countries={countriesData}
                token={user.token}
                lang={lang}
            />
        </>
    );
};

export default AddProperty;
