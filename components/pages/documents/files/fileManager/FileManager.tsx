// React imports
import { FC, RefObject, memo, useCallback, useMemo, useState } from 'react';

// Libraries imports
import dynamic from 'next/dynamic';

// Local imoports
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import DataGrid from './dataGrid/DataGrid';
import TreeView from 'devextreme-react/tree-view';

// Dynamic imports
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

const addDisabledKey = (node: any) => {
    const stack = [node];

    while (stack.length > 0) {
        const currentNode = stack.pop();
        currentNode.disabled = false;

        if (Array.isArray(currentNode.items)) {
            currentNode.items.forEach((item: any) => {
                stack.push(item);
            });
        }
    }
};

const updateDisabledStatus = (treeNode: any, id: string): any => {
    const updatedClone = structuredClone(treeNode);
    const stack = [updatedClone];

    while (stack.length > 0) {
        const node = stack.pop();

        if (Array.isArray(node.items)) {
            for (const item of node.items) {
                if (item.uuid === id) {
                    node.disabled = true;
                    item.disabled = true;
                    return updatedClone;
                } else {
                    stack.push(item);
                }
            }
        }
    }
};

interface Props {
    dataSource: any[];
    folder: any;
    treeViewRef: RefObject<TreeView<any>>;
}

export const FileManager: FC<Props> = memo(function FileManager({
    dataSource,
    folder,
    treeViewRef,
}) {
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
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
            if (type === 'New directory') throw new Error('Value not valid');
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
                console.log('delete file');
            };

            const events = {
                'New directory': handleNewDirectory,
                Rename: handleRename,
                Delete: handleDelete,
            };

            events[formPopupStatus.type]();
        },
        [formPopupStatus.type, selectedFiles]
    );

    const getTreeViewPopupDataSource = useMemo(
        () => treeViewRef.current?.instance.option('dataSource') as any[],
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
