// Libraries imports
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface Route {
    path: string;
    icon: IconProp;
    name: string;
    children: RouteChildren[];
};

interface RouteChildren {
    name: string;
    path: string;
};