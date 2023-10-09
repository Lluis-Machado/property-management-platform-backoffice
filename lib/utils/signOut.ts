/**
 * Signs the user out by making a POST request to the '/api/auth/signout' endpoint.
 *
 * @returns {Promise<Response>} - A Promise that resolves to the fetch Response.
 */
export const signOut = async (): Promise<Response> => {
    return fetch('/api/auth/signout', {
        method: 'POST',
        body: undefined,
    });
};
