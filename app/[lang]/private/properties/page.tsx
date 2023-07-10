// Local imports
import PropertiesPage from '@/components/pages/properties/PropertiesPage';
import { getApiData } from '@/lib/utils/apiCalls';

export default async function Properties() {
    const data = await getApiData('/properties/properties', 'Error while getting property info');

    return (
        <>
            <div className='text-lg text-secondary-500 mt-4'>
                Select a property
            </div>
            <PropertiesPage dataSource={data} />
        </>
    )
};