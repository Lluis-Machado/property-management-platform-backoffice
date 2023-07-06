// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { ContextMenu as DxContextMenu, Item } from 'devextreme-react/context-menu';
import { ItemClickEvent } from 'devextreme/ui/context_menu';
import dynamic from 'next/dynamic';

// Local imports
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';

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
    dataSource: any;
    selectedTreeItem: any;
};

export const ContextMenu = ({
    dataSource,
    selectedTreeItem
}: Props): React.ReactElement => {
    const ContextMenuRef = useRef<DxContextMenu>(null);
    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);

    const [formPopupStatus, setFormPopupStatus] = useState<{
        folderName?: string;
        type: FormPopupType;
        visibility: PopupVisibility;
    }>({
        folderName: '',
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
    const [dataSourceWithDisabled, setDataSourceWithDisabled] = useState<any[] | undefined>(undefined);

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        if (!dataSourceWithDisabled) {
            dataSource.forEach((item: any) => addDisabledKey(item));
        };
        setDataSourceWithDisabled(dataSource.map((item: any) => updateDisabledStatus(item, selectedTreeItem.uuid)));
        setTreeViewPopupStatus(p => ({ type, visibility: { ...p.visibility, visible: true } }));
    }, [dataSource, dataSourceWithDisabled, selectedTreeItem]);

    const handleFormPopupEvent = useCallback((type: FormPopupType) => {
        const folderName = type === 'New directory' ? 'Untitled directory' : selectedTreeItem.name;
        setFormPopupStatus(p => ({ folderName, type, visibility: { ...p.visibility, visible: true } }));
    }, [selectedTreeItem]);

    const handleRefreshEvent = useCallback(() => {
        // TODO: hacer llamada.
    }, []);

    const handleContextMenuItemClick = useCallback(({ itemIndex }: ItemClickEvent) => {
        const actions: any = {
            // New directory
            0: () => handleFormPopupEvent('New directory'),
            // Upload files
            1: () => UploadFileInputRef.current?.click(),
            // Rename
            2: () => handleFormPopupEvent('Rename'),
            // Move to
            3: () => handleCopyMoveToEvent('Move to'),
            // Copy to
            4: () => handleCopyMoveToEvent('Copy to'),
            // Delete
            5: () => handleFormPopupEvent('Delete'),
            // Refresh
            6: () => handleRefreshEvent(),
        };
        actions[itemIndex]();
    }, [handleCopyMoveToEvent, handleFormPopupEvent, handleRefreshEvent]);

    const handleFormPopupSubmit = useCallback((value?: string) => {
        const { name } = selectedTreeItem;
        switch (formPopupStatus.type) {
            case 'New directory':
                if (!name) return;
                console.log('Creating folder', value, 'in', name);
                // TODO: hacer llamada.
                break;
            case 'Rename':
                if (!name) return;
                console.log('Renaming folder from', name, 'to', value);
                // TODO: hacer llamada.
                break;
            case 'Delete':
                console.log('Deleting folder', formPopupStatus.folderName);
                // TODO: hacer llamada.
                break;
        }
    }, [formPopupStatus, selectedTreeItem]);

    const handleFileInputOnChange = useCallback(() => {
        const fileInput = UploadFileInputRef.current;
        if (!fileInput) return;

        const selectedFiles = [...fileInput.files ?? []];
        if (selectedFiles.length === 0) return;

        // TODO: hacer llamada.

        UploadFileFormRef.current?.reset();
    }, []);

    const isRootFolder = useCallback(() => selectedTreeItem?.isRoot ?? false, [selectedTreeItem]);

    const handleTreeViewPopupSubmit = useCallback((destinationFolderId: string) => {
        const originalFolder = selectedTreeItem.uuid;
        if (treeViewPopupStatus.type === 'Copy to') {
            console.log("Copying folder", originalFolder, "to", destinationFolderId);
        } else {
            console.log("Moving folder", originalFolder, "to", destinationFolderId);
        }
        // TODO: hacer llamda.
    }, [selectedTreeItem, treeViewPopupStatus]);

    return (
        <>
            <DxContextMenu
                ref={ContextMenuRef}
                target="#treeview .dx-treeview-item"
                onItemClick={handleContextMenuItemClick}
                hideOnOutsideClick
            >
                <Item closeMenuOnClick icon='newfolder' text='New directory' />
                <Item closeMenuOnClick icon='upload' text='Upload files' />
                <Item closeMenuOnClick icon='rename' text='Rename' visible={!isRootFolder()} />
                <Item closeMenuOnClick icon='movetofolder' text='Move to' visible={!isRootFolder()} />
                <Item closeMenuOnClick icon='copy' text='Copy to' visible={!isRootFolder()} />
                <Item closeMenuOnClick icon='trash' text='Delete' visible={!isRootFolder()} />
                <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
            </DxContextMenu>
            {
                (formPopupStatus.visibility.visible || formPopupStatus.visibility.hasBeenOpen) &&
                <FormPopup
                    folderName={formPopupStatus.folderName}
                    onHiding={() => setFormPopupStatus(p => ({ ...p, folderName: '', visibility: { ...p.visibility, visible: false } }))}
                    onShown={() => setFormPopupStatus(p => ({ ...p, visibility: { ...p.visibility, hasBeenOpen: true } }))}
                    onSubmit={handleFormPopupSubmit}
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
                    onSubmit={handleTreeViewPopupSubmit}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            }
            <form ref={UploadFileFormRef} className='hidden'>
                <input type='file' multiple ref={UploadFileInputRef} onChange={handleFileInputOnChange} />
            </form>
        </>
    );
};

export default ContextMenu;