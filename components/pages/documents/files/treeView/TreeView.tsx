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

    //#region Form popup submit

    const handleNewDirectory = useCallback(
        async (
            value: string,
            archiveId: string,
            isSelectedItemAnArchive: boolean,
            data: Archive | Folder
        ) => {
            if (!selectedTreeItem) return;

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

                const treeInstance = treeViewRef.current!.instance;
                treeInstance.option('dataSource', archives);
                treeInstance.repaint();
            }
        },
        [archives, selectedTreeItem, treeViewRef]
    );

    const handleRename = useCallback(
        async (
            value: string,
            isSelectedItemAnArchive: boolean,
            archiveId: string,
            data: Archive | Folder
        ) => {
            if (!selectedTreeItem) return;

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
                treeViewRef.current!.instance.repaint();
            }
        },
        [selectedTreeItem, treeViewRef]
    );

    const handleDelete = useCallback(
        async (
            isSelectedItemAnArchive: boolean,
            archiveId: string,
            data: Archive | Folder
        ) => {
            if (!selectedTreeItem) return;

            // Update DB
            const ok = isSelectedItemAnArchive
                ? await deleteArchive(archiveId)
                : await deleteFolder(archiveId, (data as Folder).id);

            // Update local
            if (ok) {
                selectedTreeItem.visible = false; // Fast way to hide it, proper solution would be find node in tree and delete it.
                treeViewRef.current!.instance.repaint();
            }
        },
        [selectedTreeItem, treeViewRef]
    );

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
                        value!,
                        archiveId,
                        isSelectedItemAnArchive,
                        data
                    ),
                Rename: () =>
                    handleRename(
                        value!,
                        isSelectedItemAnArchive,
                        archiveId,
                        data
                    ),
                Delete: () =>
                    handleDelete(isSelectedItemAnArchive, archiveId, data),
            };

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

    const updateAzure = useCallback(
        async (
            selectedData: Folder,
            isCopyTo: boolean,
            isDestinationArchive: boolean,
            destinationData: Archive | Folder,
            newArchiveId: string,
            newParentId: string
        ) => {
            let name = selectedData.name;

            if (isCopyTo) {
                const isTopLevelFolderDuplicate =
                    selectedData.parentId === null &&
                    isDestinationArchive &&
                    selectedData.archiveId === destinationData.id;
                const isSubfolderDuplicate =
                    selectedData.archiveId ===
                        (destinationData as Folder).archiveId &&
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
        },
        []
    );

    const isCorrectArchive = useCallback(
        (
            archive: any,
            isDestinationArchive: boolean,
            destinationData: Archive | Folder
        ) =>
            (isDestinationArchive && destinationData.id !== archive.data.id) ||
            (!isDestinationArchive &&
                (destinationData as Folder).archiveId !== archive.data.id),
        []
    );

    const pushFolder = useCallback(
        (node: any, responseData: Folder, isDestinationArchive: boolean) => {
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
                let dataFCF = (node.data as Folder).childFolders;
                dataFCF = Array.isArray(dataFCF) ? dataFCF : [];
                dataFCF.push(responseData);
            }
        },
        []
    );

    const addFolder = useCallback(
        (
            dataSource: any[],
            destinationData: Archive | Folder,
            isDestinationArchive: boolean,
            responseData: Folder
        ) =>
            dataSource?.map((archive) => {
                if (
                    isCorrectArchive(
                        archive,
                        isDestinationArchive,
                        destinationData
                    )
                )
                    return archive;

                const clone = structuredClone(archive);
                const stack = [clone];

                while (stack.length > 0) {
                    const node = stack.pop();
                    if (node.data.id !== destinationData.id) {
                        stack.push(...node.items);
                        continue;
                    }

                    pushFolder(node, responseData, isDestinationArchive);
                    return clone;
                }
            }),
        [isCorrectArchive, pushFolder]
    );

    const updateLocal = useCallback(
        (
            dataSource: any[],
            isDestinationArchive: boolean,
            destinationData: Archive | Folder,
            responseData: Folder
        ) => {
            treeViewRef.current?.instance.option(
                'dataSource',
                addFolder(
                    dataSource,
                    destinationData,
                    isDestinationArchive,
                    responseData
                )
            );
            treeViewRef.current?.instance.repaint();
        },
        [addFolder, treeViewRef]
    );

    const handleTreeViewPopupSubmit = useCallback(
        async (destinationNode: any) => {
            const dataSource = treeViewRef.current?.instance.option(
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

            const response = await updateAzure(
                selectedData,
                isCopyTo,
                isDestinationArchive,
                destinationData,
                newArchiveId,
                newParentId
            );
            const responseData: Folder = await response.json();
            updateLocal(
                dataSource,
                isDestinationArchive,
                destinationData,
                responseData
            );
        },
        [
            selectedTreeItem,
            treeViewPopupStatus.type,
            treeViewRef,
            updateAzure,
            updateLocal,
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
                    if (child.id === data.id) {
                        if (isMoving) node.disabled = true;
                        child.disabled = true;
                        return clone;
                    }

                    stack.push(...node.items);
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
