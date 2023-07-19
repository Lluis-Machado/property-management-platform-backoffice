import { Address } from './address';

export interface ContactData {
    id: string;
    firstName: string;
    lastName: string;
    birthDay: string | null;
    nif: string | null;
    email: string;
    phoneNumber: string;
    mobilePhoneNumber: string;
    address: Address;
}
