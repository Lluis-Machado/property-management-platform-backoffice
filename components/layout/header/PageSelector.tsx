'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Local imports
import { route } from '@/lib/types/route';
import { routes } from '@/lib/routes';

const findParent = (path: string, routes: route[]) => {
    if (!path) return undefined;
    const segments = path.split('/').filter(segment => segment !== ''); // Split the path and remove empty segments
    const parentRoute = segments[2]; // Get the second segment (it's the parent route)
    return routes.find(route => route.path === parentRoute); // Find the parent with matching path and children
};

const currentRouteIsChild = (path: string): boolean => {
    if (!path) return false;
    const segments = path.split('/').filter(segment => segment !== ''); // Split the path and remove empty segments
    const possibleChild = segments[3]; // Try to get a segment next to parent
    return possibleChild !== undefined;
};

const PageSelector = () => {

    const pathName = usePathname();
    const itemIsActualRoute = useCallback((route: string) => pathName?.includes(route), [pathName]);

    const getBasePath = useCallback(() => {
        if (!pathName) return undefined;
        let lastIndex = pathName.lastIndexOf("/");
        if (lastIndex !== -1) {
            return pathName.substring(0, lastIndex);
        }
        return pathName;
    }, [pathName]);

    return (
        <div className='flex w-full h-full items-center '>
            <ul className='flex h-full cursor-pointer select-none'>
                {
                    currentRouteIsChild(pathName || '') && findParent(pathName || '', routes)?.children.map(({ name, path }) =>
                        <Link
                            key={path}
                            href={`${getBasePath()}/${path}`}
                            className={
                                `flex h-full px-6 max-w-[13rem] items-center border-r border-primary-500/30 transition-all
                                    hover:pt-2 hover:bg-primary-100 hover:font-bold hover:border-b-8 hover:border-b-primary-400 hover:text-md
                                    active:bg-primary-300 active:border-b-primary-600
                                    ${itemIsActualRoute(path) && ' pt-2 font-bold border-b-8 text-md bg-primary-300 border-b-primary-600'}`
                            }
                        >
                            <p className='truncate' title={(name.length >= 18) ? name : undefined}>
                                {name}
                            </p>
                        </Link>
                    )
                }
            </ul>
        </div>
    );
};

export default PageSelector;