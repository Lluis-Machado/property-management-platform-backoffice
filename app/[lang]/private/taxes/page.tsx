import { redirect } from 'next/navigation';

export default async function Taxes() {
    redirect('./taxes/declarations');
}