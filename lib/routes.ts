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
        name: 'Module 1',
    },
    {
        path: 'finance',
        icon: faChartLine,
        name: 'Module 2',
    },
    {
        path: 'declarations',
        icon: faListUl,
        name: 'Module 3',
    },
    {
        path: 'documents',
        icon: faFolder,
        name: 'Module 4',
    },
    {
        path: 'downloadCenter',
        icon: faDownload,
        name: 'Module 5',
    },
];