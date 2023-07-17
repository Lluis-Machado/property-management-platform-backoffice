interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

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