'use client';
import { memo, useCallback, useRef, useState } from 'react';
import Form, {
    EmailRule,
    GroupItem,
    Item,
    PatternRule,
    RequiredRule,
    StringLengthRule,
} from 'devextreme-react/form';
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import { toast } from 'react-toastify';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import 'devextreme-react/switch';

import { Locale } from '@/i18n-config';
import { CreateAuth0User } from '@/lib/types/user';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { apiPost } from '@/lib/utils/apiPost';

let userData: CreateAuth0User = {
    blocked: false,
    connection: 'Username-Password-Authentication',
    email_verified: false,
    email: '',
    family_name: '',
    given_name: '',
    name: '',
    nickname: '',
    password: '',
    picture: '',
    user_id: '',
    verify_email: true,
};

interface Props {
    lang: Locale;
}

const AddUserPage = ({ lang }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Importante para que no se copie por referencia
    const [initialValues, _] = useState<CreateAuth0User>(
        structuredClone(userData)
    );

    const formRef = useRef<Form>(null);

    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) {
            toast.warning('Validation error detected, check all fields');
            return;
        }

        const values = structuredClone(userData);

        if (JSON.stringify(values) === JSON.stringify(initialValues)) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);

        const toastId = toast.loading('Creating contact...');

        try {
            const valuesToSend: CreateAuth0User = {
                ...values,
                name: `${values.given_name} ${values.family_name}`,
                picture: `https://ui-avatars.com/api/?name=${values.given_name}+${values.family_name}&background=random&size=128`,
            };
            console.log('Valores a enviar: ', valuesToSend);
            console.log(JSON.stringify(valuesToSend));

            const data = await apiPost('/api/users', valuesToSend);

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'User created correctly!');
            // Clear contact data
            userData = structuredClone(initialValues);
            // Pass the ID to reload the page
            router.push(`../users?createdId=${data.user_id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [initialValues, router]);

    return (
        <div>
            <Form
                ref={formRef}
                formData={userData}
                labelMode={'floating'}
                readOnly={isLoading}
            >
                {/* Main Information */}
                <GroupItem colCount={5} caption='Main Information'>
                    <Item dataField='given_name' label={{ text: 'First name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='family_name' label={{ text: 'Last name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='nickname' label={{ text: 'Nickname' }}>
                        <RequiredRule />
                    </Item>
                </GroupItem>
                <GroupItem colCount={5}>
                    <Item dataField='email' label={{ text: 'Email' }}>
                        <RequiredRule />
                        <EmailRule />
                    </Item>
                    <Item dataField='password' label={{ text: 'Password' }}>
                        <RequiredRule />
                        <StringLengthRule
                            min={8}
                            message='At least needs 8 characters'
                        />
                        <PatternRule
                            pattern={/.*[A-Z].*/}
                            message='At least needs 1 upper case letter'
                        />
                        <PatternRule
                            pattern={/.*[0-9].*/}
                            message='At least needs 1 number'
                        />
                        <PatternRule
                            pattern={/.*[!¡?¿@#$%^&+=].*/}
                            message='At least needs 1 special character'
                        />
                    </Item>
                </GroupItem>
                <GroupItem colCount={6} caption='Settings'>
                    <Item
                        dataField='blocked'
                        label={{ text: 'Block User' }}
                        editorType='dxSwitch'
                        editorOptions={{
                            width: 100,
                            switchedOnText: 'Blocked',
                            switchedOffText: 'Unblocked',
                        }}
                    />
                    <Item
                        dataField='verify_email'
                        label={{ text: 'Verify Email' }}
                        editorType='dxSwitch'
                        editorOptions={{
                            width: 100,
                            switchedOnText: 'Verify',
                            switchedOffText: "Don't verify",
                        }}
                    />
                </GroupItem>
            </Form>
            <div className='my-6'>
                <div className='flex justify-end'>
                    <div className='flex flex-row self-center'>
                        <Button
                            elevated
                            type='button'
                            text='Create User'
                            icon={faSave}
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddUserPage);
