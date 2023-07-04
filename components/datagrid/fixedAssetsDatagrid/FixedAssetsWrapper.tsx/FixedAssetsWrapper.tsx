'use client'

// React imports
import { useCallback, useEffect, useState } from 'react';

// Libraries imports
import dynamic from 'next/dynamic';

// Local imports
import '../../datagrid.css';
import { Locale } from '@/i18n-config';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { PopupVisibility } from '@/lib/types/Popups';
import FixedAssetsDatagrid from './FixedAssetsDatagrid';

// Dynamic imports
const Popup = dynamic(() => import('../../../popups/PopupInfo'));
const PopupPreview = dynamic(() => import('../../../popups/PopupPreview'));

interface Props {
    dataSource: any[];
    selectedProperty: string;
    lang: Locale;
    years: string[];
};

const FixedAssetsWrapper = ({ dataSource, lang, years }: Props): React.ReactElement => {
    const [depreciationPopupVisibility, setDepreciationPopupVisiblity] = useState<PopupVisibility>({ hasBeenOpen: false, visible: false });
    const [invoicePopupVisibility, setInvoicePopupVisibility] = useState<PopupVisibility>({ hasBeenOpen: false, visible: false });
    const [selectedFixedAsset, setSelectedFixedAsset] = useState<{ name: string, depreciation: any[] }>({ name: '', depreciation: [] });
    const [selectedInvoice, setSelectedInvoice] = useState<{ name: string, url: string }>({ name: '', url: '' });
    const [selectedYear, setSelectedYear] = useState<string>(years[0]);

    useEffect(() => {
        // TODO: Filter dataSource by year.
        console.log("Selected year: ", selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        localeDevExtreme(lang)
    }, [lang]);

    const handleDepreciationClick = useCallback((name: string, depreciation: any[]) => {
        setSelectedFixedAsset({ name, depreciation });
        setDepreciationPopupVisiblity(p => ({ ...p, visible: true }));
    }, []);

    const handleInvoiceClick = useCallback((title: string, url: string) => {
        setSelectedInvoice({ name: title, url });
        setInvoicePopupVisibility(p => ({ ...p, visible: true }));
    }, []);
    return (
        <>
            <FixedAssetsDatagrid
                dataSource={dataSource}
                onDepreciationClick={handleDepreciationClick}
                onInvoiceClick={handleInvoiceClick}
                selectedProperty='Test property'
                onYearChange={setSelectedYear}
                lang={lang}
                selectedYear={selectedYear}
                years={years}
            />
            {
                (depreciationPopupVisibility.visible || depreciationPopupVisibility.hasBeenOpen) &&
                <Popup
                    data={selectedFixedAsset}
                    isVisible={depreciationPopupVisibility.visible}
                    onClose={() => setDepreciationPopupVisiblity(p => ({ ...p, visible: false }))}
                    onShown={() => setDepreciationPopupVisiblity(p => ({ ...p, hasBeenOpen: true }))}
                />
            }
            {
                (invoicePopupVisibility.visible || invoicePopupVisibility.hasBeenOpen) &&
                <PopupPreview
                    fileURL={selectedInvoice.url}
                    isVisible={invoicePopupVisibility.visible}
                    onClose={() => setInvoicePopupVisibility(p => ({ ...p, visible: false }))}
                    onShown={() => setInvoicePopupVisibility(p => ({ ...p, hasBeenOpen: true }))}
                    title={selectedInvoice.name}
                />
            }
        </>
    )
}

export default FixedAssetsWrapper