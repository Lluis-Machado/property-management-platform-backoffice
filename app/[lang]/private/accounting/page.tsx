// Local imports
import AccountingWrapper from '@/components/datagrid/accountingDatagrid/AccountingWrapper';
import data from '@/components/datagrid/propertiesDatagrid/data.json';

export default function Accounting(): React.ReactElement {
    return (
        <>
            <div className='text-l text-secondary-500 mt-4'>Select a property</div>
            <AccountingWrapper
                dataSource={data}
            />
        </>
    );
};