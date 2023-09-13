// Libraries imports
import { toast } from 'react-toastify';
// Local imports
import { TokenRes } from '@/lib/types/token';

interface Messages {
    pending: string;
    success: string;
    error: string;
}

export const makeApiRequest = async (
    endPoint: string,
    method: string,
    messages: Messages,
    token: TokenRes,
    body?: object | FormData | null | string
) => {
    const aux = body instanceof FormData ? body : JSON.stringify(body);

    const response = await toast.promise(
        fetch(endPoint, {
            body: aux,
            cache: 'no-cache',
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
            },
            method,
        }),
        { ...messages }
    );
    return response;
};

export const documentMessages: Record<string, Messages> = {
    rename: {
        pending: 'Annalyzing',
        success: 'Invoice analyzed',
        error: 'Error annalyzing invoice',
    },
};
