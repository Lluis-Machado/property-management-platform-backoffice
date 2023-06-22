'use client'

//React imports
//Library imports

// Local imports
import data from '@/components/datagrid/propertiesDatagrid/data.json';
import PropertiesDataGrid from '@/components/datagrid/propertiesDatagrid/PropertiesDataGrid';

export default async function Properties() {
    return (
        <>
            <div className='text-l text-secondary-500 ml-8 mt-4'>Properties</div>
            <PropertiesDataGrid
                dataSource={data}
            />
        </>
    )
}