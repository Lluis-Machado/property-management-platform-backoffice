// Libraries imports
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface Tab {
    children: JSX.Element | JSX.Element[] | undefined;
    icon: IconProp;
    index?: number;
    panelId?: string;
    tabId?: string;
    title: string;
}