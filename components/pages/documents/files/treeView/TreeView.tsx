// React imports
import {
    FC,
    RefObject,
    memo,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';

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
} from '@/lib/utils/documents/apiDocuments';
import { FormPopupType } from '../popups/FormPopup';
import { isArchive } from '@/lib/utils/documents/utilsDocuments';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeItem } from '@/lib/types/treeView';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';

// Dynamic imports
const FailedUploadPopup = dynamic(() => import('../popups/FailedUploadPopup'));
const FormPopup = dynamic(() => import('../popups/FormPopup'));
const TreeViewPopup = dynamic(() => import('../popups/TreeViewPopup'));

interface Props {
    archives: any[];
    onFolderSelected: (folder: Archive | Folder) => void;
    treeViewRef: RefObject<DxTreeView<any>>;
}

const TreeView: FC<Props> = memo(function TreeView({
    archives,
    onFolderSelected,
    treeViewRef,
}): React.ReactElement {
    const UploadFileFormRef = useRef<HTMLFormElement>(null);
    const UploadFileInputRef = useRef<HTMLInputElement>(null);

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
            if (!itemData) return;
            setSelectedTreeItem(itemData as TreeItem<Archive | Folder>);
            onFolderSelected(itemData.data);
        },
        [onFolderSelected]
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

    //#region Auxiliar functions

    /**
     * Used when adding a Folder or deleting an Archive | Folder
     *
     * 1. onAdd: Returns whether the Archive 'archive' is the Archive in which the Folder 'item' has to be stored.
     * 2. onDelete:
     *      Returns whether the Archive 'archive' is the Archive in which the Folder to delete 'item' is stored or
     *      if the Archive 'archive' is the Archive to be deleted.
     *
     * @param {TreeItem<Archive>} archive - The Archive to check against.
     * @param {Archive | Folder} item - The item to be added or deleted, which can be either an Archive or a Folder.
     *
     * @returns {boolean} - True if the Archive 'archive' is the correct location for the given 'item', false otherwise.
     */
    const isCorrectArchive = useCallback(
        (archive: TreeItem<Archive>, item: Archive | Folder) => {
            const isItemArchive = isArchive(item);
            return (
                (isItemArchive && archive.data.id === item.id) ||
                (!isItemArchive &&
                    archive.data.id === (item as Folder).archiveId)
            );
        },
        []
    );

    /**
     * This method is used to push a new Folder 'folder' into the items array of a given TreeItem 'treeItem',
     * which could represent either an Archive or a Folder.
     *
     * It also updates the hasItems property of the treeItem to indicate that it has child items.
     *
     * @param {Folder} folder - The Folder object that needs to be added to the items array of the TreeItem.
     * @param {TreeItem<Archive | Folder>} treeItem - The target TreeItem into which the Folder should be pushed.
     */
    const pushFolderToItems = useCallback(
        (folder: Folder, treeItem: TreeItem<Archive | Folder>) => {
            const newFolderItem: TreeItem<Folder> = {
                data: folder,
                disabled: false,
                expanded: false,
                hasItems: false,
                id: folder.id,
                items: [],
                parentId: folder.parentId,
                selected: false,
                text: folder.name,
                visible: true,
            };

            treeItem.items.push(newFolderItem);
            treeItem.hasItems = true;
        },
        []
    );

    /**
     * This method extends the functionality of the pushFolderToItems method by not only pushing
     * the provided folder into the items array of a given TreeItem node but also adding the folder
     * to the childFolders array of the treeItem's data object.
     *
     * @param {Folder} folder - The Folder object that needs to be added to the items array of the TreeItem and its data.childFolders array.
     * @param {TreeItem<Folder>} treeItem - The target TreeItem into which the Folder should be pushed.
     */
    const pushFolderToItemsAndChildFolders = useCallback(
        (folder: Folder, treeItem: TreeItem<Folder>) => {
            pushFolderToItems(folder, treeItem);
            treeItem.data.childFolders = [
                ...(treeItem.data.childFolders || []),
                folder,
            ];
        },
        [pushFolderToItems]
    );

    /**
     * Method for getting the actual TreeView dataSource, modify each archive according to 'processArchive' logic
     * and set the TreeView dataSource to the newly modified version and repaint the three.
     *
     * @param {Function} processArchive - A function that takes an 'archive' of type TreeItem<Archive> as input and performs some modifications on it.
     */
    const updateDataSource = useCallback(
        (processArchive: (archive: TreeItem<Archive>) => void) => {
            const treeInstance = treeViewRef.current?.instance;
            if (!treeInstance) return;

            const dataSource = treeInstance.option(
                'dataSource'
            ) as TreeItem<Archive>[];
            if (!dataSource) return;

            dataSource.forEach(processArchive);

            treeInstance.option('dataSource', dataSource as any[]);
            treeInstance.repaint();
        },
        [treeViewRef]
    );

    /**
     * This method should be called after a successful creation or copy of a Folder to the database.
     * It is used to reflect the creation or copy of a Folder in the local TreeView without losing the TreeView status.
     *
     * @param {Folder} folderToAdd - The folder to be added.
     * @param {boolean} isDestinationArchive - A flag indicating whether the new folder should be added
     * directly to an archive (true) or as a sub-folder of an existing archive (false).
     */
    const handleNewDirectoryUpdateLocal = useCallback(
        (folderToAdd: Folder, isDestinationArchive: boolean) => {
            const processArchive = (archive: TreeItem<Archive>) => {
                // Case 1 - Not the correct archive
                if (!isCorrectArchive(archive, folderToAdd)) return;

                // Case 2 - Add folder to archive
                if (isDestinationArchive) {
                    pushFolderToItems(folderToAdd, archive);
                    return;
                }

                // Case 3 - Add folder to archive sub-folders
                const stack = [...archive.items];

                while (stack.length) {
                    const node = stack.pop()!;

                    if (node.data.id !== folderToAdd.parentId) {
                        stack.push(...node.items);
                        continue;
                    }

                    pushFolderToItemsAndChildFolders(folderToAdd, node);
                    break;
                }
            };

            updateDataSource(processArchive);
        },
        [
            isCorrectArchive,
            pushFolderToItems,
            pushFolderToItemsAndChildFolders,
            updateDataSource,
        ]
    );

    /**
     * This method should be called to reflect the deletion of an item (either an Archive or a Folder) from the database
     * in the local TreeView without losing the TreeView status.
     *
     * @param {boolean} isItemToDeleteAnArchive - A flag indicating whether the item to be deleted is an Archive or a Folder.
     * @param {TreeItem<Archive | Folder>} itemToDelete - The item to be deleted, of type TreeItem<Archive> if it's an Archive, or TreeItem<Folder> if it's a Folder.
     */
    const handleDeleteUpdateLocal = useCallback(
        (
            isItemToDeleteAnArchive: boolean,
            itemToDelete: TreeItem<Archive | Folder>
        ) => {
            const processArchive = (archive: TreeItem<Archive>) => {
                // Case 1 - Not the correct archive
                if (!isCorrectArchive(archive, itemToDelete.data)) return;

                // Case 2 - Delete archive
                if (isItemToDeleteAnArchive) {
                    itemToDelete.visible = false;
                    return;
                }

                // Case 3 - Delete folder from archive sub-folders
                const stack = [archive];

                while (stack.length) {
                    const node = stack.pop()!;

                    const idxToDelete = node.items.findIndex(
                        (folder) => folder.data.id === itemToDelete.id
                    );

                    if (idxToDelete === -1) {
                        stack.push(...node.items);
                        continue;
                    }

                    const items = node.items.filter(
                        (item) => item.id !== itemToDelete.id
                    );
                    node.items = items;
                    node.hasItems = items.length > 0;
                    itemToDelete.visible = false;

                    if (isArchive(node.data)) break;

                    const childFolders = (
                        node.data as Folder
                    ).childFolders.filter(
                        (child) => child.id !== itemToDelete.id
                    );
                    (node.data as Folder).childFolders = childFolders;
                    break;
                }
            };

            updateDataSource(processArchive);
        },
        [isCorrectArchive, updateDataSource]
    );

    //#endregion

    //#region Form popup submit

    /**
     * Creates a new Folder either at the root level of an Archive or as a sub-folder inside the selected archive folder.
     * Updates the database with the new folder information and updates the local state with the response data.
     *
     * @param archiveId - The ID of the archive to which the new directory will be added.
     * @param data - The data representing the selected archive or folder.
     * @param isSelectedItemAnArchive - A boolean indicating whether the selected item is an Archive (true) or a Folder (false).
     * @param value - The name of the new directory to be created.
     */
    const handleNewDirectory = useCallback(
        async (
            archiveId: string,
            data: Archive | Folder,
            isSelectedItemAnArchive: boolean,
            value: string
        ) => {
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

            if (!response.ok) return;

            // Update local
            handleNewDirectoryUpdateLocal(
                await response.json(),
                isSelectedItemAnArchive
            );
        },
        [handleNewDirectoryUpdateLocal]
    );

    /**
     * Renames an Archive or Folder. Updates the database with the new name and updates the local state with the changes.
     *
     * @param archiveId - The ID of the archive containing the item to be renamed.
     * @param data - The data representing the selected archive or folder.
     * @param isSelectedItemAnArchive - A boolean indicating whether the selected item is an archive (true) or a folder (false).
     * @param value - The new name for the archive or folder.
     */
    const handleRename = useCallback(
        async (
            archiveId: string,
            data: Archive | Folder,
            isSelectedItemAnArchive: boolean,
            value: string
        ) => {
            // Update DB
            const ok = isSelectedItemAnArchive
                ? await renameArchive(archiveId, value)
                : await renameFolder(archiveId, (data as Folder).id, {
                      archiveId,
                      name: value,
                      parentId: (data as Folder).parentId,
                  });

            if (!ok) return;

            // Update local
            selectedTreeItem!.text = value;
            data.name = value;
            treeViewRef.current!.instance.repaint();
        },
        [selectedTreeItem, treeViewRef]
    );

    /**
     * Deletes an archive or folder. Updates the database by removing the item and updates the local state accordingly.
     *
     * @param archiveId - The ID of the archive containing the item to be deleted.
     * @param isSelectedItemAnArchive - A boolean indicating whether the selected item is an archive (true) or a folder (false).
     * @param item - The TreeItem representing the archive or folder to be deleted.
     */
    const handleDelete = useCallback(
        async (
            archiveId: string,
            isSelectedItemAnArchive: boolean,
            item: TreeItem<Archive | Folder>
        ) => {
            // Update DB
            const ok = isSelectedItemAnArchive
                ? await deleteArchive(archiveId)
                : await deleteFolder(archiveId, (item.data as Folder).id);

            if (!ok) return;

            // Update local
            handleDeleteUpdateLocal(isSelectedItemAnArchive, item);
        },
        [handleDeleteUpdateLocal]
    );

    /**
     * Handles form submission from a popup for different actions like creating a new directory,
     * renaming an archive or folder, and deleting an archive or folder.
     *
     * @param value - The value submitted in the form popup, if applicable.
     */
    const handleFormPopupSubmit = useCallback(
        (value?: string) => {
            const { data } = selectedTreeItem!;
            const isSelectedItemAnArchive = isArchive(data);
            const archiveId = isSelectedItemAnArchive
                ? (data as Archive).id
                : (data as Folder).archiveId;

            const events = {
                'New directory': () =>
                    handleNewDirectory(
                        archiveId,
                        data,
                        isSelectedItemAnArchive,
                        value!
                    ),
                Rename: () =>
                    handleRename(
                        archiveId,
                        data,
                        isSelectedItemAnArchive,
                        value!
                    ),
                Delete: () =>
                    handleDelete(
                        archiveId,
                        isSelectedItemAnArchive,
                        selectedTreeItem!
                    ),
            };

            if (!selectedTreeItem) return;
            events[formPopupStatus.type]();
        },
        [
            formPopupStatus.type,
            handleDelete,
            handleNewDirectory,
            handleRename,
            selectedTreeItem,
        ]
    );

    //#endregion

    //#region Tree view popup submit

    const handleTreeViewPopupSubmitUpdateDB = useCallback(
        async (
            selectedData: Folder,
            isCopyTo: boolean,
            isDestinationArchive: boolean,
            destinationData: Archive | Folder,
            archiveId: string,
            parentId: string
        ) => {
            let name = selectedData.name;

            if (isCopyTo) {
                const isSameTopLevelFolder =
                    selectedData.parentId === null &&
                    isDestinationArchive &&
                    selectedData.archiveId === destinationData.id;
                const isSameSubfolder =
                    selectedData.archiveId ===
                        (destinationData as Folder).archiveId &&
                    selectedData.parentId === destinationData.id;

                if (isSameTopLevelFolder || isSameSubfolder) name += ' - copy';
            }

            const body = {
                archiveId,
                name,
                parentId,
            };

            return isCopyTo
                ? copyFolder(selectedData.archiveId, selectedData.id, {
                      ...body,
                  })
                : moveFolder(archiveId, selectedData.id, { ...body });
        },
        []
    );

    const handleTreeViewPopupSubmit = useCallback(
        async (destinationNode: any) => {
            if (!selectedTreeItem) return;

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

            // Update DB
            const response = await handleTreeViewPopupSubmitUpdateDB(
                selectedData,
                isCopyTo,
                isDestinationArchive,
                destinationData,
                newArchiveId,
                newParentId
            );

            if (!response.ok) return;

            // Update local
            handleNewDirectoryUpdateLocal(
                await response.json(),
                isDestinationArchive
            );
            if (!isCopyTo) {
                // Delete original
            }
        },
        [
            handleNewDirectoryUpdateLocal,
            selectedTreeItem,
            treeViewPopupStatus.type,
            handleTreeViewPopupSubmitUpdateDB,
        ]
    );

    //#endregion

    //#region Upload file

    const uploadFiles = useCallback(async () => {
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
    }, [selectedTreeItem]);

    const handleUploadFileResponse = useCallback((response: any[]) => {
        const failUploads: any[] = [];
        const okUploads: any[] = [];

        for (const file of response) {
            file.status === 201 ? okUploads.push(file) : failUploads.push(file);
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
    }, []);

    const handleFileInputOnChange = useCallback(async () => {
        const response = await uploadFiles();
        handleUploadFileResponse(response);
        UploadFileFormRef.current!.reset();
    }, [handleUploadFileResponse, uploadFiles]);

    //#endregion

    //#region Modify tree nodes disabled status for popup

    const analyzeArchive = useCallback(
        (archive: any, data: Archive | Folder, isMoving: boolean) => {
            // Not the selected folder archive
            if (archive.id !== (data as Folder).archiveId) return archive;

            const clone = structuredClone(archive);
            const stack = [clone];

            while (stack.length > 0) {
                const node = stack.pop();

                for (const child of node.items) {
                    if (child.id !== data.id) {
                        stack.push(...node.items);
                        continue;
                    }

                    if (isMoving) node.disabled = true;
                    child.disabled = true;
                    return clone;
                }
            }
        },
        []
    );

    const dataSourceWithDisabled = useMemo(() => {
        const dataSource = treeViewRef.current?.instance.option(
            'dataSource'
        ) as any[] | undefined;

        if (!dataSource?.length || !selectedTreeItem) return [];

        const { data } = selectedTreeItem;
        const isMoving = treeViewPopupStatus.type === 'Move to';

        return dataSource.map((archive) =>
            analyzeArchive(archive, data, isMoving)
        );
    }, [
        analyzeArchive,
        selectedTreeItem,
        treeViewPopupStatus.type,
        treeViewRef,
    ]);

    //#endregion

    return (
        <>
            <DxTreeView
                dataSource={archives}
                id='TreeviewArchive'
                onItemClick={handleOnItemClick}
                onItemContextMenu={({ itemData }) =>
                    setSelectedTreeItem(itemData as TreeItem<Archive | Folder>)
                }
                ref={treeViewRef}
                searchEnabled
            />
            <ContextMenu
                isArchive={isArchive(selectedTreeItem?.data)}
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
