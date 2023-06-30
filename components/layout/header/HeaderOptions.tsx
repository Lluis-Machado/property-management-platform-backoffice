// React imports
import { FC, memo } from 'react';

// Libraries imports
import { IconDefinition, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import { Locale } from '@/i18n-config';
import AvatarDropdownWrapper from '@/components/dropdowns/AvatarDropdownWrapper';

const headerOptions: { name: string, icon: IconDefinition }[] = [
    {
        name: 'notifications',
        icon: faBell,
    },
    {
        name: 'options',
        icon: faGear,
    }
];

interface Props {
    lang: Locale
};

export const HeaderOptions: FC<Props> = memo(function HeaderOptions({ lang }) {
    return (
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
            <AvatarDropdownWrapper lang={lang} />
        </div>
    );
});
