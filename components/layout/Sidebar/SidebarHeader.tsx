// Libraries imports
import Image from 'next/image';

// Local imports
import Logo from '@/public/WuF_White.png';

export const SidebarHeader = (): JSX.Element => (
    <div className='h-header flex flex-row items-center'>
        <div className='w-sidebar-icon absolute right-0'>
            <Image
                src={Logo}
                alt='Company Logo'
                className='w-full text-xl text-primary-500 cursor-pointer flex p-2 select-none'
                loading='eager'
                quality={13}
                priority
            />
        </div>
    </div>
)