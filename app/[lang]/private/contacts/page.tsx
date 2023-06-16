import { redirect } from 'next/navigation';

export default async function Contacts() {
    redirect('./contacts/contacts');
}