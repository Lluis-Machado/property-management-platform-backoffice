import { ApiCallError } from './errors';

/**
 * Performs a DELETE request to the specified API endpoint with the provided ID and handles response errors.
 *
 * @param {string} path - The API endpoint path.
 * @param {string} id - The ID parameter for the request.
 * @returns {Promise<void>} A Promise that resolves if the DELETE request is successful.
 * @throws {ApiCallError} If the response status is not OK, an ApiCallError is thrown with the error message.
 */
export const apiDelete = async (path: string, id: string): Promise<void> => {
    const resp = await fetch(`${path}?id=${id}`, { method: 'DELETE' });

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
