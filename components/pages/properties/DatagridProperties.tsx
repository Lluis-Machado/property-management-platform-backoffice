// react imports

//library imports
import DataGrid, { Column as DxColumn, SearchPanel, Toolbar, Item, Pager, HeaderFilter } from 'devextreme-react/data-grid';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

// local imports

interface Props {
    dataSource: any[];
    handleDoubleClick: ({ data }: any) => void;
    basePath: string;
};

const Datagrid = ({ dataSource, handleDoubleClick, basePath }: Props): React.ReactElement => {

    const addRowButton = (): React.ReactElement => {
        return (
            <Link
                href={`${basePath}/properties/addProperty`}
                className='cursor-pointer p-1.5 flex flex-row items-center border rounded-md text-gray-500 border-slate-300 hover:border-primary-200 active:border-primary-500'>
                <FontAwesomeIcon
                    icon={faPlus}
                    className='p-1 text-gray-500'
                />
            </Link>
        )
    };

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
            onRowDblClick={handleDoubleClick}
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
                <Item render={addRowButton} />
                <Item name='searchPanel' />
            </Toolbar>

            <DxColumn
                caption='Name'
                dataField='name'
                dataType='string'
            />
            <DxColumn
                caption='Contact Person'
                dataField='primary_contact'
                dataType='string'
            />
            <DxColumn
                caption='Address'
                dataField='address'
                dataType='string'
                allowHeaderFiltering={false}
            />
        </DataGrid>
    )
}

export default Datagrid