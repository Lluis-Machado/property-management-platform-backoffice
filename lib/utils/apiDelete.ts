import { ApiCallError } from './errors';

export const apiDelete = async (path: string, id: string): Promise<void> => {
    const resp = await fetch(`${path}?id=${id}`, { method: 'DELETE' });

    if (!resp.ok) {
        if (resp.status === 422) {
            throw new ApiCallError(
                'Found ownerships connected. Please, delete them first.'
            );
        }
        const responseMsg = await resp.text();
        throw new ApiCallError(responseMsg);
    }
};
