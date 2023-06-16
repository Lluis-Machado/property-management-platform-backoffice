import {
    faAddressBook, faCalculator, faCog, faFileAlt, faHouse, faReceipt
} from '@fortawesome/free-solid-svg-icons';

// Local imports
import { route } from './types/route';

export const routes: route[] = [
    {
        path: 'documents',
        icon: faFileAlt,
        name: 'Documents',
        children: [
            { name: 'Archives', path: 'archives' },
            { name: 'Documents', path: 'files' },
        ]
    },
    {
        path: 'accounting',
        icon: faReceipt,
        name: 'Accounting',
        children: [
            { name: 'Tenants', path: 'tenants' },
            { name: 'Expenses', path: 'expenses' },
            { name: 'Incomes', path: 'incomes' },
            { name: 'Business Partners', path: 'businessPartners' },
            { name: 'Loans', path: 'loans' },
            { name: 'Fixed Assets', path: 'fixedAssets' },
        ]
    },
    {
        path: 'taxes',
        icon: faCalculator,
        name: 'Taxes',
        children: [
            { name: 'Declarations', path: 'declarations' },
        ]
    },
    {
        path: 'properties',
        icon: faHouse,
        name: 'Properties',
        children: [
            { name: 'Properties', path: 'properties' },
        ]
    },
    {
        path: 'contacts',
        icon: faAddressBook,
        name: 'Contacts',
        children: [
            { name: 'Contacts', path: 'contacts' },
        ]
    },
    {
        path: 'administration',
        icon: faCog,
        name: 'Administration',
        children: [
            { name: 'Settings', path: 'settings' },
            { name: 'Users', path: 'users' },
        ]
    },
];