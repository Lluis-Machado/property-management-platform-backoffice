export interface Address {
    addressLine1: string;
    addressLine2: string;
    addressType?: string;
    city: string;
    country: number | null;
    postalCode: string;
    state: number | null;
}
