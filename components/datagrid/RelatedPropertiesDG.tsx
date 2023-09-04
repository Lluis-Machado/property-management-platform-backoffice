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
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Props {
    ownershipData: OwnershipData[];
}

const RelatedPropertiesDG = ({ ownershipData }: Props) => {
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`/private/properties/${data.propertyId}/property`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={ownershipData}
            focusedRowEnabled
            keyExpr='id'
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={20} />
            <Pager visible={true} showInfo showNavigationButtons />

            <Column
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
            <Column dataField='propertyName' caption='Property Name' />
            <Column
                dataField='share'
                dataType='number'
                caption='Property share (%)'
            />
        </DataGrid>
    );
};

export default RelatedPropertiesDG;
