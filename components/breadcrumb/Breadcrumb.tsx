'use client';
import { memo, useMemo } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Route {
    name: string;
    path: string;
}

const Route = ({
    routes,
    idx,
    item,
}: {
    routes: Route[];
    idx: number;
    item: Route;
}): React.ReactElement => {
    const last: boolean = idx === routes.length - 1;
    const liClassName = () => {
        if (last) {
            return 'flex flex-1 items-center gap-2';
        } else {
            return idx === routes.length - 2
                ? 'flex items-center gap-2'
                : 'hidden items-center gap-2 md:flex';
        }
    };

    return (
        <li className={liClassName()} key={item.name}>
            <Link
                href={item.path}
                className={
                    last
                        ? 'pointer-events-none max-w-[20ch] select-none items-center gap-1 truncate whitespace-nowrap text-primary-600'
                        : 'flex max-w-[20ch] select-none items-center gap-1 truncate whitespace-nowrap text-secondary-500 transition-colors hover:text-primary-500'
                }
            >
                {item.name}
            </Link>
            {!last && <FontAwesomeIcon icon={faChevronRight} />}
        </li>
    );
};

const Breadcrumb = (): React.ReactElement => {
    const pathName = usePathname();

    const getBreadCrumbs = useMemo((): Route[] => {
        if (!pathName) return [];

        const breadCrumbs: Route[] = [];

        let routes = pathName.split('/');
        const privateRoute = routes.slice(0, 3).join('/');

        const pageRoute = routes.splice(3);

        pageRoute.forEach((route, idx, routes) => {
            if (
                !/^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(
                    route
                ) &&
                !route.startsWith('auth0')
            ) {
                const name =
                    route.charAt(0).toUpperCase() +
                    route.slice(1).replace(/([A-Z])/g, ' $1');
                const path = `${privateRoute}/${routes
                    .slice(0, idx + 1)
                    .join('/')}`;
                breadCrumbs.push({ name, path });
            }
        });

        return breadCrumbs;
    }, [pathName]);

    return (
        <nav
            aria-label='Breadcrumb'
            className='relative z-10 my-5 w-min text-base'
        >
            <ol className='flex list-none items-stretch gap-2'>
                {getBreadCrumbs.map((item, idx, routes) => (
                    <Route
                        routes={routes}
                        idx={idx}
                        item={item}
                        key={item.name}
                    />
                ))}
            </ol>
        </nav>
    );
};

export default memo(Breadcrumb);
