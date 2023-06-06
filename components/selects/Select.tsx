'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Field, FieldProps } from 'formik';
import ReactSelect,
{
    ClearIndicatorProps,
    DropdownIndicatorProps,
    IndicatorSeparatorProps,
    MenuProps,
    MultiValueGenericProps,
    MultiValueRemoveProps,
    NoticeProps
} from 'react-select'
import classNames from 'classnames';
import { faChevronRight, faXmark, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { sizeType } from '@/lib/types/sizeType';
import FormError from '@/components/notifications/FormError';

/////////////////////// Start Select Components ///////////////////////
const DropdownIndicator = ({ selectProps }: DropdownIndicatorProps) => {
    // @ts-ignore
    const { menuIsOpen, size } = selectProps;
    return (
        <motion.span
            initial={{
                rotate: 0,
            }}
            animate={{
                rotate: menuIsOpen ? 90 : 0,
                transition: {
                    type: 'spring'
                },
            }}
            className={size === 'base' ? 'h-4 w-4' : 'h-5 w-5'}
        >
            <FontAwesomeIcon
                icon={faChevronRight}
                className={
                    classNames(
                        'transition-all h-full w-full',
                        menuIsOpen ? 'text-slate-500' : 'text-slate-400'
                    )
                }
            />
        </motion.span>
    )
}

const IndicatorSeparator = ({ innerProps, selectProps }: IndicatorSeparatorProps) => {
    const { menuIsOpen } = selectProps;
    return (
        <span
            {...innerProps}
            className={
                classNames(
                    'self-stretch mx-2 my-3 w-[1px]',
                    menuIsOpen ? 'bg-primary-500' : 'bg-slate-400'
                )
            }
        />
    )
}

const ClearIndicator = ({ innerProps, selectProps }: ClearIndicatorProps) => {
    // @ts-ignore
    const { menuIsOpen, size } = selectProps;
    return (
        <span
            {...innerProps}
            className={size === 'base' ? 'h-4 w-4' : 'h-5 w-5'}
        >
            <FontAwesomeIcon
                icon={faXmark}
                className={
                    classNames(
                        'transition-all h-full w-full',
                        menuIsOpen ? 'text-slate-500' : 'text-slate-400'
                    )
                }
            />
        </span>
    )
}

const Menu = ({ children, selectProps, innerRef, innerProps }: MenuProps) => {
    const { menuIsOpen } = selectProps;
    return (
        <motion.div
            // @ts-ignore
            ref={innerRef}
            className='flex absolute top-full z-10 mt-1 max-h-64 w-full list-none flex-col rounded bg-white py-2 shadow-lg shadow-slate-500/10'
            initial={{
                clipPath: 'inset(10% 75% 90% 25%)'
            }}
            animate={{
                clipPath: menuIsOpen ? 'inset(-20% -20% -20% -20%)' : undefined,
                transition: menuIsOpen ?
                    {
                        type: 'spring',
                        bounce: 0,
                        duration: 0.5,
                        delayChildren: 0.1,
                        staggerChildren: 0.05
                    }
                    : undefined
            }}
            {...innerProps}
        >
            {children}
        </motion.div>
    )
}

const MultiValueContainer = ({ children, innerProps }: MultiValueGenericProps) => {
    return (
        <motion.div
            initial={{
                clipPath: 'inset(0% 100% 0% 0%)'
            }}
            animate={{
                clipPath: 'inset(0% 0% 0% 0%)',
                transition: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.5
                }
            }}
            {...innerProps}
        >
            <div className='flex flex-row gap-2 items-center justify-center rounded bg-slate-100 px-1 ml-1 mb-1'>
                {children}
            </div>
        </motion.div>
    )
}

const MultiValueRemove = ({ innerProps, selectProps }: MultiValueRemoveProps) => {
    // @ts-ignore
    const { size } = selectProps;
    return (
        <span
            {...innerProps}
            className={size === 'base' ? 'h-4 w-4' : 'h-5 w-5'}
        >
            <FontAwesomeIcon
                icon={faXmark}
                className={'w-full h-full text-slate-400'}
            />
        </span>
    )
}

const NoOptionsMessage = ({ innerProps, selectProps }: NoticeProps) => {
    // @ts-ignore
    const { size } = selectProps;
    return (
        <span
            {...innerProps}
            className='flex flex-row justify-center my-2 w-full h-full'
        >
            <FontAwesomeIcon
                icon={faBan}
                className={'text-slate-400/50 ' + (size === 'base' ? 'h-7 w-7' : 'h-8 w-8')}
            />
        </span>
    )
}
/////////////////////// End Select Components ///////////////////////

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
    * An object from the inputsList to set as default
    */
    defaultValue?: {
        label: string;
        value: string;
    }
    /**
    * Select text label
    */
    label?: string;
    /**
    * Mark input with secondary style
    */
    isSecondary?: boolean;
    /**
    * Show loading icon
    */
    isLoading?: boolean;
    /**
    * Show clear button
    */
    isClearable?: boolean;
    /**
    * Enable multiple select
    */
    isMulti?: boolean;
    /**
    * Activate search functionality
    */
    isSearchable?: boolean;
    /**
    * Required HTML prop
    */
    required?: boolean;
    /**
    * Disabled HTML prop
    */
    isDisabled?: boolean;
    /**
    * Specifies the size of the component
    */
    size?: sizeType;
    /**
    * Specifies if the form should submit onChange
    */
    submitOnChange?: boolean;
}

const Select = ({
    inputsList,
    label,
    size = 'base',
    isSearchable = false,
    isClearable = false,
    isMulti = false,
    submitOnChange = false,
    ...rest
}: Props) => {
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    rest.required && (label += ' *');

    return (
        <div className={
            classNames(
                'w-full relative',
                rest.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )
        }>
            <Field name={rest.name} >
                {({ form, field }: FieldProps) => (
                    <>
                        {
                            // This is important for the CSS classes to be aplied correctly
                            isMulti
                            && Array.isArray(field.value)
                            && field.value.length === 0
                            && (field.value = undefined)
                        }
                        <ReactSelect
                            {...rest}
                            id={rest.name}
                            unstyled
                            components={{
                                // @ts-ignore
                                DropdownIndicator, IndicatorSeparator, ClearIndicator, MultiValueContainer, MultiValueRemove, Menu, NoOptionsMessage
                            }}
                            isSearchable={isSearchable}
                            isClearable={isClearable}
                            isMulti={isMulti}
                            closeMenuOnSelect={!isMulti}
                            blurInputOnSelect={!isMulti}
                            onMenuOpen={() => setMenuIsOpen(true)}
                            onMenuClose={() => setMenuIsOpen(false)}
                            // @ts-ignore
                            size={size}
                            placeholder=''
                            options={inputsList}
                            onChange={(newValue: any) => {
                                var returnValue = undefined;
                                !isMulti
                                    ? returnValue = newValue?.value || ''
                                    : returnValue = newValue.map((obj: { value: string, label: string }) => obj.value)
                                form.setFieldValue(rest.name, returnValue)
                                submitOnChange && form.submitForm()
                            }}
                            classNames={{
                                control: ({ isDisabled, menuIsOpen, isMulti }) =>
                                    classNames(
                                        'w-full px-4 transition-all',
                                        isMulti ?
                                            classNames(size === 'base' ? 'min-h-[2.5rem] text-sm' : 'min-h-[3rem] text-base', 'h-auto')
                                            :
                                            (size === 'base' ? 'h-10 text-sm' : 'h-12 text-base'),
                                        rest.isSecondary ? 'rounded border' : 'border-b',
                                        menuIsOpen ? ((rest.required && !field.value) ? "border-pink-500" : 'border-primary-500') : 'border-slate-200',
                                        isDisabled ? 'bg-slate-50 text-slate-400' : 'bg-white text-slate-500'
                                    ),
                                option: ({ isSelected }) =>
                                    classNames(
                                        "w-full flex items-start justify-start px-5 transition-colors duration-300",
                                        "hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-300 focus:outline-none focus-visible:outline-none",
                                        isSelected ? 'bg-primary-600 text-primary-100' : 'bg-none text-slate-500',
                                        size === 'base' ? 'gap-2 p-2' : 'gap-3 p-3'
                                    ),
                            }}
                        />
                        <label
                            htmlFor={rest.name}
                            className={
                                classNames(
                                    "pointer-events-none absolute left-2 z-[1] px-2 transition-all",
                                    "before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:transition-all",
                                    menuIsOpen ?
                                        classNames(
                                            classNames(isMulti ? '-top-4' : '-top-2', 'text-xs'),
                                            (rest.required && !field.value) ? "text-pink-500" : 'text-primary-500',
                                        )
                                        :
                                        classNames(
                                            'text-slate-400',
                                            field.value ? '-top-2 text-xs' : (size === 'base' ? 'top-2.5 text-sm' : 'top-3 text-base'),
                                        ),
                                    rest.isDisabled ? 'text-slate-400 before:bg-transparent' : 'before:bg-white'
                                )
                            }
                        >
                            {label}
                        </label>
                    </>
                )}
            </Field>
            <FormError name={rest.name} />
        </div>
    )
}

export default Select