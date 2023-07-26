// Libraries imports
import { toast } from 'react-toastify';

const BASE_END_POINT = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`;

interface Messages {
    pending: string;
    success: string;
    error: string;
}

const makeApiRequest = async (
    endPoint: string,
    method: string,
    messages: Messages,
    body?: object | FormData | null
) => {
    const aux = body instanceof FormData ? body : JSON.stringify(body);

    const response = await toast.promise(
        fetch(endPoint, {
            body: aux,
            cache: 'no-cache',
            headers:
                body instanceof FormData
                    ? undefined
                    : { 'Content-Type': 'application/json' },
            method,
        }),
        { ...messages }
    );
    return response;
};

//#region ARCHIVES

const archiveMessages: Record<string, Messages> = {
    create: {
        pending: 'Creating archive',
        success: 'Archive created',
        error: 'Error creating archive',
    },
    rename: {
        pending: 'Renaming archive',
        success: 'Archive renamed',
        error: 'Error renaming archive',
    },
    delete: {
        pending: 'Deleting archive',
        success: 'Archive deleted',
        error: 'Error deleting archive',
    },
    undelete: {
        pending: 'Restoring archive',
        success: 'Archive restored',
        error: 'Error restoring archive',
    },
};

export const createArchive = async (archiveName: string) => {
    const endPoint = `${BASE_END_POINT}/archives`;
    const body = { name: archiveName };
    return makeApiRequest(endPoint, 'POST', archiveMessages.create, body);
};

export const renameArchive = async (archiveId: string, newName: string) => {
    const params = new URLSearchParams({ newName });
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}?${params}`;
    return makeApiRequest(endPoint, 'PATCH', archiveMessages.rename);
};

export const deleteArchive = async (archiveId: string) => {
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}`;
    return makeApiRequest(endPoint, 'DELETE', archiveMessages.delete);
};

export const undeleteArchive = async (archiveId: string) => {
    const endPoint = `${BASE_END_POINT}/archives/${archiveId}/undelete`;
    return makeApiRequest(endPoint, 'PATCH', archiveMessages.undelete);
};

//#endregion

//#region DOCUMENTS

interface Document {
    destinationArchive: string;
    documentName: string;
    folderId?: string | null;
}

const documentMessages: Record<string, Messages> = {
    rename: {
        pending: 'Renaming document',
        success: 'Document renamed',
        error: 'Error renaming document',
    },
};

const uploadDocuments = async (endPoint: string, files: File[]) => {
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await makeApiRequest(
        endPoint,
        'POST',
        documentMessages.upload,
        formData
    );
    return await response.json();
};

export const uploadDocumentsToArchive = async (
    archiveId: string,
    files: File[]
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents`;
    return uploadDocuments(endPoint, files);
};

export const uploadDocumentsToFolder = async (
    archiveId: string,
    folderId: string,
    files: File[]
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents?${new URLSearchParams(
        { folderId }
    )}`;
    return uploadDocuments(endPoint, files);
};

export const renameDocument = async (
    archiveId: string,
    documentId: string,
    documentName: string
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}/rename`;
    const formData = new FormData();
    formData.append('documentName', documentName);
    const response = await makeApiRequest(
        endPoint,
        'PATCH',
        documentMessages.rename,
        formData
    );
    return response.ok;
};

export const deleteDocument = async (archiveId: string, documentId: string) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}`;
    const response = await makeApiRequest(
        endPoint,
        'DELETE',
        documentMessages.delete
    );
    return response.ok;
};

export const downloadDocument = async (
    archiveId: string,
    documentId: string
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}`;
    const response = await makeApiRequest(
        endPoint,
        'GET',
        documentMessages.download
    );
    return await response.blob();
};

const copyMoveDocument = async (
    archiveId: string,
    documentId: string,
    type: 'copy' | 'move',
    body: Document
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/documents/${documentId}/${type}`;
    const formData = new FormData();
    formData.append('destinationArchive', body.destinationArchive);
    formData.append('documentName', body.documentName);
    body.folderId && formData.append('folderId', body.folderId);
    const response = await makeApiRequest(
        endPoint,
        'POST',
        documentMessages[type],
        formData
    );
    return response.ok;
};

export const copyDocument = async (
    archiveId: string,
    documentId: string,
    body: Document
) => {
    return copyMoveDocument(archiveId, documentId, 'copy', body);
};

export const moveDocument = async (
    archiveId: string,
    documentId: string,
    body: Document
) => {
    return copyMoveDocument(archiveId, documentId, 'move', body);
};

//#endregion

//#region FOLDERS

interface Folder {
    name: string;
    parentId: string | null;
}

const folderMessages: Record<string, Messages> = {
    newFolder: {
        pending: 'Creating folder',
        success: 'Folder created',
        error: 'Error creating folder',
    },
    renameFolder: {
        pending: 'Renaming folder',
        success: 'Folder renamed',
        error: 'Error renaming folder',
    },
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
    deleteFolder: {
        pending: 'Deleting folder',
        success: 'Folder deleted',
        error: 'Error deleting folder',
    },
};

export const createFolder = async (archiveId: string, body: Folder) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders`;
    return makeApiRequest(endPoint, 'POST', folderMessages.newFolder, body);
};

export const renameFolder = async (
    archiveId: string,
    folderId: string,
    body: Folder
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}`;
    const response = await makeApiRequest(
        endPoint,
        'PATCH',
        folderMessages.renameFolder,
        body
    );
    return response.ok;
};

export const copyFolder = async (
    archiveId: string,
    folderId: string,
    body: Folder
) => copyMoveFolder(archiveId, folderId, 'copy', body);

export const moveFolder = async (
    archiveId: string,
    folderId: string,
    body: Folder
) => copyMoveFolder(archiveId, folderId, 'move', body);

const copyMoveFolder = async (
    archiveId: string,
    folderId: string,
    type: 'copy' | 'move',
    body: Folder
) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}/${type}`;
    const response = await makeApiRequest(
        endPoint,
        'POST',
        folderMessages[type],
        body
    );
    return response;
};

export const deleteFolder = async (archiveId: string, folderId: string) => {
    const endPoint = `${BASE_END_POINT}/${archiveId}/folders/${folderId}`;
    const response = await makeApiRequest(
        endPoint,
        'DELETE',
        folderMessages.deleteFolder
    );
    return response.ok;
};

//#endregion
