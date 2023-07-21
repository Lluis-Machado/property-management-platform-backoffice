'use client';

// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Form, { EmailRule, Item, RequiredRule } from 'devextreme-react/form';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import Loading from '@/components/layout/Loading';
import { toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';

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

let loginValues = {
    username: '',
    password: '',
};

const LoginForm = ({ dictionary, searchParams }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);

    const formRef = useRef<Form>(null);

    const router = useRouter();

    // useEffect for errors on the URL
    useEffect(() => {
        if (searchParams?.error) {
            toast.error(searchParams?.error);
        }
    }, [searchParams]);

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) return;

        const values = structuredClone(loginValues);

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            console.log(response);

            if (response.ok) return router.push('/private');
            else {
                const data = await response.json();
                throw new ApiCallError(
                    data?.error || 'An error has occurred, contact admin'
                );
            }
        } catch (err) {
            console.error(err); // TODO: Delete this
            err instanceof ApiCallError && toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // useEffect to listen for Enter key press
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') handleSubmit();
        };

        document.addEventListener('keypress', handleKeyPress);

        return () => document.removeEventListener('keypress', handleKeyPress);
    }, [handleSubmit]);

    return (
        <>
            <Loading isLoading={isLoading} />
            <div className='h-[8rem]'>
                {isFormLoading && (
                    <ContentLoader
                        speed={2}
                        width={400}
                        height={150}
                        viewBox='0 0 400 150'
                        backgroundColor='#f3f3f3'
                        foregroundColor='#ecebeb'
                    >
                        <rect
                            x='0'
                            y='0'
                            rx='5'
                            ry='5'
                            width='385'
                            height='40'
                        />
                        <rect
                            x='0'
                            y='75'
                            rx='5'
                            ry='5'
                            width='385'
                            height='40'
                        />
                    </ContentLoader>
                )}
                <Form
                    ref={formRef}
                    formData={loginValues}
                    labelMode={'floating'}
                    readOnly={isLoading}
                    colCount={1}
                    onContentReady={() => setIsFormLoading(false)}
                >
                    <Item
                        dataField='username'
                        label={{ text: dictionary.emailInputLabel }}
                        editorOptions={{
                            stylingMode: 'underlined',
                            mode: 'email',
                        }}
                    >
                        <EmailRule message='Email is invalid' />
                        <RequiredRule />
                    </Item>
                    <Item
                        dataField='password'
                        label={{ text: dictionary.passwordInputLabel }}
                        editorOptions={{
                            stylingMode: 'underlined',
                            mode: 'password',
                        }}
                    >
                        <RequiredRule />
                    </Item>
                </Form>
            </div>

            <div className='mt-4 flex items-center justify-end'>
                <div className='text-sm'>
                    <Link
                        href={`./reset-password`}
                        className='font-semibold text-secondary-500 hover:text-secondary-300'
                    >
                        {dictionary.forgotPasswordLink}
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

export default memo(LoginForm);
