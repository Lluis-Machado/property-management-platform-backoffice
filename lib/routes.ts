import {
    faChartLine, faChartSimple, faDownload, faFolder, faHouseChimney, faListUl
} from '@fortawesome/free-solid-svg-icons';

// Local imports
import { route } from './types/route';

export const routes: route[] = [
    {
        path: 'dashboard',
        icon: faChartSimple,
        name: 'Dashboard',
    },
    {
        path: 'propertyInformation',
        icon: faHouseChimney,
        name: 'Property Information',
    },
    {
        path: 'finance',
        icon: faChartLine,
        name: 'Finance',
    },
    {
        path: 'declarations',
        icon: faListUl,
        name: 'Declarations',
    },
    {
        path: 'documents',
        icon: faFolder,
        name: 'Documents',
    },
    {
        path: 'downloadCenter',
        icon: faDownload,
        name: 'Download Center',
    },
];