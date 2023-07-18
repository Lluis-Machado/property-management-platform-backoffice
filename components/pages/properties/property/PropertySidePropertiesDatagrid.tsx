'use client';
// React imports

// Libraries imports
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Editing,
} from 'devextreme-react/data-grid';

// Local imports

interface Props {
    dataSource: any;
}

const PropertySidePropertiesDatagrid = ({ dataSource }: Props) => {
    const data = dataSource.childProperties;
    // console.log(data)

    return (
        <DataGrid
            dataSource={data}
            keyExpr='id'
            showRowLines
            showBorders
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
        >
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={5} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showInfo
                showNavigationButtons
            />
            <Editing
                mode='batch'
                allowUpdating
                allowAdding
                allowDeleting
                useIcons
                startEditAction={'dblClick'}
                newRowPosition='first'
            />
            <Column dataField='name' dataType='string' caption='Name' />
        </DataGrid>
    );
};

export default PropertySidePropertiesDatagrid;
