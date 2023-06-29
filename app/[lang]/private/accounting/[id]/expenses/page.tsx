'use client'
// React imports
import { useState } from 'react';

//Local imports
import data from '@/components/datagrid/apinvoicesDatagrid/data.json';
import ApInvoicesDatagrid from '@/components/datagrid/apinvoicesDatagrid/ApInvoicesDatagrid';
import PopupPreview from '@/components/popups/PopupPreview';
import { Locale } from '@/i18n-config';
interface Props {
  params: { lang: Locale }
  searchParams: {searchParams: any}
}

export default function ApInvoices({ params: {lang}, searchParams }: Props): React.ReactElement {
  const [isInvoicePreviewVisible, setIsInvoicePreviewVisible] = useState<boolean>(false);
  const [invoicePreviewTitle, setInvoicePreviewTitle] = useState<string>('');
  const [invoicePreviewURL, setInvoicePreviewURL] = useState<string>('');
  return (
    <div>
      <div className='text-l text-secondary-500 mt-4'>Accounting / AP Invoices</div>
      <ApInvoicesDatagrid  
           dataSource={data}
           onInvoiceClick={(title, url) => {
               setInvoicePreviewTitle(title);
               setInvoicePreviewURL(url);
               setIsInvoicePreviewVisible(true);
           }}
           params={searchParams}
           lang={lang}
      />
                  {
                isInvoicePreviewVisible &&
                <PopupPreview
                    fileURL={invoicePreviewURL}
                    isVisible={isInvoicePreviewVisible}
                    onClose={() => setIsInvoicePreviewVisible(false)}
                    title={invoicePreviewTitle}
                />
            }
    </div>
  )
}

