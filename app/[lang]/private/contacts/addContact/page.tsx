// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddContactPage from '@/components/pages/contacts/AddContactPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';

const initialValues: ContactData = {
    id: '',
    firstName: '',
    lastName: '',
    birthDay: null,
    nif: '',
    email: '',
    phoneNumber: '',
    mobilePhoneNumber: '',
    address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    }
}

interface Props {
    params: { lang: Locale }
};

const AddContact = async ({ params: { lang } }: Props) => {
    const user = await getUser();
    const countriesData: CountryData[] = await getApiData(`/countries/countries?languageCode=${lang}`, 'Error while getting contacts');

    let countries: SelectData[] = [];
    for (const country of countriesData) {
        countries.push({
            label: `${country.name} - ${country.countryCode}`,
            value: country.id
        })
    }

    return (
        <>
            <Breadcrumb />
            <AddContactPage
                contactData={initialValues}
                countries={countries}
                lang={lang}
                token={user.token}
            />
        </>
    )
};

export default AddContact