import { Address } from './address';

export interface PropertyCreate {
    autonomousRegion: string;
    bedNumber: number;
    billingContactId: string;
    buildingPrice: Price[];
    cadastreNumber: string;
    cadastreRef: string;
    cadastreUrl: string;
    cadastreValue: string;
    comments: string;
    contactPersonId: string;
    federalState: string;
    furniturePrice: Price[];
    furniturePriceIVA: Price[];
    furniturePriceTPO: Price[];
    garbageCollection: number;
    garbagePriceAmount: number;
    ibiAmount: string;
    ibiCollection: number;
    id: string;
    loanPrice: Price[];
    mainPropertyId: string | null;
    municipality: string;
    name: string;
    plotPrice: Price[];
    propertyAddress: Address[];
    propertyScanMail: string;
    purchaseDate: Date | undefined;
    purchasePrice: Price[];
    purchasePriceAJD: Price[];
    purchasePriceTPO: Price[];
    purchasePriceTax: Price[];
    purchasePriceTotal: Price[];
    saleDate: Date;
    salePrice: Price[];
    totalPrice: Price[];
    type: string;
    typeOfUse: number;
    year: number;
}

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
    furniturePrice: Price;
    furniturePriceIVA: Price;
    furniturePriceTPO: Price;
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
    propertyAddress: Address[];
    propertyScanMail: string;
    purchaseDate: string | null;
    purchasePrice: Price;
    purchasePriceAJD: Price;
    purchasePriceTPO: Price;
    purchasePriceTax: Price;
    purchasePriceTotal: Price;
    saleDate: string | null;
    salePrice?: Price;
    totalPrice?: Price;
    type: string;
    typeOfUse: number | null[];
    year?: number | null;
}

interface Price {
    currency?: string;
    value?: number | undefined;
}
