// Local imports
import { routes } from '@/lib/routes';
import { SidebarItemsList } from './Sidebar/SidebarItemsList';
import { SidebarHeader } from './Sidebar/SidebarHeader';

export const Sidebar = (): JSX.Element => (
    <div className='flex flex-col'>
        <SidebarHeader />
        <hr className='border-primary-500/50' />
        <SidebarItemsList Routes={routes} />
        <hr className='border-primary-500/50' />
    </div>
)