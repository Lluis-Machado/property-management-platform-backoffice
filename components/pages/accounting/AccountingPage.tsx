'use client'

import { memo, useCallback } from 'react';

// Library imports
import { useRouter } from 'next/navigation';
import DataGrid, { Column as DxColumn, SearchPanel, Toolbar, Item, Pager } from 'devextreme-react/data-grid';

interface Props {
    dataSource: any[];
};

const AccountingPage = ({ dataSource }: Props): React.ReactElement => {
    const router = useRouter();

    const handleDoubleClick = useCallback(({ data }: any) => {
        router.push(`./accounting/${data.id}/incomes`)
    }, [router])

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='id'
            onRowDblClick={handleDoubleClick}
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel
                searchVisibleColumnsOnly={false}
                visible
                width={350}
            />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />

            <Toolbar>
                <Item name='searchPanel' />
            </Toolbar>

            <DxColumn
                caption='Name'
                dataField='name'
                dataType='string'
                hidingPriority={0}
            />
        </DataGrid>
    );
};

export default memo(AccountingPage);