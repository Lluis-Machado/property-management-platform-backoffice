import { faDochub } from '@fortawesome/free-brands-svg-icons';
import {
    faChartBar, faCog, faExchangeAlt, faFileAlt
} from '@fortawesome/free-solid-svg-icons';

// Local imports
import { route } from './types/route';

export const routes: route[] = [
    {
        path: 'documents',
        icon: faDochub,
        name: 'Documents',
        children: [
            { name: 'Invoices', path: 'invoices' },
            { name: 'Incomes', path: 'incomes' },
            { name: 'Management', path: 'management' },
            { name: 'Downloads', path: 'downloads' },
            { name: 'Clients', path: 'clients' },
        ]
    },
    {
        path: 'reports',
        icon: faFileAlt,
        name: 'Reports',
        children: [
            { name: 'Financial', path: 'financial' },
            { name: 'Sales', path: 'sales' },
            { name: 'Inventory', path: 'inventory' },
            { name: 'Expenses', path: 'expenses' },
            { name: 'Analytics', path: 'analytics' },
        ]
    },
    {
        path: 'transactions',
        icon: faExchangeAlt,
        name: 'Transactions',
        children: [
            { name: 'Sales', path: 'sales' },
            { name: 'Purchases', path: 'purchases' },
            { name: 'Expenses', path: 'expenses' },
            { name: 'Receipts', path: 'receipts' },
            { name: 'Banking', path: 'banking' },
        ]
    },
    {
        path: 'settings',
        icon: faCog,
        name: 'Settings',
        children: [
            { name: 'Company', path: 'company' },
            { name: 'Users', path: 'users' },
            { name: 'Permissions', path: 'permissions' },
            { name: 'Preferences', path: 'preferences' },
            { name: 'Backup', path: 'backup' },
        ]
    },
];