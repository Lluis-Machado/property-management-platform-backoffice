export interface ContactData {
    id: string;
    firstName: string;
    lastName: string;
    birthDay: string | null;
    nif: string;
    email: string;
    phoneNumber: string;
    mobilePhoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}