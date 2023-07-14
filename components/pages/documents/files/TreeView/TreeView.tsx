// React imports
import { FC, memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { Node } from 'devextreme/ui/tree_view';
import { toast } from 'react-toastify';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import './TreeView.css';
import { ApiCallError } from '@/lib/utils/errors';
import { copyFolder, deleteArchive, moveFolder, newFolder, renameFolder, renameArchive, uploadFilesToArchive, uploadFilesToFolder, deleteFolder } from '@/lib/utils/apiDocuments';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';

// Dynamic imports
const FailedUploadPopup = dynamic(() => import('../popups/FailedUploadPopup'));
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

const createChildren = async (parentNode: Node<any>) => {
    const documentsUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents`;

    // Archive
    if (!parentNode) {
        const resp = await fetch(`${documentsUrl}/archives`, { cache: 'no-cache' })
        if (!resp.ok) throw new ApiCallError('Error while getting archives');
        const data = await resp.json();
        return data.map((elem: any) => ({ ...elem, text: elem.name }));
    };

    const { itemData }: any = parentNode;

    // Top level folder
    if (!itemData.hasOwnProperty('archiveId')) {
        const folderId = itemData.id;
        const resp = await fetch(`${documentsUrl}/${folderId}/folders`, { cache: 'no-cache' })
        if (!resp.ok) throw new ApiCallError(`Error while getting archive: ${folderId} folders`);
        const data = await resp.json();
        return data.map((folder: any) => ({ ...folder, parentId: folder.archiveId, text: folder.name }));
    };

    // Sub folders
    return itemData.childFolders.map((folder: any) => ({ ...folder, text: folder.name }));
};

const isArchive = (item: any) => !item?.hasOwnProperty('archiveId') || false;

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
    const [failedUploadPopupStatus, setFailedUploadPopupStatus] = useState<{
        files: any[],
        visibility: PopupVisibility
    }>({
        files: [],
        visibility: { hasBeenOpen: false, visible: false },
    });

    const handleOnItemClick = useCallback(({ itemData }: any) => {
        setSelectedTreeItem(itemData);

        if (itemData.hasOwnProperty('archiveId')) {
            onFolderSelected(itemData.archiveId, itemData.id);
        }
    }, [onFolderSelected]);

    const handleFormPopupEvent = useCallback((type: FormPopupType) => {
        const folderName = type === 'New directory' ? 'Untitled directory' : selectedTreeItem.name;
        setFormPopupStatus(p => ({ folderName, type, visibility: { ...p.visibility, visible: true } }));
    }, [selectedTreeItem]);

    const handleRefreshEvent = useCallback(() => {
        // TODO: hacer llamada.
    }, []);

    const handleFormPopupSubmit = useCallback((value?: string) => {

        const handleNewDirectory = () => newFolder({
            archiveId,
            body: {
                name: value!,
                parentId: isSelectedItemAnArchive ? null : selectedTreeItem.id
            }
        });

        const handleRename = () => (
            isSelectedItemAnArchive
                ? renameArchive(archiveId, value!)
                : renameFolder(
                    archiveId,
                    selectedTreeItem.id,
                    {
                        archiveId,
                        name: value!,
                        parentId: selectedTreeItem.parentId,
                    }
                )
        );

        const handleDelete = () => (
            isSelectedItemAnArchive
                ? deleteArchive(archiveId)
                : deleteFolder(archiveId, selectedTreeItem.id)
        )

        const events = {
            'New directory': handleNewDirectory,
            'Rename': handleRename,
            'Delete': handleDelete,
        };

        const isSelectedItemAnArchive = isArchive(selectedTreeItem);
        const archiveId = isSelectedItemAnArchive ? selectedTreeItem.id : selectedTreeItem.archiveId
        events[formPopupStatus.type]();
    }, [formPopupStatus.type, selectedTreeItem]);

    const handleTreeViewPopupSubmit = useCallback(async (destinationNode: any) => {

        const updateAzure = async () => {
            const body = { name: selectedTreeItem.name, parentId: newParentId };
            return treeViewPopupStatus.type === 'Copy to'
                ? copyFolder({ archiveId: newArchiveId, body })
                : moveFolder(newArchiveId, { ...body, archiveId: newArchiveId }, selectedTreeItem.id);
        };

        const updateLocal = (nodes: any[]) => {

            const iterateOverNodes = (compareId: string, type: 'Delete' | 'Add') => {
                for (const elem of nodes || []) {
                    const stack = [elem];

                    while (stack.length > 0) {
                        const { children, items }: any = stack.pop();

                        if (Array.isArray(children)) {
                            const index = children.findIndex((item: any) => item.itemData.id === compareId);
                            if (index === -1) {
                                stack.push(...children);
                                break;
                            };

                            if (type === 'Delete') {
                                const selectedNode = structuredClone(children[index]);
                                children.splice(index, 1);
                                items.splice(index, 1);
                                return selectedNode
                            } else {
                                const aux = children[index];

                                deletedNode.parent = aux;
                                deletedNode.itemData.archiveId = newArchiveId;
                                deletedNode.itemData.parentId = newParentId;

                                aux.children.push(deletedNode);
                                aux.items.push(deletedNode);
                            }
                        };
                    };
                };
                return null;
            };

            const deletedNode = iterateOverNodes(selectedTreeItem.id, 'Delete');
            iterateOverNodes(destinationNode.id, 'Add');
            return nodes;
        };

        const newArchiveId = isArchive(destinationNode) ? destinationNode.archiveId : destinationNode.id;
        const newParentId = isArchive(destinationNode) ? destinationNode.id : null;

        const response = await updateAzure();
        console.log("🚀 ~ file: TreeView.tsx:201 ~ handleTreeViewPopupSubmit ~ response:", response);
    }, [selectedTreeItem, treeViewPopupStatus]);

    const handleFileInputOnChange = useCallback(async () => {
        const uploadFiles = async () => {
            const fileInput = UploadFileInputRef.current;
            if (!fileInput?.files) return [];

            const selectedFiles = [...fileInput.files];

            return isArchive(selectedTreeItem)
                ? await uploadFilesToArchive(selectedTreeItem.id, selectedFiles)
                : await uploadFilesToFolder(selectedTreeItem.archiveId, selectedTreeItem.id, selectedFiles);
        };

        const handleResponse = (response: any[]) => {
            const failUploads: any[] = [];
            const okUploads: any[] = [];

            for (const file of response) {
                file.status === 201
                    ? okUploads.push(file)
                    : failUploads.push(file)
            };

            if (okUploads.length > 0) {
                const message = `${okUploads.length} file${okUploads.length ? 's' : ''} uploaded successfully`;
                toast(message, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    type: 'success'
                });
            };

            if (failUploads.length > 0) {
                setFailedUploadPopupStatus(p => ({
                    files: failUploads,
                    visibility: { ...p.visibility, visible: true }
                }));
            };
        };

        const response = await uploadFiles();
        handleResponse(response);
        UploadFileFormRef.current!.reset();
    }, [selectedTreeItem]);

    return (
        <>
            <DxTreeView
                createChildren={createChildren}
                dataStructure='plain'
                id='TreeviewArchive'
                onItemClick={handleOnItemClick}
                onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                ref={TreeViewRef}
                searchEnabled
            />
            <ContextMenu
                isArchive={isArchive(selectedTreeItem)}
                onDirectoryCopy={() => setTreeViewPopupStatus(p => ({ type: 'Copy to', visibility: { ...p.visibility, visible: true } }))}
                onDirectoryDelete={() => handleFormPopupEvent('Delete')}
                onDirectoryMove={() => setTreeViewPopupStatus(p => ({ type: 'Move to', visibility: { ...p.visibility, visible: true } }))}
                onDirectoryRename={() => handleFormPopupEvent('Rename')}
                onDirectoryUpload={() => UploadFileInputRef.current!.click()}
                onNewDirectory={() => handleFormPopupEvent('New directory')}
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
                    onHiding={() => setTreeViewPopupStatus(p => ({ ...p, visibility: { ...p.visibility, visible: false } }))}
                    onShown={() => setTreeViewPopupStatus(p => ({ ...p, visibility: { ...p.visibility, hasBeenOpen: true } }))}
                    onSubmit={handleTreeViewPopupSubmit}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            }
            {
                (failedUploadPopupStatus.visibility.visible || failedUploadPopupStatus.visibility.hasBeenOpen) &&
                <FailedUploadPopup
                    files={failedUploadPopupStatus.files}
                    onHidden={() => setFailedUploadPopupStatus(p => ({ ...p, visibility: { ...p.visibility, visible: false } }))}
                    onShown={() => setFailedUploadPopupStatus(p => ({ ...p, visibility: { ...p.visibility, hasBeenOpen: false } }))}
                    visible={failedUploadPopupStatus.visibility.visible}
                />
            }
            <form ref={UploadFileFormRef} className='hidden' >
                <input type='file' multiple ref={UploadFileInputRef} onChange={handleFileInputOnChange} max={0} />
            </form>
        </>
    );
});

export default TreeView;