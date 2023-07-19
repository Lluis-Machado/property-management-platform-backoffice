//Local imports
import { Locale } from '@/i18n-config';
import ARInvoicesPage from '@/components/pages/accounting/incomes/ARInvoicesPage';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
}

export default async function ArInvoices({ params: { lang, id } }: Props) {
    const data = await getApiData(
        `/accounting/tenants/${id}/arinvoices?includeDeleted=false`,
        'Error while getting AR invoices'
    );

    return (
        <>
            <Breadcrumb />
            <ARInvoicesPage data={data} lang={lang} />
        </>
    );
}
