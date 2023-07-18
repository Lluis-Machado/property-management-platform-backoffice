'server-only';

import { cookies } from 'next/headers';
import { User } from '../types/user';
import { getRequestCookie } from './getRequestCookie';
import { ApiCallError } from './errors';

export async function getUser(): Promise<User> {
    const user = await getRequestCookie(cookies());
    if (!user) throw new ApiCallError('Error while getting the user');
    return user;
}
