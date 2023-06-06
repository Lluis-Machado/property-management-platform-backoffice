// React imports
import { useId } from 'react';

// Libraries imports
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
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
  * Font Awesome Icon to show
  */
  icon?: IconProp;
}

export default function BasicInput({
  icon,
  label,
  isSecondary,
  ...rest
}: Props) {

  const inputId = useId();

  return (
    <div className="relative">
      <Field
        {...rest}
        id={inputId}
        placeholder={label}
        className={`
            peer relative h-12 w-full border-slate-200 px-4 ${icon ? 'pl-12' : ''} ${isSecondary ? 'rounded border' : 'border-b'}
          text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white
          invalid:border-pink-500 invalid:text-pink-500 focus:border-primary-500 focus:outline-none
          invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50
          disabled:text-slate-400
        `}
      />
      <label
        htmlFor={inputId}
        className={`
              absolute left-2 -top-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all
              before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full
            before:bg-white before:rounded before:transition-all peer-placeholder-shown:top-3
              ${icon ? 'peer-placeholder-shown:left-10' : ''} peer-placeholder-shown:text-base
              peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500
              peer-focus:-top-2 peer-focus:left-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-primary-500
              peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400
              peer-disabled:before:bg-transparent
            `}
      >
        {label}
      </label>
      {
        icon &&
        <FontAwesomeIcon
          icon={icon}
          className="absolute top-3 left-4 h-6 w-6 text-slate-400 peer-focus:text-primary-500
        peer-disabled:cursor-not-allowed"
        />
      }
      <FormError name={rest.name} />
    </div>
  )
}
