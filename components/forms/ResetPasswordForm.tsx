"use client"

// React imports
import { useState } from 'react';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { Alert, Input, Button } from 'pg-components';
import * as Yup from 'yup';
import Link from 'next/link';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import GroupItem from '@/components/layoutComponent/GroupItem';
import Loading from '@/components/layout/Loading';

interface Props {
    dictionary: {
        title: string;
        description: string;
        emailInputLabel: string;
        backToLoginButton: string;
        submitButton: string;
    }
    searchParams: any;
}

const ResetPasswordForm = ({ dictionary, searchParams }: Props) => {
    const [error, setError] = useState<string>(searchParams?.error || '');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const initialValues = {
        username: searchParams?.email || ''
    }

    const handleSubmit = async (
        { username }: typeof initialValues,
        formikHelpers: FormikHelpers<typeof initialValues>
    ) => {
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/Users/resetPassword?email=${username}`);

            setError('')

            if (response.ok) setMessage('Email sent! Check your email.');
            else throw new ApiCallError('Invalid email.')
        } catch (err: any) {
            console.error(err); // TODO: Delete this
            (err instanceof ApiCallError) && setError(err.message)
        } finally {
            setIsLoading(false)
            formikHelpers.setSubmitting(false);
        }
    };

    return (
        <>
            <Loading isLoading={isLoading} />

            <p className="mb-12 text-md text-center text-gray-400">
                {dictionary.description}
            </p>

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Username can not be empty.').email(),
                    password: Yup.string().required('Password can not be empty.'),
                })}
                onSubmit={handleSubmit}
                className="space-y-3"
            >
                <FormikForm>
                    <Alert
                        body={message}
                        isVisible={message !== '' && true}
                        type='success'
                    />

                    <Alert
                        body={error}
                        isVisible={error !== '' && true}
                        type='danger'
                    />

                    <GroupItem cols={1} >
                        <Input
                            name="username"
                            label={dictionary.emailInputLabel}
                            icon={faUser}
                            required
                        />
                    </GroupItem>

                    <div className="flex items-center justify-end mt-2">
                        <div className="text-sm">
                            <Link href="./" className="font-semibold text-secondary-500 hover:text-secondary-300">
                                {dictionary.backToLoginButton}
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            type='submit'
                            text={dictionary.submitButton}
                        />
                    </div>
                </FormikForm>
            </Formik>
        </>
    )
}

export default ResetPasswordForm