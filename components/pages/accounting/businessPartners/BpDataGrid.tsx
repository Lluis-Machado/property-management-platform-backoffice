'use client';

// Libraries imports
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Export,
    Editing,
} from 'devextreme-react/data-grid';

interface Props {
    dataSource: any[];
}

const BpDataGrid = ({ dataSource }: Props) => {
    return (
        <DataGrid
            dataSource={dataSource}
            keyExpr='id'
            showRowLines
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
            //height={'85vh'}
        >
            <Export enabled={true} />
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={20} />
            <Pager
                visible={true}
                allowedPageSizes={'auto'}
                displayMode={'compact'}
                showPageSizeSelector
                showInfo
                showNavigationButtons
            />

            <Editing
                mode='batch'
                allowUpdating
                allowAdding
                allowDeleting
                selectTextOnEditStart
                useIcons
                startEditAction={'dblClick'}
            />

            <Column dataField='name' dataType='string' caption='Name' />
            <Column
                dataField='vatNumber'
                dataType='number'
                alignment='left'
                caption='NIF'
            />
            <Column
                dataField='phone_number'
                dataType='string'
                caption='Phone Number'
            />
            <Column dataField='address' dataType='string' caption='Address' />
            {/* <Column
                caption='View Expenses'
                alignment='center'
                hidingPriority={0}
                width={150}
                cellRender={ViewExpensesCellRender}
            /> */}
        </DataGrid>
    );
};

export default BpDataGrid;
