//Local imports
import { Locale } from '@/i18n-config';
import data from '@/components/datagrid/apinvoicesDatagrid/data.json';
import ExpensesWrapper from '@/components/pages/accounting/expenses/ExpensesWrapper';

interface Props {
  params: { lang: Locale };
  searchParams: { searchParams: any };
};

const ApInvoices = ({ params, searchParams }: Props): React.ReactElement => (
  <div>
    <div className='text-l text-secondary-500 mt-4'>Accounting / AP Invoices</div>
    <ExpensesWrapper data={data} params={params} searchParams={searchParams} />
  </div>
);

export default ApInvoices;