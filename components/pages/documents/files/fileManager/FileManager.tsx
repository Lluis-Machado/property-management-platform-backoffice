// React imports
import {
    FC,
    RefObject,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

// Libraries imports
import dynamic from 'next/dynamic';
import TreeView from 'devextreme-react/tree-view';

// Local imoports
import { deleteFile, renameFile } from '@/lib/utils/documents/apiDocuments';
import { Archive, Documents, Folder } from '@/lib/types/documentsAPI';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import DataGrid from './dataGrid/DataGrid';
import { isArchive } from '@/lib/utils/documents/utilsDocuments';
import { TreeItem } from '@/lib/types/treeView';

// Dynamic imports
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

interface Props {
    dataSource: Documents[];
    folder: Archive | Folder | undefined;
    treeViewRef: RefObject<TreeView<any>>;
}

export const FileManager: FC<Props> = memo(function FileManager({
    dataSource,
    folder,
    treeViewRef,
}) {
    const [documents, setDocuments] = useState<Documents[]>(dataSource);
    const [selectedFiles, setSelectedFiles] = useState<Documents[]>([]);
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

    useEffect(() => {
        setDocuments(dataSource);
    }, [dataSource]);

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        setTreeViewPopupStatus((p) => ({
            type,
            visibility: { ...p.visibility, visible: true },
        }));
    }, []);

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

            const deletionResults = await Promise.all(
                fileIds.map(async (fileId) => {
                    const ok = await deleteFile(archiveId, fileId);
                    return { fileId, ok };
                })
            );

            // Filter deletions
            // Separate the successful and failed deletions
            const { successfulDeletions, failedDeletions } =
                deletionResults.reduce(
                    (
                        acc: {
                            successfulDeletions: any[];
                            failedDeletions: any[];
                        },
                        { ok, fileId }
                    ) => {
                        ok
                            ? acc.successfulDeletions.push(fileId)
                            : acc.failedDeletions.push(fileId);

                        return acc;
                    },
                    { successfulDeletions: [], failedDeletions: [] }
                );

            // Update the documents useState by filtering out the deleted files
            setDocuments((p) =>
                p.filter(
                    (document) => !successfulDeletions.includes(document.id)
                )
            );

            if (failedDeletions.length > 0) {
                console.log('Failed deletions:', failedDeletions);
                // TODO: Notify the user about the failed deletions as per your preferred method (e.g., toast, alert, etc.)
            }
        },
        [folder, selectedFiles]
    );

    const handleRename = useCallback(
        async (archiveId: string, name: string | undefined) => {
            if (!name) return;
            const ok = await renameFile(archiveId, selectedFiles[0].id, name);
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
            const handleNewDirectory = () => {
                throw new Error('Invalid action for files');
            };

            const events = {
                'New directory': handleNewDirectory,
                Rename: () => handleRename(archiveId, value),
                Delete: () => handleDelete(archiveId),
            };

            if (!folder) return;

            const archiveId = isArchive(folder)
                ? folder.id
                : (folder as Folder).archiveId;

            events[formPopupStatus.type]();
        },
        [folder, formPopupStatus.type, handleDelete, handleRename]
    );

    const getTreeViewPopupDataSource = useMemo(
        () =>
            treeViewRef.current?.instance.option(
                'dataSource'
            ) as TreeItem<Archive>[],
        [treeViewRef]
    );

    return (
        <>
            <DataGrid
                dataSource={documents}
                onSelectedFile={setSelectedFiles}
                onFileCopy={() => handleCopyMoveToEvent('Copy to')}
                onFileDelete={() => handleFormPopupEvent('Delete')}
                onFileDownload={() => {}}
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
                    dataSource={getTreeViewPopupDataSource}
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
                    onSubmit={() => {}}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            )}
        </>
    );
});
