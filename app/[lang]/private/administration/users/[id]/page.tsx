// Local imports
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import UserPage from '@/components/pages/users/UserPage';
import { Locale } from '@/i18n-config';
import { Auth0User } from '@/lib/types/user';
import { getApiData } from '@/lib/utils/getApiData';

interface Props {
    params: { lang: Locale; id: string };
}

const UserForm = async ({ params: { lang, id } }: Props) => {
    const userData = await getApiData<Auth0User>(
        `/auth/users/${id}`,
        'Error while getting user info'
    );

    return (
        <>
            <Breadcrumb />
            <UserPage userData={userData} lang={lang} />
        </>
    );
};

export default UserForm;
