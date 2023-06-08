import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface route {
    path: string;
    icon: IconProp;
    name: string;
    children: routeChildren[];
}

interface routeChildren {
    name: string;
    path: string;
}