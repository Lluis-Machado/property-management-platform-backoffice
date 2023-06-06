// React imports
import { useId, useState } from 'react';

// Libraries imports
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    /**
    * Select text label
    */
    labelText: string;
    /**motion,
    * List of inputs to display
    */
    inputsList: {
        labelText: string;
        value: string;
    }[];
    /**
    * Required HTML prop
    */
    isRequired?: boolean;
    /**
    * Disabled HTML prop
    */
    isDisabled?: boolean;
    /**
    * Specifies the size of the component.
    */
    size?: sizeType;
    /**
    * Event handler to perform an action when user changes a value.
    */
    onValueChanged?: (e: string) => void;
}

type sizeType = 'large' | 'base';

export default function OldSelect({
    labelText,
    inputsList,
    onValueChanged,
    size = 'base',
    isRequired = false,
    isDisabled = false,
}: Props) {
    const selectId = useId();
    const [selectedValue, setSelectedValue] = useState('')

    return (
        <div className='relative my-6 md:w-60'>
            <select
                id={selectId}
                name={selectId}
                placeholder={labelText}
                onChange={(e) => {
                    setSelectedValue(e.target.value)
                    onValueChanged && onValueChanged(e.target.value)
                }}
                required={isRequired}
                disabled={isDisabled}
                className={`
                    peer relative w-full ${size == 'base' ? 'h-10 text-sm' : 'h-12 text-base'}
                    appearance-none border-b border-slate-200 bg-white px-4 text-slate-500 outline-none
                    transition-all autofill:bg-white focus:border-primary-500 focus-visible:outline-none
                    focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
                `}
            >
                <option value='' disabled selected></option>
                {
                    inputsList.map(input =>
                        <option key={input.value} value={input.value}>
                            {input.labelText}
                        </option>
                    )
                }
            </select>

            <label
                htmlFor={selectId}
                className={`pointer-events-none absolute ${size == 'base' ? 'top-2.5 text-sm' : 'top-3 text-base'}
                left-2 z-[1] px-2 text-slate-400 transition-all before:absolute before:top-0 before:left-0
                before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all
                ${selectedValue ? 'peer-valid:-top-2 peer-valid:text-xs' : ''}
                peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*']
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-500
                peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent`}
            >
                {labelText}
            </label>
            <FontAwesomeIcon
                icon={faChevronRight}
                className={`pointer-events-none absolute ${size == 'base' ? 'top-2.5 h-4 w-4' : 'top-3.5 h-5 w-5'}
                right-2 text-slate-400 transition-all peer-focus:text-primary-500 peer-disabled:cursor-not-allowed`}
            />
        </div>
    )
}