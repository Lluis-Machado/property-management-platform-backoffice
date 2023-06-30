// Local imports
import data from '@/components/datagrid/propertiesDatagrid/data.json';
import PropertiesWrapper from '@/components/datagrid/propertiesDatagrid/PropertiesWrapper';

export default async function Properties() {
    return (
        <>
            <div className='text-l text-secondary-500 mt-4'>Select a property</div>
            <PropertiesWrapper
                dataSource={data}
            />
        </>
    )
}