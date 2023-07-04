// Local imports
import { Locale } from '@/i18n-config';
import data from '@/components/pages/accounting/fixedAssets/data.json';
import FixedAssetsWrapper from '@/components/pages/accounting/fixedAssets/FixedAssetsWrapper';

interface Props {
    params: { lang: Locale , id: string}
};

async function getData(id: string) {
    const res = await fetch(`https://stage.plattesapis.net/accounting/tenants/${id}/fixedAssets/2023?includeDeleted=false`, {
        headers: { Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZ1TTcwYmU1OElvMjNNRUZELWh1SSJ9.eyJpc3MiOiJodHRwczovL3N0YWdlLXBsYXR0ZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY0ODk3MjJjYjlhYTgxMzlmNmI2ODBmYSIsImF1ZCI6Ind1Zi1hdXRoMC1hcGkiLCJpYXQiOjE2ODgzNjkzNTUsImV4cCI6MTY4ODQ1NTc1NSwiYXpwIjoiNkVaRGNDbGk1TDA4Z1d2czB5NmtLY2NQcW5GTHNVQzIiLCJndHkiOiJwYXNzd29yZCIsInBlcm1pc3Npb25zIjpbImFkbWluIiwicmVhZCIsInJlYWQ6ZG9jdW1lbnRzIiwid3JpdGUiLCJ3cml0ZTpkb2N1bWVudHMiXX0.Ry5tkdBKO11I1jgNPSX-u5OPfHPbBSNH9YP-n8WibVndsw9jMY4QblIhuyZR-v0vTY1OjjqsIYxeEHx0LO4GLlzEQKcckTDWXPDDQUa6Zvtk11ak_8PDU4gIrxNO6xEjzTf28R-yhhnswCyF9cTRR_iLR_RfVCnrJCaXQjoUdA8qfEXeJAwdn6JtUay0XRWNQfquI0_kmQjeSS6rt9azqvv3sl7agsfBXddrCAC-OaReHmMP2G14E9o93LA7UVIKI0iZnrT9iAHnUGQh23pukYe3-PS8MaD2jCEeZIg_ysdXImwBhuBVXQYzOHra3f2pkZEqCt0aPOGbUmLGZKR-UA' }
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
};

export default async function FixedAssets({ params: {lang, id}}: Props) {
    const data = await getData(id)
    return (
        <>
            <div className='text-l text-secondary-500 mt-4'>
                Accounting / Fixed Assets
            </div>
            <FixedAssetsWrapper
                dataSource={data}
                selectedProperty='Test property'
                lang={lang}
                years={['2023', '2022']}
            />
        </>
    )
};