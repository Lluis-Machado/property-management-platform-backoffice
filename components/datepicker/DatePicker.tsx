import { Field, FieldProps } from 'formik';
import { FormError } from 'pg-components';
import DateBox from 'devextreme-react/date-box';
import classNames from 'classnames';
import { useState } from 'react';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';

interface Props {
    /**
    * Name HTML prop
    */
    name: string;
    /**
    * A date to set as default
    */
    defaultValue?: Date;
    /**
    * Select text label
    */
    label?: string;
    /**
    * Mark input with secondary style
    */
    isSecondary?: boolean;
    /**
    * Show clear button
    */
    isClearable?: boolean;
    /**
    * Required HTML prop
    */
    required?: boolean;
    /**
    * Disabled HTML prop
    */
    isDisabled?: boolean;
    /**
    * Read only HTML prop
    */
    isReadOnly?: boolean;
}

const DatePicker = ({
    name,
    defaultValue,
    label,
    required,
    isSecondary,
    isClearable,
    isDisabled,
    isReadOnly
}: Props) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(defaultValue);

    // console.log("currentValue: ", currentValue)

    const labelMenuIsOpenClasses = (): string => {
        if (menuIsOpen) {
            const requiredClasses = required ? 'text-pink-500' : 'text-primary-500';
            return classNames('text-xs -top-2', requiredClasses);
        } else {
            const textClasses = currentValue ? '-top-2 text-xs' : 'top-3 text-base';
            return classNames('text-slate-400', textClasses);
        }
    };

    return (
        <div className='w-full relative cursor-pointer'>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <div>
                        <DateBox
                            {...field}
                            type="date"
                            className='h-12'
                            //@ts-ignore
                            displayFormat={dateFormat}
                            useMaskBehavior
                            defaultValue={defaultValue}
                            showClearButton={isClearable}
                            disabled={isDisabled}
                            readOnly={isReadOnly}
                            onFocusIn={() => setMenuIsOpen(true)}
                            onFocusOut={() => setMenuIsOpen(false)}
                            onValueChange={(date) => {
                                // const isoDate = DateTime.fromJSDate(e).toISODate()
                                // const date = DateTime.fromISO(isoDate!, {zone: 'utc'}).toJSDate()
                                setCurrentValue(date)
                                form.setFieldValue(name, date)
                            }}
                        />
                        <label
                            htmlFor={name}
                            className={
                                classNames(
                                    "pointer-events-none absolute left-2 z-[1] px-2 transition-all",
                                    "before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:transition-all",
                                    labelMenuIsOpenClasses(),
                                    "before:bg-white"
                                )
                            }
                        >
                            {label}
                        </label>
                    </div>
                )}
            </Field>
            <FormError name={name} />
        </div>
    )
}

export default DatePicker