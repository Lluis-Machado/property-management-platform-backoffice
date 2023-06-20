import React from 'react'
import data from '@/components/datagrids/data.json';
import DataGridBusinessPartners from '@/components/datagrids/DataGridBusinessPartners';

const page = () => {
  return (
    <div className='my-0'>
      <div className='text-xl text-secondary-500 mb-3'>Accounting / Business Partners</div>
      <DataGridBusinessPartners dataSource={data} />
    </div>
  )
}

export default page