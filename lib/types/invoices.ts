export interface Invoice {
    invoiceNumber: string;
    date: string;
    net: number;
    gross: number;
    serviceFromDate: string;
    serviceEndDate: string;
}
