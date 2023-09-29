import { ApiCallError } from './errors';

export const apiDelete = async (path: string, id: string): Promise<void> => {
    const resp = await fetch(`${path}?id=${id}`, { method: 'DELETE' });

    if (!resp.ok) {
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
};
