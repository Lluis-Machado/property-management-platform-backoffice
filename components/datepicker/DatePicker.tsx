import { Field, FieldProps } from 'formik';
import { FormError } from 'pg-components';
import DateBox from 'devextreme-react/date-box';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';
import { DateTime } from 'luxon';

interface Props {
    /**
    * Name HTML prop
    */
    name: string;
    /**
    * A date to set as default
    */
    defaultValue?: string;
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
    readOnly?: boolean;
}

const DatePicker = ({
    name,
    defaultValue,
    label,
    required,
    isSecondary,
    isClearable,
    isDisabled,
    readOnly
}: Props) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(defaultValue);

    const labelMenuIsOpenClasses = useCallback((): string => {
        if (menuIsOpen) {
            const requiredClasses = required ? 'text-pink-500' : 'text-primary-500';
            return classNames('text-xs -top-2', requiredClasses);
        } else {
            const textClasses = currentValue ? '-top-2 text-xs' : 'top-3 text-base';
            return classNames('text-slate-400', textClasses);
        }
    }, [menuIsOpen, required, currentValue])

    return (
        <div className='w-full relative cursor-pointer'>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <div>
                        <DateBox
                            {...field}
                            type="date"
                            className={classNames('h-12', readOnly && 'read-only')}
                            //@ts-ignore
                            displayFormat={dateFormat}
                            defaultValue={defaultValue}
                            showClearButton={isClearable}
                            disabled={isDisabled}
                            readOnly={readOnly}
                            onFocusIn={() => setMenuIsOpen(true)}
                            onFocusOut={() => setMenuIsOpen(false)}
                            onValueChange={(date) => {
                                // Error handling
                                if (!date) {
                                    setCurrentValue(date)
                                    form.setFieldValue(name, date)
                                    return;
                                }
                                // Convert to luxon and set format
                                const luxonDate = DateTime.fromJSDate(new Date(date))
                                const formattedDate = luxonDate.toFormat('yyyy-MM-dd');
                                setCurrentValue(formattedDate)
                                form.setFieldValue(name, formattedDate)
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