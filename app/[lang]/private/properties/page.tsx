// Local imports
import data from '@/components/datagrid/propertiesDatagrid/data.json';
import PropertiesWrapper from '@/components/datagrid/propertiesDatagrid/PropertiesWrapper';

async function getData() {
    const res = await fetch('https://stage.plattesapis.net/properties/properties')
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