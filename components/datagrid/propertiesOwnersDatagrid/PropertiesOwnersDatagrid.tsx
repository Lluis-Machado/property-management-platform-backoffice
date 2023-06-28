'use client'
// React imports

// Libraries imports
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid, { Column, Paging, SearchPanel, Pager, Editing, MasterDetail, Lookup, Summary, TotalItem, Scrolling } from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

// Local imports
import PropertiesOwnerMasterDetail from './PropertiesOwnerMasterDetail';

interface Props {
    dataSource: any[];
};

const MainContactCellRender = ({ value }: any): React.ReactElement => (
    <FontAwesomeIcon
        icon={value === true ? faCheck : faXmark}
        className='text-primary-600 row-focused-state'
    />
);

const PropertiesOwnersDatagrid = ({ dataSource }: Props) => {
    
    const OwnerDropdownComponent = (data: any) => {
        console.log(data)
        return (
            <DropDownBox
                //onOptionChanged 
                opened
                dataSource={dataSource}
                value={dataSource}
                displayExpr="first_name"
                valueExpr="nif"
            >
                <DataGrid
                    dataSource={dataSource}
                    selectedRowKeys={data.value}
                    focusedRowEnabled
                    keyExpr='nif'
                >
                    <SearchPanel visible />
                    <Column dataField="first_name" />
                    <Column dataField="last_name" />
                    <Column dataField="nif" caption='DNI/NIE'/>
                    <Paging enabled={true} defaultPageSize={10} />
                    <Scrolling mode='virtual'/>
                </DataGrid>
            </DropDownBox>
        );
    }
    
    return (
        <DataGrid
            dataSource={dataSource}
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
            <Paging defaultPageSize={10} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showPageSizeSelector
                showInfo
                showNavigationButtons
            />

            <Editing
                mode="batch"
                allowUpdating
                allowAdding
                allowDeleting
                useIcons
                startEditAction={'dblClick'}
                newRowPosition='first'
            />
            <Column
                dataField='first_name'
                dataType='string'
                caption='First name'
                editCellComponent={OwnerDropdownComponent}
            >
                <Lookup
                    dataSource={dataSource}
                    valueExpr="first_name"
                    displayExpr={"first_name"}
                />
            </Column>
            <Column
                dataField='last_name'
                dataType='string'
                caption='Last name'
            />
            <Column
                dataField='percentage'
                dataType='number'
                caption='Percentage %'
                width={150}
            />
            <Column
                dataField='main_contact'
                dataType='boolean'
                caption='Main Contact Person'
                width={150}
                cellRender={MainContactCellRender}
            />
            <MasterDetail
                enabled={true}
                component={PropertiesOwnerMasterDetail}
            />
            <Summary>
                <TotalItem
                    column="percentage"
                    summaryType="sum"
                />
            </Summary>
        </DataGrid>
    )
}

export default PropertiesOwnersDatagrid