export interface Identification {
    type: number | null;
    number: string;
    emissionDate?: string | null;
    expirationDate?: string | null;
    shortComment?: string;
}
