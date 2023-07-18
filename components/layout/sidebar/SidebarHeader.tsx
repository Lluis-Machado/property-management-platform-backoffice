// Libraries imports
import Image from 'next/image';

// Local imports
import Logo from '@/public/WuF_White.png';

export const SidebarHeader = (): React.ReactElement => (
    <div className='flex h-header flex-row items-center'>
        <div className='absolute right-0 w-sidebar-icon'>
            <Image
                src={Logo}
                alt='Company Logo'
                className='flex w-full cursor-pointer select-none p-2 text-xl text-primary-500'
                loading='eager'
                quality={13}
                priority
            />
        </div>
    </div>
);
