import { ApiCallError } from './errors';

/**
 * Performs a DELETE request to the specified API endpoint with provided IDs and handles response errors.
 *
 * @param {string} path - The API endpoint path.
 * @param {string} id - The ID parameter for the request.
 * @param {string} invoiceId - The invoice ID parameter for the request.
 * @returns {Promise<void>} A Promise that resolves if the DELETE request is successful.
 * @throws {ApiCallError} If the response status is not OK, an ApiCallError is thrown with the error message.
 */
export const apiDeleteAccounting = async (
    path: string,
    id: string,
    invoiceId: string
): Promise<void> => {
    const resp = await fetch(`${path}?id=${id}&invoiceId=${invoiceId}`, {
        method: 'DELETE',
    });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
};
