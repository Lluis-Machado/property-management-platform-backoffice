// React imports
import { useId } from 'react';

// Libraries imports
import { Field } from 'formik';
import FormError from '../notifications/FormError';

interface Props {
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies the compoenent auxiliar text.
     */
    helpText?: string;
    /**
     * HTML name field
     */
    name: string;
    /**
     * Specifies the compoenent text.
     */
    text?: string;
    /**
     * Specifies the variant of the component.
     */
    variant?: variantType;
}

type variantType = 'primary' | 'secondary';

const getContainerColors = (variant: variantType): string => {
    const colors = {
        primary: 'checked:bg-primary-500 checked:hover:bg-primary-600 checked:focus:bg-primary-700',
        secondary: 'checked:bg-primary-200 checked:hover:bg-primary-300 checked:focus:bg-primary-400',
    }
    return colors[variant];
}

const getSVGColors = (variant: variantType): string => {
    const colors = {
        primary: 'fill-white stroke-white',
        secondary: `fill-primary-500 stroke-primary-500 peer-hover:fill-primary-600 peer-hover:stroke-primary-600 
                    peer-focus:fill-primary-700 peer-focus:stroke-primary-700`,
    }
    return colors[variant];
}

export const Checkbox = (props: Props): JSX.Element => {

    const id = useId();
    const { helpText, text, variant = 'primary', ...rest } = props;

    return (
        <div className='flex flex-col'>
            <div className='relative flex flex-wrap items-center'>
                <Field
                    {...rest}
                    className={`
                        w-4 h-4 transition-colors border-2 rounded appearance-none cursor-pointer peer focus:outline-none 
                        focus-visible:outline-none disabled:cursor-not-allowed
                        bg-white border-secondary-300 checked:border-primary-500 checked:hover:border-primary-600 
                        checked:focus:border-primary-700 disabled:border-secondary-200 disabled:bg-secondary-100
                        ${getContainerColors(variant)}
                    `}
                    type='checkbox'
                    id={id}
                />
                {
                    text && (
                        <label
                            className={`
                                pl-2 cursor-pointer text-secondary-500 peer-disabled:cursor-not-allowed 
                                peer-disabled:text-secondary-400
                            `}
                            htmlFor={id}
                        >
                            {text}
                        </label>
                    )
                }
                {
                    text && helpText && (
                        <small className='w-full py-2 pl-6 text-xs transition text-secondary-400'>
                            <span>{helpText}</span>
                        </small>
                    )
                }
                {/* TODO: change this */}
                <svg
                    className={`
                        absolute left-0 w-4 h-4 transition-all duration-300 -rotate-90 opacity-0 pointer-events-none 
                        peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed 
                        ${text && 'top-1'} ${getSVGColors(variant)}
                    `}
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                    aria-labelledby='title-3 description-3'
                    role='graphics-symbol'
                >
                    <title id='title-3'>Check mark icon</title>
                    <desc id='description-3'>
                        Check mark icon to indicate whether the radio input is checked or
                        not.
                    </desc>
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z'
                    />
                </svg>
            </div>
            <FormError name={rest.name} />
        </div>
    )
}

export default Checkbox;