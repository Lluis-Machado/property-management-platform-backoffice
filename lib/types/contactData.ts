import { Address } from './address';
import { BankInformation } from './bankInformation';
import { Identification } from './identification';
import { Phone } from './phone';

export interface ContactData {
    addresses: Address[];
    archiveId?: string;
    bankInformation: BankInformation[];
    birthDay: string | null;
    birthPlace: string;
    email: string;
    firstName: string;
    gender: number | null;
    id?: string;
    identifications: Identification[];
    lastName: string;
    maritalStatus: number | null;
    phones: Phone[];
    title: number[];
}

export interface ContactDataProperty {
    addresses: Address[];
    bankInformation: BankInformation[];
    birthDay: string | null;
    birthPlace: string;
    email: string;
    firstName: string;
    gender: number | null;
    id?: string;
    identifications: Identification[];
    lastName: string;
    maritalStatus: number | null;
    phones: Phone[];
    title: number[];
    type: string;
}
