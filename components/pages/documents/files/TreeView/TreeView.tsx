// React imports
import { FC, memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import './TreeView.css';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';
import { ApiCallError } from '@/lib/utils/errors';
import { ToastContainer, toast } from 'react-toastify';

// Dynamic imports
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

const updateDisabledStatus = (archive: any, archiveId: string, folderId: string): any => {
    const clone = structuredClone(archive);

    const resetArchiveStatus = () => {
        const stack = [clone];

        while (stack.length > 0) {
            const currentNode = stack.pop();
            currentNode.disabled = false;
            currentNode.expanded = false;

            if (Array.isArray(currentNode.childFolders)) {
                stack.push(...currentNode.childFolders);
            };
        };
    };

    const updateArchive = () => {
        const stack = [clone];

        while (stack.length > 0) {
            const node = stack.pop();
            if (node.id === archiveId) {
                clone.expanded = true;
            }
            node.disabled = false;

            if (!Array.isArray(node.childFolders)) continue;

            for (const item of node.childFolders) {
                item.disabled = false;
                if (item.id === folderId) {
                    node.expanded = true;
                    node.disabled = true;
                    item.disabled = true;
                } else {
                    stack.push(item);
                };
            };
        };
    };

    resetArchiveStatus();
    updateArchive();

    return clone;
};

const itemRender = (params: any): React.ReactElement => (
    <div className='flex flex-row items-center text-center gap-4'>
        <FontAwesomeIcon icon={faFolder} />
        <p>
            {params.name}
        </p>
    </div>
);

interface Props {
    dataSource: any;
    onArchiveSelected: (archiveId: string) => void;
    onFolderSelected: (archiveId: string, folderId: string) => void;
};

const TreeView: FC<Props> = memo(function TreeView({ dataSource, onArchiveSelected, onFolderSelected }): React.ReactElement {

    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedTreeItem, setSelectedTreeItem] = useState<any>(undefined);

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

    const handleOnItemClick = useCallback((e: any) => {
        console.log(e);
        const { itemData } = e;
        setSelectedTreeItem(itemData);

        if (itemData.hasOwnProperty('archiveId')) {
            onFolderSelected(itemData.archiveId, itemData.id);
        } else {
            onArchiveSelected(itemData.id);
        };
    }, [onArchiveSelected, onFolderSelected]);

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        setDataSourceWithDisabled(dataSource.map((item: any) => updateDisabledStatus(item, selectedTreeItem.archiveId, selectedTreeItem.id)));
        setTreeViewPopupStatus(p => ({ type, visibility: { ...p.visibility, visible: true } }));
    }, [dataSource, selectedTreeItem]);

    const handleFormPopupEvent = useCallback((type: FormPopupType) => {
        const folderName = type === 'New directory' ? 'Untitled directory' : selectedTreeItem.name;
        setFormPopupStatus(p => ({ folderName, type, visibility: { ...p.visibility, visible: true } }));
    }, [selectedTreeItem]);

    const handleRefreshEvent = useCallback(() => {
        // TODO: hacer llamada.
    }, []);

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

    const handleTreeViewPopupSubmit = useCallback(async (destinationNode: any) => {
        const newArchiveId = destinationNode.hasOwnProperty('archiveId') ? destinationNode.archiveId : destinationNode.id;
        const newParentId = destinationNode.hasOwnProperty('archiveId') ? destinationNode.id : null;

        if (treeViewPopupStatus.type === 'Copy to') {
            const body = { name: selectedTreeItem.name, parentId: newParentId };
            const apiCall = fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${newArchiveId}/folders`,
                {
                    body: JSON.stringify(body),
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                }
            );
            const response = await toast.promise(
                apiCall,
                {
                    pending: 'Copying folder',
                    success: 'Folder copied',
                    error: 'Error copying folder',
                },
            );

            console.log(await response.json())
        } else {
            const body = {
                archiveId: newArchiveId,
                name: selectedTreeItem.name,
                parentId: newParentId
            };
            const apiCall = fetch(
                `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${newArchiveId}/folders/${selectedTreeItem.id}`,
                {
                    body: JSON.stringify(body),
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                }
            );

            const response = await toast.promise(
                apiCall,
                {
                    pending: 'Moving folder',
                    success: 'Folder moved',
                    error: 'Error moving folder',
                },
            );

            console.log(await response.json());
        }
    }, [selectedTreeItem, treeViewPopupStatus]);

    return (
        <>
            <div className='w-full relative'>
                <DxTreeView
                    dataSource={dataSource}
                    dataStructure='tree'
                    displayExpr='name'
                    id='ArchiveTreeview'
                    itemRender={itemRender}
                    itemsExpr='childFolders'
                    onItemClick={handleOnItemClick}
                    onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                    searchEnabled
                />
                <ContextMenu
                    isArchive={selectedTreeItem && !selectedTreeItem?.hasOwnProperty('archiveId')}
                    onDirectoryCopy={() => handleCopyMoveToEvent('Copy to')}
                    onDirectoryDelete={() => { }}
                    onDirectoryMove={() => handleCopyMoveToEvent('Move to')}
                    onDirectoryRename={() => { console.log('Directory rename') }}
                    onDirectoryUpload={() => { console.log('Upload file') }}
                    onNewDirectory={() => { console.log('New Directory') }}
                    onRefresh={handleRefreshEvent}
                />
            </div>
            {
                (formPopupStatus.visibility.visible || formPopupStatus.visibility.hasBeenOpen) &&
                <FormPopup
                    elementName={formPopupStatus.folderName}
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
});

export default TreeView;