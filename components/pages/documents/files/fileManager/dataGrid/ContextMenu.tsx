// React imports
import { FC, memo, useCallback } from 'react';

// Libraries imports
import {
    ContextMenu as DxContextMenu,
    Item,
} from 'devextreme-react/context-menu';
import { ItemClickEvent } from 'devextreme/ui/context_menu';

interface Props {
    /**
     * A function to be called when the "Copy to" action is triggered.
     */
    onFileCopy: () => void;
    /**
     * A function to be called when the "Delete" action is triggered.
     */
    onFileDelete: () => void;
    /**
     * A function to be called when the "Download" action is triggered.
     */
    onFileDownload: () => void;
    /**
     * A function to be called when the "Move to" action is triggered.
     */
    onFileMove: () => void;
    /**
     * A function to be called when the "Rename" action is triggered.
     */
    onFileRename: () => void;
    /**
     * A function to be called when the "Split" action is triggered.
     */
    onFileSplit: () => void;
    /**
     * A function to be called when the "Join" action is triggered.
     */
    onFileJoin: () => void;
    /**
     * The amount of selected files
     */
    selectedFilesQuantity: number;
}

/**
 * ContextMenu component that displays a context menu for file-related actions.
 */
export const ContextMenu: FC<Props> = memo(function ContextMenu({
    onFileCopy,
    onFileDelete,
    onFileDownload,
    onFileMove,
    onFileRename,
    onFileSplit,
    onFileJoin,
    selectedFilesQuantity,
}): React.ReactElement {
    /**
     * Handles the click event of the context menu items.
     * @param {ItemClickEvent} event - The click event object containing the index of the clicked item.
     */
    const handleContextMenuItemClick = useCallback(
        ({ itemIndex }: ItemClickEvent) => {
            const actions: Record<number, () => void> = {
                0: onFileDownload,
                1: onFileRename,
                2: onFileMove,
                3: onFileCopy,
                4: onFileSplit,
                5: onFileJoin,
                6: onFileDelete,
            };
            actions[itemIndex]();
        },
        [
            onFileCopy,
            onFileDelete,
            onFileDownload,
            onFileMove,
            onFileRename,
            onFileJoin,
            onFileSplit,
        ]
    );

    return (
        <DxContextMenu
            target='#DocumentsDataGrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap.dx-scrollable.dx-visibility-change-handler.dx-scrollable-both.dx-scrollable-simulated > div > div > div.dx-scrollable-content > div > table > tbody > tr:not(.dx-freespace-row)'
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
            <Item
                closeMenuOnClick
                icon='fields'
                text='Split'
                visible={selectedFilesQuantity === 1}
            />
            <Item
                closeMenuOnClick
                icon='collapse'
                text='Join'
                visible={selectedFilesQuantity > 1}
            />
            <Item closeMenuOnClick beginGroup icon='trash' text='Delete' />
        </DxContextMenu>
    );
});

export default ContextMenu;
