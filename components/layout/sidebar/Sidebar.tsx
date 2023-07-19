// Local imports
import { routes } from '@/lib/routes';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItemsList } from './SidebarItemsList';

const Sidebar = (): React.ReactElement => {
    return (
        <div className='flex h-full flex-col'>
            <SidebarHeader />
            <hr className='border-primary-500/50' />
            <SidebarItemsList Routes={routes} />
            <hr className='border-primary-500/50' />
            <div className='relative flex flex-grow'>
                <p className='absolute bottom-5 left-[80%] origin-bottom-left -rotate-90 transform select-none whitespace-nowrap text-xl font-bold tracking-sidebar-wide'>
                    BACK OFFICE
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
