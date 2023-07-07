'use client'

// React imports
import { useState } from 'react';

// Local imports
import { Locale } from '@/i18n-config';
import { PopupVisibility } from '@/lib/types/Popups';
import PopupPreview from '@/components/popups/PopupPreview';
import DataGrid from './DataGrid';

interface Props {
    data: any[]
    lang: Locale;
    searchParams: { searchParams: any };
};

const ExpensesWrapper = ({ data, lang , searchParams }: Props): React.ReactElement => {
    const [invoiceVisibility, setInvoiceVisibility] = useState<PopupVisibility>({ hasBeenOpen: false, visible: false });
    const [invoicePreviewTitle, setInvoicePreviewTitle] = useState<string>('');
    const [invoicePreviewURL, setInvoicePreviewURL] = useState<string>('');
    
    return (
        <>
            <DataGrid
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
        </>
    );
};

export default ExpensesWrapper;