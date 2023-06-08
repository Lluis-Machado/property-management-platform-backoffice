'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

// Local imports
import { getUser, signOut } from '@/lib/utils/apiCalls'
import { user } from '@/lib/types/user'
import AvatarDropdown from '@/components/dropdowns/AvatarDropdown';

const AvatarDropdownWrapper = () => {
    const [user, setUser] = useState<user | undefined>(undefined)
    const router = useRouter();

    const navigationItems = [
        {
            linkName: 'Profile',
            onClick: './private/profile'
        },
        {
            linkName: 'Log Out',
            onClick: async () => await signOut().then(_ => router.push('/'))
        }
    ]

    useEffect(() => {
        getUser().then(res => setUser(res))
    }, [])

    return (
        <div className='mr-5 w-auto flex justify-center items-center'>
            <p className='whitespace-nowrap font-semibold select-none'>{user?.nickname}</p>
            <AvatarDropdown picture={user?.picture} navigationItems={navigationItems} />
        </div>
    )
}

export default AvatarDropdownWrapper