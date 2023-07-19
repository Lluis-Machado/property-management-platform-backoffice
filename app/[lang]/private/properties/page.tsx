// Local imports
import PropertiesPage from '@/components/pages/properties/PropertiesPage';
import { Locale } from '@/i18n-config';
import { PropertyData } from '@/lib/types/propertyInfo';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale };
}

export default async function Properties() {
    const data: PropertyData[] = await getApiData(
        '/properties/properties',
        'Error while getting property info'
    );

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>
                Select a property
            </div>
            <PropertiesPage dataSource={data} />
        </>
    );
}
