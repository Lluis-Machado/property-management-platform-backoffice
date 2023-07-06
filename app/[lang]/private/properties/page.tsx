// Local imports
import PropertiesWrapper from '@/components/pages/properties/PropertiesWrapper';
import { ApiCallError } from '@/lib/utils/errors';

async function getData() {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/properties/properties`, { cache: 'no-cache' })
    if (!resp.ok) throw new ApiCallError('Error while getting property info');
    return resp.json()
  }


export default async function Properties() {
    const data = await getData()
    return (
        <>
            <div className='text-l text-secondary-500 mt-4'>
                Select a property
            </div>
            <PropertiesWrapper dataSource={data}/>
        </>
    )
};