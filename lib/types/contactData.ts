import { Address } from './address';
import { Identification } from './identification';
import { Phone } from './phone';

export interface ContactData {
    id?: string;
    title: number | null;
    firstName: string;
    lastName: string;
    gender: number | null;
    birthPlace: string;
    birthDay: string | null;
    maritalStatus: number | null;
    identifications: Identification[];
    addresses: Address[];
    phones: Phone[];
    email: string;
    iban: string;
}
