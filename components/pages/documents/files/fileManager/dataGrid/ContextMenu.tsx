// React imports
import { useCallback, useRef } from 'react';

// Libraries imports
import { ContextMenu as DxContextMenu, Item } from 'devextreme-react/context-menu';
import { ItemClickEvent } from 'devextreme/ui/context_menu';

interface Props {
    onFileCopy: () => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onFileMove: () => void;
    onFileRename: () => void;
    onRefresh: () => void;
    selectedFilesQuantity: number;
};

export const ContextMenu = ({
    onFileCopy, onFileDelete, onFileDownload, onFileMove,
    onFileRename, onRefresh, selectedFilesQuantity
}: Props): React.ReactElement => {
    const ContextMenuRef = useRef<DxContextMenu>(null);

    const handleContextMenuItemClick = useCallback(({ itemIndex }: ItemClickEvent) => {
        const actions: any = {
            0: onFileRename,
            1: onFileMove,
            2: onFileCopy,
            3: onFileDelete,
            4: onRefresh,
            5: onFileDownload,
        };
        actions[itemIndex]();
    }, [onFileCopy, onFileDelete, onFileDownload, onFileMove, onFileRename, onRefresh]);

    return (
        <DxContextMenu
            ref={ContextMenuRef}
            target='#dataGrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap'
            onItemClick={handleContextMenuItemClick}
            hideOnOutsideClick
        >
            <Item closeMenuOnClick icon='rename' text='Rename' visible={selectedFilesQuantity === 1} />
            <Item closeMenuOnClick icon='movetofolder' text='Move to' />
            <Item closeMenuOnClick icon='copy' text='Copy to' />
            <Item closeMenuOnClick icon='trash' text='Delete' />
            <Item closeMenuOnClick beginGroup icon='refresh' text='Refresh' />
            <Item closeMenuOnClick icon='download' text='Download' />
        </DxContextMenu>
    );
};

export default ContextMenu;