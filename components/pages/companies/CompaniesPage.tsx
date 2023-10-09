'use client';

// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import {
    Column,
    DataGrid,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import AddRowButton from '@/components/buttons/AddRowButton';
import { CompanyData } from '@/lib/types/companyData';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dataSource: CompanyData[];
}

const CompaniesPage = ({ dataSource }: Props) => {
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`./companies/${data.id}/companyInfo`}
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
            keyExpr='id'
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
                    <AddRowButton href={`./companies/addCompany`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
            <Column caption='Company Name' dataField='name' dataType='string' />
            <Column caption='NIF' dataField='nif' dataType='string' />
            <Column caption='Email' dataField='email' dataType='string' />
        </DataGrid>
    );
};

export default memo(CompaniesPage);
