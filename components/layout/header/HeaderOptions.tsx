// React imports
import { FC, memo } from 'react';

// Libraries imports
import {
    IconDefinition,
    faBell,
    faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import { Locale } from '@/i18n-config';
import AvatarDropdownWrapper from '@/components/dropdowns/AvatarDropdownWrapper';
import { getUser } from '@/lib/utils/getUser';
import Link from 'next/link';

const headerOptions: { name: string; icon: IconDefinition; url: string }[] = [
    {
        name: 'notifications',
        icon: faBell,
        url: '#',
    },
    {
        name: 'options',
        icon: faGear,
        url: '/private/administration',
    },
];

interface Props {
    lang: Locale;
}

export const HeaderOptions: FC<Props> = memo(async function HeaderOptions({
    lang,
}) {
    const user = await getUser();

    return (
        <div className='z-20 flex flex-row text-secondary-500/50'>
            {headerOptions.map((icon) => (
                <Link
                    href={icon.url}
                    key={icon.name}
                    className='flex w-sidebar-icon min-w-sidebar-icon cursor-pointer items-center justify-center transition-all hover:scale-125'
                >
                    <FontAwesomeIcon icon={icon.icon} />
                </Link>
            ))}
            <AvatarDropdownWrapper
                lang={lang}
                nickname={user.nickname}
                picture={user.picture}
            />
        </div>
    );
});
