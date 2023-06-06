// React imports
import { MouseEvent } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import {
    faCircleCheck, faCircleExclamation, faInfo,
    faLightbulb, faTriangleExclamation, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    /**
     * Content of the alert.
     */
    body: string;
    /**
     * Indicates whether the alert can be closed or not.
     */
    dismissable?: boolean;
    /**
     * Indicate whether the alert should display an icon or not.
     * The icon varies depending on the type of alert.
     */
    icon?: boolean;
    /**
     * Determines whether the alert is visible or not.
     */
    isVisible: boolean;
    /**
     * A function that is executed after the UI component is hidden.
     */
    onHidden?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    /**
     * Title of the alert.
     */
    title?: string;
    /**
     * Type of alert.
     */
    type?: alertType;
}

type alertType = 'success' | 'warning' | 'info' | 'danger' | 'default';

const getContainerColorStyle = (type: alertType): string => {
    const colors = {
        success: '  border-emerald-100  bg-emerald-50   text-emerald-700',
        warning: '  border-amber-100    bg-amber-50     text-amber-700',
        info: '     border-cyan-100     bg-cyan-50      text-cyan-700',
        danger: '   border-red-100      bg-red-50       text-red-700',
        default: '  border-primary-700  bg-primary-600  text-custom-white',
    };

    return colors[type];
};

const getIcon = (type: alertType): IconProp => {
    const icons = {
        success: faCircleCheck,
        warning: faTriangleExclamation,
        info: faInfo,
        danger: faCircleExclamation,
        default: faLightbulb,
    };

    return icons[type];
}

const getButtonColorStyle = (type: alertType): string => {
    const colors = {
        success: 'text-emerald-700 hover:bg-emerald-700 hover:text-emerald-100 focus:bg-emerald-200 focus:text-emerald-700 ',
        warning: 'text-amber-700 hover:bg-amber-700 hover:text-amber-100 focus:bg-amber-200 focus:text-amber-700',
        info: 'text-cyan-700 hover:bg-cyan-700 hover:text-cyan-100 focus:bg-cyan-200 focus:text-cyan-700',
        danger: 'text-pink-700 hover:bg-pink-700 hover:text-pink-100 focus:bg-pink-200 focus:text-pink-700',
        default: 'text-custom-white hover:bg-primary-100 hover:text-primary-600 focus:bg-primary-500 focus:text-custom-white',
    };

    return colors[type];
};

export const Alert = ({
    body,
    dismissable = false,
    icon = false,
    isVisible,
    onHidden = () => null,
    title,
    type = 'default'
}: Props): JSX.Element =>
    <AnimatePresence>
        {
            isVisible &&
            <motion.div
                className={`
                    flex justify-between w-full items-center gap-4 rounded border px-4 py-3 text-base
                    ${getContainerColorStyle(type)}
                `}
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: .5, ease: 'easeInOut' } }}
                exit={{ opacity: 0, transition: { duration: .5, ease: 'easeInOut' } }}
            >
                {/* Icons */}
                <div className='flex flex-row'>
                    {/* Icon */}
                    {icon && <FontAwesomeIcon icon={getIcon(type)} className='h-6 w-6 text-xl' />}
                    <div className={`${icon && 'pl-4'}`}>
                        {/* Title */}
                        {
                            title &&
                            <h3 className="mb-2 font-semibold">
                                {title}
                            </h3>
                        }
                        {/*  body */}
                        <p className="flex-1">{body}</p>
                    </div>
                </div>
                {/*  <!-- Close button --> */}
                {
                    dismissable &&
                    <motion.button
                        aria-label="Close"
                        className={`
                            inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs
                            font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed 
                            disabled:shadow-none disabled:hover:bg-transparent
                            ${getButtonColorStyle(type)}
                        `}
                        whileHover={{ rotate: 90 }}
                        transition={{
                            ease: "linear",
                            duration: 0.01
                        }}
                        onClick={(e) => onHidden(e)}
                    >
                        <span className="relative only:-mx-4 text-xl flex">
                            <FontAwesomeIcon icon={faXmark} />
                        </span>
                    </motion.button>
                }
            </motion.div>
        }
    </AnimatePresence>

export default Alert;
