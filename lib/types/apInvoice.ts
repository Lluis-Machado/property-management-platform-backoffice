export interface ApInvoice {
    businessPartnerId: string;
    // businessPartnerName: string;
    // businessPartnerVatNumber: string;
    refNumber: string;
    date: string;
    currency: string;
    totalAmount: number;
    totalBaseAmount: number;
    totalTax: number;
    totalTaxPercentage: number;
    invoiceLines: InvoiceLines[];
    vatNumber?: string;
}
export interface ApInvoiceAnalyzedData {
    form: ApInvoice;
}

interface InvoiceLines {
    description: string;
    tax: string | null;
    quantity: Number;
    unitPrice: Number;
    expenseCategoryId: string | null;
    depreciationRatePerYear: string | null;
    serviceDateFrom: string | null;
    serviceDateTo: string | null;
}
