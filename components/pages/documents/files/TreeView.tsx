'use client'

// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { ContextMenu, Item } from 'devextreme-react/context-menu';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemClickEvent } from 'devextreme/ui/context_menu';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import './TreeView.css'
import { FormPopupType } from './TreeViewFormPopup';
import { TreeViewPopup, TreeViewPopupType } from './TreeViewPopup';

// Dynamic imports
const TreeViewFormPopup = dynamic(() => import('./TreeViewFormPopup'));

const itemRender = (params: any): React.ReactElement => {
    if (!params.isDirectory) return <></>;
    return (
        <div className='flex flex-row items-center text-center gap-4'>
            <FontAwesomeIcon icon={faFolder} />
            <p>
                {params.name}
            </p>
        </div>
    );
};

const addDisabledKey = (node: any) => {
    const stack = [node]; // Initialize stack with the root node

    while (stack.length > 0) {
        const currentNode = stack.pop();
        currentNode.disabled = false;

        if (Array.isArray(currentNode.items) && currentNode.items.length > 0) {
            // Push each item of the current node to the stack
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

        if (Array.isArray(node.items) && node.items.length > 0) {
            for (const item of node.items) {
                if (item.uuid === id) {
                    node.disabled = true;
                    item.disabled = true;
                } else {
                    stack.push(item);
                };
            };
        };
    };

    return updatedClone;
};

interface Props {
    dataSource: any;
    permissions?: {
        copy: boolean;
        create: boolean;
        delete: boolean;
        download: boolean;
        move: boolean;
        rename: boolean;
        upload: boolean;
    };
};

export const TreeView = ({
    dataSource,
    permissions = {
        copy: true,
        create: true,
        delete: true,
        download: true,
        move: true,
        rename: true,
        upload: true
    },
}: Props): React.ReactElement => {
    const ContextMenuRef = useRef<ContextMenu>(null);
    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedTreeItem, setSelectedTreeItem] = useState<any>(undefined);
    const [formPopupStatus, setFormPopupStatus] = useState<{
        folderName: string;
        type: FormPopupType;
        visible: boolean;
    }>({
        folderName: '',
        type: 'Delete',
        visible: false
    });
    const [treeViewPopupStatus, setTreeViewPopupStatus] = useState<{
        type: TreeViewPopupType;
        visible: boolean;
    }>({
        type: 'Copy to',
        visible: false
    });

    const [dataSourceWithDisabled, setDataSourceWithDisabled] = useState<any[] | undefined>(undefined);

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        if (!dataSourceWithDisabled) {
            dataSource.forEach((item: any) => addDisabledKey(item));
        };
        setDataSourceWithDisabled(dataSource.map((item: any) => updateDisabledStatus(item, selectedTreeItem.uuid)));
        setTreeViewPopupStatus({ type, visible: true });
    }, [dataSource, dataSourceWithDisabled, selectedTreeItem]);

    const handleFormPopupEvent = useCallback((type: FormPopupType) => {
        const folderName = type === 'New directory' ? 'Untitled directory' : selectedTreeItem.name;
        setFormPopupStatus({ folderName, type, visible: true });
    }, [selectedTreeItem]);

    const handleRefreshEvent = useCallback(() => {
        // TODO: hacer llamada.
    }, []);

    const handleContextMenuItemClick = useCallback((e: ItemClickEvent) => {
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
        actions[e.itemIndex]();
    }, [handleCopyMoveToEvent, handleFormPopupEvent, handleRefreshEvent]);

    const handleFormPopupSubmit = useCallback((value?: string) => {
        switch (formPopupStatus.type) {
            case 'New directory':
                if (!selectedTreeItem?.name) return;
                console.log('Creating folder', value, 'in', selectedTreeItem.name);
                // TODO: hacer llamada.
                break;
            case 'Rename':
                if (!selectedTreeItem?.name) return;
                console.log('Renaming folder from', selectedTreeItem.name, 'to', value);
                // TODO: hacer llamada.
                break;
            case 'Delete':
                console.log('Deleting folder', formPopupStatus.folderName);
                // TODO: hacer llamada.
                break;
        }
    }, [formPopupStatus.folderName, formPopupStatus.type, selectedTreeItem?.name]);

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
        <div className='w-full relative'>
            <DxTreeView
                dataSource={dataSource}
                displayExpr='name'
                hasItemsExpr='isDirectory'
                id='treeview'
                itemRender={itemRender}
                itemsExpr='items'
                keyExpr='id'
                onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                searchEnabled
                searchExpr={['name', 'uuid']}
            />
            <ContextMenu
                ref={ContextMenuRef}
                target="#treeview .dx-treeview-item"
                onItemClick={handleContextMenuItemClick}
                hideOnOutsideClick
            >
                <Item closeMenuOnClick icon='newfolder' text='New directory' visible={permissions.create} />
                <Item closeMenuOnClick icon='upload' text='Upload files' visible={permissions.upload} />
                <Item closeMenuOnClick icon='rename' text='Rename' visible={!isRootFolder() && permissions.rename} />
                <Item closeMenuOnClick icon='movetofolder' text='Move to' visible={!isRootFolder() && permissions.move} />
                <Item closeMenuOnClick icon='copy' text='Copy to' visible={!isRootFolder() && permissions.copy} />
                <Item closeMenuOnClick icon='trash' text='Delete' visible={!isRootFolder() && permissions.delete} />
                <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
            </ContextMenu>
            <TreeViewFormPopup
                folderName={formPopupStatus.folderName}
                onHiding={() => setFormPopupStatus(p => ({ ...p, folderName: '', visible: false }))}
                onSubmit={handleFormPopupSubmit}
                type={formPopupStatus.type}
                visible={formPopupStatus.visible}
            />
            <TreeViewPopup
                dataSource={dataSourceWithDisabled!}
                onHiding={() => setTreeViewPopupStatus(p => ({ ...p, visible: false }))}
                onSubmit={handleTreeViewPopupSubmit}
                type={treeViewPopupStatus.type}
                visible={treeViewPopupStatus.visible}
            />
            <form ref={UploadFileFormRef} className='hidden'>
                <input type='file' multiple ref={UploadFileInputRef} onChange={handleFileInputOnChange} />
            </form>
        </div>
    );
};