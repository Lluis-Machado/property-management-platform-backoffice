'use client'
// React imports

// Libraries imports
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid, { Column, Paging, SearchPanel, Pager, Editing, Lookup, Summary, TotalItem } from 'devextreme-react/data-grid';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { ContactData } from '@/lib/types/contactData';

interface Props {
    dataSource: any;
    contactData: ContactData[];
};

const MainContactCellRender = ({ value }: any): React.ReactElement => (
    <FontAwesomeIcon
        icon={value === true ? faCheck : faXmark}
        className='text-primary-600 row-focused-state'
    />
);

const PropertiesOwnersDatagrid = ({ dataSource, contactData }: Props) => {
    const data = dataSource.ownerships;
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
                mode="batch"
                allowUpdating
                allowAdding
                allowDeleting
                useIcons
                startEditAction={'dblClick'}
                newRowPosition='first'
            />
            <Column
                dataField='contactId'
                caption='First Name'
                editCellComponent={OwnerDropdownComponent}
            >
                <Lookup
                    dataSource={contactData}
                    valueExpr="id"
                    displayExpr="firstName"
                />
            </Column>
            <Column
                dataField='contactDetail.lastName'
                dataType='string'
                caption='Last Name'
            />
            <Column
                dataField='share'
                dataType='number'
                caption='Percentage %'
                width={150}
            />
            <Column
                dataField='mainOwnership'
                dataType='boolean'
                caption='Main Contact Person'
                width={150}
                cellRender={MainContactCellRender}
            />
        </DataGrid>
    )
}

export default PropertiesOwnersDatagrid