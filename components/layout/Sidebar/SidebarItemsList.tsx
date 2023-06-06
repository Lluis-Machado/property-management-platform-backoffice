'use client'

// Libraries imports
import { AnimatePresence, easeIn, motion } from 'framer-motion';

// Local imports
import { route } from '@/lib/types/route';
import { SidebarItem } from './SidebarItem';
import { itemVariants } from '@/lib/framerMotion/dropdownVariants';

interface Props {
    Routes: route[];
}

export const SidebarItemsList = ({ Routes }: Props): JSX.Element => {
    return (
        <nav>
            <AnimatePresence>
                <motion.ul
                    className='w-[56px]'
                    initial='closed'
			        animate='open'
                    variants={{
                        open: {
                            transition: {
                                type: 'spring',
                                bounce: 0,
                                duration: 0.3,
                                delayChildren: 0.1,
                                staggerChildren: 0.05
                            }
                        },
                        closed: {
                            transition: {
                                type: 'spring',
                                bounce: 0,
                                duration: 0.1
                            }
                        }
                    }}
                >
                    {Routes.map(route =>
                        <SidebarItem route={route} key={route.name} />
                    )}
                </motion.ul>
            </AnimatePresence>
        </nav>
    )
}