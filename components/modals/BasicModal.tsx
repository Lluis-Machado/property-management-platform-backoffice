// React imports
import { useEffect, useRef, useState } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    /**
    * Text to be shown on the modal button
    */
    labelText?: string;
    /**
    * Modal title
    */
    title?: string;
    /**
    * Modal body text
    */
    bodyText?: string;
    /**
    * If true, shows a close button
    */
    showCloseButton?: boolean;
    /**
    * If true, hides modal on outside click
    */
    hideOnOutsideClick?: boolean;
}

export default function BasicModal({
    labelText,
    title,
    bodyText,
    showCloseButton = true,
    hideOnOutsideClick = true,
}: Props): JSX.Element {

    const [isShowing, setIsShowing] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (hideOnOutsideClick && wrapperRef.current && !wrapperRef.current.contains(event.target))
                setIsShowing(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [hideOnOutsideClick, wrapperRef])

    return (
        <>
            <button
                onClick={() => setIsShowing(true)}
                className={`
                    inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded 
                    bg-primary-500 px-5 text-sm font-medium tracking-wide text-white 
                    transition duration-300 hover:bg-primary-600 focus:bg-primary-900 
                    focus-visible:outline-none disabled:cursor-not-allowed disabled:border-primary-300
                    disabled:bg-primary-300 disabled:shadow-none
                `}
            >
                <span>{labelText}</span>
            </button>

            <AnimatePresence>
                {
                    isShowing && typeof document !== 'undefined'
                        ?
                        <div
                            className={`
                                fixed top-0 left-0 z-20 flex h-screen w-screen items-center 
                                justify-center bg-slate-300/20 backdrop-blur-sm
                            `}
                            aria-modal='true'
                            role='dialog'
                        >
                            {/* <!-- Modal --> */}
                            <motion.div
                                ref={wrapperRef}
                                className={`
                                    flex max-h-[90vh] w-11/12 max-w-xl flex-col gap-6 overflow-hidden
                                    rounded bg-white p-6 text-slate-500 shadow-xl shadow-slate-700/10
                                `}
                                role='document'
                                initial={{
                                    opacity: 0,
                                    scale: 0.75,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        ease: 'easeOut',
                                        duration: 0.15,
                                    },
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.75,
                                    transition: {
                                        ease: 'easeIn',
                                        duration: 0.15,
                                    },
                                }}
                            >
                                {/* <!-- Modal header --> */}
                                <header className='flex items-center gap-4'>
                                    <h3 className='flex-1 text-xl font-medium text-slate-700'>
                                        {title}
                                    </h3>
                                    {
                                        showCloseButton &&
                                        <motion.button
                                            onClick={() => setIsShowing(false)}
                                            className={`
                                                inline-flex h-10 items-center justify-center gap-2 justify-self-center 
                                                whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide 
                                                text-primary-500 transition duration-300 hover:bg-primary-100 
                                                hover:text-primary-600 focus:bg-primary-200 focus:text-primary-900 
                                                focus-visible:outline-none disabled:cursor-not-allowed 
                                                disabled:text-primary-300 disabled:shadow-none disabled:hover:bg-transparent
                                            `}
                                            aria-label='close dialog'
                                            whileHover={{ rotate: 90 }}
                                            transition={{
                                                ease: 'linear',
                                                duration: 0.01
                                            }}
                                        >
                                            <span className='relative only:-mx-5 flex'>
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                    className='h-5 w-5'
                                                />
                                            </span>
                                        </motion.button>
                                    }
                                </header>
                                {/* <!-- Modal body --> */}
                                <div className='flex-1 overflow-auto'>
                                    <p>
                                        {bodyText}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                        :
                        null
                }
            </AnimatePresence>
        </>
    )
}