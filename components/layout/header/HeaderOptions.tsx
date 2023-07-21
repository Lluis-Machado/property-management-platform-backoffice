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
import { User } from '@/lib/types/user';

const headerOptions: { name: string; icon: IconDefinition }[] = [
    {
        name: 'notifications',
        icon: faBell,
    },
    {
        name: 'options',
        icon: faGear,
    },
];

interface Props {
    lang: Locale;
    user: User;
}

export const HeaderOptions: FC<Props> = memo(function HeaderOptions({
    lang,
    user,
}) {
    return (
        <div className='z-20 flex flex-row text-secondary-500/50'>
            {headerOptions.map((icon) => (
                <div
                    key={icon.name}
                    className='flex w-sidebar-icon min-w-sidebar-icon cursor-pointer items-center justify-center transition-all hover:scale-125'
                >
                    <FontAwesomeIcon icon={icon.icon} />
                </div>
            ))}
            <AvatarDropdownWrapper lang={lang} user={user} />
        </div>
    );
});
