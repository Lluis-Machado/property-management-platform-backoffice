// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddApInvoicePage from '@/components/pages/accounting/expenses/addApInvoice/AddApInvoicePage';

interface Props {
    params: { id: string };
}
const AddApInvoice = async () => {
    return (
        <>
            <Breadcrumb />
            <AddApInvoicePage />
        </>
    );
};
export default AddApInvoice;
