// Local imports
import data from '@/components/datagrid/propertiesDatagrid/data.json';
import PropertiesWrapper from '@/components/datagrid/propertiesDatagrid/PropertiesWrapper';

async function getData() {
    const res = await fetch('https://stage.plattesapis.net/properties/properties', {
        headers: {Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZ1TTcwYmU1OElvMjNNRUZELWh1SSJ9.eyJpc3MiOiJodHRwczovL3N0YWdlLXBsYXR0ZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY0ODk3MjJjYjlhYTgxMzlmNmI2ODBmYSIsImF1ZCI6Ind1Zi1hdXRoMC1hcGkiLCJpYXQiOjE2ODg0NTgyMzcsImV4cCI6MTY4ODU0NDYzNywiYXpwIjoiNkVaRGNDbGk1TDA4Z1d2czB5NmtLY2NQcW5GTHNVQzIiLCJndHkiOiJwYXNzd29yZCIsInBlcm1pc3Npb25zIjpbImFkbWluIiwicmVhZCIsInJlYWQ6ZG9jdW1lbnRzIiwid3JpdGUiLCJ3cml0ZTpkb2N1bWVudHMiXX0.VXPUYfi_11y6jKElbz6bmajHiRjbyL2EiU2FCclwSZgRJNe1ajAlSjG81BAocbvvV1tG1cpbzVju2J8WwjZwLvw3wqqL_Ror8np9AQ7c-wSHVBgk270F6t2XQ-L23YpVlwH5Au4j0XiTifgHZh2DybN-66_M3XeQ6rwTqw7aaSY_56jwZsNaezt5dWNXdelhpj_bjoMcOMgUtKAODhnkKEyQJThAe5vAJnhYd_W4Pqhtkf80B0VX4zHpNCOkJZnv18wb4rzt7X7oxoKRfgr5H-1UbEHJZTDGKjrMAjPRAayUr1I-pknqOb6NkC5Qh8RF1EbaesqAkSQTDjF6a1wTDw' }
    })
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