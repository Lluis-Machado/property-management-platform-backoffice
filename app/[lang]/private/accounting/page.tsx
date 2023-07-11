// Local imports
import AccountingPage from "@/components/pages/accounting/AccountingPage"
import { Locale } from "@/i18n-config";
import { getApiData } from "@/lib/utils/getApiData"

interface Props {
    params: { lang: Locale }
};

export default async function Accounting() {
    const data = await getApiData('/accounting/tenants?includeDeleted=false', 'Error while getting tenants');

    console.log("Accounting: ", data)

    return (
        <>
            <div className='text-lg text-secondary-500 mt-4'>
                Select a property
            </div>
            <AccountingPage dataSource={data} />
        </>
    )
}