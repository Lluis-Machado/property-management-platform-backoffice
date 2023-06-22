'use client'

// React imports
import { useCallback, useEffect } from 'react';

// Libraries imports
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import DataGrid, { Column, Paging, SearchPanel, Toolbar, Item, Pager, Export, Editing } from 'devextreme-react/data-grid';
import Link from 'next/link';

// Local imports
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';

interface Props {
    dataSource: any[];
}

const DataGridBusinessPartners = ({ dataSource }: Props) => {
    const pathName = usePathname();

    // useEffect(() => {
    //     localeDevExtreme()
    // }, []);

    const getBasePath = useCallback(() => {
        if (!pathName) return undefined;
        let lastIndex = pathName.lastIndexOf('/');
        if (lastIndex !== -1) {
            return pathName.substring(0, lastIndex);
        }
        return pathName;
    }, [pathName])

    // const ViewExpensesCellRender = useCallback(({ data }: any) => {
    //     const { name } = data;
    //     return (
    //         <Link href={`${getBasePath()}/expenses?bp=${name}`}>
    //             <FontAwesomeIcon
    //                 icon={faFileInvoice}
    //                 className='text-primary-600 hover:scale-110 hover:text-primary-800'
    //             />
    //         </Link>
    //     )
    // }, [getBasePath]);

    return (
        <DataGrid
            dataSource={dataSource}
            keyExpr='nif'
            showRowLines
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
            height={'85vh'}
        >
            <Export enabled={true} />
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={20} />
            <Pager
                visible={true}
                allowedPageSizes={'auto'}
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
                selectTextOnEditStart
                useIcons
                startEditAction={'dblClick'}
            />

            <Column
                dataField='name'
                dataType='string'
                caption='Name'
                hidingPriority={0}
            />
            <Column
                dataField='nif'
                dataType='number'
                alignment='left'
                caption='NIF'
                hidingPriority={1}
            />
            <Column
                dataField='phone_number'
                dataType='string'
                caption='Phone Number'
                hidingPriority={2}
            />
            <Column
                dataField='address'
                dataType='string'
                caption='Address'
                hidingPriority={3}
            />
            {/* <Column
                caption='View Expenses'
                alignment='center'
                hidingPriority={0}
                width={150}
                cellRender={ViewExpensesCellRender}
            /> */}
        </DataGrid>
    )
}

export default DataGridBusinessPartners