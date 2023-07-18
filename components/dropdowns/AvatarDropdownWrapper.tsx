'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AvatarDropdown } from 'pg-components';

// Local imports
import { getUser, signOut } from '@/lib/utils/apiCalls';
import { User } from '@/lib/types/user';
import { Locale } from '@/i18n-config';

const AvatarDropdownWrapper = ({ lang }: { lang: Locale }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
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

    useEffect(() => {
        getUser()
            .then((res) => setUser(res))
            .catch((e) => console.error(e));
    }, []);

    return (
        <div className='mr-5 flex w-auto items-center justify-center'>
            <p className='select-none whitespace-nowrap font-semibold'>
                {user?.nickname}
            </p>
            <AvatarDropdown
                picture={user?.picture}
                navigationItems={navigationItems}
            />
        </div>
    );
};

export default AvatarDropdownWrapper;
