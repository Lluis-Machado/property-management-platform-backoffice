import { TokenRes } from '../types/token';
import { ApiCallError } from './errors';

export const apiDelete = async (
    path: string,
    token: TokenRes,
    errMsg: string
): Promise<void> => {
    const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${path}`,
        {
            method: 'DELETE',
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
};