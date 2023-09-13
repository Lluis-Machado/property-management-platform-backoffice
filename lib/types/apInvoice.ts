export interface ApInvoice {
    businessPartner: {
        name: string;
        vatNumber: string;
    };
    refNumber: string;
    date: string;
    currency: string;
    invoiceLines: InvoiceLines[];
    totalAmount: Number;
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
