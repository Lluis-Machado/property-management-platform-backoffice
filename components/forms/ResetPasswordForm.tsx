'use client';

// React imports
import { memo, useRef, useState } from 'react';

import { Button } from 'pg-components';
import Link from 'next/link';
import Form, { EmailRule, Item, RequiredRule } from 'devextreme-react/form';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { toast } from 'react-toastify';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';

interface Props {
    dictionary: {
        title: string;
        description: string;
        emailInputLabel: string;
        backToLoginButton: string;
        submitButton: string;
    };
}

let formValues = {
    username: '',
};

const ResetPasswordForm = ({ dictionary }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const formRef = useRef<Form>(null);

    const handleSubmit = async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        setIsLoading(true);
        const toastId = toast.loading('Sending email...');

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/auth/Users/resetPassword?email=${formValues.username}`
            );

            if (response.ok)
                updateSuccessToast(toastId, 'Email sent! Check your email.');
            else throw new ApiCallError('Invalid email.');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <p className='text-md mb-12 text-center text-gray-400'>
                {dictionary.description}
            </p>

            <Form
                ref={formRef}
                formData={formValues}
                labelMode={'floating'}
                readOnly={isLoading}
                colCount={1}
            >
                <Item
                    dataField='username'
                    label={{ text: dictionary.emailInputLabel }}
                    editorOptions={{ stylingMode: 'underlined', mode: 'email' }}
                >
                    <EmailRule message='Email is invalid' />
                    <RequiredRule message='Email is required' />
                </Item>
            </Form>

            <div className='mt-2 flex items-center justify-end'>
                <div className='text-sm'>
                    <Link
                        href='./'
                        className='font-semibold text-secondary-500 hover:text-secondary-300'
                    >
                        {dictionary.backToLoginButton}
                    </Link>
                </div>
            </div>

            <div className='mt-4 flex justify-center'>
                <Button
                    elevated
                    type='button'
                    text={dictionary.submitButton}
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default memo(ResetPasswordForm);
