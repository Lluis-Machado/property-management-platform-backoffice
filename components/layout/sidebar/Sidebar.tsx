// Local imports
import { routes } from '@/lib/routes';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItemsList } from './SidebarItemsList';

const Sidebar = (): React.ReactElement => {
    return (
        <div className='flex flex-col h-full'>
            <SidebarHeader />
            <hr className='border-primary-500/50' />
            <SidebarItemsList Routes={routes} />
            <hr className='border-primary-500/50' />
            <div className='flex flex-grow relative'>
                <p className='absolute whitespace-nowrap text-xl font-bold tracking-sidebar-wide origin-bottom-left transform left-[80%] bottom-5 -rotate-90 select-none'>
                    BACK OFFICE
                </p>
            </div>
        </div>
    );
};

export default Sidebar;