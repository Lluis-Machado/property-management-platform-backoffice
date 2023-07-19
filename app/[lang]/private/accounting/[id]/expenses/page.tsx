//Local imports
import { Locale } from '@/i18n-config';
import ExpensesPage from '@/components/pages/accounting/expenses/ExpensesPage';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
    searchParams: { searchParams: any };
}

export default async function ApInvoices({
    params: { lang, id },
    searchParams,
}: Props) {
    const data = await getApiData<any>(
        `/accounting/tenants/${id}/apinvoices?includeDeleted=false`,
        'Error while getting AP invoices'
    );

    return (
        <>
            <Breadcrumb />
            <ExpensesPage data={data} searchParams={searchParams} lang={lang} />
        </>
    );
}
