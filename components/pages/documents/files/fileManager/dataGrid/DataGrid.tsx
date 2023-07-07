// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { Column, DataGrid as DxDataGrid, Item, Selection, Toolbar } from 'devextreme-react/data-grid';
import { ContextMenuPreparingEvent } from 'devextreme/ui/data_grid';
import {
    faArrowRight, faCopy, faDownload, faFile,
    faImage, faPenToSquare, faQuestion, faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import { files } from '../../files';
import ContextMenu from './ContextMenu';

type ToolBarItemType = 'Download' | 'Move to' | 'Copy to' | 'Rename' | 'Delete' | 'Separator';

const fileExtensionCellRender = (e: any): React.ReactElement => {
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
    onFileCopy: () => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onFileMove: () => void;
    onFileRename: () => void;
    onRefresh: () => void;
    onSelectedFile: (file: any) => void;
};

const DataGrid = ({
    onFileCopy, onFileDelete, onFileDownload, onFileMove,
    onFileRename, onRefresh, onSelectedFile
}: Props): React.ReactElement => {

    const DataGridRef = useRef<DxDataGrid>(null);

    const [selectedFilesQuantity, setSelectedFilesQuantity] = useState<number>(0);

    const handleOnClick = useCallback((action: ToolBarItemType) => {
        const on = {
            'Download': onFileDownload,
            'Move to': onFileMove,
            'Copy to': onFileCopy,
            'Rename': onFileRename,
            'Delete': onFileDelete,
            'Separator': () => { },
        };

        on[action]();
    }, [onFileCopy, onFileDelete, onFileDownload, onFileMove, onFileRename]);

    const ToolBarItemRender = useCallback((type: ToolBarItemType): React.ReactElement => {
        const icon = {
            'Download': faDownload,
            'Move to': faArrowRight,
            'Copy to': faCopy,
            'Rename': faPenToSquare,
            'Delete': faTrash,
        };
        return type === 'Separator'
            ? <div className='h-8 border border-primary-500 pointer-events-none' />
            : (
                <div
                    className='
                        flex flex-row gap-2 select-none p-2 text-base items-center text-center 
                        hover:bg-primary-300 hover:rounded hover:cursor-pointer transition-colors duration-300
                    '
                    onClick={() => handleOnClick(type)}
                >
                    <FontAwesomeIcon icon={icon[type]} />
                    {type}
                </div>
            )
    }, [handleOnClick]);

    const handleOnSelectionChanged = useCallback(({ selectedRowsData }: any) => {
        setSelectedFilesQuantity(selectedRowsData.length);
        onSelectedFile(selectedRowsData);
    }, [onSelectedFile]);

    const handleRightClick = useCallback((e: ContextMenuPreparingEvent<any, any>) => {
        if (e.row?.rowType === 'data') {
            const instance = DataGridRef.current!.instance;
            if (!instance.isRowSelected(e.row.key)) {
                instance.clearSelection();
                instance.selectRowsByIndexes([e.rowIndex]);
            };
        };
    }, []);

    return (
        <>
            <DxDataGrid
                dataSource={files}
                id='dataGrid'
                onContextMenuPreparing={handleRightClick}
                onSelectionChanged={handleOnSelectionChanged}
                ref={DataGridRef}
                rowAlternationEnabled
                showBorders
            >
                <Selection mode='multiple' showCheckBoxesMode='none' />
                <Toolbar visible>
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Download')} />
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Separator')} />
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Move to')} />
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Copy to')} />
                    <Item location='before' visible={selectedFilesQuantity === 1} render={_ => ToolBarItemRender('Rename')} />
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Separator')} />
                    <Item location='before' visible={selectedFilesQuantity > 0} render={_ => ToolBarItemRender('Delete')} />
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
            <ContextMenu
                onFileCopy={onFileCopy}
                onFileDelete={onFileDelete}
                onFileDownload={onFileDownload}
                onFileMove={onFileMove}
                onFileRename={onFileRename}
                onRefresh={onRefresh}
                selectedFilesQuantity={selectedFilesQuantity}
            />
        </>
    );
};

export default DataGrid;