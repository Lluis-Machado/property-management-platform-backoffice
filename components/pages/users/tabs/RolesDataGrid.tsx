import { UserRoles } from '@/lib/types/user';
import DataGrid, {
    Column,
    Pager,
    SearchPanel,
} from 'devextreme-react/data-grid';
import React from 'react';

interface Props {
    userRoles: UserRoles[];
}

const RolesDataGrid = ({ userRoles }: Props) => {
    return (
        <DataGrid
            dataSource={userRoles}
            keyExpr={'id'}
            focusedRowEnabled
            showRowLines
            showBorders
            showColumnLines
        >
            <SearchPanel visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Column dataField='id' visible={false} />
            <Column dataField='name' caption={'Name'} />
            <Column dataField='description' caption={'Description'} />
        </DataGrid>
    );
};

export default RolesDataGrid;
