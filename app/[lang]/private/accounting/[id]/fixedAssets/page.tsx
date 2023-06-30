'use client'

// Local imports
import data from '@/components/datagrid/fixedAssetsDatagrid/data.json';
import FixedAssetsWrapper from '@/components/datagrid/fixedAssetsDatagrid/FixedAssetsWrapper.tsx/FixedAssetsWrapper';
import { Locale } from '@/i18n-config';

interface Props {
    params: { lang: Locale }
}

export default async function FixedAssets({ params: { lang } }: Props) {

    return (
        <div>
            <div className='text-l text-secondary-500 mt-4'>Accounting / Fixed Assets</div>
            <FixedAssetsWrapper
                dataSource={data}
                selectedProperty='Test property'
                lang={lang}
            />
        </div>
    )
}