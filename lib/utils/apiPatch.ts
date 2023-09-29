import { ApiCallError } from './errors';

export const apiPatch = async <T>(
    path: string,
    id: string,
    values: T
): Promise<T> => {
    const resp = await fetch(`${path}?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
    });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
    return resp.json();
};
