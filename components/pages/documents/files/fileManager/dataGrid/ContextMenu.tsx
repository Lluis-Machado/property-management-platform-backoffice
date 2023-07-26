// React imports
import { FC, memo, useCallback, useRef } from 'react';

// Libraries imports
import {
    ContextMenu as DxContextMenu,
    Item,
} from 'devextreme-react/context-menu';
import { ItemClickEvent } from 'devextreme/ui/context_menu';

interface Props {
    onFileCopy: () => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onFileMove: () => void;
    onFileRename: () => void;
    selectedFilesQuantity: number;
}

export const ContextMenu: FC<Props> = memo(function ContextMenu({
    onFileCopy,
    onFileDelete,
    onFileDownload,
    onFileMove,
    onFileRename,
    selectedFilesQuantity,
}): React.ReactElement {
    const ContextMenuRef = useRef<DxContextMenu>(null);

    const handleContextMenuItemClick = useCallback(
        ({ itemIndex }: ItemClickEvent) => {
            const actions: Record<number, () => void> = {
                0: onFileDownload,
                1: onFileRename,
                2: onFileMove,
                3: onFileCopy,
                4: onFileDelete,
            };
            actions[itemIndex]();
        },
        [onFileCopy, onFileDelete, onFileDownload, onFileMove, onFileRename]
    );

    return (
        <DxContextMenu
            ref={ContextMenuRef}
            target='#DocumentsDataGrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap'
            onItemClick={handleContextMenuItemClick}
            hideOnOutsideClick
        >
            <Item closeMenuOnClick icon='download' text='Download' />
            <Item
                closeMenuOnClick
                beginGroup
                icon='rename'
                text='Rename'
                visible={selectedFilesQuantity === 1}
            />
            <Item closeMenuOnClick icon='movetofolder' text='Move to' />
            <Item closeMenuOnClick icon='copy' text='Copy to' />
            <Item closeMenuOnClick beginGroup icon='trash' text='Delete' />
        </DxContextMenu>
    );
});

export default ContextMenu;
