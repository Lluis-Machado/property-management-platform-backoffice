// React imports
import { FC, memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Node } from 'devextreme/ui/tree_view';
import { toast } from 'react-toastify';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import './TreeView.css';
import { ApiCallError } from '@/lib/utils/errors';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';

// Dynamic imports
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

const itemRender = (params: any): React.ReactElement => (
    <div className='flex flex-row items-center text-center gap-4'>
        <FontAwesomeIcon icon={faFolder} />
        <p>
            {params.name ?? params.itemData.name}
        </p>
    </div>
);

const createChildren = async (parentNode: Node<any>) => {
    const documentsUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`

    // Archive
    if (!parentNode) {
        const resp = await fetch(`${documentsUrl}/archives`, { cache: 'no-cache' })
        if (!resp.ok) throw new ApiCallError('Error while getting archives');
        const data = await resp.json();
        console.log(data);
        return data.map((archive: any) => ({ ...archive, parentId: archive.archiveId }));
    };

    const { itemData }: any = parentNode;

    // Top level folder
    if (!itemData.hasOwnProperty('archiveId')) {
        const folderId = itemData.id;
        const resp = await fetch(`${documentsUrl}/${folderId}/folders`, { cache: 'no-cache' })
        if (!resp.ok) throw new ApiCallError(`Error while getting archive: ${folderId} folders`);
        const data = await resp.json();
        return data.map((folder: any) => ({ ...folder, parentId: folder.archiveId }));
    };

    // Sub folders
    return itemData.childFolders;
};

interface Props {
    onFolderSelected: (archiveId: string, folderId: string) => void;
};

const TreeView: FC<Props> = memo(function TreeView({ onFolderSelected }): React.ReactElement {

    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);
    const TreeViewRef = useRef<DxTreeView>(null);

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

    const handleOnItemClick = useCallback((e: any) => {
        // console.log("Selected item: ", e);
        const { itemData } = e;
        setSelectedTreeItem(itemData);

        if (itemData.hasOwnProperty('archiveId')) {
            onFolderSelected(itemData.archiveId, itemData.id);
        }
    }, [onFolderSelected]);

    const handleCopyMoveToEvent = useCallback((type: TreeViewPopupType) => {
        setTreeViewPopupStatus(p => ({ type, visibility: { ...p.visibility, visible: true } }));
    }, []);

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

    const handleTreeViewPopupSubmit = useCallback((destinationNode: any) => {

        const updateAzure = async () => {
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

                return response.ok;
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

                return response.ok;
            };
        };

        // Option 1

        const updateLocal = () => {

            const deleteFromPrevious = () => {
                let selectedNode: any = undefined;

                for (const elem of nodes || []) {
                    const stack = [elem];

                    while (stack.length > 0 && selectedNode === undefined) {
                        const currentNode: any = stack.pop();

                        if (Array.isArray(currentNode.items)) {
                            const index = currentNode.items.findIndex((item: any) => item.itemData.id === selectedTreeItem.id);
                            if (index !== -1) {
                                console.log(structuredClone(currentNode.items));
                                const aux = currentNode.items.splice(index, 1)[0];
                                console.log(structuredClone(currentNode.items));
                                selectedNode = aux;
                            } else {
                                stack.push(...currentNode.items);
                            };
                        };
                    };

                    if (selectedNode) {
                        break;
                    };
                };

                return selectedNode;
            };

            const nodes = TreeViewRef.current?.instance.getNodes();

            const prevNode = deleteFromPrevious();

            console.log(prevNode);

        };

        // updateLocal();
        // updateAzure().then(success => success && updateLocal());


        // Option 2

        const deleteChildren = () => {

            const nodes = TreeViewRef.current?.instance.getNodes();

            const deleteFromPrevious = () => {
                let selectedNode: any = undefined;

                for (const elem of nodes || []) {
                    const stack = [elem];
                    let deleteCount = 0;
                    while (stack.length > 0 && deleteCount < 2) {
                        const currentNode: any = stack.pop();

                        if (Array.isArray(currentNode.items)) {
                            const indexFrom = currentNode.items.findIndex((item: any) => item.itemData.id === selectedTreeItem.id);
                            const indexTo = currentNode.items.findIndex((item: any) => item.itemData.id === destinationNode.id);
                            if (indexFrom !== -1 || indexTo !== -1) {
                                console.log(structuredClone(currentNode.items));
                                delete currentNode.items;
                                console.log(structuredClone(currentNode.items));
                                deleteCount++;
                            }
                            stack.push(...currentNode.items);
                        };
                    };

                    if (selectedNode) {
                        break;
                    };
                };

                return selectedNode;
            };

        };

        deleteChildren();
        // updateAzure().then(success => success && updateLocal());


    }, [selectedTreeItem, treeViewPopupStatus]);

    return (
        <>
            <DxTreeView
                createChildren={createChildren}
                dataStructure='plain'
                id='TreeviewArchive'
                itemRender={itemRender}
                onItemClick={handleOnItemClick}
                onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                ref={TreeViewRef}
                searchEnabled
            />
            <ContextMenu
                isArchive={selectedTreeItem && !selectedTreeItem?.hasOwnProperty('archiveId')}
                onDirectoryCopy={() => handleCopyMoveToEvent('Copy to')}
                onDirectoryDelete={() => { console.log('Directory delete') }}
                onDirectoryMove={() => handleCopyMoveToEvent('Move to')}
                onDirectoryRename={() => { console.log('Directory rename') }}
                onDirectoryUpload={() => { console.log('Upload file') }}
                onNewDirectory={() => { console.log('New Directory') }}
                onRefresh={handleRefreshEvent}
            />
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
                    createChildren={createChildren}
                    itemRender={itemRender}
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