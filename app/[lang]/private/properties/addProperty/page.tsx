// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddPropertyPage from '@/components/pages/properties/AddPropertyPage';
import { Locale } from '@/i18n-config';
import { ContactData } from '@/lib/types/contactData';
import { CountryData } from '@/lib/types/countriesData';
import { PropertyData } from '@/lib/types/propertyInfo';
import { SelectData } from '@/lib/types/selectData';
import { getApiData } from '@/lib/utils/getApiData';
import { getApiDataWithCache } from '@/lib/utils/getApiDataWithCache';
import { getUser } from '@/lib/utils/getUser';

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
    cadastreValue: '',
    comments: '',
    contactPersonId: '',
    federalState: '',
    garbageCollection: null,
    garbagePriceAmount: null,
    ibiAmount: '',
    ibiCollection: null,
    id: '',
    loanPrice: {
        currency: '',
        value: 0,
    },
    mainOwnerId: '',
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
    purchasePriceTPOPercentage: null,
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
    furniturePriceIVAPercentage: 0,
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
    const [user, contactData, countriesData] = await Promise.all([
        getUser(),
        getApiData<ContactData[]>(
            '/contacts/contacts',
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
            value: contact.id as string,
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
