import { Address } from './address';
import { BankInformation } from './bankInformation';
import { CompanyContacts } from './companyContacts';

export interface CompanyData {
    addresses: Address[];
    archiveId?: string;
    bankInformation: BankInformation[];
    comments: string;
    companyPurpose: string;
    contacts: CompanyContacts[];
    countryMaskId: number;
    email: string;
    foundingDate: string | null;
    germanTaxOffice: string;
    id?: string;
    name: string;
    nif: string | null;
    phoneNumber: string;
    taxNumber: string;
    uStIDNumber: string;
}

export interface CompanyDataProperty {
    addresses: Address[];
    bankInformation: BankInformation[];
    comments: string;
    companyPurpose: string;
    contacts: CompanyContacts[];
    countryMaskId: number;
    email: string;
    firstName?: string;
    foundingDate: string | null;
    germanTaxOffice: string;
    id?: string;
    name: string;
    nif: string | null;
    phoneNumber: string;
    taxNumber: string;
    type: string;
    uStIDNumber: string;
}
