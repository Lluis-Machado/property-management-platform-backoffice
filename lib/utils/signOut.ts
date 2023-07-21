export const signOut = async (): Promise<Response> => {
    return fetch('/api/auth/signout', {
        method: 'POST',
        body: undefined,
    });
};
