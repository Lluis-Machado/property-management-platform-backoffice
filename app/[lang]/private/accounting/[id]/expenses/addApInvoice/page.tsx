// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddApInvoicePage from '@/components/pages/accounting/expenses/addApInvoice/AddApInvoicePage';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { getApiData } from '@/lib/utils/getApiData';
interface Props {
    params: { id: string };
}

const AddApInvoice: any = async ({ params: { id } }: Props) => {
    const [tenatsBusinessPartners, allBusinessPartners] = await Promise.all([
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
                tenatsBusinessPartners={tenatsBusinessPartners}
                allBusinessPartners={allBusinessPartners}
            />
        </>
    );
};
export default AddApInvoice;
