//Local imports
import ExpensesPage from '@/components/pages/accounting/expenses/ExpensesPage';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { id: string };
    searchParams: { searchParams: any };
}

export default async function ApInvoices({
    params: { id },
    searchParams,
}: Props) {
    const data = await getApiData<any>(
        `/accounting/tenants/${id}/apinvoices?includeDeleted=false`,
        'Error while getting AP invoices'
    );

    return (
        <>
            <Breadcrumb />
            <ExpensesPage data={data} searchParams={searchParams} id={id} />
        </>
    );
}
