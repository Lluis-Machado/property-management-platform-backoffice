import { ApiCallError } from './errors';

/**
 * Performs a DELETE request to the specified API endpoint with an optional request body and handles response errors.
 *
 * @param {string} path - The API endpoint path.
 * @param {any} [body] - An optional request body to include in the DELETE request.
 * @returns {Promise<void>} A Promise that resolves if the DELETE request is successful.
 * @throws {ApiCallError} If the response status is not OK, an ApiCallError is thrown with the error message.
 */
export const apiDelete = async (path: string, body?: any): Promise<void> => {
    const resp = await fetch(path, {
        method: 'DELETE',
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!resp.ok) {
        if (resp.status === 422) {
            throw new ApiCallError(
                'Found ownerships connected. Please, delete them first.'
            );
        }
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
};
