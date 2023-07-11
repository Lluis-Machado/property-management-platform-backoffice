'use client'

//Local imports
import { Locale } from '@/i18n-config';
import ExpensesPage from '@/components/pages/accounting/expenses/ExpensesPage';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';

interface Props {
  params: { lang: Locale, id: string }
  searchParams: { searchParams: any }
};

async function getData(id: string) {
  const res = await fetch(`https://stage.plattesapis.net/accounting/tenants/${id}/apinvoices?includeDeleted=false`, {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZ1TTcwYmU1OElvMjNNRUZELWh1SSJ9.eyJpc3MiOiJodHRwczovL3N0YWdlLXBsYXR0ZXMuZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY0ODZkN2JjYzNkZjA2NGNlZWNiZjI1NiIsImF1ZCI6Ind1Zi1hdXRoMC1hcGkiLCJpYXQiOjE2ODg5ODU2OTksImV4cCI6MTY4OTA3MjA5OSwiYXpwIjoiNkVaRGNDbGk1TDA4Z1d2czB5NmtLY2NQcW5GTHNVQzIiLCJndHkiOiJwYXNzd29yZCIsInBlcm1pc3Npb25zIjpbImFkbWluIiwicmVhZCIsInJlYWQ6ZG9jdW1lbnRzIiwid3JpdGUiLCJ3cml0ZTpkb2N1bWVudHMiXX0.n5xPQnrGbr2bfT-YlKv3y9OgE1jfGxRBKPc93V9iJh9EYnjLI6HYHT6kKkNg0HuH73hWIS7XB1yP-JEQNOEot9jY6cKwRMwc6FpwjF_PrMg0EDj7fOgTf9xAx6ffZCnihfQOn1h5_N0rDnkKNv1X6CHiOTbCSf7IsuATv7bMcKtpjOEpBFlMuDVY_0Us_K_irBjxuPyF1mw5cCkP7qgVdkLHXoybOax7I1W3aA1nqD2HK7SAL1-4N1wjIOCHUUIzQw1TwKIF96MUTKsNOTAru46DOYMEjjVpM9cwzh-idJXj-qeT_vzfgk7NBHrimw1DoRnGBzo7SyPJDfaAcsjwIA'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
};

export default async function ApInvoices({ params: { lang, id }, searchParams }: Props) {
  const data = await getData(id)

  return (
    <>
      <Breadcrumb />
      <ExpensesPage
        data={data}
        searchParams={searchParams}
        lang={lang}
      />
    </>
  )
};