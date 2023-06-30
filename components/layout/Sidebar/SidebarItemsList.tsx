import 'server-only';

// Local imports
import { route } from '@/lib/types/route';
import { SidebarItem } from './SidebarItem';

interface Props {
    Routes: route[];
};

export const SidebarItemsList = ({ Routes }: Props): React.ReactElement => {
    return (
        <nav>
            <ul className='w-full'>
                {Routes.map(route =>
                    <SidebarItem route={route} key={route.name} />
                )}
            </ul>
        </nav>
    );
};