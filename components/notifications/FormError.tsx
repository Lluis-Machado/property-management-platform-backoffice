import { ErrorMessage } from 'formik'
import React from 'react'

const FormError = ({ name }: { name: string }) => {
    return (
        <div className='h-4 block'>
            <ErrorMessage
                name={name}
                component='span'
                className='text-sm text-pink-500 mt-1'
            />
        </div>
    )
}

export default FormError