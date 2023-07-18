import { Id } from 'react-toastify';
import { updateErrorToast } from './customToasts';
import { ApiCallError } from './errors';

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
