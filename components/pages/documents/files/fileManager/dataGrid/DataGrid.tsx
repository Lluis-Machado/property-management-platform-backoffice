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
import { ContextMenuPreparingEvent } from 'devextreme/ui/data_grid';
import {
    faArrowRight,
    faCopy,
    faDownload,
    faFile,
    faImage,
    faPenToSquare,
    faQuestion,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import ContextMenu from './ContextMenu';
import { formatFileSize } from '@/lib/utils/documents/utilsDocuments';

type ToolBarItemType =
    | 'Download'
    | 'Move to'
    | 'Copy to'
    | 'Rename'
    | 'Delete'
    | 'Separator';

const ExtensionCellRender = ({ data }: any): React.ReactElement => {
    const icon = (ext: string) => {
        switch (ext) {
            case '.jpeg':
            case '.jpg':
            case '.png':
                return faImage;
            case '.doc':
            case '.docx':
            case '.pdf':
            case '.txt':
                return faFile;
            default:
                return faQuestion;
        }
    };

    return (
        <div className='flex justify-center'>
            <FontAwesomeIcon icon={icon(data.extension)} />
        </div>
    );
};

const NameCellRender = ({ data }: any): React.ReactElement => (
    <p>{(data.name as string).replace(data.extension, '')}</p>
);

const SizeCellRender = ({ data }: any): React.ReactElement => (
    <p>{formatFileSize(data.contentLength)}</p>
);

interface Props {
    dataSource: any[];
    onFileCopy: () => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onFileMove: () => void;
    onFileRename: () => void;
    onRefresh: () => void;
    onSelectedFile: (file: any) => void;
}

const DataGrid = ({
    dataSource,
    onFileCopy,
    onFileDelete,
    onFileDownload,
    onFileMove,
    onFileRename,
    onRefresh,
    onSelectedFile,
}: Props): React.ReactElement => {
    const DataGridRef = useRef<DxDataGrid>(null);

    const [selectedFilesQuantity, setSelectedFilesQuantity] =
        useState<number>(0);

    const handleOnClick = useCallback(
        (action: ToolBarItemType) => {
            const on = {
                Download: onFileDownload,
                'Move to': onFileMove,
                'Copy to': onFileCopy,
                Rename: onFileRename,
                Delete: onFileDelete,
                Separator: () => {},
            };

            on[action]();
        },
        [onFileCopy, onFileDelete, onFileDownload, onFileMove, onFileRename]
    );

    const ToolBarItemRender = useCallback(
        (type: ToolBarItemType): React.ReactElement => {
            const icon = {
                Download: faDownload,
                'Move to': faArrowRight,
                'Copy to': faCopy,
                Rename: faPenToSquare,
                Delete: faTrash,
            };

            return type === 'Separator' ? (
                <div className='pointer-events-none h-8 border border-primary-500' />
            ) : (
                <div
                    className='
                        flex select-none flex-row items-center gap-2 p-2 text-center text-base 
                        transition-colors duration-300 hover:cursor-pointer hover:rounded hover:bg-primary-300
                    '
                    onClick={() => handleOnClick(type)}
                >
                    <FontAwesomeIcon icon={icon[type]} />
                    {type}
                </div>
            );
        },
        [handleOnClick]
    );

    const handleOnSelectionChanged = useCallback(
        ({ selectedRowsData }: any) => {
            setSelectedFilesQuantity(selectedRowsData.length);
            onSelectedFile(selectedRowsData);
        },
        [onSelectedFile]
    );

    const handleRightClick = useCallback(
        (e: ContextMenuPreparingEvent<any, any>) => {
            if (e.row?.rowType === 'data') {
                const instance = DataGridRef.current!.instance;
                if (!instance.isRowSelected(e.row.key)) {
                    instance.clearSelection();
                    instance.selectRowsByIndexes([e.rowIndex]);
                }
            }
        },
        []
    );

    return (
        <>
            <DxDataGrid
                columnAutoWidth
                dataSource={dataSource ?? []}
                focusedRowEnabled
                id='DocumentsDataGrid'
                keyExpr='id'
                onContextMenuPreparing={handleRightClick}
                onSelectionChanged={handleOnSelectionChanged}
                ref={DataGridRef}
                rowAlternationEnabled
                showBorders
            >
                <Selection mode='multiple' showCheckBoxesMode='none' />
                <Toolbar visible>
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Download')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Separator')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Move to')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Copy to')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity === 1}
                        render={(_) => ToolBarItemRender('Rename')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Separator')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 0}
                        render={(_) => ToolBarItemRender('Delete')}
                    />
                </Toolbar>
                <Column
                    caption=''
                    cellRender={ExtensionCellRender}
                    dataField='extension'
                    width={30}
                />
                <Column
                    caption='Name'
                    cellRender={NameCellRender}
                    dataField='name'
                />
                <Column
                    caption='Size'
                    cellRender={SizeCellRender}
                    dataField='contentLength'
                    dataType='number'
                />
                <Column
                    caption='Created at'
                    dataField='createdAt'
                    dataType='datetime'
                />
                <Column caption='Created by' dataField='createdByUser' />
                <Column
                    caption='Updated at'
                    dataField='lastUpdateAt'
                    dataType='datetime'
                />
                <Column caption='Updated by' dataField='lastUpdateByUser' />
                <Column
                    caption='Deleted'
                    dataField='deleted'
                    dataType='boolean'
                />
                <Column caption='Folder Id' dataField='folderId' />
                <Column caption='Id' dataField='id' />
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
