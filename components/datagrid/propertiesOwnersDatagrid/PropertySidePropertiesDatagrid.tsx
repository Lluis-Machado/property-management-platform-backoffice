'use client'
// React imports
// Libraries imports
import DataGrid, { Column, Paging, SearchPanel, Pager, Editing, Lookup, Summary, TotalItem } from 'devextreme-react/data-grid';
// Local imports

interface Props {
    dataSource: any;
};


const PropertySidePropertiesDatagrid = ({ dataSource }: Props) => {

    const data = dataSource.childProperties;
    console.log(data)
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
            <Column
                dataField='id'
                dataType='string'
                caption='ID'
                width={300}
            />
            <Column
                dataField='name'
                dataType='string'
                caption='Name'
            />
        </DataGrid>
    )
}

export default PropertySidePropertiesDatagrid