// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import { faBars, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

// Local imports
import { useSidebar } from '@/lib/context/SidebarContext';
import Logo from '@/public/WuF_White.png';

export const SidebarToggleButton = (): JSX.Element => {

    const {
        setIsSidebarCollapsed, isSidebarCollapsed,
        sidebarWidthTransition, sidebarWidthCollapsed
    } = useSidebar();

    return (
        <motion.div
            className='h-header flex flex-row items-center'
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, transition: { delay: .25, duration: .25, ease: 'easeIn' } }}
            exit={{ opacity: 0, transition: { delay: .25, duration: .25, ease: 'easeOut' } }}
        >
            {/* Company Icons */}
            <AnimatePresence>
                {
                    !isSidebarCollapsed &&
                    <motion.div
                        className='flex flex-row absolute items-center'
                        initial={{ right: sidebarWidthCollapsed }}
                        animate={{ right: sidebarWidthCollapsed, transition: { ...sidebarWidthTransition } }}
                        exit={{ right: sidebarWidthCollapsed }}
                    >
                        <div className='w-sidebar-icon'>
                            <Image src={Logo} alt='WuF logo' className='scale-80' />
                        </div>
                        <div className='w-sidebar-text'>
                            <p className='text-center text-md leading-4 select-none'>
                                Eigentümerportal
                            </p>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
            {/* Hamburguer */}
            <div className='w-sidebar-icon absolute right-0'>
                <FontAwesomeIcon
                    icon={isSidebarCollapsed ? faBars : faBarsStaggered}
                    className='w-full text-xl text-primary-500 cursor-pointer flex'
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>
        </motion.div>
    )
}
