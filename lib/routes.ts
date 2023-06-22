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
            { name: 'AR Invoices', path: 'incomes' },
            { name: 'AP Invoices', path: 'expenses' },
            { name: 'Business Partners', path: 'businessPartners' },
            { name: 'Fixed Assets', path: 'fixedAssets' },
            { name: 'Loans', path: 'loans' },
            { name: 'Periods', path: 'periods' },
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
            { name: 'Property Info', path: 'property' },
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