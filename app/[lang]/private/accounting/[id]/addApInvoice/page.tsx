// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddApInvoicePage from '@/components/pages/accounting/expenses/addApInvoice/AddApInvoicePage';
import { TokenRes } from '@/lib/types/token';
import { getUser } from '@/lib/utils/getUser';

interface Props {
    params: { id: string };
    token: TokenRes;
}

const AddApInvoice: any = async ({ params: { id }, token }: Props) => {
    const user = await getUser();

    return (
        <>
            <Breadcrumb />
            <AddApInvoicePage id={id} token={user.token} />
        </>
    );
};
export default AddApInvoice;
