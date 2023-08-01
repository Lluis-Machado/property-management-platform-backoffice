import { Address } from './address';

export interface ContactData {
    id?: string;
    firstName: string;
    lastName: string;
    birthPlace: string;
    birthDay: string | null;
    nif: string | null;
    email: string;
    phoneNumber: string;
    mobilePhoneNumber: string;
    addresses: Address[];
    maritalStatus: number;
    nifExpirationDate: string | null;
    passportExpirationDate: string | null;
    passportNumber: string;
    socialSecurityNumber: string;
    taxId: string;
    scanMail: string;
    secondaryEmail: string;
    otherPhoneNumber: string;
    faxNumber: string;
}
