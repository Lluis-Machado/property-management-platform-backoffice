import { Address } from './address';

export interface PropertyCreate {
    name: string;
    type: string;
    typeOfUse: number[];
    address: Address;
    cadastreRef: string;
    comments: string;
    mainOwnerId: string;
    mainOwnerType: string;
    childProperties: string[];
    parentPropertyId: string | null;
}

export interface PropertyData {
    name: string;
    type: string;
    typeOfUse: number[];
    address: Address;
    cadastreRef: string;
    cadastreUrl: string;
    comments: string;
    mainOwnerId: string;
    mainOwnerType: string;
    parentPropertyId: string;
    id: string;
}
