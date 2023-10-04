import UsersPage from '@/components/pages/users/UsersPage';
import { Auth0User } from '@/lib/types/user';
import { getApiData } from '@/lib/utils/getApiData';

const Users = async () => {
    const usersData = await getApiData<Auth0User[]>(
        '/auth/users',
        'Error while getting the users'
    );

    return (
        <>
            <div className='mt-4 text-lg text-secondary-500'>Users Page</div>
            <UsersPage dataSource={usersData} />
        </>
    );
};

export default Users;
