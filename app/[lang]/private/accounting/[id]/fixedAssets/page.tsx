// Local imports
import { Locale } from '@/i18n-config';
import FixedAssetsPage from '@/components/pages/accounting/fixedAssets/FixedAssetsPage';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale, id: string }
};

export default async function FixedAssets({ params: { lang, id } }: Props) {
    const data = await getApiData(`/accounting/tenants/${id}/fixedAssets/2023?includeDeleted=false`, 'Error while getting fixed assets');
    
    return (
        <>
            <Breadcrumb />
            <FixedAssetsPage
                dataSource={data}
                selectedProperty='Test property'
                lang={lang}
                years={['2023', '2022']}
            />
        </>
    )
};