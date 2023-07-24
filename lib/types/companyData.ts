import { Address } from './address';

export interface CompanyData {
    id: string;
    name: string;
    nif: string | null;
    email: string;
    phoneNumber: string;
    address: Address;
    tenantId: string;
    createdAt: string;
    lastUpdateAt: string;
    createdByUser: string;
    lastUpdateByUser: string;
    deleted: boolean;
}

export interface CompanyCreate {
    name: string;
    nif: string | null;
    email: string;
    phoneNumber: string;
}
