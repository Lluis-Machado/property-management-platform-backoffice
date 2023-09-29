'use client';

// React imports
import { memo, useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Form, { Item } from 'devextreme-react/form';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import Loading from '@/components/layout/Loading';
import { toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';
import { Locale } from '@/i18n-config';

interface Props {
    dictionary: {
        title: string;
        emailInputLabel: string;
        passwordInputLabel: string;
        forgotPasswordLink: string;
        submitButton: string;
    };
    searchParams: any;
    lang: Locale;
}

const LoginForm = ({ dictionary, searchParams, lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
    const [passwordMode, setPasswordMode] = useState<'password' | 'text'>(
        'password'
    );
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const formRef = useRef<Form>(null);

    const router = useRouter();

    useEffect(() => {
        localeDevExtreme(lang);
    }, [lang]);

    // useEffect for errors on the URL
    useEffect(() => {
        if (searchParams?.error) {
            toast.error(searchParams?.error);
        }
    }, [searchParams]);

    const handleSubmit = useCallback(async () => {
        const valuesToSend = {
            username,
            password,
        };

        try {
            if (!username) throw new ApiCallError("Username can't be empty");
            else if (!password)
                throw new ApiCallError("Password can't be empty");

            setIsLoading(true);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valuesToSend),
            });

            // If OK, redirect to the pathname requested from
            // this user or to /private if the previous does not exist
            if (response.ok)
                return router.push(searchParams?.pathname || '/private');
            else {
                const data = await response.json();
                throw new ApiCallError(
                    data?.error || 'An error has occurred, contact admin'
                );
            }
        } catch (err) {
            err instanceof ApiCallError && toast.error(err.message);
            setIsLoading(false);
        }
    }, [router, username, password, searchParams?.pathname]);

    // useEffect to listen for Enter key press
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') handleSubmit();
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleSubmit]);

    return (
        <>
            <Loading isLoading={isLoading} />
            <div className='h-[7rem]'>
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
                            y='5'
                            rx='5'
                            ry='5'
                            width='385'
                            height='30'
                        />
                        <rect
                            x='0'
                            y='50'
                            rx='5'
                            ry='5'
                            width='385'
                            height='30'
                        />
                    </ContentLoader>
                )}
                <Form
                    ref={formRef}
                    labelMode={'floating'}
                    colCount={1}
                    onContentReady={() => setIsFormLoading(false)}
                >
                    <Item>
                        <TextBox
                            placeholder={dictionary.emailInputLabel}
                            mode='email'
                            readOnly={isLoading}
                            value={username}
                            onValueChange={setUsername}
                            valueChangeEvent='input'
                        />
                    </Item>
                    <Item>
                        <TextBox
                            placeholder={dictionary.passwordInputLabel}
                            mode={passwordMode}
                            readOnly={isLoading}
                            value={password}
                            onValueChange={setPassword}
                            valueChangeEvent='input'
                        >
                            <TextBoxButton
                                name='password'
                                location='after'
                                options={{
                                    icon:
                                        passwordMode === 'password'
                                            ? 'eyeopen'
                                            : 'eyeclose',
                                    type: 'default',
                                    onClick: () => {
                                        setPasswordMode((prev) =>
                                            prev === 'password'
                                                ? 'text'
                                                : 'password'
                                        );
                                    },
                                }}
                            />
                        </TextBox>
                    </Item>
                </Form>
            </div>

            <div className='mt-0 flex items-center justify-end'>
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
