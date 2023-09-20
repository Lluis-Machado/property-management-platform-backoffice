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
    body?: object | FormData | null | string,
    isApplicationJson?: boolean
) => {
    const aux = body instanceof FormData ? body : JSON.stringify(body);

    let headersInit: HeadersInit = {
        Authorization: `${token.token_type} ${token.access_token}`,
    };

    if (isApplicationJson) {
        headersInit = {
            ...headersInit,
            'Content-type': 'application/json; charset=UTF-8',
        };
    }

    const response = await toast.promise(
        fetch(endPoint, {
            body: aux,
            cache: 'no-store',
            headers: headersInit,
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
