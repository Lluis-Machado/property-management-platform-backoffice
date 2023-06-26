'use client'

// React imports
import { useState, memo, useCallback, useEffect } from 'react';

// Local imports
import { Invoice } from '@/lib/types/invoices';
import PopupPreview from '@/components/popups/PopupPreview';
import ARInvoicesDatagrid from './ARInvoicesDatagrid';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { Locale } from '@/i18n-config';

interface Props {
    data: Invoice[];
    lang: Locale;
};

const IncomeWrapper = ({ data, lang }: Props) => {
    const [invoiceURL, setInvoiceURL] = useState<string>('#');
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [popupTitle, setPopupTitle] = useState<string>('');


    useEffect(() => {
        localeDevExtreme(lang)
    }, [lang]);
    
    const onClickHandler = useCallback((title: string, url: string) => {
        setIsPopupVisible(true);
        setPopupTitle(title);
        setInvoiceURL(url);
    }, []);

    return (
        <>
            {/* Data Grid */}
            <ARInvoicesDatagrid
                dataSource={data}
                onInvoiceClick={onClickHandler}
                lang={lang}
            />
            {/* Document Preview Popup */}
            {
                popupTitle &&
                <PopupPreview
                    fileURL={invoiceURL}
                    isVisible={isPopupVisible}
                    onClose={() => setIsPopupVisible(false)}
                    title={popupTitle}
                />
            }
        </>
    );
};

export default memo(IncomeWrapper);