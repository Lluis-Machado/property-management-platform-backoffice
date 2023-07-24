// React imports
import { FC, RefObject, memo, useCallback, useMemo, useState } from 'react';

// Libraries imports
import dynamic from 'next/dynamic';
import TreeView from 'devextreme-react/tree-view';

// Local imoports
import { deleteFile } from '@/lib/utils/documents/apiDocuments';
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
    dataSource: any[];
    folder: Archive | Folder | undefined;
    treeViewRef: RefObject<TreeView<any>>;
}

export const FileManager: FC<Props> = memo(function FileManager({
    dataSource,
    folder,
    treeViewRef,
}) {
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

    const handleFormPopupSubmit = useCallback(
        (value?: string) => {
            const handleNewDirectory = () => {
                throw new Error('Invalid action for files');
            };

            const handleRename = async () => {
                if (!value) return;
                console.log(selectedFiles);
            };

            const handleDelete = async () => {
                if (!folder) return;
                const archiveId = isArchive(folder)
                    ? folder.id
                    : (folder as Folder).archiveId;
                console.log(selectedFiles);

                const ok = deleteFile(archiveId, selectedFiles[0].id);
            };

            const events = {
                'New directory': handleNewDirectory,
                Rename: handleRename,
                Delete: handleDelete,
            };

            events[formPopupStatus.type]();
        },
        [folder, formPopupStatus.type, selectedFiles]
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
                dataSource={dataSource}
                onSelectedFile={setSelectedFiles}
                onFileCopy={() => handleCopyMoveToEvent('Copy to')}
                onFileDelete={() => handleFormPopupEvent('Delete')}
                onFileDownload={() => {}}
                onFileMove={() => handleCopyMoveToEvent('Move to')}
                onFileRename={() => handleFormPopupEvent('Rename')}
                onRefresh={() => {}}
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
