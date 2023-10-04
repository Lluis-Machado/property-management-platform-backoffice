import { UserRoles } from '@/lib/types/user';
import DataGrid, {
    Column,
    Editing,
    Lookup,
    Pager,
    SearchPanel,
} from 'devextreme-react/data-grid';
import React from 'react';

interface Props {
    userRoles: UserRoles[];
    roles: UserRoles[];
    isEditing: boolean;
}

const RolesDataGrid = ({ userRoles, roles, isEditing }: Props) => {
    return (
        <DataGrid
            dataSource={userRoles}
            keyExpr={'id'}
            focusedRowEnabled
            showRowLines
            showBorders
            showColumnLines
        >
            <Editing
                mode='batch'
                allowUpdating={isEditing}
                allowAdding={isEditing}
                allowDeleting={isEditing}
                useIcons
            />
            <SearchPanel visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Column dataField='id' caption={'Role Name'}>
                <Lookup dataSource={roles} valueExpr='id' displayExpr='name' />
            </Column>
            <Column
                dataField='description'
                caption={'Description'}
                allowEditing={false}
            />
        </DataGrid>
    );
};

export default RolesDataGrid;
