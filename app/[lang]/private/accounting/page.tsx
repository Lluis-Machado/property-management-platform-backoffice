'use client'

//React imports
//Library imports

// Local imports
import AccountingWrapper from "@/components/datagrid/accountingDatagrid/AccountingWrapper"
import data from '@/components/datagrid/propertiesDatagrid/data.json';

export default async function Accounting() {
    return (
        <>
            <div className='text-l text-secondary-500 ml-8 mt-4'>Accounting</div>
            <AccountingWrapper
                dataSource={data}
            />
        </>
    )
}