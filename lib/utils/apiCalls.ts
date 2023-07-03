import { User } from '../types/user';

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