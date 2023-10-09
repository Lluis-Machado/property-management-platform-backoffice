'use client';
import { useRouter } from 'next/navigation';
import { AvatarDropdown } from 'pg-components';

// Local imports
import { signOut } from '@/lib/utils/signOut';
import { Locale } from '@/i18n-config';

interface Props {
    lang: Locale;
    nickname: string;
    picture: string;
}

const AvatarDropdownWrapper = ({ lang, nickname, picture }: Props) => {
    const router = useRouter();

    const navigationItems = [
        {
            linkName: 'Profile',
            onClick: () => router.push(`/${lang}/private/profile`),
        },
        {
            linkName: 'Log Out',
            onClick: async () => await signOut().then((_) => router.push('/')),
        },
    ];

    return (
        <div className='mr-5 flex w-auto items-center justify-center'>
            <p className='select-none whitespace-nowrap font-semibold'>
                {nickname}
            </p>
            <AvatarDropdown
                picture={picture}
                navigationItems={navigationItems}
            />
        </div>
    );
};

export default AvatarDropdownWrapper;
