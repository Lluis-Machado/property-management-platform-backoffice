// Local imports
import AccountingPage from '@/components/pages/accounting/AccountingPage';
import { Locale } from '@/i18n-config';
import { Tenant } from '@/lib/types/tenansts';
import { getApiData } from '@/lib/utils/getApiData';
import { sortByProperty } from '@/lib/utils/sortByProperty';

interface Props {
    params: { lang: Locale };
}

export default async function Accounting() {
    const data = await getApiData<Tenant[]>(
        '/accounting/tenants?includeDeleted=false',
        'Error while getting tenants'
    );

    sortByProperty(data, 'name');

    return (
        <>
            <div className='text-2xl tracking-wide text-secondary-500'>
                Accounting Module
            </div>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a property
            </div>
            <AccountingPage dataSource={data} />
        </>
    );
}
