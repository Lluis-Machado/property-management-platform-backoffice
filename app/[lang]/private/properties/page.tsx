'use client'

//React imports
//Library imports

// Local imports
import data from '@/components/datagrid/propertiesDatagrid/data.json';
import PropertiesWrapper from '@/components/datagrid/propertiesDatagrid/PropertiesWrapper';

export default async function Properties() {
    return (
        <>
            <div className='text-l text-secondary-500 ml-2 mt-4'>Properties</div>
            <PropertiesWrapper
                dataSource={data}
            />
        </>
    )
}