"use client"

// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { Alert } from 'pg-components';

// Local imports
import ApInvoicesDatagrid from './ApInvoicesDatagrid';
import PopupPreview from '@/components/popups/PopupPreview';
import { Locale } from '@/i18n-config';

interface Props {
    dataSource: any[];
    searchParams: { searchParams: any }
    lang: Locale
};

export const ExpensesWrapper = ({ dataSource, searchParams, lang }: Props): React.ReactElement => {

    const [invoice, setInvoice] = useState<{ title: string; url: string; visible: boolean; }>({ title: '', url: '', visible: false });

    const handleInvoiceClick = useCallback((title: string, url: string) => {
        setInvoice({ title, url, visible: true });
    }, []);

    return (
        <>
            <ApInvoicesDatagrid
                dataSource={dataSource}
                onInvoiceClick={handleInvoiceClick}
                params={searchParams}
                lang = {lang}
            />
            <PopupPreview
                fileURL={invoice.url}
                isVisible={invoice.visible && invoice.url !== 'invalidUrl'}
                onClose={() => setInvoice({ title: '', url: '', visible: false })}
                title={invoice.title}
            />
            <div className='absolute bottom-4 right-12'>
                <Alert
                    body='No file available for the selected invoice.'
                    isVisible={invoice.visible && invoice.url === 'invalidUrl'}
                    onHidden={() => setInvoice({ title: '', url: '', visible: false })}
                    //duration={2000}
                    type='warning'
                />
            </div>
        </>
    );
};

export default ExpensesWrapper;