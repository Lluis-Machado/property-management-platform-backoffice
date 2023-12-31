import { ApiCallError } from './errors';

/**
 * Performs a POST request to the API endpoint with provided data and handles response errors.
 *
 * @param {string} path - The API endpoint path.
 * @param {string} id - The identifier for the request.
 * @param {T} values - The data to be sent in the request body.
 * @returns {Promise<T>} A Promise that resolves to the response data.
 * @throws {ApiCallError} If the response status is not OK, an ApiCallError is thrown with the error message.
 */
export const apiPostAccounting = async <T>(
    path: string,
    id: string,
    values: T
): Promise<T> => {
    const resp = await fetch(`${path}?id=${id}`, {
        method: 'POST',
        body: JSON.stringify(values),
    });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
    return resp.json();
};
