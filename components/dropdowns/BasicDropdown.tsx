'use client'

// React imports
import { MouseEvent, useEffect, useRef, useState } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

// Local imports
import { itemVariants } from '@/lib/framerMotion/dropdownVariants';

interface Props {
    /**
    * Label to show on the dropdown
    */
    label: string,
    /**
    * Item array to configure dropdown children
    */
    navigationItems: {
        linkName: string;
        onClick: ((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void) | string;
    }[]
}

export default function BasicDropdown({ label, navigationItems }: Props): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

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
                className='relative inline-flex'
                animate={isOpen ? 'open' : 'closed'}
                initial={false}
            >
                {/*  <!--  Start Dropdown trigger --> */}
                <button
                    className={`
                        inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium 
                        tracking-wide text-white transition duration-300 rounded whitespace-nowrap 
                        bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 focus-visible:outline-none
                        disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300 
                        disabled:shadow-none
                     `}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <span>{label}</span>
                    <motion.span
                        className='relative only:-mx-5'
                        variants={{
                            open: { rotate: 180, y: -1 },
                            closed: { rotate: 0 }
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-5 h-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            aria-labelledby='t-01 d-01'
                            role='graphics-symbol'
                        >
                            <title id='t-01'>Button icon</title>
                            <desc id='d-01'>An icon describing the buttons usage</desc>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                            />
                        </svg>
                    </motion.span>
                </button>
                {/*  <!--  End Dropdown trigger --> */}
                {/*  <!-- Start Menu list --> */}
                <motion.ul
                    className={`
                        flex absolute top-full z-10 mt-1 w-72 list-none flex-col 
                        rounded bg-white py-2 shadow-lg shadow-slate-500/10
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
                            clipPath: 'inset(10% 75% 90% 25%)',
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
                                        bg-none text-slate-500 flex items-start justify-start gap-2 p-2 px-5 
                                        transition-colors duration-300 hover:bg-primary-100 hover:text-primary-500 
                                        focus:bg-primary-300 focus:outline-none focus-visible:outline-none
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
        </AnimatePresence >
    )
}