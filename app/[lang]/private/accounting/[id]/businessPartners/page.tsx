// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import BpPage from '@/components/pages/accounting/businessPartners/BpPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
}

export default async function BusinessPartners({
    params: { lang, id },
}: Props) {
    const data = await getApiData(
        `/accounting/tenants/${id}/businessPartners?includeDeleted=false`,
        'Error while getting business partners'
    );

    return (
        <>
            <Breadcrumb />
            <BpPage data={data} />
        </>
    );
}
