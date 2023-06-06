'use client'

// React imports
import { useState } from 'react';

// Libraries imports
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Link from 'next/link';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import Alert from '@/components/notifications/Alert';
import BasicInput from '@/components/inputs/BasicInput';
import Button from '@/components/buttons/Button';
import GroupItem from '@/components/layoutComponent/GroupItem';
import Loading from '@/components/layout/Loading';
import PasswordInput from '@/components/inputs/PasswordInput';

interface Props {
    dictionary: {
        title: string;
        emailInputLabel: string;
        passwordInputLabel: string;
        forgotPasswordLink: string;
        submitButton: string;
    };
    searchParams: any;
}

const LoginForm = ({ dictionary, searchParams }: Props) => {
    const router = useRouter();

    const [error, setError] = useState<string>(searchParams?.error || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const initialValues = {
        username: '',
        password: '',
    }

    const handleSubmit = async (
        { username, password }: typeof initialValues,
        formikHelpers: FormikHelpers<typeof initialValues>
    ) => {
        console.log('username y pass: ', username, password)
        setIsLoading(true)
        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            console.log(response)

            if (response.ok) return router.push("/private/dashboard");
            else {
                const data = await response.json()
                throw new ApiCallError(data?.error || 'An error has occurred, contact admin')
            }

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
                        body={error}
                        isVisible={error !== '' && true}
                        type='danger'
                    />
                    <GroupItem cols={1} >
                        <BasicInput
                            name="username"
                            label={dictionary.emailInputLabel}
                            icon={faUser}
                            required
                        />

                        <PasswordInput
                            name="password"
                            label={dictionary.passwordInputLabel}
                            required
                        />
                    </GroupItem>

                    <div className="flex items-center justify-end mt-4">
                        <div className="text-sm">
                            <Link href={`./reset-password`} className="font-semibold text-secondary-500 hover:text-secondary-300">
                                {dictionary.forgotPasswordLink}
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

export default LoginForm