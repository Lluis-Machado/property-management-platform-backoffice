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
        value: undefined,
    },
    cadastreNumber: '',
    cadastreRef: '',
    cadastreUrl: '',
    cadastreValue: '',
    comments: '',
    contactPersonId: '',
    federalState: '',
    furniturePrice: {
        currency: '',
        value: undefined,
    },
    furniturePriceIVA: {
        currency: '',
        value: undefined,
    },
    furniturePriceTPO: {
        currency: '',
        value: undefined,
    },
    garbageCollection: null,
    garbagePriceAmount: null,
    ibiAmount: '',
    ibiCollection: null,
    id: '',
    loanPrice: {
        currency: '',
        value: undefined,
    },
    mainOwnerId: '',
    mainPropertyId: null,
    municipality: '',
    name: '',
    plotPrice: {
        currency: '',
        value: undefined,
    },
    propertyAddress: [
        {
            addressLine1: '',
            addressLine2: '',
            city: '',
            country: null,
            postalCode: '',
            state: null,
        },
    ],
    propertyScanMail: '',
    purchaseDate: null,
    purchasePrice: {
        currency: '',
        value: undefined,
    },
    purchasePriceAJD: {
        currency: '',
        value: undefined,
    },
    purchasePriceTPO: {
        currency: '',
        value: undefined,
    },
    purchasePriceTax: {
        currency: '',
        value: undefined,
    },
    purchasePriceTotal: {
        currency: '',
        value: undefined,
    },
    saleDate: null,
    salePrice: {
        currency: '',
        value: undefined,
    },
    totalPrice: {
        currency: '',
        value: undefined,
    },
    type: '',
    typeOfUse: null,
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
