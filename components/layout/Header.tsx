'use client'

// Libraries imports
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AvatarDropdownWrapper from '@/components/dropdowns/AvatarDropdownWrapper';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { route } from '@/lib/types/route';
import { useCallback } from 'react';

const headerOptions = [
    {
        name: 'notifications',
        icon: faBell,
    },
    {
        name: 'options',
        icon: faGear,
    }
]

export const Header = (): JSX.Element => {
    const pathName = usePathname();
    const itemIsActualRoute = useCallback((route: string) => pathName?.includes(route), [pathName]);

    const findParent = useCallback((path: string, routes: route[]) => {
        if (!path) return undefined;
        const segments = path.split('/').filter(segment => segment !== ''); // Split the path and remove empty segments
        const parentRoute = segments[2]; // Get the second segment (it's the parent route)
        return routes.find(route => route.path === parentRoute); // Find the parent with matching path and children
    }, [pathName])

    const getBasePath = useCallback(() => {
        if (!pathName) return undefined;
        let lastIndex = pathName.lastIndexOf("/");
        if (lastIndex !== -1) {
            return pathName.substring(0, lastIndex);
        }
        return pathName;
    }, [pathName])

    return (
        <div className='flex flex-row h-header justify-between'>
            {/* Property Selector */}
            <div className='flex w-full h-full items-center '>
                <ul className='flex h-full cursor-pointer select-none'>
                    {
                        findParent(pathName || '', routes)?.children.map(({ name, path }) =>
                            <li
                                key={path}
                                className={
                                    `flex h-full px-6 max-w-[13rem] items-center border-r border-primary-500/30 transition-all
                                    hover:pt-2 hover:bg-primary-100 hover:font-bold hover:border-b-8 hover:border-b-primary-400 hover:text-md
                                    active:bg-primary-300 active:border-b-primary-600
                                    ${itemIsActualRoute(path) && ' pt-2 font-bold border-b-8 text-md bg-primary-300 border-b-primary-600'}`
                                }
                            >
                                <Link href={`${getBasePath()}/${path}`} className='truncate' title={(name.length >= 18) ? name : undefined}>
                                    {name}
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
            {/* Header options */}
            <div className='flex flex-row text-secondary-500/50 z-20'>
                {
                    headerOptions.map(icon =>
                        <div
                            key={icon.name}
                            className='w-sidebar-icon min-w-sidebar-icon flex justify-center items-center cursor-pointer transition-all hover:scale-125'
                        >
                            <FontAwesomeIcon icon={icon.icon} />
                        </div>
                    )
                }
                <AvatarDropdownWrapper />
            </div>
        </div>
    )
}

export default Header;