// Local imports
import { Locale } from '@/i18n-config';
import data from '@/components/datagrid/fixedAssetsDatagrid/data.json';
import FixedAssetsWrapper from '@/components/datagrid/fixedAssetsDatagrid/FixedAssetsWrapper.tsx/FixedAssetsWrapper';

interface Props {
    params: { lang: Locale };
};

export default function FixedAssets({ params: { lang } }: Props): React.ReactElement {
    return (
        <div>
            <div className='text-l text-secondary-500 mt-4'>Accounting / Fixed Assets</div>
            <FixedAssetsWrapper
                dataSource={data}
                selectedProperty='Test property'
                lang={lang}
            />
        </div>
    );
};