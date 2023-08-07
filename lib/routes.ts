import {
    faAddressBook,
    faBuilding,
    faCalculator,
    faCog,
    faFileAlt,
    faHouse,
    faReceipt,
} from '@fortawesome/free-solid-svg-icons';

// Local imports
import { Route } from './types/route';

export const routes: Route[] = [
    {
        path: 'documents',
        icon: faFileAlt,
        name: 'Documents',
        children: [
            { name: 'Postbox', path: 'postbox' },
            { name: 'Documents', path: 'files' },
        ],
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
        ],
    },
    {
        path: 'taxes',
        icon: faCalculator,
        name: 'Taxes',
        children: [{ name: 'Declarations', path: 'declarations' }],
    },
    {
        path: 'properties',
        icon: faHouse,
        name: 'Properties',
        children: [{ name: 'Property Info', path: 'property' }],
    },
    {
        path: 'contacts',
        icon: faAddressBook,
        name: 'Contacts',
        children: [{ name: 'Contact Info', path: 'contactInfo' }],
    },
    {
        path: 'companies',
        icon: faBuilding,
        name: 'Companies',
        children: [{ name: 'Company Info', path: 'companyInfo' }],
    },
    {
        path: 'administration',
        icon: faCog,
        name: 'Administration',
        children: [
            { name: 'Settings', path: 'settings' },
            { name: 'Users', path: 'users' },
        ],
    },
];
