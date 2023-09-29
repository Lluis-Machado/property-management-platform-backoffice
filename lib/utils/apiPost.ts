import { ApiCallError } from './errors';

export const apiPost = async <T>(path: string, values: T): Promise<T> => {
    const res = await fetch(path, {
        method: 'POST',
        body: JSON.stringify(values),
    });

    if (!res.ok) {
        const responseMsg = await res.text();
        throw new ApiCallError(responseMsg);
    }
    return res.json();
};
