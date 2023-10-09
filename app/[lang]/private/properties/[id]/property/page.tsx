// local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PropertyPage from '@/components/pages/properties/property/PropertyPage';
import { Locale } from '@/i18n-config';
import { CompanyData, CompanyDataProperty } from '@/lib/types/companyData';
import { ContactData, ContactDataProperty } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { PropertyData } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';

interface Props {
    params: { lang: Locale; id: string };
}

const Property = async ({ params: { id, lang } }: Props) => {
    const [
        propertyData,
        propertiesData,
        contactData,
        companyData,
        ownershipData,
        countriesData,
    ] = await Promise.all([
        getApiData<PropertyData>(
            `/properties/properties/${id}`,
            'Error while getting property info'
        ),
        getApiData<PropertyData[]>(
            `/properties/properties/`,
            'Error while getting properties info'
        ),
        getApiData<ContactData[]>(
            '/contacts/contacts',
            'Error while getting contacts'
        ),
        getApiData<CompanyData[]>(
            '/companies/companies?includeDeteted=false',
            'Error while getting contacts'
        ),
        getApiData<OwnershipPropertyData[]>(
            `/ownership/ownership/${id}/property`,
            'Error while getting ownerships'
        ),
        getApiDataWithCache<CountryData[]>(
            `/countries/countries?languageCode=${lang}`,
            'Error while getting countries'
        ),
    ]);
    // Sort properties alphabetical
    let propertiesSorted = propertiesData.slice(0);
    propertiesSorted.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    // Get states
    let statesData: StateData[] = [];
    if (propertyData.propertyAddress.country) {
        statesData = await getApiDataWithCache(
            `/countries/countries/${propertyData.propertyAddress.country}/states?languageCode=${lang}`,
            'Error while getting states'
        );
    }

    // Add contact type to contacts
    let contacts: ContactDataProperty[] = [];
    for (const contact of contactData) {
        contacts.push({
            ...contact,
            firstName: `${contact.firstName} ${contact.lastName}`,
            type: 'Contact',
        });
    }

    // Sort contacts alphabetical
    let contactsListSorted = contacts.slice(0);
    contactsListSorted.sort(function (a, b) {
        var x = a.firstName!.toLowerCase();
        var y = b.firstName!.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    // Add contact type to companies
    let companieslist: CompanyDataProperty[] = [];
    for (const company of companyData) {
        companieslist.push({
            ...company,
            firstName: company.name,
            type: 'Company',
        });
    }

    const totalContactsList = [...contacts, ...companieslist];

    // Sort all contacts alphabetical
    let totalContactsListSorted = totalContactsList.slice(0);
    totalContactsListSorted.sort(function (a, b) {
        var x = a.firstName!.toLowerCase();
        var y = b.firstName!.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    return (
        <>
            <Breadcrumb />
            <PropertyPage
                propertyData={propertyData}
                propertiesData={propertiesSorted}
                totalContactsList={totalContactsListSorted}
                lang={lang}
                contacts={contactsListSorted}
                ownershipData={ownershipData}
                countries={countriesData}
                initialStates={statesData}
            />
        </>
    );
};

export default Property;
