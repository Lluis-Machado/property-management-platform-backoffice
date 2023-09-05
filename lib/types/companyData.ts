import { Address } from './address';
import { BankInformation } from './bankInformation';
import { CompanyContacts } from './companyContacts';

export interface CompanyData {
    id?: string;
    name: string;
    nif: string | null;
    email: string;
    germanTaxOffice: string;
    countryMaskId: number;
    phoneNumber: string;
    comments: string;
    companyPurpose: string;
    taxNumber: string;
    uStIDNumber: string;
    foundingDate: string | null;
    addresses: Address[];
    contacts: CompanyContacts[];
    bankInformation: BankInformation[];
}

export interface CompanyDataProperty {
    id?: string;
    firstName?: string;
    name: string;
    nif: string | null;
    email: string;
    germanTaxOffice: string;
    countryMaskId: number;
    phoneNumber: string;
    comments: string;
    companyPurpose: string;
    taxNumber: string;
    uStIDNumber: string;
    foundingDate: string | null;
    addresses: Address[];
    contacts: CompanyContacts[];
    bankInformation: BankInformation[];
}
