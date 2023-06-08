'use client'

// React imports
import { MouseEvent, useEffect, useRef, useState } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Local imports
import { itemVariants } from '@/lib/framerMotion/dropdownVariants';
import placeholder from '@/public/Portrait_Placeholder.png';

interface Props {
    /**
    * URL for the avatar picture
    */
    picture?: string,
    /**
    * Item array to configure dropdown children
    */
    navigationItems: {
        linkName: string;
        onClick: ((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void) | string;
    }[]
}

export default function AvatarDropdown({ picture, navigationItems }: Props): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target))
                setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    return (
        <AnimatePresence>
            {/* <!-- Component: Basic dropdown menu--> */}
            <motion.div
                ref={wrapperRef}
                // key={'userdropdownkey'}
                className='relative ml-2 select-none'
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
            >
                {/*  <!--  Start Dropdown trigger --> */}
                <button
                    className={`
                        flex max-w-xs h-8 w-8 items-center rounded-full bg-custom-white 
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
                        focus:ring-offset-primary-500
                    `}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <span className='sr-only'>Open user menu</span>
                    <Image
                        height={50}
                        width={50}
                        className='h-8 w-8 rounded-full'
                        src={picture || placeholder}
                        alt='user picture'
                        loading='eager'
                        quality={13}
                    />
                </button>
                {/*  <!--  End Dropdown trigger --> */}
                {/*  <!-- Start Menu list --> */}
                <motion.ul
                    className={`
                        flex absolute right-0 top-full z-10 mt-2 w-48 origin-top-right list-none flex-col 
                        rounded bg-white py-1 shadow-lg shadow-slate-500/10 ring-1 ring-black ring-opacity-5 
                        focus:outline-none
                    `}
                    variants={{
                        open: {
                            clipPath: 'inset(-20% -20% -20% -20%)',
                            transition: {
                                type: 'spring',
                                bounce: 0,
                                duration: 0.5,
                                delayChildren: 0.1,
                                staggerChildren: 0.05
                            }
                        },
                        closed: {
                            clipPath: 'inset(10% 5% 90% 90%)',
                            transition: {
                                type: 'spring',
                                bounce: 0,
                                duration: 0.2
                            }
                        }
                    }}
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                    {navigationItems.map((item) =>
                        <motion.li key={item.linkName} variants={itemVariants}>
                            {typeof item.onClick === 'string' ?
                                <Link
                                    className={`
                                        bg-none text-slate-500 flex items-start justify-start gap-2 
                                        p-2 px-5 transition-colors duration-300 hover:bg-primary-100
                                        hover:text-primary-500 focus:bg-primary-300 focus:outline-none 
                                        focus-visible:outline-none
                                     `}
                                    onClick={() => setIsOpen(false)}
                                    href={item.onClick}
                                >
                                    <span className='flex flex-col gap-1 overflow-hidden whitespace-nowrap'>
                                        <span className='leading-5 truncate'>{item.linkName}</span>
                                    </span>
                                </Link>
                                :
                                <button
                                    className={`
                                        bg-none text-slate-500 w-full flex items-start justify-start gap-2 
                                        p-2 px-5 transition-colors duration-300 hover:bg-primary-100 
                                        hover:text-primary-500 focus:bg-primary-300 focus:outline-none 
                                        focus-visible:outline-none
                                    `}
                                    type='button'
                                    onClick={(e) => {
                                        (typeof item.onClick === 'function') && item.onClick(e)
                                        setIsOpen(false)
                                    }}
                                >
                                    <span className='flex flex-col gap-1 overflow-hidden whitespace-nowrap'>
                                        <span className='leading-5 truncate'>{item.linkName}</span>
                                    </span>
                                </button>
                            }
                        </motion.li>
                    )}
                </motion.ul>
                {/*  <!-- End Menu list --> */}
            </motion.div>
            {/* <!-- End Basic dropdown menu--> */}
        </AnimatePresence>
    )
}