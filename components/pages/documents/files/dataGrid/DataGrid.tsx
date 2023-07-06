// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import {
    Column,
    DataGrid as DxDataGrid,
    Item,
    Selection,
    Toolbar,
} from 'devextreme-react/data-grid';

// Local imports
import { files } from '../files';
import { faArrowRight, faCopy, faDownload, faFile, faImage, faPenToSquare, faQuestion, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContextMenu from './ContextMenu';
import DataSource from 'devextreme/data/data_source';
import { ContextMenuPreparingEvent } from 'devextreme/ui/data_grid';

type ToolBarItemType = 'Download' | 'Move to' | 'Copy to' | 'Rename' | 'Delete' | 'Clear Selection' | 'Separator';

const fileExtensionCellRender = (e: any) => {
    const icon = (ext: string) => {
        switch (ext) {
            case 'jpeg':
            case 'jpg':
            case 'png':
                return faImage;
            case 'doc':
            case 'docx':
            case 'pdf':
            case 'txt':
                return faFile;
            default:
                return faQuestion;
        };
    };

    return (
        <div className='flex justify-center'>
            <FontAwesomeIcon icon={icon(e.value)} />
        </div>
    );
};

const customizeNameText = ({ value }: { value: string }) => {
    const lastIndex = value.lastIndexOf('.');
    return lastIndex === -1
        ? value
        : value.substring(0, lastIndex);
};

interface Props {
    onSelectedFile: (file: any) => void;
}

const DataGrid = ({ onSelectedFile }: Props) => {

    const DataGridRef = useRef<DxDataGrid>(null);

    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const actionClicked = useCallback((action: ToolBarItemType) => {
        const actions = {
            'Download': () => { console.log('TODO: Download file') },
            'Move to': () => { console.log('TODO: Move file') },
            'Copy to': () => { console.log('TODO: Copy file') },
            'Rename': () => { console.log('TODO: Rename file') },
            'Delete': () => { console.log('TODO: Delete file') },
            'Clear Selection': () => { DataGridRef.current?.instance.clearSelection() },
            'Separator': () => { },
        };
        actions[action]();
    }, []);

    const ToolBarItemRender = useCallback((type: ToolBarItemType) => {
        const icon = {
            'Download': faDownload,
            'Move to': faArrowRight,
            'Copy to': faCopy,
            'Rename': faPenToSquare,
            'Delete': faTrash,
            'Clear Selection': faXmark
        };
        return type === 'Separator'
            ? <div className='h-8 border border-primary-500' />
            : (
                <div
                    className='
                        flex flex-row gap-2 select-none p-2 text-base items-center text-center 
                        hover:bg-primary-300 hover:rounded hover:cursor-pointer transition-colors duration-300
                    '
                    onClick={() => actionClicked(type)}
                >
                    <FontAwesomeIcon icon={icon[type]} />
                    {type}
                </div>
            )
    }, [actionClicked]);

    const handleOnSelectionChanged = useCallback(({ selectedRowsData }: any) => {
        setSelectedItems(selectedRowsData);
        onSelectedFile(selectedRowsData.length === 1 ? selectedRowsData[0] : null);
    }, [onSelectedFile]);

    const handleRightClick = useCallback((e: ContextMenuPreparingEvent<any, any>) => {
        if (e.row?.rowType === "data") {
            const instance = DataGridRef.current!.instance;
            instance.clearSelection();
            instance.selectRowsByIndexes([e.rowIndex]);
        };
    }, []);

    return (
        <div>

            <DxDataGrid
                dataSource={files}
                onSelectionChanged={handleOnSelectionChanged}
                ref={DataGridRef}
                rowAlternationEnabled
                showBorders
                id='dataGrid'
                onContextMenuPreparing={handleRightClick}
            >
                <Selection mode='multiple' showCheckBoxesMode='none' />
                <Toolbar visible>
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Download')} />
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Separator')} />
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Move to')} />
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Copy to')} />
                    <Item location='before' visible={selectedItems.length === 1} render={_ => ToolBarItemRender('Rename')} />
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Separator')} />
                    <Item location='before' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Delete')} />
                    <Item location='after' visible={selectedItems.length > 0} render={_ => ToolBarItemRender('Clear Selection')} />
                </Toolbar>
                <Column
                    caption=''
                    cellRender={fileExtensionCellRender}
                    dataField='file_extension'
                    width={30}
                />
                <Column
                    caption='Name'
                    dataField='file_name'
                    customizeText={customizeNameText}
                />
                <Column
                    caption='Size (B)'
                    dataField='file_size'
                    dataType='number'
                />
                <Column
                    caption='Created'
                    dataField='created_date'
                    dataType='date'
                />
                <Column
                    caption='Modified'
                    dataField='modified_date'
                    dataType='date'
                />
            </DxDataGrid>
            <ContextMenu dataSource={DataSource} selectedTreeItem={selectedItems} />
        </div>
    );
};

export default DataGrid;