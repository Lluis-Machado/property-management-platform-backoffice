// Local imports
import data from '@/components/pages/accounting/businessPartners/data.json';
import DataGrid from '@/components/pages/accounting/businessPartners/DataGrid';

const page = (): React.ReactElement => (
  <>
    <div className='text-l text-secondary-500 mt-4'>
      Accounting / Business Partners
    </div>
    <DataGrid dataSource={data} />
  </>
);

export default page;