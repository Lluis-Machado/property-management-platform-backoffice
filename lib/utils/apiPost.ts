import { ApiCallError } from './errors';

export const apiPost = async <T>(path: string, values: T): Promise<T> => {
    const auxBody =
        values instanceof FormData ? values : JSON.stringify(values);
    console.log(auxBody);
    const res = await fetch(path, {
        method: 'POST',
        body: auxBody,
    });

    if (!res.ok) {
        const responseMsg = await res.text();
        throw new ApiCallError(responseMsg);
    }
    return res.json();
};
