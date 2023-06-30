'use client'

// React imports
import { useState } from 'react';

//Local imports
import { Locale } from '@/i18n-config';
import { PopupVisibility } from '@/lib/types/Popups';
import ApInvoicesDatagrid from '@/components/datagrid/apinvoicesDatagrid/ApInvoicesDatagrid';
import data from '@/components/datagrid/apinvoicesDatagrid/data.json';
import PopupPreview from '@/components/popups/PopupPreview';

interface Props {
  params: { lang: Locale }
  searchParams: { searchParams: any }
};

export default function ApInvoices({ params: { lang }, searchParams }: Props): React.ReactElement {
  const [invoiceVisibility, setInvoiceVisibility] = useState<PopupVisibility>({ hasBeenOpen: false, visible: false });
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
          setInvoiceVisibility(p => ({ ...p, visible: true }));
        }}
        params={searchParams}
        lang={lang}
      />
      {
        (invoiceVisibility.visible || invoiceVisibility.hasBeenOpen) &&
        <PopupPreview
          fileURL={invoicePreviewURL}
          isVisible={invoiceVisibility.visible}
          onClose={() => setInvoiceVisibility(p => ({ ...p, visible: false }))}
          title={invoicePreviewTitle}
          onShown={() => setInvoiceVisibility(p => ({ ...p, hasBeenOpen: true }))}
        />
      }
    </div>
  );
};