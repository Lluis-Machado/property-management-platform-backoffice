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
    const [user, tenatsBusinessPartners, allBusinessPartners] =
        await Promise.all([
            getUser(),
            getApiData<BusinessPartners[]>(
                `/accounting/tenants/b99f942c-a141-4555-9554-14a09c5f94a4/businessPartners`,
                'Error while getting Business Partners info'
            ),
            getApiData<BusinessPartners[]>(
                `/accounting/businessPartners`,
                'Error while getting all Business Partners info'
            ),
        ]);

    return (
        <>
            <Breadcrumb />
            <AddApInvoicePage
                id={id}
                token={user.token}
                tenatsBusinessPartners={tenatsBusinessPartners}
                allBusinessPartners={allBusinessPartners}
            />
        </>
    );
};
export default AddApInvoice;
