'use client';

// React imports
import { useState } from 'react';

// Local imports
import { PopupVisibility } from '@/lib/types/Popups';
import PopupPreview from '@/components/popups/PopupPreview';
import DataGrid from './DataGrid';
import { TokenRes } from '@/lib/types/token';

interface Props {
    data: any[];
    id: string;
    searchParams: { searchParams: any };
    token: TokenRes;
}

const ExpensesPage = ({
    data,
    id,
    searchParams,
    token,
}: Props): React.ReactElement => {
    const [invoiceVisibility, setInvoiceVisibility] = useState<PopupVisibility>(
        {
            hasBeenOpen: false,
            visible: false,
        }
    );
    const [invoicePreviewTitle, setInvoicePreviewTitle] = useState<string>('');
    const [invoicePreviewURL, setInvoicePreviewURL] = useState<string>('');

    return (
        <>
            <DataGrid
                dataSource={data}
                onInvoiceClick={(title, url) => {
                    setInvoicePreviewTitle(title);
                    setInvoicePreviewURL(url);
                    setInvoiceVisibility((p) => ({ ...p, visible: true }));
                }}
                params={searchParams}
                id={id}
                token={token}
            />
            {(invoiceVisibility.visible || invoiceVisibility.hasBeenOpen) && (
                <PopupPreview
                    fileURL={invoicePreviewURL}
                    isVisible={invoiceVisibility.visible}
                    onClose={() =>
                        setInvoiceVisibility((p) => ({ ...p, visible: false }))
                    }
                    title={invoicePreviewTitle}
                    onShown={() =>
                        setInvoiceVisibility((p) => ({
                            ...p,
                            hasBeenOpen: true,
                        }))
                    }
                />
            )}
        </>
    );
};

export default ExpensesPage;
