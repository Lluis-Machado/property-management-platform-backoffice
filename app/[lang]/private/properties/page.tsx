// Local imports
import PropertiesWrapper from '@/components/pages/properties/PropertiesWrapper';
import { getApiData } from '@/lib/utils/apiCalls';

export default async function Properties() {
    const data = await getApiData('/properties/properties', 'Error while getting property info');

    return (
        <>
            <div className='text-lg text-secondary-500 mt-4'>
                Select a property
            </div>
            <PropertiesWrapper dataSource={data} />
        </>
    )
};