import { Address } from './address';
export interface PropertyData {
    archiveId?: string;
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
    furniturePrice: Price;
    furniturePriceGross: Price;
    furniturePriceIVA: Price;
    furniturePriceIVAPercentage: number;
    furniturePriceTotal: Price;
    furniturePriceTPO: Price;
    furniturePriceTPOPercentage: number;
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
    priceTotal: Price;
    propertyAddress: Address;
    propertyScanMail: string;
    purchaseDate: string | null;
    purchasePriceAJD: Price;
    purchasePriceAJDPercentage: number | null;
    purchasePriceGross: Price;
    purchasePriceNet: Price;
    purchasePriceTax: Price;
    purchasePriceTaxPercentage: number | null;
    purchasePriceTotal: Price;
    purchasePriceTPO: Price;
    purchasePriceTPOPercentage: number | null;
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
