'use client'

// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter, usePathname } from 'next/navigation';

// Local imports
import { route } from '@/lib/types/route';
import { itemVariants } from '@/lib/framerMotion/dropdownVariants';

interface ISidebarItem {
    route: route;
}

const gold = '#b89e6c';
const blue = '#274158';
const white = '#fbfbfb';

export const SidebarItem = ({ route }: ISidebarItem): JSX.Element => {
    const router = useRouter();
    const pathName = usePathname();
    const borderRadius = 6;
    const borderWidth = 8;

    const [isOver, setIsOver] = useState<boolean>(false);

    const routePath = useCallback(() => {
        return `/private/${route.path}`
    }, [route.path]);

    const itemIsActualRoute = useCallback(() => pathName?.includes(routePath()), [pathName, routePath]);

    const itemBGColor = useCallback(() => {
        if (isOver || itemIsActualRoute()) {
            return gold;
        } else {
            return blue;
        }
    }, [isOver, itemIsActualRoute]);

    const routeClicked = useCallback(() => router.push(routePath()), [routePath, router])

    return (
        <motion.li
            className='h-auto cursor-pointer'
            onMouseEnter={() => setIsOver(true)}
            onMouseLeave={() => setIsOver(false)}
            variants={itemVariants}
        >
            {/* Tooltip */}
            <AnimatePresence>
                {
                    isOver &&
                    <motion.div
                        className='absolute h-header flex flex-row items-center cursor-default'
                        initial={{
                            left: 0,
                            opacity: 0,
                        }}
                        animate={{
                            left: 48 + borderWidth + 4,
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
            <motion.div
                className='h-header flex flex-row items-center'
                initial={{
                    backgroundColor: blue,
                    marginRight: borderWidth,
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    paddingLeft: borderWidth,
                    color: white,
                }}
                animate={{
                    backgroundColor: itemBGColor(),
                    marginRight: itemIsActualRoute() || isOver ? 0 : borderWidth,
                    borderTopRightRadius: itemIsActualRoute() || isOver ? borderRadius : 0,
                    borderBottomRightRadius: itemIsActualRoute() || isOver ? borderRadius : 0,
                    paddingLeft: itemIsActualRoute() || isOver ? borderWidth : 0,
                    color: white,
                    transition: {
                        duration: .3,
                        ease: easeInOut
                    }
                }}
                whileHover={{
                    color: white,
                    backgroundColor: gold,
                    marginRight: 0,
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    paddingLeft: borderWidth,
                    transition: {
                        duration: .3,
                        ease: easeInOut
                    }
                }}
                onMouseEnter={() => setIsOver(true)}
                onMouseLeave={() => setIsOver(false)}
                onClick={() => routeClicked()}
            >
                <div className='w-sidebar-icon'>
                    <FontAwesomeIcon
                        icon={route.icon}
                        className='w-sidebar-icon flex text-xl'
                    />
                </div>
            </motion.div>
        </motion.li>
    )
}
