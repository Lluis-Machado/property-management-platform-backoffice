// Libraries imports
import { Field } from "formik";
import FormError from '@/components/notifications/FormError';

interface Props {
    /**
    * Name HTML prop
    */
    name: string;
    /**
    * List of inputs to display
    */
    inputsList: {
        label: string;
        value: string;
    }[];
    /**
    * Radio group text label
    */
    label?: string;
    /**
    * Disabled HTML prop
    */
    disabled?: boolean;
    /**
    * Required HTML prop
    */
    required?: boolean;
}

export const BasicRadioGroup = ({
    label,
    inputsList,
    ...rest
}: Props) => {
    rest.required && (label += ' *');
    
    return (
        <>
            <fieldset className="flex gap-10">
                {label && <legend className={`mb-2 text-slate-500`}>{label}</legend>}
                {
                    inputsList.map(input =>
                        <div className="relative flex items-center" key={input.value}>
                            <Field
                                {...rest}
                                id={input.value}
                                value={input.value}
                                type="radio"
                                className="w-4 h-4 transition-colors bg-white border-2 rounded-full appearance-none
                            cursor-pointer peer border-slate-500 checked:border-primary-500 checked:bg-primary-500
                            checked:hover:border-primary-600 checked:hover:bg-primary-600 focus:outline-none
                            checked:focus:border-primary-700 checked:focus:bg-primary-700 focus-visible:outline-none
                            disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50
                            disabled:hover:bg-inherit disabled:hover:border-inherit"
                            />
                            <label
                                className="pl-2 cursor-pointer text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
                                htmlFor={input.value}
                            >
                                {input.label}
                            </label>
                            <svg
                                className="absolute left-0 w-4 h-4 transition-all duration-300 scale-50 opacity-0
                            pointer-events-none fill-white peer-checked:scale-100 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                role="graphics-symbol"
                            >
                                <circle cx="8" cy="8" r="4" />
                            </svg>
                        </div>
                    )
                }
            </fieldset>
            <FormError name={rest.name} />
        </>
    )
}

export default BasicRadioGroup;