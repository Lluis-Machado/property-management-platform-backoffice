'use client';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import ToolbarTooltips from '@/components/tooltips/ToolbarTooltips';
import { Locale } from '@/i18n-config';
import { Auth0User, UserLogs, UserRoles } from '@/lib/types/user';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPatch } from '@/lib/utils/apiPatch';
import { customError } from '@/lib/utils/customError';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import {
    faClockRotateLeft,
    faPencil,
    faSave,
    faTrash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Form, {
    GroupItem,
    Item,
    PatternRule,
    RequiredRule,
    StringLengthRule,
    Tab,
    TabPanelOptions,
    TabbedItem,
} from 'devextreme-react/form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';
import React, { memo, useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import RolesDataGrid, { RolesDatagridProps } from './tabs/RolesDataGrid';
import LogsDataGrid from './tabs/LogsDataGrid';

interface Props {
    userData: Auth0User;
    userRoles: UserRoles[];
    userLogs: UserLogs[];
    roles: UserRoles[];
    lang: Locale;
}

const UserPage = ({ userData, userRoles, userLogs, roles, lang }: Props) => {
    // States
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [unsavedVisible, setUnsavedVisible] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState<Auth0User>(
        structuredClone(userData) // Important to not be copied by reference
    );
    // Refs
    const formRef = useRef<Form>(null);
    const rolesDG = useRef<RolesDatagridProps>(null);

    const router = useRouter();

    const handleSubmit = useCallback(async () => {
        const res = formRef.current!.instance.validate();
        if (!res.isValid) {
            toast.warning('Validation error detected, check all fields');
            return;
        }

        const values = structuredClone(userData);

        if (
            JSON.stringify(values) === JSON.stringify(initialValues) &&
            !rolesDG.current?.hasEditData()
        ) {
            toast.warning('Change at least one field');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Updating user...');

        try {
            // Save roles, if there are any
            if (rolesDG.current?.hasEditData()) rolesDG.current?.saveEditData();
            // Deleting this properties because auth0 does not want them
            // @ts-ignore
            delete values.user_id;
            // @ts-ignore
            delete values.identities;
            // @ts-ignore
            delete values.updated_at;
            // @ts-ignore
            delete values.created_at;
            // @ts-ignore
            delete values.email_verified;
            // @ts-ignore
            delete values.email;
            // @ts-ignore
            delete values.logins_count;
            // @ts-ignore
            delete values.last_ip;
            // @ts-ignore
            delete values.email;
            // @ts-ignore
            delete values.last_login;
            // @ts-ignore
            delete values.last_password_reset;

            console.log('Valores a enviar: ', values);
            console.log(JSON.stringify(values));

            const data = await apiPatch(
                `/api/users/${userData.user_id!}`,
                values
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);

            updateSuccessToast(toastId, 'Contact updated correctly!');
            setInitialValues(data);
            setIsEditing(false);
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [userData, initialValues]);

    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting user...');
        try {
            await apiDelete(`/api/users/${userData.user_id!}`);

            updateSuccessToast(toastId, 'Contact deleted correctly!');
            // Pass the ID to reload the page
            router.push(`../users?deletedId=${userData.user_id}`);
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [userData, router]);

    const handleEditingButton = () => {
        const values = structuredClone(userData);
        if (
            isEditing &&
            JSON.stringify(values) !== JSON.stringify(initialValues)
        ) {
            setUnsavedVisible(true);
        } else {
            setIsEditing((prev) => !prev);
        }
    };

    return (
        <div className='mt-4'>
            <ConfirmationPopup
                message='Are you sure you want to delete this user?'
                isVisible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
            />
            <ConfirmationPopup
                message='Are you sure you want to exit without saving?'
                isVisible={unsavedVisible}
                onClose={() => setUnsavedVisible(false)}
                onConfirm={() => router.refresh()}
            />
            {/* Toolbar tooltips */}
            <ToolbarTooltips isEditing={isEditing} />
            <div className='my-6 flex w-full justify-between'>
                {/* Contact avatar and name */}
                <div className='ml-5 flex items-center gap-5'>
                    <Image
                        className='select-none rounded-full'
                        src={initialValues.picture}
                        alt='user avatar with name initials'
                        width={64}
                        height={64}
                    />
                    <span className='text-4xl tracking-tight text-zinc-900'>
                        {initialValues.name}
                    </span>
                </div>

                {/* Button toolbar */}
                <div className='flex flex-row gap-4 self-center'>
                    <Button
                        id='auditButton'
                        elevated
                        onClick={() =>
                            toast.info('For now this is just a mockup')
                        }
                        type='button'
                        icon={faClockRotateLeft}
                    />
                    <Button
                        id='saveButton'
                        elevated
                        onClick={handleSubmit}
                        type='button'
                        icon={faSave}
                        disabled={!isEditing || isLoading}
                        isLoading={isLoading}
                    />
                    <Button
                        id='editButton'
                        elevated
                        onClick={() => handleEditingButton()}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                    <Button
                        id='deleteButton'
                        elevated
                        onClick={() => setDeleteVisible(true)}
                        type='button'
                        icon={faTrash}
                        style='danger'
                    />
                </div>
            </div>
            {/* Contact form */}
            <Form
                ref={formRef}
                formData={userData}
                labelMode={'floating'}
                readOnly={isLoading || !isEditing}
            >
                {/* Main Information */}
                <GroupItem colCount={5}>
                    <Item dataField='name' label={{ text: 'Name' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='nickname' label={{ text: 'Nickname' }}>
                        <RequiredRule />
                    </Item>
                    <Item dataField='password' label={{ text: 'Password' }}>
                        <StringLengthRule
                            min={8}
                            message='At least needs 8 characters'
                            ignoreEmptyValue
                        />
                        <PatternRule
                            pattern={/.*[A-Z].*/}
                            message='At least needs 1 upper case letter'
                            ignoreEmptyValue
                        />
                        <PatternRule
                            pattern={/.*[0-9].*/}
                            message='At least needs 1 number'
                            ignoreEmptyValue
                        />
                        <PatternRule
                            pattern={/.*[!¡?¿@#$%^&+=].*/}
                            message='At least needs 1 special character'
                            ignoreEmptyValue
                        />
                    </Item>
                </GroupItem>
                {/* Tabs */}
                <GroupItem cssClass='mt-4'>
                    <TabbedItem>
                        <TabPanelOptions
                            deferRendering={false}
                            height={'50vh'}
                        />
                        <Tab title={`Roles`}>
                            <RolesDataGrid
                                ref={rolesDG}
                                userId={userData.user_id}
                                userRoles={userRoles}
                                roles={roles}
                                isEditing={isEditing}
                            />
                        </Tab>
                        <Tab title={`Logs`}>
                            <LogsDataGrid userLogs={userLogs} />
                        </Tab>
                    </TabbedItem>
                </GroupItem>
            </Form>
        </div>
    );
};

export default memo(UserPage);
