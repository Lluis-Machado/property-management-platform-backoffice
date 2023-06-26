import React from 'react'
import data from '@/components/datagrids/data.json';
import DataGridBusinessPartners from '@/components/datagrids/DataGridBusinessPartners';

const page = () => {
  return (
    <div>
      <div className='text-l text-secondary-500 mt-4'>Accounting / Business Partners</div>
      <DataGridBusinessPartners dataSource={data} />
    </div>
  )
}

export default page