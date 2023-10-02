// React imports
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

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
    faEnvelope,
    faFile,
    faFileExcel,
    faFileLines,
    faFilePowerpoint,
    faFileWord,
    faImage,
    faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import { Document } from '@/lib/types/documentsAPI';
import { formatDocumentSize } from '@/lib/utils/documents/utilsDocuments';
import ContextMenu from './ContextMenu';
import { isLoadingFileManager } from '@/lib/atoms/isLoadingFileManager';
import { useAtom } from 'jotai';

/**
 * Type for the possible types of toolbar items.
 */
type ToolBarItemType =
    | 'Download'
    | 'Move to'
    | 'Copy to'
    | 'Rename'
    | 'Split'
    | 'Join'
    | 'Delete'
    | 'Separator';

/**
 * Renders the icon for the document extension.
 * @param {Document} data - The document data.
 */
const ExtensionCellRender = ({
    data,
}: {
    data: Document;
}): React.ReactElement => {
    const icon = (ext: string) => {
        // This are all the possibilities:
        // .pdf, .png, .jpg, .jpeg, .heif, .xls, .xlsx, .doc, .docx, .odt, .ppt, .pptx, .eml
        switch (ext.toLowerCase()) {
            case '.jpeg':
            case '.jpg':
            case '.png':
            case '.heif':
                return faImage;
            case '.pdf':
                return faFile;
            case '.txt':
                return faFileLines;
            case '.eml':
                return faEnvelope;
            case '.xlsx':
            case '.xls':
                return faFileExcel;
            case '.doc':
            case '.docx':
            case '.odt':
                return faFileWord;
            case '.ppt':
            case '.pptx':
                return faFilePowerpoint;
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

/**
 * Renders the name of the document without its extension.
 * @param {Document} data - The document data.
 */
const NameCellRender = ({ data }: { data: Document }): React.ReactElement => (
    <p>{data.name.replace(data.extension, '')}</p>
);

/**
 * Renders the size of the document in a human-readable format.
 * @param {Document} data - The document data.
 */
const SizeCellRender = ({ data }: { data: Document }): React.ReactElement => (
    <p>{formatDocumentSize(data.contentLength)}</p>
);

interface Props {
    /** The data source containing an array of documents. */
    dataSource: Document[];
    /** Callback function for handling the "Copy" action. */
    onFileCopy: () => void;
    /** Callback function for handling the "Delete" action. */
    onFileDelete: () => void;
    /** Callback function for handling the "Download" action. */
    onFileDownload: () => void;
    /** Callback function for handling the "Move" action. */
    onFileMove: () => void;
    /** Callback function for handling the "Rename" action. */
    onFileRename: () => void;
    /** Callback function for handling the "Split" action. */
    onFileSplit: () => void;
    /** Callback function for handling the "Join" action. */
    onFileJoin: () => void;
    /** Callback function for handling the selection change. */
    onSelectionChanged: (documents: Document[]) => void;
}

/**
 * DataGrid component that displays a data grid of documents with various actions.
 */
const DataGrid: FC<Props> = memo(function DataGrid({
    dataSource,
    onFileCopy,
    onFileDelete,
    onFileDownload,
    onFileMove,
    onFileRename,
    onFileSplit,
    onFileJoin,
    onSelectionChanged,
}): React.ReactElement {
    const DataGridRef = useRef<DxDataGrid>(null);
    const [isLoading, _] = useAtom(isLoadingFileManager);

    useEffect(() => {
        if (isLoading) {
            DataGridRef.current?.instance.beginCustomLoading('');
        } else {
            DataGridRef.current?.instance.endCustomLoading();
        }
    }, [isLoading]);

    const [selectedFilesQuantity, setSelectedFilesQuantity] =
        useState<number>(0);
    /**
     * Handles the click event for toolbar items.
     * @param {ToolBarItemType} action - The type of toolbar item clicked.
     */
    const handleOnClick = useCallback(
        (action: ToolBarItemType) => {
            const on = {
                Download: onFileDownload,
                Rename: onFileRename,
                'Move to': onFileMove,
                'Copy to': onFileCopy,
                Split: onFileSplit,
                Join: onFileJoin,
                Delete: onFileDelete,
                Separator: () => {},
            };

            on[action]();
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

    /**
     * Renders the toolbar item based on its type.
     * @param {ToolBarItemType} type - The type of toolbar item to render.
     */
    const ToolBarItemRender = useCallback(
        (type: ToolBarItemType): React.ReactElement => {
            const icon = {
                Download: 'download',
                'Move to': 'movetofolder',
                'Copy to': 'copy',
                Split: 'fields',
                Join: 'collapse',
                Rename: 'rename',
                Delete: 'trash',
            };

            return type === 'Separator' ? (
                <div className='pointer-events-none h-8 border border-primary-500' />
            ) : (
                <div
                    className='
                        flex select-none flex-row items-center gap-1 whitespace-nowrap p-2 text-center text-base
                        transition-colors duration-200 hover:cursor-pointer hover:rounded hover:bg-primary-100
                    '
                    onClick={() => handleOnClick(type)}
                >
                    <i className={`dx-icon-${icon[type]} text-lg`}></i>
                    {type}
                </div>
            );
        },
        [handleOnClick]
    );

    /**
     * Handles the selection changed event in the data grid.
     * @param {Object} selectedRowsData - The selected row data in the data grid.
     */
    const handleOnSelectionChanged = useCallback(
        ({ selectedRowsData }: { selectedRowsData: Document[] }) => {
            setSelectedFilesQuantity(selectedRowsData.length);
            onSelectionChanged(selectedRowsData);
        },
        [onSelectionChanged]
    );

    /**
     * Handles the right-click event to select a row in the data grid.
     * @param {ContextMenuPreparingEvent<any, any>} e - The right-click event object.
     */
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
                height='100%'
                id='DocumentsDataGrid'
                keyExpr='id'
                onContextMenuPreparing={handleRightClick}
                // onRowClick={({ data }: { data: Document }) =>
                //     onSelectionChanged([data])
                // }
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
                        visible={selectedFilesQuantity === 1}
                        render={(_) => ToolBarItemRender('Rename')}
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
                        render={(_) => ToolBarItemRender('Split')}
                    />
                    <Item
                        location='before'
                        visible={selectedFilesQuantity > 1}
                        render={(_) => ToolBarItemRender('Join')}
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
                    sortOrder='asc'
                />
                <Column
                    caption='Size'
                    cellRender={SizeCellRender}
                    dataField='contentLength'
                    dataType='number'
                />
                <Column
                    caption='Uploaded at'
                    dataField='createdAt'
                    dataType='datetime'
                />
                <Column caption='Uploaded by' dataField='createdByUser' />
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
                    visible={false}
                />
                <Column
                    caption='Folder Id'
                    dataField='folderId'
                    visible={false}
                />
                <Column caption='Id' dataField='id' visible={false} />
            </DxDataGrid>
            <ContextMenu
                onFileCopy={onFileCopy}
                onFileDelete={onFileDelete}
                onFileDownload={onFileDownload}
                onFileMove={onFileMove}
                onFileRename={onFileRename}
                onFileSplit={onFileSplit}
                onFileJoin={onFileJoin}
                selectedFilesQuantity={selectedFilesQuantity}
            />
        </>
    );
});

export default DataGrid;
