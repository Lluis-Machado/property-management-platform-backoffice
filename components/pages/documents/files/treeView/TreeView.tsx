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
    createFolder,
    deleteArchive,
    deleteFolder,
    moveFolder,
    renameArchive,
    renameFolder,
    uploadDocumentsToArchive,
    uploadDocumentsToFolder,
} from '@/lib/utils/documents/apiDocuments';
import { FormPopupType } from '../popups/FormPopup';
import {
    getTreeItemFolderFromFolder,
    isArchive,
    isCorrectArchive,
} from '@/lib/utils/documents/utilsDocuments';
import { PopupVisibility } from '@/lib/types/Popups';
import { TreeItem } from '@/lib/types/treeView';
import { TreeViewPopupType } from '../popups/TreeViewPopup';
import ContextMenu from './ContextMenu';

// Dynamic imports
const FailedUploadPopup = dynamic(() => import('../popups/FailedFilesPopup'));
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
    const [failedUploadPopupStatus, setFailedDocumentsPopupStatus] = useState<{
        files: any[];
        visibility: PopupVisibility;
    }>({
        files: [],
        visibility: { hasBeenOpen: false, visible: false },
    });

    /**
     * Handles the click event on a tree view item.
     * Updates the selected tree item and invokes the `onFolderSelected` callback with the selected item's data.
     *
     * @param itemData - The data associated with the clicked tree view item.
     */
    const handleOnItemClick = useCallback(
        ({ itemData }: ItemClickEvent<TreeItem<Archive | Folder>>) => {
            if (!itemData) return;
            setSelectedTreeItem(itemData as TreeItem<Archive | Folder>);
            onFolderSelected(itemData.data);
        },
        [onFolderSelected]
    );

    /**
     * Handles an event to show a form popup with a specific type.
     * Sets the appropriate folder name and popup type in the state to display the form popup.
     *
     * @param type - The type of the form popup, such as 'New directory', 'Rename' or 'Delete.
     */
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

    //#region Auxiliar functions

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
            treeItem.items.push(getTreeItemFolderFromFolder(folder));
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
            treeItem.data.childFolders.push(folder);
        },
        [pushFolderToItems]
    );

    /**
     * Method for getting the actual TreeView dataSource, modify each archive according to 'processArchive' logic
     * and set the TreeView dataSource to the newly modified version and repaint the three.
     *
     * @param {Function} processArchive - A function that takes an 'archive' of type TreeItem<Archive> as input and performs some modifications on it.
     */
    const updateTreeViewDataSource = useCallback(
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

            updateTreeViewDataSource(processArchive);
        },
        [
            pushFolderToItems,
            pushFolderToItemsAndChildFolders,
            updateTreeViewDataSource,
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

            updateTreeViewDataSource(processArchive);
        },
        [updateTreeViewDataSource]
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
            const response = await createFolder(archiveId, {
                name: value,
                parentId: isSelectedItemAnArchive ? null : (data as Folder).id,
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
     * Handles form submission of FormPopup for different actions like creating a new directory,
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
            setSelectedTreeItem(undefined);
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

    /**
     * Handles the submission of a form popup in the tree view, either copying or moving a folder to a new destination.
     * Updates the database with the appropriate action (copy/move) and returns the API response.
     *
     * @param archiveId - The ID of the archive from which the folder is being copied or moved.
     * @param destinationData - The data representing the destination archive or folder.
     * @param isCopyTo - A boolean indicating whether the action is to copy the folder (true) or move it (false).
     * @param isDestinationArchive - A boolean indicating whether the destination node is an archive (true) or a folder (false).
     * @param parentId - The ID of the parent folder in the destination, if applicable (only for moving folders).
     * @param selectedData - The data representing the folder to be copied or moved.
     * @returns A Promise containing the API response for the copy/move action.
     */
    const handleTreeViewPopupSubmitUpdateDB = useCallback(
        async (
            archiveId: string,
            destinationData: Archive | Folder,
            isCopyTo: boolean,
            isDestinationArchive: boolean,
            parentId: string,
            selectedData: Folder
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
                ? copyFolder(selectedData.archiveId, selectedData.id, body)
                : moveFolder(archiveId, selectedData.id, body);
        },
        []
    );

    /**
     * Handles the submission of a form popup in the tree view, either copying or moving a folder to a new destination.
     * Updates the database and local state accordingly based on the action (copy/move) and the API response.
     *
     * @param destinationNode - The destination node data where the folder is to be copied or moved.
     */
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
                newArchiveId,
                destinationData,
                isCopyTo,
                isDestinationArchive,
                newParentId,
                selectedData
            );

            if (!response.ok) return;

            // Update local
            // Delete original
            if (!isCopyTo) {
                const isSourceArchive = isArchive(selectedData);
                const sourceArchiveId = isSourceArchive
                    ? selectedData.id
                    : (selectedData as Folder).archiveId;
                handleDelete(
                    sourceArchiveId,
                    isSourceArchive,
                    selectedTreeItem
                );
            }
            // Add to new Archive / Folder
            handleNewDirectoryUpdateLocal(
                await response.json(),
                isDestinationArchive
            );

            setSelectedTreeItem(undefined);
        },
        [
            selectedTreeItem,
            treeViewPopupStatus.type,
            handleTreeViewPopupSubmitUpdateDB,
            handleNewDirectoryUpdateLocal,
            handleDelete,
        ]
    );

    //#endregion

    //#region Upload file

    /**
     * Uploads selected files to the server, either to an archive or a folder, based on the currently selected tree item.
     * If an archive is selected, the files are uploaded to the archive. If a folder is selected, the files are uploaded to that folder within the archive.
     *
     * @returns A Promise containing the API response for the file uploads.
     */
    const uploadFiles = useCallback(async () => {
        const fileInput = UploadFileInputRef.current;
        if (!fileInput?.files) return [];

        const selectedFiles = [...fileInput.files];
        const { data } = selectedTreeItem!;

        return isArchive(data)
            ? await uploadDocumentsToArchive(data.id, selectedFiles)
            : await uploadDocumentsToFolder(
                  (data as Folder).archiveId,
                  (data as Folder).id,
                  selectedFiles
              );
    }, [selectedTreeItem]);

    /**
     * Handles the API response after uploading files.
     * Separates the successful and failed uploads into two arrays.
     * Displays a toast notification for successful uploads and opens a popup for failed uploads.
     *
     * @param response - The API response containing the status of the file uploads.
     */
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
            setFailedDocumentsPopupStatus((p) => ({
                files: failUploads,
                visibility: { ...p.visibility, visible: true },
            }));
        }
    }, []);

    /**
     * Handles the `onChange` event of the file input element. Uploads selected files to the server,
     * displays notifications for successful and failed uploads, and resets the file input element.
     */
    const handleFileInputOnChange = useCallback(async () => {
        const response = await uploadFiles();
        handleUploadFileResponse(response);
        UploadFileFormRef.current!.reset();
    }, [handleUploadFileResponse, uploadFiles]);

    //#endregion

    //#region Clone tree and modify nodes disabled status for TreeViewPopup

    /**
     * Disables all the child nodes of the given folder to disable the posibility to try to move a folder onto its children and cause
     * potential bugs and errors.
     *
     * @param {TreeItem<Folder>} folder - The folder to disable.
     */
    const disableAll = useCallback((folder: TreeItem<Folder>) => {
        folder.disabled = true;
        folder.items.forEach(disableAll);
    }, []);

    /**
     * Clones the tree and modifies the nodes' disabled status for TreeViewPopup.
     *
     * @param {TreeItem<Archive>} archive - The archive to analyze.
     * @param {Archive | Folder} data - The data representing the selected item in the TreeView.
     * @param {boolean} isMoving - A flag indicating whether the operation is a "Move to" action.
     *
     * @returns {any | undefined} - A cloned and modified version of the archive with the disabled status updated.
     */
    const analyzeArchive = useCallback(
        (
            archive: TreeItem<Archive>,
            data: Archive | Folder,
            isMoving: boolean
        ) => {
            // Not the selected folder archive
            if (archive.id !== (data as Folder).archiveId) return archive;

            const clone = structuredClone(archive);
            const stack = [clone];

            while (stack.length > 0) {
                const node = stack.pop();

                if (!node) continue;

                for (const child of node.items) {
                    if (child.id !== data.id) {
                        stack.push(...node.items);
                        continue;
                    }

                    if (isMoving) {
                        node.disabled = true;
                        child.items.forEach(disableAll);
                    }
                    child.disabled = true;
                    return clone;
                }
            }
        },
        [disableAll]
    );

    /**
     * Creates a new data source by cloning the tree and updating nodes' disabled status for TreeViewPopup.
     *
     * @returns {TreeItem<Archive>[]} - An array representing the cloned and modified data source.
     */
    const dataSourceWithDisabled = useMemo(() => {
        const dataSource = treeViewRef.current?.instance.option(
            'dataSource'
        ) as TreeItem<Archive>[];

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
                selectByClick
                selectionMode='single'
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
                        setFailedDocumentsPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, visible: false },
                        }))
                    }
                    onShown={() =>
                        setFailedDocumentsPopupStatus((p) => ({
                            ...p,
                            visibility: { ...p.visibility, hasBeenOpen: false },
                        }))
                    }
                    visible={failedUploadPopupStatus.visibility.visible}
                    type='upload'
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
