interface BaseInterface {
    createdAt: string;
    createdByUser: string | null;
    deleted: boolean;
    id: string;
    lastUpdateAt: string;
    lastUpdateByUser: string | null;
}

export interface Archive extends BaseInterface {
    name: string;
}

export interface Folder extends BaseInterface {
    archiveId: string;
    childFolders: Folder[];
    hasDocuments: boolean;
    name: string;
    parentId: string | null;
}

export interface Document extends BaseInterface {
    contentLength: number;
    extension: string;
    folderId: string;
    name: string;
}

export interface DocumentUpload {
    fileName: string;
    status: number;
}
