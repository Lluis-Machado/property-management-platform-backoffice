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
import { useState } from 'react';

const initialValues: PropertyData = {
    autonomousRegion: '',
    bedNumber: null,
    billingContactId: '',
    buildingPrice: {
        currency: '',
        value: 0,
    },
    cadastreNumber: '',
    cadastreRef: '',
    cadastreUrl: '',
    cadastreValue: {
        currency: '',
        value: 0,
    },
    comments: '',
    contactPersonId: '',
    federalState: '',
    garbageCollectionDate: '',
    garbagePriceAmount: {
        currency: '',
        value: 0,
    },
    ibiAmount: {
        currency: '',
        value: 0,
    },
    ibiCollectionDate: '',
    id: '',
    loanPrice: {
        currency: '',
        value: 0,
    },
    mainOwnerId: '',
    mainOwnerType: '',
    mainPropertyId: null,
    municipality: '',
    name: '',
    plotPrice: {
        currency: '',
        value: 0,
    },
    propertyAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: null,
        postalCode: '',
        country: null,
        addressType: null,
    },
    propertyScanMail: '',
    purchaseDate: null,
    purchasePriceNet: {
        currency: '',
        value: 0,
    },
    purchasePriceGross: {
        currency: '',
        value: 0,
    },
    purchasePriceAJDPercentage: null,
    purchasePriceAJD: {
        currency: '',
        value: 0,
    },
    purchasePriceTPOPercentage: 0,
    purchasePriceTPO: {
        currency: '',
        value: 0,
    },
    purchasePriceTaxPercentage: null,
    purchasePriceTax: {
        currency: '',
        value: 0,
    },
    purchasePriceTotal: {
        currency: '',
        value: 0,
    },
    priceTotal: {
        currency: '',
        value: 0,
    },
    furniturePrice: {
        currency: '',
        value: 0,
    },
    furniturePriceIVA: {
        currency: '',
        value: 0,
    },
    furniturePriceIVAPercentage: 21,
    furniturePriceTPO: {
        currency: '',
        value: 0,
    },
    furniturePriceTPOPercentage: 0,
    furniturePriceTotal: {
        currency: '',
        value: 0,
    },
    furniturePriceGross: {
        currency: '',
        value: 0,
    },
    saleDate: null,
    salePrice: {
        currency: '',
        value: 0,
    },
    totalPrice: {
        currency: '',
        value: 0,
    },
    type: '',
    typeOfUse: [],
    year: null,
};

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

    let contacts: SelectData[] = [];
    for (const contact of contactData) {
        contacts.push({
            label: `${contact.firstName} ${contact.lastName}`,
            id: contact.id as string,
            type: 'Contact',
        });
    }

    let companies: SelectData[] = [];
    for (const company of companyData) {
        companies.push({
            label: company.name,
            id: company.id as string,
            type: 'Company',
        });
    }
    const items = [...contacts, ...companies];

    return (
        <>
            <Breadcrumb />
            <AddPropertyPage
                propertyData={initialValues}
                properties={properties}
                contacts={contacts}
                countries={countriesData}
                token={user.token}
                lang={lang}
                items={items}
            />
        </>
    );
};

export default AddProperty;
