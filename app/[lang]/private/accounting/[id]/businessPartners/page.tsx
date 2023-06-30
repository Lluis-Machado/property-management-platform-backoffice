import React from 'react'
import data from '@/components/datagrids/data.json';
import DataGridBusinessPartners from '@/components/datagrids/DataGridBusinessPartners';
interface Props {
  params: { 
    id: string 
  }
}

async function getData(id: string) {
  const res = await fetch(`https://stage.plattesapis.net/accounting/tenants/${id}/businessPartners?includeDeleted=false'`, {
      headers: {Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZ1TTcwYmU1OElvMjNNRUZELWh1SSJ9.eyJpc3MiOiJodHRwczovL3N0YWdlLXBsYXR0ZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY0ODk3MjJjYjlhYTgxMzlmNmI2ODBmYSIsImF1ZCI6Ind1Zi1hdXRoMC1hcGkiLCJpYXQiOjE2ODgxMTcyOTcsImV4cCI6MTY4ODIwMzY5NywiYXpwIjoiNkVaRGNDbGk1TDA4Z1d2czB5NmtLY2NQcW5GTHNVQzIiLCJndHkiOiJwYXNzd29yZCIsInBlcm1pc3Npb25zIjpbImFkbWluIiwicmVhZCIsInJlYWQ6ZG9jdW1lbnRzIiwid3JpdGUiLCJ3cml0ZTpkb2N1bWVudHMiXX0.Xq03JElKZdbQ2UIRNJUn42cVbE5t6MhBreNjnIq0t7jeUkgbbEMZU1rtU1sE6xZRlFML9-HudDoQn0z3TbtPXUwEJ_qOHEAxtPHkns10imiXJndQoiPe6H7o0-3frk85AQtRrE18UEiPxcOWlX65glbFLIhKMC4UCuVWNdN3q5MpcglI812lpFUsD61XBRkkQjG-CUR-RVA7U539xaAc5LOtUywX2O1kwa8BkDPLqw4UuAADw2Fny7AFlx_82CgMlE_MkmwvzcvqEH694ya3LKIY10CQIlxp5rLPSKAGQTB3natyzlpPwfGWuhICa-sjgaM3QySSslbmXxc2Ro4kVA' }
  })
  if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export default async function BusinessPartners({ params: {id} }: Props) {
  const data = await getData(id)
  return (
    <div>
      <div className='text-l text-secondary-500 mt-4'>Accounting / Business Partners</div>
      <DataGridBusinessPartners dataSource={data} />
    </div>
  )
}