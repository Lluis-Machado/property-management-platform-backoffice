'use client';

import { memo, useCallback } from 'react';

// Library imports
import { useRouter } from 'next/navigation';
import DataGrid, {
    Column as DxColumn,
    SearchPanel,
    Toolbar,
    Item,
    Pager,
} from 'devextreme-react/data-grid';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dataSource: any[];
}

const AccountingPage = ({ dataSource }: Props): React.ReactElement => {
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`./accounting/${data.id}/incomes`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

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
            <DxColumn
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
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
