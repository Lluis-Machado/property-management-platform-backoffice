'use client';
import AddRowButton from '@/components/buttons/AddRowButton';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { Auth0User } from '@/lib/types/user';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import DataGrid, {
    Column,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import React, { memo, useCallback } from 'react';

interface Props {
    dataSource: Auth0User[];
}

const UsersPage = ({ dataSource }: Props) => {
    const CellRender = useCallback(
        ({ data }: { data: Auth0User }): React.ReactElement => (
            <LinkWithIcon
                href={`./users/${data.user_id}`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='user_id'
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />

            <Toolbar>
                <Item>
                    <AddRowButton href={`./users/addUser`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
            <Column caption='Name' dataField='name' dataType='string' />
            <Column caption='Nickname' dataField='nickname' dataType='string' />
            <Column caption='Email' dataField='email' dataType='string' />
            <Column
                caption='Created At'
                dataField='created_at'
                dataType='date'
            />
            <Column
                caption='Updated At'
                dataField='updated_at'
                dataType='date'
            />
            <Column
                caption='Last Login'
                dataField='last_login'
                dataType='date'
            />
            <Column caption='Last IP' dataField='last_ip' dataType='string' />
            <Column
                caption='Logins Count'
                dataField='logins_count'
                dataType='number'
            />
        </DataGrid>
    );
};

export default memo(UsersPage);
