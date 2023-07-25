// React imports
import { FC, RefObject, memo, useCallback, useEffect, useState } from 'react';

// Libraries imports
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import TreeView from 'devextreme-react/tree-view';

// Local imoports
import { Archive, Document, Folder } from '@/lib/types/documentsAPI';
import {
    copyDocument,
    deleteDocument,
    downloadDocument,
    moveDocument,
    renameDocument,
} from '@/lib/utils/documents/apiDocuments';
import {
    DocumentDownload,
    isArchive,
} from '@/lib/utils/documents/utilsDocuments';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeItem } from '@/lib/types/treeView';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import DataGrid from './dataGrid/DataGrid';
import FailedDocumentPopup, {
    failedDocumentsType,
} from '../popups/FailedDocumentsPopup';

// Dynamic imports
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

interface Props {
    dataSource: Document[];
    folder: Archive | Folder | undefined;
    treeViewRef: RefObject<TreeView<any>>;
}

export const FileManager: FC<Props> = memo(function FileManager({
    dataSource,
    folder,
    treeViewRef,
}) {
    const [documents, setDocuments] = useState<Document[]>(dataSource);
    const [selectedFiles, setSelectedFiles] = useState<Document[]>([]);
    const [formPopupStatus, setFormPopupStatus] = useState<{
        fileName?: string;
        type: FormPopupType;
        visibility: PopupVisibility;
    }>({
        fileName: '',
        type: 'Delete',
        visibility: { hasBeenOpen: false, visible: false },
    });
    const [treeViewPopupStatus, setTreeViewPopupStatus] = useState<{
        type: TreeViewPopupType;
        visibility: PopupVisibility;
    }>({
        type: 'Copy to',
        visibility: { hasBeenOpen: false, visible: false },
    });
    const [failedDocumentsPopupStatus, setFailedDocumentsPopupStatus] =
        useState<{
            files: Document[];
            type: failedDocumentsType;
            visibility: PopupVisibility;
        }>({
            files: [],
            type: 'download',
            visibility: { hasBeenOpen: false, visible: false },
        });

    useEffect(() => {
        setDocuments(dataSource);
    }, [dataSource]);

    //#region Auxiliar functions

    const auxMehtod = useCallback(
        (
            action: 'deleted' | 'copied' | 'moved' | 'downloaded',
            results: boolean[],
            type: failedDocumentsType,
            onSuccessfullDocuments: (
                successfulDocuments: Document[]
            ) => void | Promise<void>
        ) => {
            const successfulDocuments = selectedFiles.filter(
                (_, idx) => results[idx]
            );
            const failedDocuments = selectedFiles.filter(
                (_, idx) => !results[idx]
            );

            if (successfulDocuments.length > 0) {
                onSuccessfullDocuments(successfulDocuments);
                toast(
                    `${successfulDocuments.length} file${
                        successfulDocuments.length > 1 ? 's' : ''
                    } ${action} successfully`,
                    {
                        autoClose: 3000,
                        pauseOnHover: true,
                        type: 'success',
                    }
                );
            }

            if (failedDocuments.length > 0) {
                setFailedDocumentsPopupStatus((p) => ({
                    files: failedDocuments,
                    type,
                    visibility: { ...p.visibility, visible: true },
                }));
            }
        },
        [selectedFiles]
    );

    //#endregion

    //#region Form popup

    const handleFormPopupEvent = useCallback(
        (type: FormPopupType) => {
            if (type === 'New directory')
                throw new Error("Can't create folders in documents");
            if (type === 'Rename' && selectedFiles.length !== 1)
                throw new Error("Can't rename multiple documents at once");

            const fileName =
                selectedFiles.length === 1
                    ? selectedFiles[0].name
                    : `${selectedFiles.length} items`;

            setFormPopupStatus((p) => ({
                fileName,
                type,
                visibility: { ...p.visibility, visible: true },
            }));
        },
        [selectedFiles]
    );

    const handleDelete = useCallback(
        async (archiveId: string) => {
            if (!folder) return;

            const fileIds = selectedFiles.map((file) => file.id);

            const results = await Promise.all(
                fileIds.map(
                    async (fileId) => await deleteDocument(archiveId, fileId)
                )
            );

            const onSuccessfullDocuments = (successfulDocuments: Document[]) =>
                setDocuments((p) =>
                    p.filter(
                        (document) => !successfulDocuments.includes(document)
                    )
                );

            auxMehtod('deleted', results, 'delete', onSuccessfullDocuments);
        },
        [auxMehtod, folder, selectedFiles]
    );

    const handleRename = useCallback(
        async (archiveId: string, name: string | undefined) => {
            if (!name) return;
            const ok = await renameDocument(
                archiveId,
                selectedFiles[0].id,
                name
            );
            if (ok) {
                setDocuments((p) =>
                    p.map((document) =>
                        document.id === selectedFiles[0].id
                            ? { ...document, name }
                            : document
                    )
                );
            }
        },
        [selectedFiles]
    );

    const handleFormPopupSubmit = useCallback(
        (value?: string) => {
            if (!folder) return;

            const archiveId = isArchive(folder)
                ? folder.id
                : (folder as Folder).archiveId;

            const events = {
                'New directory': () => {
                    throw new Error('Invalid action for files');
                },
                Rename: () => handleRename(archiveId, value),
                Delete: () => handleDelete(archiveId),
            };

            events[formPopupStatus.type]();
        },
        [folder, formPopupStatus.type, handleDelete, handleRename]
    );

    //#endregion

    //#region TreeView popup

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        setTreeViewPopupStatus((p) => ({
            type,
            visibility: { ...p.visibility, visible: true },
        }));
    }, []);

    const handleTreeViewPopupSubmit = useCallback(
        async (destination: TreeItem<Archive | Folder>) => {
            if (!folder) return;

            const isCopyTo = treeViewPopupStatus.type === 'Copy to';

            const handleCall = async () => {
                const dData = destination.data;
                const isDestinatioArchive = isArchive(dData);

                const archiveId = isArchive(folder)
                    ? folder.id
                    : (folder as Folder).archiveId;
                const destinationArchive = isDestinatioArchive
                    ? dData.id
                    : (dData as Folder).archiveId;
                const folderId = isDestinatioArchive
                    ? null
                    : (dData as Folder).id;

                return await Promise.all(
                    selectedFiles.map(async (document) => {
                        const operation = isCopyTo
                            ? copyDocument
                            : moveDocument;
                        return await operation(archiveId, document.id, {
                            destinationArchive,
                            documentName: document.name,
                            folderId,
                        });
                    })
                );
            };

            const action = isCopyTo ? 'copied' : 'moved';
            const results = await handleCall();
            const type = isCopyTo ? 'copy' : 'move';
            const onSuccessfullDocuments = (
                successfulDocuments: Document[]
            ) => {
                if (!isCopyTo) {
                    setDocuments((p) =>
                        p.filter(
                            (document) =>
                                !successfulDocuments.includes(document)
                        )
                    );
                }
            };

            auxMehtod(action, results, type, onSuccessfullDocuments);
        },
        [auxMehtod, folder, selectedFiles, treeViewPopupStatus.type]
    );

    //#endregion

    const handleDownload = useCallback(async () => {
        if (!selectedFiles || !folder) return;

        const archiveId = isArchive(folder)
            ? folder.id
            : (folder as Folder).archiveId;

        // Wait for all the promises to resolve (parallel file downloads)
        const results = await Promise.all(
            selectedFiles.map(async (file): Promise<DocumentDownload> => {
                try {
                    const blob = await downloadDocument(archiveId, file.id);
                    return { name: file.name, success: true, blob };
                } catch (error) {
                    return { name: file.name, success: false, blob: null };
                }
            })
        );

        const onSuccessfullDocuments = async () => {
            const successfulDownloads = results.filter(
                (result) => result.success
            );
            if (successfulDownloads.length === 1) {
                saveAs(
                    successfulDownloads[0].blob!,
                    successfulDownloads[0].name
                );
            } else if (successfulDownloads.length > 1) {
                const { downloadDocumentsZIP: downloadFilesZIP } = await import(
                    '@/lib/utils/documents/utilsDocuments'
                );
                downloadFilesZIP(successfulDownloads);
            }
        };

        auxMehtod(
            'downloaded',
            results.map((r) => r.success),
            'download',
            onSuccessfullDocuments
        );
    }, [auxMehtod, folder, selectedFiles]);

    return (
        <>
            <DataGrid
                dataSource={documents}
                onSelectedFile={setSelectedFiles}
                onFileCopy={() => handleCopyMoveToEvent('Copy to')}
                onFileDelete={() => handleFormPopupEvent('Delete')}
                onFileDownload={handleDownload}
                onFileMove={() => handleCopyMoveToEvent('Move to')}
                onFileRename={() => handleFormPopupEvent('Rename')}
            />
            {(formPopupStatus.visibility.visible ||
                formPopupStatus.visibility.hasBeenOpen) && (
                <FormPopup
                    elementName={formPopupStatus.fileName}
                    onHiding={() =>
                        setFormPopupStatus((p) => ({
                            ...p,
                            fileName: '',
                            visibility: { ...p.visibility, visible: false },
                        }))
                    }
                    onShown={() =>
                        setFormPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, hasBeenOpen: true },
                        }))
                    }
                    onSubmit={handleFormPopupSubmit}
                    type={formPopupStatus.type}
                    visible={formPopupStatus.visibility.visible}
                />
            )}
            {(treeViewPopupStatus.visibility.visible ||
                treeViewPopupStatus.visibility.hasBeenOpen) && (
                <TreeViewPopup
                    dataSource={
                        treeViewRef.current?.instance.option(
                            'dataSource'
                        ) as TreeItem<Archive>[]
                    }
                    onHiding={() =>
                        setTreeViewPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, visible: false },
                        }))
                    }
                    onShown={() =>
                        setTreeViewPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, hasBeenOpen: true },
                        }))
                    }
                    onSubmit={handleTreeViewPopupSubmit}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            )}
            {(failedDocumentsPopupStatus.visibility.visible ||
                failedDocumentsPopupStatus.visibility.hasBeenOpen) && (
                <FailedDocumentPopup
                    documents={failedDocumentsPopupStatus.files}
                    onHidden={() =>
                        setFailedDocumentsPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, visible: false },
                        }))
                    }
                    onShown={() =>
                        setFailedDocumentsPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, hasBeenOpen: false },
                        }))
                    }
                    visible={failedDocumentsPopupStatus.visibility.visible}
                    type={failedDocumentsPopupStatus.type}
                />
            )}
        </>
    );
});
