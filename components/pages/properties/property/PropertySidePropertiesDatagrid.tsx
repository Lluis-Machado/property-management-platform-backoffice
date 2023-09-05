'use client';

// React imports
import { useCallback } from 'react';
// Libraries imports
import DataGrid, { Column, Paging, Pager } from 'devextreme-react/data-grid';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

// Local imports

interface Props {
    dataSource: any;
}
const typeRender = (value: any) => {
    switch (value.value) {
        case 0:
            return 'Apartment';
        case 1:
            return 'Rural property';
        case 2:
            return 'Residential property';
        case 3:
            return 'Plot';
        case 4:
            return 'Parking';
        case 5:
            return 'Storage room';
        case 6:
            return 'Mooring';
    }
};

const PropertySidePropertiesDatagrid = ({ dataSource }: Props) => {
    const data = dataSource.childProperties;

    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`/private/properties/${data.id}/property`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

    return (
        <DataGrid
            dataSource={data}
            keyExpr='id'
            showRowLines
            showBorders
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
        >
            <Paging defaultPageSize={5} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showInfo
                showNavigationButtons
            />
            <Column
                alignment='center'
                caption='Details'
                cellRender={CellRender}
                width={100}
            />
            <Column dataField='name' dataType='string' caption='Name' />
            <Column
                dataField='type'
                dataType='string'
                caption='Type'
                cellRender={typeRender}
            />
        </DataGrid>
    );
};

export default PropertySidePropertiesDatagrid;
