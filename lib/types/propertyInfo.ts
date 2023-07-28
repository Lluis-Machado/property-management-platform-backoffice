import { Address } from './address';

export interface PropertyCreate {
    name: string;
    type: string;
    typeOfUse: number;
    address: Address[];
    cadastreRef: string;
    comments: string;
    billingContactId: string;
    contactPersonId: string;
    mainOwnerType: string;
    childProperties: string[];
    parentPropertyId: string | null;
}

export interface PropertyData {
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
    mainPropertyId: string;
    municipality: string;
    name: string;
    plotPrice: Price[];
    propertyAddress: Address[];
    propertyScanMail: string;
    purchaseDate: Date;
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

interface Price {
    currency?: string;
    value: number;
}
