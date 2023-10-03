import { ApiCallError } from './errors';

export const apiPatchAccounting = async <T>(
    path: string,
    id: string,
    invoiceId: string,
    values: T
): Promise<T> => {
    const resp = await fetch(`${path}?id=${id}&invoiceId=${invoiceId}`, {
        method: 'POST',
        body: JSON.stringify(values),
    });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
    return resp.json();
};
