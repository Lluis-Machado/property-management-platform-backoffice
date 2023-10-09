import { Id } from 'react-toastify';
import { updateErrorToast } from './customToasts';
import { ApiCallError } from './errors';

/**
 * Handles custom error handling and displays an error toast notification.
 *
 * @param {unknown} error - The error object or value to handle.
 * @param {Id} toastId - The ID of the toast to update.
 */
export const customError = (error: unknown, toastId: Id) => {
    console.error(error);
    if (error instanceof ApiCallError) {
        updateErrorToast(toastId, error.message);
    } else {
        updateErrorToast(
            toastId,
            'There was an unexpected error, contact admin'
        );
    }
};
