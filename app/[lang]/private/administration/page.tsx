import { redirect } from 'next/navigation';

export default async function Administration() {
    redirect('./administration/settings');
}