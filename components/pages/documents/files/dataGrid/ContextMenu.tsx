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
            // Rename
            0: () => handleFormPopupEvent('Rename'),
            // Move to
            1: () => handleCopyMoveToEvent('Move to'),
            // Copy to
            2: () => handleCopyMoveToEvent('Copy to'),
            // Delete
            3: () => handleFormPopupEvent('Delete'),
            // Refresh
            4: () => handleRefreshEvent(),
            // Download
            5: () => {},
        };
        actions[itemIndex]();
    }, [handleCopyMoveToEvent, handleFormPopupEvent, handleRefreshEvent]);

    const handleFormPopupSubmit = useCallback((value?: string) => {
        const { name } = selectedTreeItem;
        switch (formPopupStatus.type) {
            case 'Rename':
                if (!name) return;
                console.log('Renaming file from', name, 'to', value);
                // TODO: hacer llamada.
                break;
            case 'Delete':
                console.log('Deleting file', formPopupStatus.folderName);
                // TODO: hacer llamada.
                break;
        }
    }, [formPopupStatus, selectedTreeItem]);

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
                target='#dataGrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap'
                onItemClick={handleContextMenuItemClick}
                hideOnOutsideClick
            >
                <Item closeMenuOnClick icon='rename' text='Rename' visible={selectedTreeItem.length === 1} />
                <Item closeMenuOnClick icon='movetofolder' text='Move to' />
                <Item closeMenuOnClick icon='copy' text='Copy to' />
                <Item closeMenuOnClick icon='trash' text='Delete' />
                <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
                <Item closeMenuOnClick icon='download' text='Download' />
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
        </>
    );
};

export default ContextMenu;