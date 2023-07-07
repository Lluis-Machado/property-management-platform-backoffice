// React imports
import { useCallback, useState } from 'react';

// Libraries imports
import dynamic from 'next/dynamic';

// Local imoports
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import DataGrid from './dataGrid/DataGrid';

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
        };
    };
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
                };
            };
        };
    };
};

interface Props {
    dataSource: any[];
    folderId: string;
};

export const FileManager = ({ dataSource, folderId }: Props) => {

    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [dataSourceWithDisabled, setDataSourceWithDisabled] = useState<any[] | undefined>(undefined);
    const [formPopupStatus, setFormPopupStatus] = useState<{
        fileName?: string;
        type: FormPopupType;
        visibility: PopupVisibility;
    }>({
        fileName: '',
        type: 'Delete',
        visibility: { hasBeenOpen: false, visible: false }
    });
    const [treeViewPopupStatus, setTreeViewPopupStatus] = useState<{
        type: TreeViewPopupType;
        visibility: PopupVisibility;
    }>({
        type: 'Copy to',
        visibility: { hasBeenOpen: false, visible: false }
    });

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        if (dataSourceWithDisabled === undefined) {
            dataSource.forEach((item: any) => addDisabledKey(item));
        };
        setDataSourceWithDisabled(dataSource.map((item: any) => updateDisabledStatus(item, folderId)));
        setTreeViewPopupStatus(p => ({ type, visibility: { ...p.visibility, visible: true } }));
    }, [dataSource, dataSourceWithDisabled, folderId]);

    const handleFormPopupEvent = useCallback((type: FormPopupType) => {
        const folderName = type === 'New directory' ? 'Untitled directory' : selectedFiles[0].name;
        setFormPopupStatus(p => ({ folderName, type, visibility: { ...p.visibility, visible: true } }));
    }, [selectedFiles]);

    return (
        <>
            <DataGrid
                onSelectedFile={setSelectedFiles}
                onFileCopy={() => handleCopyMoveToEvent('Copy to')}
                onFileDelete={() => { handleFormPopupEvent('Rename') }}
                onFileDownload={() => { }}
                onFileMove={() => handleCopyMoveToEvent('Move to')}
                onFileRename={() => { handleFormPopupEvent('Rename') }}
                onRefresh={() => { }}
            />
            {
                (formPopupStatus.visibility.visible || formPopupStatus.visibility.hasBeenOpen) &&
                <FormPopup
                    elementName={formPopupStatus.fileName}
                    onHiding={() => setFormPopupStatus(p => ({ ...p, fileName: '', visibility: { ...p.visibility, visible: false } }))}
                    onShown={() => setFormPopupStatus(p => ({ ...p, visibility: { ...p.visibility, hasBeenOpen: true } }))}
                    onSubmit={() => { }}
                    type={formPopupStatus.type}
                    visible={formPopupStatus.visibility.visible}
                />
            }
            {
                (treeViewPopupStatus.visibility.visible || treeViewPopupStatus.visibility.hasBeenOpen) &&
                <TreeViewPopup
                    dataSource={dataSourceWithDisabled!}
                    onHiding={() => setTreeViewPopupStatus(p => ({ ...p, visibility: { ...p.visibility, visible: false } }))}
                    onShown={() => setTreeViewPopupStatus(p => ({ ...p, visibility: { ...p.visibility, hasBeenOpen: true } }))}
                    onSubmit={() => { }}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            }
        </>
    );
};
