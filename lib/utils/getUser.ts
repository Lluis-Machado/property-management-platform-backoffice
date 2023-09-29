'server-only';

import { cookies } from 'next/headers';
import { User } from '../types/user';
import { getRequestCookie } from './getRequestCookie';
import { ApiCallError } from './errors';

/**
 * Asynchronously fetches user data.
 * @returns {Promise<User>} A Promise that resolves to the user data.
 * @throws {ApiCallError} If there is an error while fetching the user data.
 */
export async function getUser(): Promise<User> {
    const user = await getRequestCookie(cookies());
    if (!user) throw new ApiCallError('Error while getting the user');
    return user;
}
