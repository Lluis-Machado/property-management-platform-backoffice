// Local imports
import { Locale } from '@/i18n-config';
import data from '@/components/pages/accounting/fixedAssets/data.json';
import FixedAssetsWrapper from '@/components/pages/accounting/fixedAssets/FixedAssetsWrapper';

interface Props {
    params: { lang: Locale };
};

const FixedAssets = ({ params: { lang } }: Props): React.ReactElement => (
    <>
        <div className='text-l text-secondary-500 mt-4'>
            Accounting / Fixed Assets
        </div>
        <FixedAssetsWrapper
            dataSource={data}
            selectedProperty='Test property'
            lang={lang}
        />
    </>
);

export default FixedAssets;