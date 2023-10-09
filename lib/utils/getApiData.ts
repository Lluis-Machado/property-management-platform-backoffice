'server-only';
import { cookies } from 'next/headers';
import { ApiCallError } from './errors';
import { getRequestCookie } from './getRequestCookie';

/**
 * Retrieves API data without caching for a specified path.
 *
 * @param {string} path - The API endpoint path to fetch data from.
 * @param {string} errorMsg - Error message to throw if the request fails.
 * @returns {Promise<T>} - A Promise that resolves to the fetched data of type T.
 */
export const getApiData = async <T>(
    path: string,
    errorMsg: string
): Promise<T> => {
    const user = await getRequestCookie(cookies());
    if (!user)
        throw new ApiCallError('Error while getting the user in getApiData');

    const resp = await fetch(process.env.NEXT_PUBLIC_API_GATEWAY_URL + path, {
        method: 'GET',
        headers: {
            Authorization: `${user.token.token_type} ${user.token.access_token}`,
        },
        cache: 'no-store',
    });
    if (!resp.ok) throw new ApiCallError(errorMsg);
    return resp.json();
};
