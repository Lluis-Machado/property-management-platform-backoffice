'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import DataGrid, { Column, Paging, SearchPanel, Pager, Lookup } from 'devextreme-react/data-grid';

interface Props {
    ownershipData: any;
    propertiesData: any;
};

const ContactPropertiesDG = ({ ownershipData, propertiesData }: Props) => {
    const router = useRouter();

    const handleDoubleClick = useCallback(({ data }: any) => {
        router.push(`/private/properties/${data.propertyId}/property`)
    }, [router])

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={ownershipData}
            focusedRowEnabled
            keyExpr='id'
            onRowDblClick={handleDoubleClick}
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={20} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showInfo
                showNavigationButtons
            />

            {/* <Editing
      mode="batch"
      allowUpdating
      allowAdding
      allowDeleting
      useIcons
      startEditAction={'dblClick'}
      newRowPosition='first'
    /> */}

            <Column
                dataField='propertyId'
                caption='Property Name'
            >
                <Lookup
                    dataSource={propertiesData}
                    valueExpr="id"
                    displayExpr="name"
                />
            </Column>
            <Column
                dataField='share'
                dataType='number'
                caption='Property share (%)'
            // width={150}
            />
            <Column
                dataField='mainOwnership'
                dataType='boolean'
                caption='Main Contact Person'
            // width={150}
            />
        </DataGrid>
    )
}

export default ContactPropertiesDG