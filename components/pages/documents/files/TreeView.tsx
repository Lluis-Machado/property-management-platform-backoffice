'use client'

// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { ContextMenu as DxContextMenu, Item } from 'devextreme-react/context-menu';
import { faFolder, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemClickEvent } from 'devextreme/ui/context_menu';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import './TreeView.css'
import { fileItems } from './data.js';
import { PopupType } from './TreeViewFormPopup';

// Dynamic imports
const TreeViewFormPopup = dynamic(() => import('./TreeViewFormPopup'));
const FileUploader = dynamic(() => import('devextreme-react/file-uploader'));

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

export const TreeView = (): React.ReactElement => {
    const ContextMenuRef = useRef<DxContextMenu>(null);

    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedTreeItem, setSelectedTreeItem] = useState<any>(undefined);
    const [popupStatus, setPopupStatus] = useState<{
        folderName: string;
        type: PopupType;
        visible: boolean;
    }>({
        folderName: '',
        type: 'Delete',
        visible: false
    });

    const handleContextMenuItemClick = useCallback((e: ItemClickEvent) => {
        switch (e.itemIndex) {
            // New directory
            case 0:
                setPopupStatus({ folderName: 'Untitled directory', type: 'New directory', visible: true });
                break;
            // Upload files
            case 1:
                UploadFileInputRef.current?.click();
                break;
            // Rename
            case 2:
                if (!selectedTreeItem.name) return;
                setPopupStatus({ folderName: selectedTreeItem.name, type: 'Rename', visible: true });
                break;
            // Move to
            case 3:
                break;
            // Copy to
            case 4:
                break;
            // Delete
            case 5:
                if (!selectedTreeItem.name) return;
                setPopupStatus({ folderName: selectedTreeItem.name, type: 'Delete', visible: true });
                break;
            // Refresh
            case 6:
                break;
        }
    }, [selectedTreeItem]);

    const handlePopupSubmit = useCallback((value?: string) => {
        switch (popupStatus.type) {
            case 'New directory':
                if (!selectedTreeItem?.name) return;
                console.log('Creating folder', value, 'in', selectedTreeItem.name)
                break;
            case 'Rename':
                if (!selectedTreeItem?.name) return;
                console.log('Renaming folder from', selectedTreeItem.name, 'to', value)
                break;
            case 'Delete':
                console.log('Deleting folder', popupStatus.folderName)
                break;
        }
    }, [popupStatus.folderName, popupStatus.type, selectedTreeItem?.name]);

    const handleFileInputOnChange = useCallback(() => {
        const fileInput = UploadFileInputRef.current;
        if (!fileInput) return;

        const selectedFiles = [...fileInput.files ?? []];
        for (const f of selectedFiles) {
            console.log(f);
        }

        UploadFileFormRef.current?.reset();
    }, []);

    return (
        <div className='w-full relative'>
            <DxTreeView
                dataSource={fileItems}
                displayExpr='name'
                hasItemsExpr='isDirectory'
                id='treeview'
                itemRender={itemRender}
                itemsExpr='items'
                keyExpr='id'
                onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                searchEnabled
                searchExpr='name'
            />
            <DxContextMenu
                ref={ContextMenuRef}
                target="#treeview .dx-treeview-item"
                onItemClick={handleContextMenuItemClick}
                hideOnOutsideClick
            >
                <Item closeMenuOnClick icon='newfolder' text='New directory' />
                <Item closeMenuOnClick icon='upload' text='Upload files' />
                <Item closeMenuOnClick icon='rename' text='Rename' />
                <Item closeMenuOnClick icon='movetofolder' text='Move to' />
                <Item closeMenuOnClick icon='copy' text='Copy to' />
                <Item closeMenuOnClick icon='trash' text='Delete' />
                <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
            </DxContextMenu>
            <TreeViewFormPopup
                folderName={popupStatus.folderName}
                onHiding={() => setPopupStatus(p => ({ ...p, folderName: '', visible: false }))}
                onSubmit={handlePopupSubmit}
                type={popupStatus.type}
                visible={popupStatus.visible}
            />
            <form ref={UploadFileFormRef}>
                <input type='file' multiple className='hidden' ref={UploadFileInputRef} onChange={handleFileInputOnChange}/>
            </form>
        </div>
    );
};