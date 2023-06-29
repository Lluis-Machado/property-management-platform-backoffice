//React import

//Local imports
import data from '@/components/datagrid/arInvoicesDatagrid/data.json';
import { Locale } from '@/i18n-config';
import ARInvoicesWrapper from '@/components/datagrid/arInvoicesDatagrid/ARInvoicesWrapper';
interface Props {
  params: { lang: Locale }
}

const page = ({ params: { lang } }: Props) => {
  return (
    <div>
      <div className='text-l text-secondary-500 mt-4'>Accounting / AR Invoices</div>
      <ARInvoicesWrapper  
        data={data} 
        lang={lang}
      />
    </div>
  )
}

export default page