export interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: number | null;
    postalCode: string;
    country: number | null;
    addressType: number | null;
    shortComment: string;
}
