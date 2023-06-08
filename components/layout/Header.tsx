'use client'

// React imports
import { useEffect, useState } from 'react';

// Libraries imports
import { motion } from 'framer-motion';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation'
import { Formik, Form as FormikForm } from 'formik';

// Local imports
import { getUser, signOut } from '@/lib/utils/apiCalls'
import { user } from '@/lib/types/user'
import AvatarDropdown from '@/components/dropdowns/AvatarDropdown';
import Select from '@/components/selects/Select';

const headerOptions = [
    {
        name: 'notifications',
        icon: faBell,
        whileHoverAnimation: {
            rotateZ: [0, 45, - 45, 0],
            transition: {
                duration: 1,
                ease: 'easeInOut',
            }
        }
    },
    {
        name: 'options',
        icon: faGear,
        whileHoverAnimation: {
            rotateZ: 60,
            transition: {
                duration: .25,
                ease: 'easeInOut'
            }
        }
    }
]

const inputsList = [
    {
        label: 'Villa Baumhaus - Ferienvermietung',
        value: 'baumhaus'
    },
    {
        label: 'Villa Sonnenschein - Dauervermietung',
        value: 'sonnenschein'
    }
]

export const Header = (): JSX.Element => {

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
        <div className='flex flex-row h-header justify-between'>
            {/* Property Selector */}
            <div className='flex w-full h-full items-center '>
                <ul className='flex h-full cursor-pointer'>
                    {
                        ['Invoices', 'Incomes', 'Page 3', 'SteuerklareungungangenSteuerklareungungangenSteuerklareungungangen', 'Page 5'].map((val) =>
                            <li className={
                                `flex h-full px-6 max-w-[13rem] items-center border-r border-primary-500/30 transition-all
                                hover:pt-2 hover:bg-primary-100 hover:font-bold hover:border-b-8 hover:border-b-primary-400 hover:text-md
                                active:bg-primary-300 active:border-b-primary-600`
                            }
                            >
                                <p className='truncate' title={(val.length >= 18) ? val : undefined}>
                                    {val}
                                </p>
                            </li>
                        )
                    }
                </ul>
            </div>
            {/* Header options */}
            <div className='flex flex-row text-secondary-500/50 z-20'>
                {
                    headerOptions.map(icon =>
                        <motion.div
                            key={icon.name}
                            className='w-sidebar-icon min-w-sidebar-icon flex justify-center items-center cursor-pointer'
                            whileHover={icon.whileHoverAnimation}
                        >
                            <FontAwesomeIcon icon={icon.icon} />
                        </motion.div>
                    )
                }
                <div className='mr-5 w-auto flex justify-center items-center'>
                    <p className='whitespace-nowrap font-semibold'>{user?.nickname}</p>
                    <AvatarDropdown picture={user?.picture} navigationItems={navigationItems} />
                </div>
            </div>
        </div>
    )
}

export default Header;