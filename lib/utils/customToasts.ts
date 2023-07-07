import { toast, Id } from 'react-toastify';

export const updateSuccessToast = (toastId: Id, msg: string) => {
    toast.update(toastId, { render: msg, type: "success", isLoading: false, closeOnClick: true, closeButton: true, draggable: true, autoClose: 5000 });
}

export const updateErrorToast = (toastId: Id, msg: string) => {
    toast.update(toastId, { render: msg, type: "error", isLoading: false, closeOnClick: true, closeButton: true, draggable: true });
}