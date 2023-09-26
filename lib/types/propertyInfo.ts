import { Address } from './address';
export interface PropertyData {
    autonomousRegion: string;
    bedNumber: number | null;
    billingContactId: string | null;
    buildingPrice: Price;
    cadastreNumber: string;
    cadastreRef: string;
    cadastreUrl: string;
    cadastreValue: Price;
    comments?: string;
    contactPersonId: string | null;
    federalState: string;
    garbageCollection: number;
    garbageCollectionDate: string | null;
    garbagePriceAmount: Price;
    ibiAmount: Price;
    ibiCollection: number;
    ibiCollectionDate: string | null;
    id: string;
    loanPrice: Price;
    mainOwnerId: string | null;
    mainOwnerType: string | null;
    mainPropertyId: string | null;
    municipality: string;
    name: string;
    plotPrice: Price;
    propertyAddress: Address;
    propertyScanMail: string;
    purchaseDate: string | null;
    purchasePriceNet: Price;
    purchasePriceGross: Price;
    purchasePriceAJD: Price;
    purchasePriceAJDPercentage: number | null;
    purchasePriceTPO: Price;
    purchasePriceTPOPercentage: number | null;
    purchasePriceTax: Price;
    purchasePriceTaxPercentage: number | null;
    purchasePriceTotal: Price;
    priceTotal: Price;
    furniturePrice: Price;
    furniturePriceIVA: Price;
    furniturePriceIVAPercentage: number;
    furniturePriceTPO: Price;
    furniturePriceTPOPercentage: number;
    furniturePriceTotal: Price;
    furniturePriceGross: Price;
    saleDate: string | null;
    salePrice: Price;
    totalPrice: Price;
    type: number | null;
    typeOfUse: number[];
    year: number | null;
}

interface Price {
    currency?: string;
    value: number;
}
