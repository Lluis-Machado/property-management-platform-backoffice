'use client';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import {
    Column,
    DataGrid,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import AddRowButton from '@/components/buttons/AddRowButton';

const Postbox = () => {
    const router = useRouter();

    const handleDouleClick = useCallback(
        ({ data }: any) => {
            router.push(`./contacts/${data.id}/contactInfo`);
        },
        [router]
    );

    return (
        <>
            <Breadcrumb />
            <DataGrid
                columnMinWidth={100}
                dataSource={undefined}
                focusedRowEnabled
                keyExpr='id'
                onRowDblClick={handleDouleClick}
                columnHidingEnabled={false}
                rowAlternationEnabled
                allowColumnResizing
                showBorders
                showRowLines
            >
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

                <Column
                    caption='First Name'
                    dataField='firstName'
                    dataType='string'
                    hidingPriority={0}
                />
                <Column
                    caption='Last Name'
                    dataField='lastName'
                    dataType='string'
                    hidingPriority={1}
                />
                <Column
                    caption='NIF'
                    dataField='nif'
                    dataType='string'
                    hidingPriority={2}
                />
                <Column
                    caption='Email'
                    dataField='email'
                    dataType='string'
                    hidingPriority={3}
                />
                {/* <MasterDetail enabled={true} component={DetailTemplate} /> */}
            </DataGrid>
        </>
    );
};

export default Postbox;
