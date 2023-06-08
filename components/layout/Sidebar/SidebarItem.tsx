'use client'

// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';

// Local imports
import { route } from '@/lib/types/route';
import Link from 'next/link';

interface ISidebarItem {
    route: route;
}

export const SidebarItem = ({ route }: ISidebarItem): JSX.Element => {
    const pathName = usePathname();

    const [isOver, setIsOver] = useState<boolean>(false);

    const routePath = useCallback(() => {
        return `/private/${route.path}`
    }, [route.path]);

    const itemIsActualRoute = useCallback(() => pathName?.includes(routePath()), [pathName, routePath]);

    return (
        <li
            className={
                `h-auto cursor-pointer transition-all
                 hover:border-l-8 hover:border-l-primary-500 hover:bg-primary-200 hover:text-secondary-500
                 active:border-l-primary-700 active:bg-primary-400
                 ${itemIsActualRoute() && ' border-l-8 border-l-primary-700 bg-primary-400 text-secondary-500'}`
            }
            onMouseEnter={() => setIsOver(true)}
            onMouseLeave={() => setIsOver(false)}
        >
            {/* Tooltip */}
            <AnimatePresence>
                {
                    isOver &&
                    <motion.div
                        className='absolute h-header flex flex-row items-center cursor-default text-custom-white'
                        initial={{
                            left: 40,
                            opacity: 0,
                        }}
                        animate={{
                            left: 60,
                            opacity: 1,
                            transition: {
                                duration: .3,
                                ease: easeInOut
                            }
                        }}
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: .3,
                                ease: easeInOut
                            }
                        }}
                        onMouseEnter={() => setIsOver(true)}
                        onMouseLeave={() => setIsOver(false)}
                    >
                        <div className='w-5 h-5 bg-secondary-500 rotate-45' />
                        <div className={`
                            absolute left-1 text-center whitespace-nowrap px-4 
                            py-1 bg-secondary-500 rounded-lg select-none
                        `}
                        >
                            {route.name}
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
            {/* Item */}
            <Link
                href={`/private/${route.path}`}
                className={`h-header flex flex-row items-center`}
                onMouseEnter={() => setIsOver(true)}
            >
                <div className='w-full'>
                    <FontAwesomeIcon
                        icon={route.icon}
                        className='w-full flex text-xl'
                    />
                </div>
            </Link>
        </li>
    )
}
