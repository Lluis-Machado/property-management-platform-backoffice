//Local imports
import { Locale } from '@/i18n-config';
import ARInvoicesWrapper from '@/components/datagrid/arInvoicesDatagrid/ARInvoicesWrapper';
import data from '@/components/datagrid/arInvoicesDatagrid/data.json';
interface Props {
  params: { lang: Locale };
};

const page = ({ params: { lang } }: Props): React.ReactElement => (
  <>
    <div className='text-l text-secondary-500 mt-4'>Accounting / AR Invoices</div>
    <ARInvoicesWrapper
      data={data}
      lang={lang}
    />
  </>
);

export default page;