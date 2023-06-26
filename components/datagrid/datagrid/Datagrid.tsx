// react imports

//library imports
import DataGrid, { Column as DxColumn, SearchPanel, Toolbar, Item, Pager, HeaderFilter } from 'devextreme-react/data-grid';

// local imports


interface Props {
    dataSource: any[];
    handleDouleClick: ({ data }: any) => void;
};

const Datagrid = ({ dataSource, handleDouleClick }: Props): React.ReactElement => {
  return (
    <DataGrid
                allowColumnResizing={true}
                columnHidingEnabled={false}
                columnMinWidth={100}
                dataSource={dataSource}
                focusedRowEnabled
                id='datagrid'
                keyExpr='name'
                showBorders
                showRowLines
                onRowDblClick={handleDouleClick}
            >
                <HeaderFilter visible />
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
                <DxColumn
                    caption='Contact Person'
                    dataField='primary_contact'
                    dataType='string'
                    hidingPriority={1}
                />
                <DxColumn
                    caption='Address'
                    dataField='address'
                    dataType='string'
                    allowHeaderFiltering={false}
                    hidingPriority={2}
                />
            </DataGrid>
  )
}

export default Datagrid