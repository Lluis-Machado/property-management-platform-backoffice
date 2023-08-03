'use client';

// React imports
import { useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import {
    faCheck,
    faXmark,
    faCircleInfo,
    faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'devextreme-react/tooltip';
import {
    DataGrid as DxDataGrid,
    Column,
    Paging,
    SearchPanel,
    Pager,
    Export,
    Editing,
    HeaderFilter,
    Toolbar,
    Item,
} from 'devextreme-react/data-grid';
import PreviewFileCellRender from '../../../datagrid/PreviewFileCellRender';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import AddRowButton from '@/components/buttons/AddRowButton';

// Local imports
import { Button } from 'pg-components';
import { TokenRes } from '@/lib/types/token';

const ContentTooltip = ({ value }: { value: string }): React.ReactElement => {
    switch (value) {
        case 'BAT':
            return (
                <>
                    <strong>BAT</strong> - Beschränkt abzugsfähige Kosten pro
                    vermieteten Tag
                </>
            );
        case 'BAV':
            return (
                <>
                    <strong>BAV</strong> - Beschränkt abzugsfähige Kosten für
                    das gesamte Jahr
                </>
            );
        case 'UAT':
            return (
                <>
                    <strong>UAT</strong> - Unbeschränkt abzugsfähige Kosten pro
                    vermieteten Tag
                </>
            );
        case 'UAV':
            return (
                <>
                    <strong>UAV</strong> - Unbeschränkt abzugsfähige Kosten für
                    das gesamte Jahr
                </>
            );
        case 'NA':
            return (
                <>
                    <strong>NA</strong> - Nicht abzugsfähige Kosten
                </>
            );
        case 'Aktiv':
            return (
                <>
                    <strong>Aktiv</strong> - Aktivierungspflichtige Kosten
                </>
            );
        default:
            return <></>;
    }
};

const CostTypeCellRender = ({ value, rowIndex }: any): React.ReactElement => (
    <div className='flex gap-2'>
        {value}
        <span id={value + rowIndex}>
            <FontAwesomeIcon
                icon={faCircleInfo}
                className='row-focused-state cursor-pointer text-primary-500'
                size='sm'
            />
        </span>
        <Tooltip
            target={'#' + value + rowIndex}
            showEvent='mouseenter'
            hideEvent='mouseleave'
            position='top'
        >
            <ContentTooltip value={value} />
        </Tooltip>
    </div>
);

const ReverseChargeCellRender = ({ value }: any): React.ReactElement => (
    <FontAwesomeIcon
        icon={value === true ? faCheck : faXmark}
        className='row-focused-state text-primary-500'
    />
);

interface Props {
    dataSource: any[];
    onInvoiceClick: (title: string, url: string) => void;
    params: any;
    id: string;
    token: TokenRes;
}

const DataGrid = ({
    dataSource,
    onInvoiceClick,
    params,
    id,
    token,
}: Props): React.ReactElement => {
    const dataGridRef = useRef<DxDataGrid>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [notAllowEditing, setNotAllowEditing] = useState<boolean>(true);

    const editingMode = () => {
        setIsEditing((prev) => !prev);
        setNotAllowEditing((prev) => !prev);
    };

    const InvoiceCellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <PreviewFileCellRender
                onClick={() => onInvoiceClick(data.invoiceNumber, data.url)}
                url={data.url}
            />
        ),
        [onInvoiceClick]
    );

    return (
        <DxDataGrid
            dataSource={dataSource}
            keyExpr='id'
            showRowLines
            defaultFilterValue={
                params.bp ? ['businessPartner', '=', params.bp] : undefined
            }
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
            showBorders
            ref={dataGridRef}
        >
            <HeaderFilter visible />
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
                mode='batch'
                allowUpdating
                allowAdding
                allowDeleting
                selectTextOnEditStart
                useIcons
                startEditAction={'dblClick'}
            />
            {notAllowEditing === false && (
                <Editing mode='batch' allowUpdating allowAdding allowDeleting />
            )}

            <Toolbar>
                <Item>
                    <AddRowButton
                        href={`/private/accounting/${id}/addApInvoice`}
                    />
                </Item>
                <Item name='saveButton' disabled={notAllowEditing} />
                <Item name='revertButton' disabled={notAllowEditing} />
                <Item>
                    <Button
                        elevated
                        onClick={editingMode}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                allowHeaderFiltering={false}
                caption='Invoice Nr.'
                dataField='id'
                dataType='string'
            />
            <Column
                caption='Date'
                dataField='date'
                dataType='date'
                width={100}
                //@ts-ignore
                format={dateFormat}
            />
            <Column
                caption='Business Partner'
                dataField='businessPartner.name'
                dataType='string'
            />
            <Column
                caption='Netto'
                dataField='netAmount'
                dataType='number'
                format={currencyFormat}
                width={100}
            />
            <Column
                caption='Bruto'
                dataField='grossAmount'
                dataType='number'
                format={currencyFormat}
                width={100}
            />
            <Column
                caption='Service from date'
                dataField='invoiceLines[0].serviceDateFrom'
                dataType='date'
                width={100}
                //@ts-ignore
                format={dateFormat}
            />
            <Column
                caption='Service end date'
                dataField='invoiceLines[0].serviceDateTo'
                dataType='date'
                //@ts-ignore
                format={dateFormat}
                width={100}
            />
            <Column
                caption='Cost type'
                cellRender={CostTypeCellRender}
                dataField='costType'
                dataType='string'
                name='costType'
                width={100}
            />
            <Column
                caption='Category'
                dataField='invoiceLines[0].expenseCategory.name'
                dataType='string'
                width={150}
            />
            <Column
                allowGrouping={false}
                allowHeaderFiltering={false}
                caption='Description'
                dataField='invoiceLines[0].description'
                dataType='string'
            />
            <Column
                alignment='center'
                caption='Reverse Charge'
                cellRender={ReverseChargeCellRender}
                dataField='reverseCharge'
                width={150}
            >
                <HeaderFilter
                    dataSource={[
                        { text: '✓', value: true },
                        { text: '🞩', value: false },
                    ]}
                />
            </Column>
            <Column
                alignment='center'
                allowExporting={false}
                caption='Invoice'
                cellRender={InvoiceCellRender}
                width={100}
            />
        </DxDataGrid>
    );
};

export default DataGrid;
