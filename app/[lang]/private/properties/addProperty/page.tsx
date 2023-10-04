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

interface Props {
    params: { lang: Locale };
}

const AddProperty = async ({ params: { lang } }: Props) => {
    const [properties, contactData, companyData, countriesData] =
        await Promise.all([
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

    // Sort properties alphabetical
    let propertiesSorted = properties.slice(0);
    propertiesSorted.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    // Add contact type to contacts
    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            id: contact.id as string,
            type: 'Contact',
        });
    }

    // Sort contacts alphabetical
    let contactsSorted = contacts.slice(0);
    contactsSorted.sort(function (a, b) {
        var x = a.label.toLowerCase();
        var y = b.label.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    // Add contact type to companies
    let companies: SelectData[] = [];
    for (const company of companyData) {
        companies.push({
            label: company.name,
            id: company.id as string,
            type: 'Company',
        });
    }
    const totalContactsList = [...contacts, ...companies];

    // Sort all contacts alphabetical
    let totalContactsListsorted = totalContactsList.slice(0);
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
                lang={lang}
                totalContactsList={totalContactsListsorted}
            />
        </>
    );
};

export default AddProperty;
