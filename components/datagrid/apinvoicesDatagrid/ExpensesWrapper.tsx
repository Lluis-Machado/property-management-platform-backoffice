"use client"

// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { Alert } from 'pg-components';

// Local imports
import ApInvoicesDatagrid from './ApInvoicesDatagrid';
import PopupPreview from '@/components/popups/PopupPreview';
import { Locale } from '@/i18n-config';
import { PopupVisibility } from '@/lib/types/Popups';

interface Props {
    dataSource: any[];
    searchParams: { searchParams: any }
    lang: Locale
};

export const ExpensesWrapper = ({ dataSource, searchParams, lang }: Props): React.ReactElement => {

    const [invoice, setInvoice] = useState<{ title: string; url: string; visibility: PopupVisibility; }>({
        title: '',
        url: '',
        visibility: {
            hasBeenOpen: false,
            visible: false
        }
    });

    const handleInvoiceClick = useCallback((title: string, url: string) => {
        setInvoice((prev) => ({
            title,
            url,
            visibility: {
                ...prev.visibility,
                visible: true,
            }
        }));
    }, []);

    return (
        <>
            <ApInvoicesDatagrid
                dataSource={dataSource}
                onInvoiceClick={handleInvoiceClick}
                params={searchParams}
                lang={lang}
            />
            <PopupPreview
                onShown={() => setInvoice((prev) => ({
                    ...prev,
                    visibility: {
                        ...prev.visibility,
                        hasBeenOpen: true,
                    }
                }))}
                fileURL={invoice.url}
                isVisible={invoice.visibility.visible && invoice.url !== 'invalidUrl'}
                onClose={() => setInvoice((prev) => ({
                    title: '',
                    url: '',
                    visibility: {
                        ...prev.visibility,
                        visible: true,
                    }
                }))}
                title={invoice.title}
            />
            <div className='absolute bottom-4 right-12'>
                <Alert
                    body='No file available for the selected invoice.'
                    isVisible={invoice.visibility.visible && invoice.url === 'invalidUrl'}
                    onHidden={() => setInvoice((prev) => ({
                        title: '',
                        url: '',
                        visibility: {
                            ...prev.visibility,
                            visible: true,
                        }
                    }))}
                    //duration={2000}
                    type='warning'
                />
            </div>
        </>
    );
};

export default ExpensesWrapper;