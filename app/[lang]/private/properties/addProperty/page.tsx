// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
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
        state: '',
        postalCode: '',
        country: '',
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
    const user = await getUser();
    const contactData: ContactData[] = await getApiData(
        '/contacts/contacts',
        'Error while getting contacts'
    );
    const countriesData: CountryData[] = await getApiData(
        `/countries/countries?languageCode=${lang}`,
        'Error while getting contacts'
    );

    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            value: contact.id,
        });
    }

    let countries: SelectData[] = [];
    for (const country of countriesData) {
        countries.push({
            label: `${country.name} - ${country.countryCode}`,
            value: country.id,
        });
    }

    return (
        <>
            <Breadcrumb />
            <AddPropertyPage
                propertyData={initialValues}
                contacts={contacts}
                countries={countries}
                token={user.token}
                lang={lang}
            />
        </>
    );
};

export default AddProperty;
