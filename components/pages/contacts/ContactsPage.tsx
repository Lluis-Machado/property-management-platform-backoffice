'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { Column as DxColumn, DataGrid, Item, Pager, SearchPanel, Toolbar } from 'devextreme-react/data-grid';

interface Props {
    dataSource: any[];
};

const ContactsPage = ({ dataSource }: Props) => {
    const router = useRouter();

    const handleDouleClick = useCallback(({ data }: any) => {
        router.push(`./contacts/${data.id}/contact`)
    }, [router])

    return (
        <div>
            <DataGrid
                allowColumnResizing
                columnHidingEnabled={false}
                columnMinWidth={100}
                dataSource={dataSource}
                focusedRowEnabled
                keyExpr='id'
                onRowDblClick={handleDouleClick}
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

                <DxColumn
                    caption='Fisrt Name'
                    dataField='first_name'
                    dataType='string'
                    hidingPriority={0}
                />
                <DxColumn
                    caption='Last Name'
                    dataField='last_name'
                    dataType='string'
                    hidingPriority={1}
                />
                <DxColumn
                    caption='NIF'
                    dataField='nif'
                    dataType='string'
                    hidingPriority={2}
                />
                <DxColumn
                    caption='Email'
                    dataField='email'
                    dataType='string'
                    hidingPriority={3}
                />
            </DataGrid>
        </div>
    )
}

export default ContactsPage