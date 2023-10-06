// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import UserPage from '@/components/pages/users/UserPage';
import { Locale } from '@/i18n-config';
import { Auth0User, UserLogs, UserRoles } from '@/lib/types/user';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
}

const UserForm = async ({ params: { lang, id } }: Props) => {
    const [userData, userRoles, userLogs, roles] = await Promise.all([
        getApiData<Auth0User>(
            `/auth/users/${id}`,
            'Error while getting user info'
        ),
        getApiData<UserRoles[]>(
            `/auth/users/${id}/roles`,
            'Error while getting user roles'
        ),
        getApiData<UserLogs[]>(
            `/auth/users/${id}/logs`,
            'Error while getting user logs'
        ),
        getApiData<UserRoles[]>(`/auth/roles`, 'Error while getting all roles'),
    ]);

    return (
        <>
            <Breadcrumb />
            <UserPage
                userData={userData}
                userRoles={userRoles}
                userLogs={userLogs}
                roles={roles}
                lang={lang}
            />
        </>
    );
};

export default UserForm;
