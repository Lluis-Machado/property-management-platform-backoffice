'use client';

// React imports
import { memo } from 'react';

// Libraries imports
import {
    Column,
    DataGrid,
    HeaderFilter,
    Item,
    Pager,
    Paging,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import { formatDocumentSize } from '@/lib/utils/documents/utilsDocuments';
import { dateFormat } from '@/lib/utils/datagrid/customFormats';

/**
 * Renders the size of the document in a human-readable format.
 * @param {Document} data - The document data.
 */
const SizeCellRender = ({ data }: { data: any }): React.ReactElement => (
    <p>{formatDocumentSize(data.contentLength)}</p>
);

const getBadgeColor = (value: number): string => {
    const colors: any = {
        0: 'bg-red-300',
        1: 'bg-orange-300',
        2: 'bg-green-300',
        3: 'bg-lime-300',
        4: 'bg-cyan-300',
        5: 'bg-purple-300',
    };
    return colors[value];
};

const documentStates = [
    'Received',
    'Processing',
    'Pending Review',
    'Approved',
    'Rejected',
    'On Hold',
];

// Render Category Code with Tooltip & Tooltip Colors
const StatusCellRender = ({
    value,
    rowIndex,
    data,
}: {
    value: number;
    rowIndex: number;
    data: any;
}): React.ReactElement => (
    <div className='bg- flex flex-row items-center gap-2 text-center'>
        <span id={value + rowIndex + data.id}>
            <div
                className={`rounded-3xl px-2 py-1 text-center text-xs text-black ${getBadgeColor(
                    value
                )}`}
            >
                {documentStates[value]}
            </div>
        </span>
    </div>
);

interface Props {
    dataSource: any;
}

const PostBoxPage = ({ dataSource }: Props) => {
    // const router = useRouter();

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='id'
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <HeaderFilter visible />
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Paging pageSize={18} />
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
                allowHeaderFiltering={false}
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
                allowHeaderFiltering={false}
            />
            <Column
                caption='Created At'
                dataField='createdAt'
                dataType='date'
                allowHeaderFiltering={false}
                //@ts-ignore
                format={dateFormat}
                sortOrder='desc'
            />
            <Column
                caption='Status'
                dataField='status'
                cellRender={StatusCellRender}
            />
        </DataGrid>
    );
};

export default memo(PostBoxPage);
