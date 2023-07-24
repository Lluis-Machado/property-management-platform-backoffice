// libraries imports
import { toast } from 'react-toastify';

const BASE_END_POINT = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`;

//#region ARCHIVES

export const createArchive = async (archiveName: string) => {
    const endPoint = `${BASE_END_POINT}/archives`;
    const body = { name: archiveName };
    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        }),
        {
            pending: 'Creating archive',
            success: 'Archive created',
            error: 'Error creating archive',
        }
    );
    return response.ok;
};

export const renameArchive = async (archiveId: string, newName: string) => {
    const params = new URLSearchParams({ newName: newName });
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}?${params}`;
    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
        }),
        {
            pending: 'Renaming archive',
            success: 'Archive renamed',
            error: 'Error renaming archive',
        }
    );
    return response.ok;
};

export const deleteArchive = async (archiveId: string) => {
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}`;
    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
        }),
        {
            pending: 'Deleting archive',
            success: 'Archive deleted',
            error: 'Error deleting archive',
        }
    );
    return response.ok;
};

export const undeleteArchive = async (archiveId: string) => {
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}/undelete`;
    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
        }),
        {
            pending: 'Restoring archive',
            success: 'Archive restored',
            error: 'Error restoring archive',
        }
    );
    return response.ok;
};

//#endregion

//#region DOCUMENTS

export const uploadFilesToArchive = async (
    archiveId: string,
    files: any[]
): Promise<Document> => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents`;
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await fetch(endPoint, {
        body: formData,
        cache: 'no-cache',
        method: 'POST',
    });

    return await response.json();
};

export const uploadFilesToFolder = async (
    archiveId: string,
    folderId: string,
    files: any[]
) => {
    const params = new URLSearchParams({ folderId });
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents?${params}`;
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await fetch(endPoint, {
        body: formData,
        cache: 'no-cache',
        method: 'POST',
    });

    return await response.json();
};

export const renameFile = async (
    archiveId: string,
    documentId: string,
    documentName: string
) => {
    const params = new URLSearchParams({ documentName });
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}?${params}`;

    const response = await fetch(endPoint, {
        cache: 'no-cache',
        method: 'PATCH',
    });

    return response.ok;
};

export const deleteFile = async (archiveId: string, documentId: string) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}`;

    const response = await fetch(endPoint, {
        cache: 'no-cache',
        method: 'DELETE',
    });

    return response.ok;
};

//#endregion

//#region FOLDERS

interface Folder {
    archiveId: string;
    body: {
        name: string;
        parentId: string | null;
    };
}

export const newFolder = async ({ archiveId, body }: Folder) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders`;
    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        }),
        {
            pending: 'Creating folder',
            success: 'Folder created',
            error: 'Error creating folder',
        }
    );

    return response;
};

export const renameFolder = async (
    archiveId: string,
    folderId: string,
    body: { archiveId: string; name: string; parentId: string | null }
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}`;
    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
        }),
        {
            pending: 'Renaming folder',
            success: 'Folder renamed',
            error: 'Error renaming folder',
        }
    );
    return response.ok;
};

export const copyFolder = async (
    archiveId: string,
    folderId: string,
    body: { archiveId: string; name: string; parentId?: string }
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}/copy`;
    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        }),
        {
            pending: 'Copying folder',
            success: 'Folder copied',
            error: 'Error copying folder',
        }
    );
    return response;
};

export const moveFolder = async (
    archiveId: string,
    folderId: string,
    body: { archiveId: string; parentId?: string }
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}/move`;
    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        }),
        {
            pending: 'Moving folder',
            success: 'Folder moved',
            error: 'Error moving folder',
        }
    );
    return response;
};

export const deleteFolder = async (archiveId: string, folderId: string) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}`;
    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
        }),
        {
            pending: 'Deleting folder',
            success: 'Folder deleted',
            error: 'Error deleting folder',
        }
    );
    return response.ok;
};

//#endregion
