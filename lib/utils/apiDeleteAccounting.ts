import { ApiCallError } from './errors';

export const apiDeleteAccounting = async (
    path: string,
    id: string,
    invoiceId: string
): Promise<void> => {
    const resp = await fetch(`${path}?id=${id}&invoiceId=${invoiceId}`, {
        method: 'DELETE',
    });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
};
