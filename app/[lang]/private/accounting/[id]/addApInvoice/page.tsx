// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddApInvoicePage from '@/components/pages/accounting/expenses/addApInvoice/AddApInvoicePage';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { TokenRes } from '@/lib/types/token';
import { getApiData } from '@/lib/utils/getApiData';
import { getUser } from '@/lib/utils/getUser';
interface Props {
    params: { id: string };
    token: TokenRes;
}

const AddApInvoice: any = async ({ params: { id }, token }: Props) => {
    const [user, businessPartners] = await Promise.all([
        getUser(),
        getApiData<BusinessPartners[]>(
            `/accounting/tenants/b99f942c-a141-4555-9554-14a09c5f94a4/businessPartners`,
            'Error while getting Business Partners info'
        ),
    ]);

    return (
        <>
            <Breadcrumb />
            <AddApInvoicePage
                id={id}
                token={user.token}
                businessPartners={businessPartners}
            />
        </>
    );
};
export default AddApInvoice;
