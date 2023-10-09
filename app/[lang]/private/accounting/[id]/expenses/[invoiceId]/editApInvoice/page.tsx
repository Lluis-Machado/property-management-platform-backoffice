// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { getApiData } from '@/lib/utils/getApiData';
import { EditApInvoicePage } from '@/components/pages/accounting/expenses/editApInvoice/EditApInvoicePage';
import { ApInvoice } from '@/lib/types/apInvoice';

interface Props {
    params: { id: string; invoiceId: string };
}

const EditApInvoice: any = async ({ params: { id, invoiceId } }: Props) => {
    const [apInvoiceData, tenatsBusinessPartners] = await Promise.all([
        getApiData<ApInvoice>(
            `/accounting/tenants/${id}/apinvoices/${invoiceId}`,
            'Error while getting Ap invoice info'
        ),
        getApiData<BusinessPartners[]>(
            `/accounting/tenants/b99f942c-a141-4555-9554-14a09c5f94a4/businessPartners`,
            'Error while getting Business Partners info'
        ),
    ]);

    return (
        <>
            <Breadcrumb />
            <EditApInvoicePage
                id={id}
                invoiceId={invoiceId}
                apInvoiceData={apInvoiceData}
                tenatsBusinessPartners={tenatsBusinessPartners}
            />
        </>
    );
};
export default EditApInvoice;
