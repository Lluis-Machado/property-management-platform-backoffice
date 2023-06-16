import { redirect } from 'next/navigation';

export default async function Accounting() {
    redirect('./accounting/tenants');
}