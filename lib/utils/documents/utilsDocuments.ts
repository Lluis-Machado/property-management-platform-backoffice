// Libraries imports
import { saveAs } from 'file-saver';

// Local imports
import { Archive, Folder } from '@/lib/types/documentsAPI';
import { TreeItem } from '@/lib/types/treeView';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const formatFileSize = (
    bytes: number,
    dp: number = 2,
    si: boolean = false
) => {
    const base = si ? 1000 : 1024;

    if (Math.abs(bytes) < base) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= base;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= base &&
        u < units.length - 1
    );

    return bytes.toFixed(dp) + ' ' + units[u];
};

/**
 * Determines whether a item is an Archive or not.
 * @param item object to analyze
 * @returns Whether the item prop is an Archive or not(Folder)
 */
export const isArchive = (
    item: Archive | Folder | undefined
): item is Archive => !item?.hasOwnProperty('archiveId');

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
export const isCorrectArchive = (
    archive: TreeItem<Archive>,
    item: Archive | Folder
): boolean => {
    const isItemArchive = isArchive(item);
    return (
        (isItemArchive && archive.data.id === item.id) ||
        (!isItemArchive && archive.data.id === (item as Folder).archiveId)
    );
};

/**
 * Constructs a TreeItem for a given Folder and its child folders recursively.
 *
 * @param {Folder} folder - The folder for which to create the tree item.
 * @returns {TreeItem<Folder>} The root tree item representing the folder and its children.
 */
export const getTreeItemFolderFromFolder = (
    folder: Folder
): TreeItem<Folder> => ({
    data: folder,
    disabled: false,
    expanded: false,
    hasItems: folder.childFolders.length > 0,
    id: folder.id,
    items: folder.childFolders.map(getTreeItemFolderFromFolder),
    parentId: folder.parentId,
    selected: false,
    text: folder.name,
    visible: true,
});

export interface DocumentDownload {
    fileName: string;
    success: boolean;
    blob: Blob | null;
}

export const downloadFilesZIP = async (documents: DocumentDownload[]) => {
    try {
        // Dynamic imports
        const JSZip = await import('jszip');

        const zip = new JSZip.default();

        // Add each file's blob from the successfulDownloads array to the zip
        documents.forEach((file) => {
            zip.file(file.fileName, file.blob!);
        });

        // Generate the zip content
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Trigger the download of the zip file
        saveAs(zipContent, 'files.zip');
    } catch (error) {
        console.error('Error while creating or downloading the zip:', error);
    }
};
