// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { TokenRes } from '@/lib/types/token';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';
import { EditApInvoicePage } from '@/components/pages/accounting/expenses/editApInvoice/EditApInvoicePage';
import { ApInvoice } from '@/lib/types/apInvoice';

interface Props {
    params: { id: string; invoiceId: string };
    token: TokenRes;
}

const EditApInvoice: any = async ({
    params: { id, invoiceId },
    token,
}: Props) => {
    console.log(invoiceId);
    const [user, apInvoiceData, tenatsBusinessPartners] = await Promise.all([
        getUser(),
        getApiData<ApInvoice>(
            `/accounting/tenants/${id}/apinvoices/${invoiceId}`,
            'Error while getting Ap invpice info'
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
                token={user.token}
                apInvoiceData={apInvoiceData}
                tenatsBusinessPartners={tenatsBusinessPartners}
            />
        </>
    );
};
export default EditApInvoice;
