// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { CompanyData } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { PropertyData } from '@/lib/types/propertyInfo';
import { SelectData } from '@/lib/types/selectData';
import { sortByProperty } from '@/lib/utils/sortByProperty';
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
    sortByProperty(properties, 'name');

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
    sortByProperty(contacts, 'label');

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
    sortByProperty(totalContactsList, 'label');

    return (
        <>
            <Breadcrumb />
            <AddPropertyPage
                properties={properties}
                contacts={contacts}
                countries={countriesData}
                lang={lang}
                totalContactsList={totalContactsList}
            />
        </>
    );
};

export default AddProperty;
