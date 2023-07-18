import { TokenRes } from '../types/token';
import { ApiCallError } from './errors';

export const apiPatch = async <T>(
    path: string,
    values: T,
    token: TokenRes,
    errMsg: string
): Promise<T> => {
    const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${path}`,
        {
            method: 'PATCH',
            body: JSON.stringify(values),
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
        }
    );

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg || errMsg);
    }
    return resp.json();
};
