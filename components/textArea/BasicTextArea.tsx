// React imports
import { useId } from 'react';

// Libraries imports
import { Field } from 'formik';

// Local imports
import { sizeType } from '@/lib/types/sizeType';
import FormError from '@/components/notifications/FormError';

interface Props {
    /**
    * HTML name field
    */
    name: string;
    /**
    * Floating input label text
    */
    label?: string;
    /**
    * Mark input with secondary style
    */
    isSecondary?: boolean;
    /**
    * Required HTML prop
    */
    required?: boolean;
    /**
    * Disabled HTML prop
    */
    disabled?: boolean;
    /**
    * Read only HTML prop
    */
    readOnly?: boolean;
    /**
    * Specifies the size of the component.
    */
    size?: sizeType;
}

const getSize = (size: sizeType): string => {
    const sizes = {
        base: ' text-xs peer-placeholder-shown:text-sm peer-focus:text-xs ',
        large: ' text-sm peer-placeholder-shown:text-base peer-focus:text-sm '
    };

    return sizes[size];
}

export default function BasicTextArea({
    label,
    size = 'base',
    isSecondary,
    ...rest
}: Props): JSX.Element {
    const textAreaId = useId();
    return (
        <div className='relative'>
            <Field
                {...rest}
                as='textarea'
                id={textAreaId}
                rows={3}
                placeholder={label}
                className={`peer relative w-full ${isSecondary ? 'rounded border' : 'border-b'} border-slate-200
                ${size === 'base' ? 'px-4 py-2 text-sm' : 'p-4'} text-slate-500 placeholder-transparent outline-none
                transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-primary-500
                focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed
                disabled:bg-slate-50 disabled:text-slate-400`}
            />
            <label
                htmlFor={textAreaId}
                className={`absolute left-2 z-[1] cursor-text px-2 text-slate-400 transition-all before:absolute before:top-0
                before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all
                ${getSize(size)} -top-2 peer-placeholder-shown:top-2.5 peer-focus:-top-2 peer-required:after:text-pink-500
                peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500 peer-focus:cursor-default
                peer-focus:text-primary-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed
                peer-disabled:text-slate-400 peer-disabled:before:bg-transparent`}
            >
                {label}
            </label>
            <FormError name={rest.name} />
        </div>
    )
}
