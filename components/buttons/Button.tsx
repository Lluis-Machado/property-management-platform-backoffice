// React imports
import { ButtonHTMLAttributes, MouseEvent } from 'react';

// Libraries imports
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

// Local imports
import { sizeType } from "@/lib/types/sizeType";

interface Props {
    /**
     *  Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
    * Specifies whether the UI component should include a shadow that makes it look elevated.
    */
    elevated?: boolean;
    /**
    * Specifies whether the UI component includes an FontAwesome icon or not.
    */
    icon?: IconDefinition;
    /**
    * Specifies the icon position if any.
    */
    iconPosition?: iconPositionType;
    /**
    * A function that is executed when the Button is clicked or tapped.
    */
    onClick?: (e: MouseEvent) => void;
    /**
    * Specifies the border radius of the component.
    */
    rounded?: boolean;
    /**
    * Specifies the size of the component.
    */
    size?: sizeType;
    /**
    * Specifies the style of the component.
    */
    style?: styleType;
    /**
     * Specifies the text fo the component.
     */
    text?: string;
    /**
     * Type of button
     */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

type iconPositionType = 'leading' | 'trailing';
type styleType = 'normal' | 'outline';

const getContainerColors = (style: styleType): string =>
    style == 'normal'
        ? `bg-primary-500 hover:bg-primary-600 focus:bg-primary-700 disabled:bg-primary-300 shadow-primary-200 text-white`
        : `border border-primary-500 text-primary-500 hover:border-primary-600 hover:text-primary-600 focus:border-primary-700
           focus:text-primary-700 disabled:text-primary-300 bg-white`;

const getSize = (size: sizeType): string => {
    const sizes = {
        large: 'h-12 px-6',
        base: ' h-10 px-5',
    };

    return sizes[size];
}

const getShadow = (size: sizeType): string => size == 'large' ? 'shadow-lg' : 'shadow-md';

export const Button = ({
    text,
    icon,
    onClick,
    size = 'base',
    style = 'normal',
    iconPosition = 'trailing',
    rounded = false,
    elevated = false,
    disabled = false,
    type = 'button'
}: Props): JSX.Element =>
    <AnimatePresence>
        <motion.button
            className={`inline-flex w-full font-semibold items-center justify-center gap-2 text-sm tracking-wide transition duration-300 
                whitespace-nowrap focus-visible:outline-none disabled:cursor-not-allowed disabled:shadow-none
                disabled:border-primary-300 focus:shadow-primary-200 hover:shadow-primary-200 
                ${rounded ? 'rounded-full' : 'rounded'} ${elevated && getShadow(size)} ${getSize(size)} ${getContainerColors(style)}`}
            initial={false}
            whileTap={{ y: 2 }}
            transition={{
                ease: 'linear',
                duration: 0.001
            }}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {
                text &&
                <span
                    className={`${(icon && iconPosition == 'leading') && 'order-2'}`}
                >
                    {text}
                </span>
            }
            {
                icon &&
                <span className={`relative ${size == 'base' ? 'only:-mx-5' : 'only:-mx-6'}`}>
                    <FontAwesomeIcon icon={icon} />
                </span>
            }
        </motion.button>
    </AnimatePresence>

export default Button;