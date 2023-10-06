export interface ApInvoice {
    businessPartnerId: string;
    businessPartnerName: string | null;
    vatNumber?: string | null;
    businessPartner: {
        id: string;
        name: string;
        vatNumber: string;
    };
    refNumber: string;
    date: string | null;
    currency: string;
    netAmount: number;
    grossAmount: number;
    totalTax: number;
    invoiceLines: InvoiceLines[];
    url?: string;
}
export interface ApInvoiceAnalyzedData {
    form: ApInvoice;
}

export interface InvoiceLines {
    description: string;
    tax: string | null;
    discount: string | null;
    quantity: Number;
    unitPrice: Number;
    totalPrice: Number;
    expenseCategory: {
        id: string | null;
        name: string | null;
        expenseTypeCode: string | null;
    };
    depreciationRatePerYear?: string | null;
    serviceDateFrom: string | null;
    serviceDateTo: string | null;
    fixedAsset: {} | null;
}
