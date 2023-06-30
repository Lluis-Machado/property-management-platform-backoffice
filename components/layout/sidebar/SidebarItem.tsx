'use client'

// React imports
import { FC, memo, useCallback, useState } from 'react';

// Libraries imports
import { AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Local imports
import { Route } from '@/lib/types/route';

// Dynamic Routets
const SidebarTooltip = dynamic(() => import('./SidebarTooltip'));

interface Props {
    route: Route;
};

export const SidebarItem: FC<Props> = memo(function SidebarItem({ route }) {
    const pathName = usePathname();
    const [isOver, setIsOver] = useState<boolean>(false);
    const itemIsActualRoute = useCallback(() => pathName?.includes(`/private/${route.path}`), [pathName, route.path]);

    return (
        <li
            className={`h-auto cursor-pointer`}
            onMouseEnter={() => setIsOver(true)}
            onMouseLeave={() => setIsOver(false)}
        >
            {/* Tooltip */}
            <AnimatePresence>
                {
                    isOver &&
                    <SidebarTooltip
                        onMouseEnter={() => setIsOver(true)}
                        onMouseLeave={() => setIsOver(false)}
                        route={route}
                    />
                }
            </AnimatePresence>
            {/* Item */}
            <Link
                href={`/private/${route.path}`}
                className={`
                    h-header flex flex-row items-center transition-all
                    hover:border-l-8 hover:border-l-primary-500 hover:bg-primary-200 hover:text-secondary-500
                    active:border-l-primary-700 active:bg-primary-400
                    ${itemIsActualRoute() && ' border-l-8 border-l-primary-700 bg-primary-400 text-secondary-500'}`
                }
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
    );
});
