// Local imports
import { routes } from '@/lib/routes';
import { SidebarItemsList } from './Sidebar/SidebarItemsList';
import { SidebarHeader } from './Sidebar/SidebarHeader';

export const Sidebar = (): JSX.Element => (
    <div className='flex flex-col h-full'>
        <div>
            <SidebarHeader />
            <hr className='border-primary-500/50' />
            <SidebarItemsList Routes={routes} />
            <hr className='border-primary-500/50' />
        </div>
        <div className='h-full relative'>
            <p className='absolute whitespace-nowrap text-xl font-bold tracking-sidebar-wide origin-bottom-left transform left-[80%] bottom-5 -rotate-90 select-none'>
                BACK OFFICE
            </p>
        </div>
    </div>
)