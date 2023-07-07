import { User } from '../types/user';
import { ApiCallError } from './errors';

export const getUser = async (): Promise<User> => {
    return fetch('/api/user').then(res => res.json());
};

export const signOut = async (): Promise<Response> => {
    return fetch('/api/auth/signout',
        {
            method: 'POST',
            body: undefined
        });
};

export const getApiData = async (path: string, errorMsg: string) => {
    const resp = await fetch(process.env.NEXT_PUBLIC_API_GATEWAY_URL + path, { cache: 'no-store' })
    if (!resp.ok) throw new ApiCallError(errorMsg);
    return resp.json()
}