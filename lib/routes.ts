import { faDochub } from '@fortawesome/free-brands-svg-icons';
import {
    faCog, faExchangeAlt, faFileAlt
} from '@fortawesome/free-solid-svg-icons';

// Local imports
import { route } from './types/route';

export const routes: route[] = [
    {
        path: 'documents',
        icon: faDochub,
        name: 'Documents',
        children: [
            { name: 'Archives', path: 'archives' },
            { name: 'Documents', path: 'files' },
        ]
    },
    {
        path: 'accounting',
        icon: faFileAlt,
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
        icon: faCog,
        name: 'Taxes',
        children: [
            { name: 'Declarations', path: 'declarations' },
        ]
    },
    {
        path: 'properties',
        icon: faCog,
        name: 'Properties',
        children: [
            { name: 'Properties', path: 'properties' },
        ]
    },
    {
        path: 'contacts',
        icon: faExchangeAlt,
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