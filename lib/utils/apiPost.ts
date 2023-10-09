import { ApiCallError } from './errors';

/**
 * Performs a POST request to the specified API endpoint with provided data and handles response errors.
 *
 * @param {string} path - The API endpoint path.
 * @param {T} values - The data to be sent in the request body.
 * @returns {Promise<T>} A Promise that resolves to the response data.
 * @throws {ApiCallError} If the response status is not OK, an ApiCallError is thrown with the error message.
 */
export const apiPost = async <T>(path: string, values: T): Promise<T> => {
    const auxBody =
        values instanceof FormData ? values : JSON.stringify(values);

    const res = await fetch(path, {
        method: 'POST',
        body: auxBody,
    });

    if (!res.ok) {
        const responseMsg = await res.text();
        throw new ApiCallError(responseMsg);
    }
    return res.json();
};
