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
        <div className='my-0'>
            <div className='text-l text-secondary-500 mb-3 ml-4 mt-4'>Accounting / AR Invoices</div>
            <FixedAssetsWrapper
                dataSource={data}
                selectedProperty='Test property'
                lang={lang}
            />
        </div>
    )
}