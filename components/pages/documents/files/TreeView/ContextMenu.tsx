// React imports
import { FC, memo, useMemo, useRef } from 'react';

// Libraries imports
import { ContextMenu as DxContextMenu, Item } from 'devextreme-react/context-menu';

interface Props {
    isArchive: boolean;
    onDirectoryDelete: () => void;
    onDirectoryCopy: () => void;
    onDirectoryMove: () => void;
    onDirectoryRename: () => void;
    onDirectoryUpload: () => void;
    onNewDirectory: () => void;
    onRefresh: () => void;
};

const ContextMenu: FC<Props> = memo(function ContextMenu({
    isArchive, onDirectoryDelete, onDirectoryCopy, onDirectoryMove,
    onDirectoryRename, onDirectoryUpload, onNewDirectory, onRefresh,
}): React.ReactElement {
    const ContextMenuRef = useRef<DxContextMenu>(null);

    const actions = useMemo(() => ({
        0: onNewDirectory,
        1: onDirectoryUpload,
        2: onDirectoryRename,
        3: onDirectoryMove,
        4: onDirectoryCopy,
        5: onDirectoryDelete,
        6: onRefresh,
    }), [onDirectoryCopy, onDirectoryDelete, onDirectoryMove, onDirectoryRename, onDirectoryUpload, onNewDirectory, onRefresh]);

    return (
        <DxContextMenu
            ref={ContextMenuRef}
            target='#ArchiveTreeview .dx-treeview-item'
            onItemClick={({ itemIndex }) => actions[itemIndex as keyof typeof actions]()}
        >
            <Item closeMenuOnClick icon='newfolder' text='New directory' />
            <Item closeMenuOnClick icon='upload' text='Upload files' />
            <Item closeMenuOnClick icon='rename' text='Rename' />
            <Item closeMenuOnClick icon='movetofolder' text='Move to' visible={!isArchive} />
            <Item closeMenuOnClick icon='copy' text='Copy to' visible={!isArchive} />
            <Item closeMenuOnClick icon='trash' text='Delete' />
            <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
        </DxContextMenu>
    );
});

export default ContextMenu;