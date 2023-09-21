// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { PropertyData } from '@/lib/types/propertyInfo';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale };
}

const AddProperty = async ({ params: { lang } }: Props) => {
    const [user, properties, contactData, companyData, countriesData] =
        await Promise.all([
            getUser(),
            getApiData<PropertyData[]>(
                `/properties/properties/`,
                'Error while getting properties info'
            ),
            getApiData<ContactData[]>(
                '/contacts/contacts',
                'Error while getting companies'
            ),
            getApiData<CompanyData[]>(
                '/companies/companies?includeDeteted=false',
                'Error while getting contacts'
            ),
            getApiDataWithCache<CountryData[]>(
                `/countries/countries?languageCode=${lang}`,
                'Error while getting countries'
            ),
        ]);

    let propertiesSorted = properties.slice(0);
    propertiesSorted.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            id: contact.id as string,
            type: 'Contact',
        });
    }

    let contactsSorted = contacts.slice(0);
    contactsSorted.sort(function (a, b) {
        var x = a.label.toLowerCase();
        var y = b.label.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    let companies: SelectData[] = [];
    for (const company of companyData) {
        companies.push({
            label: company.name,
            id: company.id as string,
            type: 'Company',
        });
    }
    const totalContactsList = [...contacts, ...companies];

    var totalContactsListsorted = totalContactsList.slice(0);
    totalContactsListsorted.sort(function (a, b) {
        var x = a.label.toLowerCase();
        var y = b.label.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    return (
        <>
            <Breadcrumb />
            <AddPropertyPage
                properties={propertiesSorted}
                contacts={contactsSorted}
                countries={countriesData}
                token={user.token}
                lang={lang}
                totalContactsList={totalContactsListsorted}
            />
        </>
    );
};

export default AddProperty;
