// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { TokenRes } from '@/lib/types/token';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';
import { EditApInvoicePage } from '@/components/pages/accounting/expenses/editApInvoice/EditApInvoicePage';

interface Props {
    params: { id: string };
    token: TokenRes;
}

const EditApInvoice: any = async ({ params: { id }, token }: Props) => {
    const [user, tenatsBusinessPartners] = await Promise.all([
        getUser(),
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
                token={user.token}
                tenatsBusinessPartners={tenatsBusinessPartners}
            />
        </>
    );
};
export default EditApInvoice;
