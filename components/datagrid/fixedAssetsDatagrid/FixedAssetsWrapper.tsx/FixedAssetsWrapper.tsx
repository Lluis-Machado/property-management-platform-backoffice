// React imports
import { useCallback, useEffect, useState } from 'react';

// Libraries imports
import dynamic from 'next/dynamic';

// Local imports
import '../../datagrid.css';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import FixedAssetsDatagrid from './FixedAssetsDatagrid';
import { Locale } from '@/i18n-config';

const Popup = dynamic(() => import('../../../popups/PopupInfo'));
const PopupPreview = dynamic(() => import('../../../popups/PopupPreview'));

interface Props {
    dataSource: any[];
    selectedProperty: string;
    lang: Locale;
};

const FixedAssetsWrapper = ({ dataSource, lang }: Props): React.ReactElement => {
    const [isDepreciationPopupVisible, setIsDepreciationPopupVisible] = useState<boolean>(false);
    const [isInvoicePopupVisible, setIsInvoicePopupVisible] = useState<boolean>(false);
    const [selectedFixedAsset, setSelectedFixedAsset] = useState<{ name: string, depreciation: any[] }>({ name: '', depreciation: [] });
    const [selectedInvoice, setSelectedInvoice] = useState<{ name: string, url: string }>({ name: '', url: '' });

    useEffect(() => {
        localeDevExtreme(lang)
    }, [lang]);

    const handleDepreciationClick = useCallback((name: string, depreciation: any[]) => {
        setSelectedFixedAsset({ name, depreciation });
        setIsDepreciationPopupVisible(true);
    }, []);

    const handleInvoiceClick = useCallback((title: string, url: string) => {
        setSelectedInvoice({ name: title, url });
        setIsInvoicePopupVisible(true);
    }, []);
    return (
        <>
            <FixedAssetsDatagrid
                dataSource={dataSource}
                onDepreciationClick={handleDepreciationClick}
                onInvoiceClick={handleInvoiceClick}
                selectedProperty='Test property'
                lang={lang}
            />
            <Popup
                data={selectedFixedAsset}
                isVisible={isDepreciationPopupVisible}
                onClose={() => setIsDepreciationPopupVisible(false)}
            />
            <PopupPreview
                fileURL={selectedInvoice.url}
                isVisible={isInvoicePopupVisible}
                onClose={() => setIsInvoicePopupVisible(false)}
                title={selectedInvoice.name}
            />
        </>
    )
}

export default FixedAssetsWrapper