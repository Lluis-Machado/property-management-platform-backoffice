import { Address } from './address';

export interface CompanyData {
    id?: string;
    name: string;
    nif: string | null;
    email: string;
    phoneNumber: string;
    addresses: Address[];
    germanTaxOffice: string;
    companyPurpose: string;
    taxNumber: string;
    uStIDNumber: string;
    foundingDate: string | null;
}
