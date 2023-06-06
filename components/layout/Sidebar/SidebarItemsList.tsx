// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';

// Local imports
import { route } from '@/lib/types/route';
import { SidebarItem } from './SidebarItem';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useSidebar, useSidebarWidth } from '@/lib/context/SidebarContext';

interface Props {
    Routes: route[];
}

export const SidebarItemsList = ({ Routes }: Props): JSX.Element => {

    const isDesktop = useMediaQuery();
    const { sidebarWidthTransition, borderWidth, isSidebarCollapsed } = useSidebar();
    const width = useSidebarWidth() + borderWidth;

    return (
        <nav>
            <motion.ul
                initial={{
                    width: 0,
                    opacity: 0,
                }}
                animate={{
                    width,
                    opacity: 1,
                    transition: {
                        width: { ...sidebarWidthTransition },
                        opacity: { delay: .25, duration: .25, ease: 'easeIn' }
                    }
                }}
                exit={{
                    width: 0,
                    opacity: 0,
                    transition: {
                        width: { ...sidebarWidthTransition },
                        opacity: { delay: .25, duration: .25, ease: 'easeOut' }
                    }
                }}

            >
                {Routes.map(route =>
                    <AnimatePresence key={route.name} >
                        {
                            (isDesktop || !isSidebarCollapsed) &&
                            <SidebarItem route={route} />
                        }
                    </AnimatePresence>
                )}
            </motion.ul>
        </nav>
    )
}