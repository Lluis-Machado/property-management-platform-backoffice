// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import AddApInvoicePage from '@/components/pages/accounting/expenses/addApInvoice/AddAppInvoicePage';

interface Props {
    params: { id: string };
}
const Addexpense = async () => {
    return (
        <>
            <Breadcrumb />
            <AddApInvoicePage />
        </>
    );
};
export default Addexpense;
