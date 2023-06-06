// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter, usePathname } from 'next/navigation';


// Local imports
import { route } from '@/lib/types/route';
import { SidebarItemsList } from './SidebarItemsList';
import { useSidebar, useSidebarWidth } from "@/lib/context/SidebarContext";
import useMediaQuery from '@/lib/hooks/useMediaQuery';

interface ISidebarItem {
    route: route;
}

const gold = '#b89e6c';
const blue = '#274158';
const white = '#fbfbfb';
const transparent = undefined;

export const SidebarItem = ({ route }: ISidebarItem): JSX.Element => {
    const router = useRouter();
    const pathName = usePathname();

    const { sidebarWidthTransition, borderRadius, borderWidth, isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();

    const [isOver, setIsOver] = useState<boolean>(false);
    const width = useSidebarWidth();

    const isDesktop = useMediaQuery();

    const itemAnimationConsts = {
        ...sidebarWidthTransition,
        duration: .25
    }

    const arrowDegrees = useCallback(() => {
        if (isOver) {
            return isDesktop ? -90 : 0;
        }
        return isDesktop ? 0 : 90;
    }, [isDesktop, isOver]);


    const routePath = useCallback(() => {
        if (route.parent) {
            return `/private/${route.parent}/${route.path}`;
        }
        return `/private/${route.path}`
    }, [route.parent, route.path]);

    const itemIsActualRoute = useCallback(() => pathName?.includes(routePath()), [pathName, routePath]);

    const itemBGColor = useCallback(() => {
        if (isOver || (itemIsActualRoute() && (isDesktop || !route.parent))) {
            return gold;
        } else if (!isDesktop && route.parent) {
            return transparent;
        } else {
            return blue;
        }
    }, [isDesktop, isOver, itemIsActualRoute, route.parent]);


    const routeClicked = useCallback(() => !route.isGroup && router.push(routePath()), [route.isGroup, routePath, router])

    return (
        <motion.li
            className='h-auto cursor-pointer'
            onMouseEnter={() => isDesktop && setIsOver(true)}
            onMouseLeave={() => isDesktop && setIsOver(false)}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                transition: {
                    opacity: { delay: .25, duration: .25, ease: 'easeIn' }
                }
            }}
            exit={{
                opacity: 0,
                transition: {
                    opacity: { delay: .25, duration: .25, ease: 'easeOut' }
                }
            }}
        >
            {/* Tooltip when collapsed */}
            <AnimatePresence>
                {
                    isOver && isSidebarCollapsed && isDesktop &&
                    <motion.div
                        className='absolute h-header flex flex-row items-center cursor-default'
                        initial={{
                            left: 0,
                            opacity: 0,
                        }}
                        animate={{
                            left: width + borderWidth + 4,
                            opacity: 1,
                            transition: { ...itemAnimationConsts }
                        }}
                        exit={{
                            opacity: 0,
                            transition: { ...itemAnimationConsts }
                        }}
                        onMouseEnter={() => isDesktop && setIsOver(true)}
                        onMouseLeave={() => isDesktop && setIsOver(false)}
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
            {/* Item Group Desktop*/}
            <AnimatePresence>
                {
                    isDesktop &&
                    isOver && !isSidebarCollapsed &&
                    route.isGroup && route.children &&
                    <motion.div
                        className='absolute left-sidebar bg-secondary-500'
                        onMouseEnter={() => setIsOver(true)}
                        onMouseLeave={() => setIsOver(false)}
                        initial={{ width: 0 }}
                        animate={{ width, transition: { ...sidebarWidthTransition } }}
                        exit={{ width: 0, transition: { ...sidebarWidthTransition } }}
                    >
                        <SidebarItemsList Routes={route.children} />
                    </motion.div>
                }
            </AnimatePresence>
            {/* Item */}
            <motion.div
                className='h-header flex flex-row items-center'
                initial={{
                    backgroundColor: route.parent ? transparent : blue,
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
                    color: route.parent && !isDesktop && (isOver || itemIsActualRoute()) ? gold : white,
                    transition: { ...itemAnimationConsts }
                }}
                whileHover={{
                    color: route.parent && !isDesktop ? gold : white,
                    backgroundColor: route.parent && !isDesktop ? transparent : gold,
                    marginRight: 0,
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    paddingLeft: borderWidth,
                    transition: { ...itemAnimationConsts }
                }}
                onMouseEnter={() => isDesktop && setIsOver(true)}
                onMouseLeave={() => isDesktop && setIsOver(false)}
                onClick={() => {
                    if (isSidebarCollapsed && route.isGroup) {
                        setIsSidebarCollapsed(false);
                    }
                    if (!isDesktop) setIsOver(p => !p);
                    routeClicked();
                }}
            >
                <div className='w-sidebar-icon'>
                    <FontAwesomeIcon
                        icon={route.icon}
                        className='w-sidebar-icon flex text-xl'
                    />
                </div>
                <AnimatePresence>
                    {
                        !isSidebarCollapsed &&
                        <div className='flex flex-row items-center overflow-hidden'>
                            <div className='w-sidebar-text'>
                                <motion.p
                                    className='w-sidebar-text select-none text-md font-normal'
                                    animate={{ transition: { ...sidebarWidthTransition } }}
                                    exit={{ scale: 1, transition: { ...sidebarWidthTransition } }}
                                >
                                    {route.name}
                                </motion.p>
                            </div>
                            <div className='w-sidebar-icon'>
                                {
                                    route.isGroup &&
                                    <motion.button
                                        initial={{
                                            rotate: arrowDegrees(),
                                        }}
                                        animate={{
                                            rotate: arrowDegrees(),
                                            transition: {
                                                type: 'spring'
                                            },
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className='w-sidebar-icon flex text-xl'
                                        />
                                    </motion.button>
                                }
                            </div>
                        </div>
                    }
                </AnimatePresence>
            </motion.div>
            {/* Item Group Mobile*/}
            <AnimatePresence>
                {
                    !isDesktop &&
                    isOver && !isSidebarCollapsed &&
                    route.isGroup && route.children &&
                    <motion.div
                        className='bg-[#1F3548] shadow-[inset_0px_0px_10px_7px_#192B3B]'
                        initial={{ width: 0 }}
                        animate={{ width, transition: { ...sidebarWidthTransition } }}
                        exit={{ width: 0, transition: { ...sidebarWidthTransition } }}
                    >
                        <SidebarItemsList Routes={route.children} />
                    </motion.div>
                }
            </AnimatePresence>
        </motion.li>
    )
}
