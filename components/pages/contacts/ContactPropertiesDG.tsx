'use client';

// React imports
import { useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
} from 'devextreme-react/data-grid';
import { OwnershipData } from '@/lib/types/ownershipData';

interface Props {
    ownershipData: OwnershipData[];
}

const ContactPropertiesDG = ({ ownershipData }: Props) => {
    const router = useRouter();

    const handleDoubleClick = useCallback(
        ({ data }: any) => {
            router.push(`/private/properties/${data.propertyId}/property`);
        },
        [router]
    );

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
            <Pager visible={true} showInfo showNavigationButtons />

            <Column dataField='propertyName' caption='Property Name' />
            <Column
                dataField='share'
                dataType='number'
                caption='Property share (%)'
            />
            <Column
                dataField='mainOwnership'
                dataType='boolean'
                caption='Main Contact Person'
            />
        </DataGrid>
    );
};

export default ContactPropertiesDG;
