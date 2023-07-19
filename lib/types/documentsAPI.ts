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
