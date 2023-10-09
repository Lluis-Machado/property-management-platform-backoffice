import { toast, Id } from 'react-toastify';

/**
 * Updates an existing toast notification with a success message.
 *
 * @param {Id} toastId - The ID of the toast to update.
 * @param {string} msg - The success message to display.
 */
export const updateSuccessToast = (toastId: Id, msg: string) => {
    toast.update(toastId, {
        render: msg,
        type: 'success',
        isLoading: false,
        closeOnClick: true,
        closeButton: true,
        draggable: true,
        autoClose: 5000, // Automatically close after 5000 milliseconds (5 seconds).
    });
};

/**
 * Updates an existing toast notification with an error message.
 *
 * @param {Id} toastId - The ID of the toast to update.
 * @param {string} msg - The error message to display.
 */
export const updateErrorToast = (toastId: Id, msg: string) => {
    toast.update(toastId, {
        render: msg,
        type: 'error',
        isLoading: false,
        closeOnClick: true,
        closeButton: true,
        draggable: true,
    });
};
