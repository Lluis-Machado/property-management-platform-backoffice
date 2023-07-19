// React imports
import { FC, memo, useCallback, useMemo, useRef, useState } from 'react';

// Libraries imports
import { ItemClickEvent } from 'devextreme/ui/tree_view';
import { toast } from 'react-toastify';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';
import dynamic from 'next/dynamic';

// Local imports
import { Archive, Folder } from '@/lib/types/documentsAPI';
import {
    copyFolder,
    deleteArchive,
    deleteFolder,
    moveFolder,
    newFolder,
    renameArchive,
    renameFolder,
    uploadFilesToArchive,
    uploadFilesToFolder,
} from '@/lib/utils/apiDocuments';
import { FormPopupType } from '../popups/FormPopup';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';

// Dynamic imports
const FailedUploadPopup = dynamic(() => import('../popups/FailedUploadPopup'));
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

const isArchive = (item: any): item is Archive =>
    !item?.hasOwnProperty('archiveId') || false;

interface Props {
    archives: any[];
    onItemSelected: (archiveId: string, folderId?: string) => void;
}

const TreeView: FC<Props> = memo(function TreeView({
    archives,
    onItemSelected,
}): React.ReactElement {
    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);
    const TreeViewRef = useRef<DxTreeView>(null);

    const [selectedTreeItem, setSelectedTreeItem] = useState<
        TreeItem<Archive | Folder> | undefined
    >(undefined);

    const [formPopupStatus, setFormPopupStatus] = useState<{
        folderName?: string;
        type: FormPopupType;
        visibility: PopupVisibility;
    }>({
        folderName: '',
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
    const [failedUploadPopupStatus, setFailedUploadPopupStatus] = useState<{
        files: any[];
        visibility: PopupVisibility;
    }>({
        files: [],
        visibility: { hasBeenOpen: false, visible: false },
    });

    const handleOnItemClick = useCallback(
        ({ itemData }: ItemClickEvent<TreeItem<Archive | Folder>>) => {
            if (itemData) {
                setSelectedTreeItem(itemData as TreeItem<Archive | Folder>);
                const { data } = itemData;
                isArchive(data)
                    ? onItemSelected(data.id)
                    : onItemSelected(data.archiveId, data.id);
            }
        },
        [onItemSelected]
    );

    const handleFormPopupEvent = useCallback(
        (type: FormPopupType) => {
            const folderName =
                type === 'New directory'
                    ? 'Untitled directory'
                    : selectedTreeItem!.data.name;
            setFormPopupStatus((p) => ({
                folderName,
                type,
                visibility: { ...p.visibility, visible: true },
            }));
        },
        [selectedTreeItem]
    );

    const handleRefreshEvent = useCallback(async () => {
        // TODO: hacer llamada.
    }, []);

    const handleFormPopupSubmit = useCallback(
        (value?: string) => {
            const handleNewDirectory = async () => {
                if (!selectedTreeItem || !value) return;

                // Update DB
                const response = await newFolder({
                    archiveId,
                    body: {
                        name: value,
                        parentId: isSelectedItemAnArchive
                            ? null
                            : (data as Folder).id,
                    },
                });

                // Update local
                if (response.ok) {
                    const newFolder: Folder = await response.json();

                    selectedTreeItem.items.push({
                        data: newFolder,
                        disabled: false,
                        expanded: false,
                        hasItems: false,
                        id: newFolder.id,
                        items: [],
                        parentId: newFolder.parentId,
                        selected: false,
                        text: newFolder.name,
                        visible: true,
                    });

                    if (!isSelectedItemAnArchive) {
                        let dataFCF = (data as Folder).childFolders;
                        dataFCF = Array.isArray(dataFCF) ? dataFCF : [];
                        dataFCF.push(newFolder);
                    }

                    const treeInstance = TreeViewRef.current!.instance;
                    treeInstance.option('dataSource', archives);
                    treeInstance.repaint();
                }
            };

            const handleRename = async () => {
                if (!selectedTreeItem || !value) return;

                // Update DB
                const ok = isSelectedItemAnArchive
                    ? await renameArchive(archiveId, value)
                    : await renameFolder(archiveId, (data as Folder).id, {
                          archiveId,
                          name: value,
                          parentId: (data as Folder).parentId,
                      });

                // Update local
                if (ok) {
                    selectedTreeItem.text = value;
                    data.name = value;
                    TreeViewRef.current!.instance.repaint();
                }
            };

            const handleDelete = async () => {
                if (!selectedTreeItem) return;

                // Update DB
                const ok = isSelectedItemAnArchive
                    ? await deleteArchive(archiveId)
                    : await deleteFolder(archiveId, (data as Folder).id);

                // Update local
                if (ok) {
                    selectedTreeItem.visible = false; // FAst way to hide it, proper solution would be find node in tree and delete it.
                    TreeViewRef.current!.instance.repaint();
                }
            };

            const events = {
                'New directory': handleNewDirectory,
                Rename: handleRename,
                Delete: handleDelete,
            };

            const { data } = selectedTreeItem!;
            const isSelectedItemAnArchive = isArchive(data);
            const archiveId = isSelectedItemAnArchive
                ? (data as Archive).id
                : (data as Folder).archiveId;

            events[formPopupStatus.type]();
        },
        [archives, formPopupStatus.type, selectedTreeItem]
    );

    const handleTreeViewPopupSubmit = useCallback(
        async (destinationNode: any) => {
            const updateAzure = async () => {
                let name = selectedData.name;

                if (isCopyTo) {
                    const isTopLevelFolderDuplicate =
                        selectedData.parentId === null &&
                        isDestinationArchive &&
                        selectedData.archiveId === destinationData.id;
                    const isSubfolderDuplicate =
                        selectedData.archiveId === destinationData.archiveId &&
                        selectedData.parentId === destinationData.id;

                    if (isTopLevelFolderDuplicate || isSubfolderDuplicate)
                        name += ' - copy';
                }

                const body = {
                    archiveId: newArchiveId,
                    name,
                    parentId: newParentId,
                };
                return isCopyTo
                    ? copyFolder(selectedData.archiveId, selectedData.id, {
                          ...body,
                      })
                    : moveFolder(newArchiveId, selectedData.id, { ...body });
            };

            const updateLocal = () => {
                const addFolder = () =>
                    dataSource?.map((archive) => {
                        if (
                            (isDestinationArchive &&
                                destinationData.id !== archive.data.id) ||
                            (!isDestinationArchive &&
                                destinationData.archiveId !== archive.data.id)
                        )
                            return archive;

                        const clone = structuredClone(archive);
                        const stack = [clone];

                        while (stack.length > 0) {
                            const node = stack.pop();

                            if (node.data.id === destinationData.id) {
                                node.items.push({
                                    data: responseData,
                                    disabled: false,
                                    expanded: false,
                                    hasItems: false,
                                    id: responseData.id,
                                    items: [],
                                    parentId: isDestinationArchive
                                        ? responseData.archiveId
                                        : responseData.parentId,
                                    selected: false,
                                    text: responseData.name,
                                    visible: true,
                                });
                                if (!isArchive(node.data)) {
                                    let dataFCF = (node.data as Folder)
                                        .childFolders;
                                    dataFCF = Array.isArray(dataFCF)
                                        ? dataFCF
                                        : [];
                                    dataFCF.push(responseData);
                                }
                                return clone;
                            }

                            stack.push(...node.items);
                        }
                    });

                TreeViewRef.current?.instance.option('dataSource', addFolder());
                TreeViewRef.current?.instance.repaint();
            };

            const dataSource = TreeViewRef.current?.instance.option(
                'dataSource'
            ) as any[] | undefined;
            if (!dataSource || !selectedTreeItem) return;

            const selectedData = selectedTreeItem.data as Folder;
            const { data: destinationData } = destinationNode;
            const isDestinationArchive = isArchive(destinationData);

            const newArchiveId = isDestinationArchive
                ? destinationData.id
                : (destinationData as Folder).archiveId;
            const newParentId = isDestinationArchive
                ? undefined
                : destinationData.id;

            const isCopyTo = treeViewPopupStatus.type === 'Copy to';

            const response = await updateAzure();
            const responseData: Folder = await response.json();
            updateLocal();
        },
        [selectedTreeItem, treeViewPopupStatus]
    );

    const handleFileInputOnChange = useCallback(async () => {
        const uploadFiles = async () => {
            const fileInput = UploadFileInputRef.current;
            if (!fileInput?.files) return [];

            const selectedFiles = [...fileInput.files];
            const { data } = selectedTreeItem!;

            return isArchive(data)
                ? await uploadFilesToArchive(data.id, selectedFiles)
                : await uploadFilesToFolder(
                      (data as Folder).archiveId,
                      (data as Folder).id,
                      selectedFiles
                  );
        };

        const handleResponse = (response: any[]) => {
            const failUploads: any[] = [];
            const okUploads: any[] = [];

            for (const file of response) {
                file.status === 201
                    ? okUploads.push(file)
                    : failUploads.push(file);
            }

            if (okUploads.length > 0) {
                const message = `${okUploads.length} file${
                    okUploads.length ? 's' : ''
                } uploaded successfully`;
                toast(message, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    type: 'success',
                });
            }

            if (failUploads.length > 0) {
                setFailedUploadPopupStatus((p) => ({
                    files: failUploads,
                    visibility: { ...p.visibility, visible: true },
                }));
            }
        };

        const response = await uploadFiles();
        handleResponse(response);
        UploadFileFormRef.current!.reset();
    }, [selectedTreeItem]);

    const dataSourceWithDisabled = useMemo(() => {
        const dataSource = TreeViewRef.current?.instance.option(
            'dataSource'
        ) as any[] | undefined;
        if (!dataSource?.length || !selectedTreeItem) return [];

        const { data } = selectedTreeItem;

        const analyzeArchive = (archive: any) => {
            // Not the selected folder archive
            if (archive.id !== (data as Folder).archiveId) return archive;

            const clone = structuredClone(archive);
            const stack = [clone];
            const isMoving = treeViewPopupStatus.type === 'Move to';

            while (stack.length > 0) {
                const node = stack.pop();

                for (const child of node.items) {
                    if (child.id === data.id) {
                        if (isMoving) node.disabled = true;
                        child.disabled = true;
                        return clone;
                    }

                    stack.push(...node.items);
                }
            }
        };

        return dataSource.map(analyzeArchive);
    }, [selectedTreeItem, treeViewPopupStatus.type]);

    return (
        <>
            <DxTreeView
                dataSource={archives}
                id='TreeviewArchive'
                onItemClick={handleOnItemClick}
                onItemContextMenu={({ itemData }) =>
                    setSelectedTreeItem(itemData as TreeItem<Archive | Folder>)
                }
                ref={TreeViewRef}
                searchEnabled
            />
            <ContextMenu
                isArchive={isArchive(selectedTreeItem?.data) ?? true}
                onDirectoryCopy={() =>
                    setTreeViewPopupStatus((p) => ({
                        type: 'Copy to',
                        visibility: { ...p.visibility, visible: true },
                    }))
                }
                onDirectoryDelete={() => handleFormPopupEvent('Delete')}
                onDirectoryMove={() =>
                    setTreeViewPopupStatus((p) => ({
                        type: 'Move to',
                        visibility: { ...p.visibility, visible: true },
                    }))
                }
                onDirectoryRename={() => handleFormPopupEvent('Rename')}
                onDirectoryUpload={() => UploadFileInputRef.current!.click()}
                onNewDirectory={() => handleFormPopupEvent('New directory')}
                onRefresh={handleRefreshEvent}
            />
            {(formPopupStatus.visibility.visible ||
                formPopupStatus.visibility.hasBeenOpen) && (
                <FormPopup
                    elementName={formPopupStatus.folderName}
                    onHiding={() =>
                        setFormPopupStatus((p) => ({
                            ...p,
                            folderName: '',
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
                    dataSource={dataSourceWithDisabled}
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
                    onSubmit={handleTreeViewPopupSubmit}
                    type={treeViewPopupStatus.type}
                    visible={treeViewPopupStatus.visibility.visible}
                />
            )}
            {(failedUploadPopupStatus.visibility.visible ||
                failedUploadPopupStatus.visibility.hasBeenOpen) && (
                <FailedUploadPopup
                    files={failedUploadPopupStatus.files}
                    onHidden={() =>
                        setFailedUploadPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, visible: false },
                        }))
                    }
                    onShown={() =>
                        setFailedUploadPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, hasBeenOpen: false },
                        }))
                    }
                    visible={failedUploadPopupStatus.visibility.visible}
                />
            )}
            <form ref={UploadFileFormRef} className='hidden'>
                <input
                    type='file'
                    multiple
                    ref={UploadFileInputRef}
                    onChange={handleFileInputOnChange}
                    max={0}
                />
            </form>
        </>
    );
});

export default TreeView;
