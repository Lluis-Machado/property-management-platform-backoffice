'use client';

// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import {
    Column,
    DataGrid,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import { formatDocumentSize } from '@/lib/utils/documents/utilsDocuments';

/**
 * Renders the size of the document in a human-readable format.
 * @param {Document} data - The document data.
 */
const SizeCellRender = ({ data }: { data: any }): React.ReactElement => (
    <p>{formatDocumentSize(data.contentLength)}</p>
);

const PostBoxPage = () => {
    const router = useRouter();

    // const handleDouleClick = useCallback(
    //     ({ data }: any) => {
    //         router.push(`./contacts/${data.id}/contactInfo`);
    //     },
    //     [router]
    // );

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={undefined}
            focusedRowEnabled
            keyExpr='id'
            // onRowDblClick={handleDouleClick}
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />

            <Toolbar>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                caption='Document Name'
                dataField='documentName'
                dataType='string'
            />
            <Column
                caption='Archive Name'
                dataField='archiveName'
                dataType='string'
            />
            <Column
                caption='Size'
                cellRender={SizeCellRender}
                dataField='contentLength'
                dataType='number'
            />
            <Column
                caption='Created At'
                dataField='createdAt'
                dataType='date'
            />
            <Column caption='Status' dataField='status' />
        </DataGrid>
    );
};

export default memo(PostBoxPage);
