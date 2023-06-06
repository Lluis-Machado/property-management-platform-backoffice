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
        <div className='flex flex-row h-header justify-between items-center'>
            {/* Property Selector */}
            <div className='w-full flex justify-center items-center mt-4'>
                <Formik
                    initialValues={{
                        property: 'baumhaus',
                    }}
                    onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
                >
                    <FormikForm>
                        <div className={'md:w-[25rem] lg:w-[30rem] xl:w-[36rem]'}>
                            <Select
                                name='property'
                                inputsList={inputsList}
                                defaultValue={inputsList[0]}
                                submitOnChange
                                isSecondary
                            />
                        </div>
                    </FormikForm>
                </Formik>
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