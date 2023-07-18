'use client'

// React imports
import { memo, useCallback } from 'react';

// Library imports
import { useRouter } from 'next/navigation';
import DataGrid, { Column, SearchPanel, Toolbar, Item, Pager } from 'devextreme-react/data-grid';
import { PropertyData } from '@/lib/types/propertyInfo';
import AddRowButton from '@/components/buttons/AddRowButton';

interface Props {
    dataSource: PropertyData[];
};

const PropertiesPage = ({ dataSource }: Props): React.ReactElement => {

    console.log(dataSource)
    const router = useRouter();

    const handleDoubleClick = useCallback(({ data }: any) => {
        router.push(`./properties/${data.id}/property`)
    }, [router])

    const addressCellRender = (e: PropertyData) => {
        const { addressLine1, city, country, state, postalCode } = e.address;
        const parts = [addressLine1, postalCode && `${postalCode} - ${city}`, state, country];
        return parts.filter(Boolean).join(', ');
    };

    const mainContactCellRender = (e: PropertyData) => {
        const { ownerName } = e.mainOwner
        return `${ownerName ?? ''}`
    }

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='id'
            onRowDblClick={handleDoubleClick}
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
                <Item>
                    <AddRowButton href={`/private/properties/addProperty`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                caption='Name'
                dataField='name'
                dataType='string'
            />
            <Column
                caption='Address'
                dataType='string'
                calculateCellValue={addressCellRender}
                allowSearch
            />
            <Column
                caption='Main Contact'
                dataType='string'
                calculateCellValue={mainContactCellRender}
                allowSearch
            />
            <Column
                caption='Cadastral Reference'
                dataField='cadastreRef'
                dataType='string'
            />
        </DataGrid>
    )
}

export default memo(PropertiesPage);