import { UserLogs } from '@/lib/types/user';
import DataGrid, {
    Column,
    Pager,
    SearchPanel,
} from 'devextreme-react/data-grid';
import React from 'react';

interface Props {
    userLogs: UserLogs[];
}

const LogsDataGrid = ({ userLogs }: Props) => {
    return (
        <DataGrid
            dataSource={userLogs}
            keyExpr={'_id'}
            focusedRowEnabled
            showRowLines
            showBorders
            showColumnLines
            rowAlternationEnabled
        >
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Column
                dataField='date'
                caption={'Date'}
                dataType='datetime'
                sortOrder='desc'
            />
            <Column dataField='ip' caption={'IP'} />
            <Column dataField='client_ip' caption={'Client IP'} />
            <Column dataField='user_name' caption={'User Name'} />
            <Column dataField='log_id' caption={'Log ID'} />
            <Column
                dataField='isMobile'
                caption={'Is Mobile?'}
                dataType='boolean'
            />
            <Column dataField='user_agent' caption={'User Agent'} />
            <Column
                dataField='location_info'
                caption={'Location Info'}
                dataType='object'
            />
        </DataGrid>
    );
};

export default LogsDataGrid;
