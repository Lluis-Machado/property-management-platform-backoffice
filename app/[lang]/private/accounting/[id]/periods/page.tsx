//Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';
import PeriodsPage from '@/components/pages/accounting/periods/PeriodsPage';
import { PeriodsData } from '@/lib/types/periodsData';

interface Props {
    params: { lang: Locale; id: string };
}
export default async function Periods({ params: { lang, id } }: Props) {
    const data = await getApiData<PeriodsData[]>(
        `/accounting/tenants/${id}/periods?includeDeleted=false`,
        'Error while getting Periods'
    );

    return (
        <>
            <Breadcrumb />
            <PeriodsPage data={data} id={id} />
        </>
    );
}
