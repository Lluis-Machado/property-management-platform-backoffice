// Local imports
import data from '@/components/pages/properties/data.json';
import PropertiesWrapper from '@/components/pages/properties/PropertiesWrapper';

async function getData() {
    const res = await fetch('https://stage.plattesapis.net/properties/properties', { cache: 'no-cache' })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      return res.json()
  }

export default async function Properties() {
    const data = await getData()
    return (
        <>
            <div className='text-l text-secondary-500 mt-4'>
                Select a property
            </div>
            <PropertiesWrapper dataSource={data} />
        </>
    )
};