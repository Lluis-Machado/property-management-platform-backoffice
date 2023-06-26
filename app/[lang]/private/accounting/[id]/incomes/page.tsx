//React import

//Local imports
import data from '@/components/datagrid/arInvoices/data.json';
import ARInvoicesDatagrid from '@/components/datagrid/arInvoices/ARInvoicesDatagrid';

const page = () => {
  return (
    <div className='my-0'>
      <div className='text-l text-secondary-500 mb-3 ml-4 mt-4'>Accounting / AR Invoices</div>
      <ARInvoicesDatagrid dataSource={data} />
    </div>
  )
}

export default page