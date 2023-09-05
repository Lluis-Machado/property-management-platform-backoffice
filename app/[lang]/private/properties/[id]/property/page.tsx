// local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PropertyPage from '@/components/pages/properties/property/PropertyPage';
import { Locale } from '@/i18n-config';
import { CompanyData, CompanyDataProperty } from '@/lib/types/companyData';
import { ContactData } from '@/lib/types/contactData';
import { CountryData, StateData } from '@/lib/types/countriesData';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { PropertyData } from '@/lib/types/propertyInfo';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { lang: Locale; id: string };
}

const Property = async ({ params: { id, lang } }: Props) => {
    const [
        user,
        propertyData,
        propertiesData,
        contactData,
        companyData,
        ownershipData,
        countriesData,
    ] = await Promise.all([
        getUser(),
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

    let statesData: StateData[] = [];
    if (propertyData.propertyAddress.country) {
        statesData = await getApiDataWithCache(
            `/countries/countries/${propertyData.propertyAddress.country}/states?languageCode=${lang}`,
            'Error while getting states'
        );
    }

    let contacts: ContactData[] = [];
    for (const contact of contactData) {
        contacts.push({
            ...contact,
            firstName: `${contact.firstName} ${contact.lastName}`,
        });
    }

    let companieslist: CompanyDataProperty[] = [];
    for (const company of companyData) {
        companieslist.push({
            ...company,
            firstName: company.name,
        });
    }

    const contactList = [...contacts, ...companieslist];

    return (
        <>
            <Breadcrumb />
            <PropertyPage
                propertyData={propertyData}
                propertiesData={propertiesData}
                contactList={contactList}
                lang={lang}
                token={user.token}
                contacts={contacts}
                ownershipData={ownershipData}
                countries={countriesData}
                initialStates={statesData}
            />
        </>
    );
};

export default Property;
