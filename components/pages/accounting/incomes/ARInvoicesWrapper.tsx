'use client'

// React imports
import { useState, memo, useCallback, useEffect } from 'react';

// Local imports
import { Invoice } from '@/lib/types/invoices';
import PopupPreview from '@/components/popups/PopupPreview';
import DataGrid from './DataGrid';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { Locale } from '@/i18n-config';
import { PopupVisibility } from '@/lib/types/Popups';

interface Props {
    data: Invoice[];
    lang: Locale;
};

const IncomeWrapper = ({ data, lang }: Props) => {
    const [invoiceURL, setInvoiceURL] = useState<string>('#');
    const [popupVisibility, setPopupVisibility] = useState<PopupVisibility>({ hasBeenOpen: false, visible: false });
    const [popupTitle, setPopupTitle] = useState<string>('');


    useEffect(() => {
        localeDevExtreme(lang)
    }, [lang]);

    const onClickHandler = useCallback((title: string, url: string) => {
        setPopupTitle(title);
        setInvoiceURL(url);
        setPopupVisibility(p => ({ ...p, visible: true }));
    }, []);

    return (
        <>
            {/* Data Grid */}
            <DataGrid
                dataSource={data}
                onInvoiceClick={onClickHandler}
                lang={lang}
            />
            {/* Document Preview Popup */}
            {
                (popupVisibility.visible || popupVisibility.hasBeenOpen) &&
                <PopupPreview
                    fileURL={invoiceURL}
                    isVisible={popupVisibility.visible}
                    onClose={() => setPopupVisibility(p => ({ ...p, visible: false }))}
                    title={popupTitle}
                    onShown={() => setPopupVisibility(p => ({ ...p, hasBeenOpen: true }))}
                />
            }
        </>
    );
};

export default memo(IncomeWrapper);