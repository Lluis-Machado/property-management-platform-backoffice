'use client';

// React imports
import { useState, memo, useCallback, useEffect } from 'react';

// Local imports
import PopupPreview from '@/components/popups/PopupPreview';
import ARDataGrid from './DataGrid';
import { PopupVisibility } from '@/lib/types/Popups';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { Locale } from '@/i18n-config';
import { Invoice } from '@/lib/types/invoices';

interface Props {
    data: Invoice[];
    lang: Locale;
}

const ARInvoicesPage = ({ data, lang }: Props) => {
    const [invoiceURL, setInvoiceURL] = useState<string>('#');
    const [popupVisibility, setPopupVisibility] = useState<PopupVisibility>({
        hasBeenOpen: false,
        visible: false,
    });
    const [popupTitle, setPopupTitle] = useState<string>('');

    useEffect(() => {
        localeDevExtreme(lang);
    }, [lang]);

    const onClickHandler = useCallback((title: string, url: string) => {
        setPopupTitle(title);
        setInvoiceURL(url);
        setPopupVisibility((p) => ({ ...p, visible: true }));
    }, []);

    return (
        <>
            {/* Data Grid */}
            <ARDataGrid
                dataSource={data}
                onInvoiceClick={onClickHandler}
                lang={lang}
            />
            {/* Document Preview Popup */}
            {(popupVisibility.visible || popupVisibility.hasBeenOpen) && (
                <PopupPreview
                    fileURL={invoiceURL}
                    isVisible={popupVisibility.visible}
                    onClose={() =>
                        setPopupVisibility((p) => ({ ...p, visible: false }))
                    }
                    title={popupTitle}
                    onShown={() =>
                        setPopupVisibility((p) => ({ ...p, hasBeenOpen: true }))
                    }
                />
            )}
        </>
    );
};

export default memo(ARInvoicesPage);
