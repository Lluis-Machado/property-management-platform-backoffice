// Local imports
import data from '@/components/datagrids/data.json';
import DataGridBusinessPartners from '@/components/datagrids/DataGridBusinessPartners';

const page = (): React.ReactElement => (
  <>
    <div className='text-l text-secondary-500 mt-4'>Accounting / Business Partners</div>
    <DataGridBusinessPartners dataSource={data} />
  </>
);

export default page;