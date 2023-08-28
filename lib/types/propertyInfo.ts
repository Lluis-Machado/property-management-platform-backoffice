import { Address } from './address';
export interface PropertyData {
    autonomousRegion: string;
    bedNumber: number | null;
    billingContactId: string;
    buildingPrice?: Price;
    cadastreNumber: string;
    cadastreRef: string;
    cadastreUrl: string;
    cadastreValue: string;
    comments?: string;
    contactPersonId: string;
    federalState: string;
    garbageCollection: number | null;
    garbagePriceAmount: number | null;
    ibiAmount: string;
    ibiCollection: number | null;
    id: string;
    loanPrice: Price;
    mainOwnerId: string;
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
    salePrice?: Price;
    totalPrice?: Price;
    type: string;
    typeOfUse: number[];
    year?: number | null;
}

interface Price {
    currency?: string;
    value: number;
}
