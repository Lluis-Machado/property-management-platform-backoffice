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

export const uploadDocumentsToArchive = async (
    archiveId: string,
    files: any[]
): Promise<Document> =>
    uploadDocuments(`${BASE_END_POINT}/${archiveId}/documents`, files);

export const uploadDocumentsToFolder = async (
    archiveId: string,
    folderId: string,
    files: any[]
) =>
    uploadDocuments(
        `${BASE_END_POINT}/${archiveId}/documents?${new URLSearchParams({
            folderId,
        })}`,
        files
    );

const uploadDocuments = async (endPoint: string, files: any[]) => {
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

export const renameDocument = async (
    archiveId: string,
    documentId: string,
    documentName: string
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}/rename`;

    const formData = new FormData();
    formData.append('documentName', documentName);

    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            method: 'PATCH',
            body: formData,
        }),
        {
            pending: 'Renaming document',
            success: 'Document renamed',
            error: 'Error renaming document',
        }
    );

    return response.ok;
};

export const deleteDocument = async (archiveId: string, documentId: string) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}`;

    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
            method: 'DELETE',
        }),
        {
            pending: 'Deleting document',
            success: 'Document deleted',
            error: 'Error deleting document',
        }
    );

    return response.ok;
};

export const downloadDocument = async (
    archiveId: string,
    documentId: string
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}`;

    const response = await toast.promise(
        fetch(endPoint, {
            cache: 'no-cache',
        }),
        {
            pending: 'Downloading document',
            success: 'Document downloaded',
            error: 'Error downloading document',
        }
    );

    return await response.blob();
};

interface CopyMoveDocument {
    archiveId: string;
    documentId: string;
    body: {
        destinationArchive: string;
        documentName: string;
        folderId: string | null;
    };
}

export const copyDocument = async ({
    archiveId,
    body,
    documentId,
}: CopyMoveDocument) => copyMoveFile({ archiveId, body, documentId }, 'copy');

export const moveDocument = async ({
    archiveId,
    body,
    documentId,
}: CopyMoveDocument) => copyMoveFile({ archiveId, body, documentId }, 'move');

const copyMoveFile = async (
    { archiveId, body, documentId }: CopyMoveDocument,
    type: 'copy' | 'move'
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}/${type}`;

    const messages = {
        copy: {
            pending: 'Copying document',
            success: 'Document copied',
            error: 'Error copying document',
        },
        move: {
            pending: 'Moving document',
            success: 'Document moved',
            error: 'Error moving document',
        },
    };

    const formData = new FormData();
    formData.append('destinationArchive', body.destinationArchive);
    formData.append('documentName', body.documentName);
    body.folderId && formData.append('folderId', body.folderId);

    const response = await toast.promise(
        fetch(endPoint, {
            body: formData,
            cache: 'no-cache',
            method: 'POST',
        }),
        {
            ...messages[type],
        }
    );

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

interface CopyMoveFolder {
    archiveId: string;
    folderId: string;
    body: {
        archiveId: string;
        name: string;
        parentId?: string;
    };
}

export const copyFolder = async ({
    archiveId,
    folderId,
    body,
}: CopyMoveFolder) => copyMoveFolder({ archiveId, body, folderId }, 'copy');

export const moveFolder = async ({
    archiveId,
    folderId,
    body,
}: CopyMoveFolder) => copyMoveFolder({ archiveId, body, folderId }, 'move');

const copyMoveFolder = async (
    { archiveId, folderId, body }: CopyMoveFolder,
    type: 'copy' | 'move'
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}/${type}`;

    const messages = {
        copy: {
            pending: 'Copying folder',
            success: 'Folder copied',
            error: 'Error copying folder',
        },
        move: {
            pending: 'Moving folder',
            success: 'Folder moved',
            error: 'Error moving folder',
        },
    };

    const response = await toast.promise(
        fetch(endPoint, {
            body: JSON.stringify(body),
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        }),
        {
            ...messages[type],
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
