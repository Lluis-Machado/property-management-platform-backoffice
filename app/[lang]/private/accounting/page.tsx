// Local imports
import AccountingPage from '@/components/pages/accounting/AccountingPage';
import { Locale } from '@/i18n-config';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale };
}

export default async function Accounting() {
    const data = await getApiData<any>(
        '/accounting/tenants?includeDeleted=false',
        'Error while getting tenants'
    );

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a property
            </div>
            <AccountingPage dataSource={data} />
        </>
    );
}
