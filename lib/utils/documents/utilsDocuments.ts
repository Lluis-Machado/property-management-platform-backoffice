import { Archive, Folder } from '@/lib/types/documentsAPI';

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
