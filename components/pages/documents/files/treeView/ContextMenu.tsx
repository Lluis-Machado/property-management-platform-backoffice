// React imports
import { FC, memo, useMemo } from 'react';

// Libraries imports
import {
    ContextMenu as DxContextMenu,
    Item,
} from 'devextreme-react/context-menu';

interface Props {
    /**
     * A boolean value indicating whether the context menu is for an archive or not.
     */
    isArchive: boolean;
    /**
     * A function to be called when the "Delete" action is triggered.
     */
    onDirectoryDelete: () => void;
    /**
     * A function to be called when the "Copy to" action is triggered.     *
     */
    onDirectoryCopy: () => void;
    /**
     * A function to be called when the "Move to" action is triggered.
     */
    onDirectoryMove: () => void;
    /**
     * A function to be called when the "Rename" action is triggered.
     */
    onDirectoryRename: () => void;
    /**
     * A function to be called when the "Upload files" action is triggered.
     */
    onDirectoryUpload: () => void;
    /**
     * A function to be called when the "New folder" action is triggered.
     */
    onNewDirectory: () => void;
}

/**
 * ContextMenu component that displays a context menu for folder-related actions.
 */
const ContextMenu: FC<Props> = memo(function ContextMenu({
    isArchive,
    onDirectoryDelete,
    onDirectoryCopy,
    onDirectoryMove,
    onDirectoryRename,
    onDirectoryUpload,
    onNewDirectory,
}): React.ReactElement {
    /**
     * A memoized object containing action functions mapped by their corresponding item index in the context menu.
     */
    const actions = useMemo(
        () => ({
            0: onNewDirectory,
            1: onDirectoryUpload,
            2: onDirectoryRename,
            3: onDirectoryMove,
            4: onDirectoryCopy,
            5: onDirectoryDelete,
        }),
        [
            onDirectoryCopy,
            onDirectoryDelete,
            onDirectoryMove,
            onDirectoryRename,
            onDirectoryUpload,
            onNewDirectory,
        ]
    );

    return (
        <DxContextMenu
            target='#TreeviewArchive .dx-treeview-item'
            onItemClick={({ itemIndex }) =>
                actions[itemIndex as keyof typeof actions]()
            }
        >
            <Item closeMenuOnClick icon='newfolder' text='New folder' />
            <Item closeMenuOnClick icon='upload' text='Upload files' />
            <Item closeMenuOnClick icon='rename' text='Rename' />
            <Item
                closeMenuOnClick
                icon='movetofolder'
                text='Move to'
                visible={!isArchive}
            />
            <Item
                closeMenuOnClick
                icon='copy'
                text='Copy to'
                visible={!isArchive}
            />
            <Item closeMenuOnClick icon='trash' text='Delete' />
        </DxContextMenu>
    );
});

export default ContextMenu;
