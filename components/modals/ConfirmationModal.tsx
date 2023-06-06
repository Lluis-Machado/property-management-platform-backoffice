// React imports
import { useEffect, useRef, useState } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
    * If true, hides modal on outside click (default: true)
    */
    hideOnOutsideClick?: boolean;
    /**
    * Font Awesome Icon to show
    */
    icon?: IconProp;
    /**
    * Icon color based on type
    */
    iconColor?: iconColor;
    /**
    * Whether or not show confirm button (default: true)
    */
    showConfirmButton?: boolean;
    /**
    * Whether or not show cancel button (default: true)
    */
    showCancelButton?: boolean;
    /**
    * Text for confirm button (default: 'Yes')
    */
    confirmButtonText?: string;
    /**
    * Text for cancel button (default: 'Cancel')
    */
    cancelButtonText?: string;
    /**
    * Action when confirmed
    */
    onConfirm?: () => void;
}

type iconColor = 'success' | 'warning' | 'info' | 'danger' | 'default';

const getIconColor = (type: iconColor): string => {
    const colors = {
        success: 'text-emerald-500',
        warning: 'text-amber-500',
        info: 'text-cyan-500',
        danger: 'text-pink-500',
        default: '',
    };

    return colors[type];
};

export default function ConfirmationModal({
    labelText,
    title,
    bodyText,
    icon,
    iconColor = 'default',
    hideOnOutsideClick = true,
    showConfirmButton = true,
    showCancelButton = true,
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    onConfirm
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
                    inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-primary-500 
                    px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-primary-600
                    focus:bg-primary-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-primary-300
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
                                fixed top-0 left-0 z-20 flex items-center justify-center w-screen 
                                h-screen bg-slate-300/20 backdrop-blur-sm
                            `}
                            aria-modal='true'
                            role='dialog'
                        >
                            {/* <!-- Modal --> */}
                            <motion.div
                                ref={wrapperRef}
                                className={`
                                    flex max-h-[90vh] max-w-xs flex-col gap-6 overflow-hidden rounded 
                                    bg-white p-6 text-center text-slate-500 shadow-xl shadow-slate-700/10
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
                                <header className='flex flex-col items-center gap-4'>
                                    {
                                        icon &&
                                        <FontAwesomeIcon
                                            icon={icon}
                                            className={`w-8 h-8 ${getIconColor(iconColor)}`}
                                        />
                                    }
                                    <h3 className='flex-1 text-xl font-medium text-slate-700'>
                                        {title}
                                    </h3>
                                </header>
                                {/* <!-- Modal body --> */}
                                <div className='flex-1 overflow-auto'>
                                    <p>
                                        {bodyText}
                                    </p>
                                </div>
                                {/* <!-- Modal actions --> */}
                                <div className='flex justify-start gap-2'>
                                    {
                                        showConfirmButton &&
                                        <button
                                            onClick={() => {
                                                onConfirm && onConfirm()
                                                setIsShowing(false)
                                            }}
                                            className={`
                                                inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium 
                                                tracking-wide text-white transition duration-300 rounded whitespace-nowrap 
                                                bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none 
                                                disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none
                                            `}
                                        >
                                            <span>{confirmButtonText}</span>
                                        </button>
                                    }
                                    {
                                        showCancelButton &&
                                        <button
                                            onClick={() => setIsShowing(false)}
                                            className={`
                                                inline-flex items-center justify-center flex-1 h-10 gap-2 px-5 text-sm font-medium tracking-wide transition 
                                                duration-300 rounded justify-self-center whitespace-nowrap text-emerald-500 hover:bg-emerald-100 
                                                hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none 
                                                disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent
                                            `}
                                        >
                                            <span>{cancelButtonText}</span>
                                        </button>
                                    }
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