'use client';

// React imports
import { useCallback, useRef } from 'react';

// Libraries imports
import {
    faCheck,
    faPenToSquare,
    faXmark,
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
    HeaderFilter,
    Toolbar,
    Item,
    MasterDetail,
} from 'devextreme-react/data-grid';
import PreviewFileCellRender from '../../../datagrid/PreviewFileCellRender';
import { RowExpandingEvent } from 'devextreme/ui/data_grid';

// Local imports
import { ApInvoice } from '@/lib/types/apInvoice';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import AddRowButton from '@/components/buttons/AddRowButton';

interface Props {
    dataSource: ApInvoice[];
    onInvoiceClick: (title: string, url: string) => void;
    params: any;
    id: string;
}

// Tooltip
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
        case 'Asset':
            return (
                <>
                    <strong>Asset</strong> - Fixed Asset
                </>
            );
        default:
            return <></>;
    }
};
// Colors Tooltip
const getBadgeColor = (value: string): string => {
    const colors: any = {
        BAT: 'bg-red-300',
        BAV: 'bg-orange-300',
        UAT: 'bg-green-300',
        UAV: 'bg-lime-300',
        NA: 'bg-cyan-300',
        Aktiv: 'bg-purple-300',
        Asset: 'bg-blue-300',
    };
    return colors[value];
};
// Render Category Code with Tooltip & Tooltip Colors
const CostTypeCellRender = ({
    value,
    rowIndex,
    data,
}: {
    value: string;
    rowIndex: number;
    data: any;
}): React.ReactElement => (
    <div className='bg- flex flex-row items-center gap-2 text-center'>
        <span id={value + rowIndex + data.id}>
            <div
                className={`rounded-3xl px-2 py-1 text-center text-xs text-black ${getBadgeColor(
                    value
                )}`}
            >
                {value}
            </div>
        </span>
        <Tooltip
            target={'#' + value + rowIndex + data.id}
            showEvent='mouseenter'
            hideEvent='mouseleave'
            position='top'
        >
            <ContentTooltip value={value} />
        </Tooltip>
    </div>
);
// Reverse charge convirting value in icon
const ReverseChargeCellRender = ({ value }: any): React.ReactElement => (
    <FontAwesomeIcon
        icon={value === true ? faCheck : faXmark}
        className='row-focused-state text-primary-500'
    />
);

const DataGrid = ({
    dataSource,
    onInvoiceClick,
    params,
    id,
}: Props): React.ReactElement => {
    const dataGridRef = useRef<DxDataGrid>(null);
    console.log(dataSource);

    // RENDER INVOICE CELL TO SEE INVOICE
    const InvoiceCellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <PreviewFileCellRender
                onClick={() => onInvoiceClick(data.invoiceNumber, data.url)}
                url={data.url}
            />
        ),
        [onInvoiceClick]
    );

    // RENDER INVOICE EDITING
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <>
                <LinkWithIcon
                    href={`/private/accounting/${id}/expenses/${data.id}editApInvoice`}
                    icon={faPenToSquare}
                />
            </>
        ),
        [id]
    );

    // MASTERDETAIL INVOICELINES
    const DetailSection = ({ data }: any) => {
        return (
            <DxDataGrid
                dataSource={data.data.invoiceLines}
                showBorders={true}
                columnAutoWidth={true}
            >
                <HeaderFilter visible />
                <Column
                    dataField='expenseCategory.name'
                    caption='Category'
                    width={250}
                />
                <Column
                    dataField='expenseCategory.expenseTypeCode'
                    caption='Code'
                    cellRender={CostTypeCellRender}
                    dataType='string'
                />
                <Column dataField='description' allowHeaderFiltering={false} />
                <Column
                    dataField='serviceDateFrom'
                    dataType='date'
                    allowHeaderFiltering={false}
                    //@ts-ignore
                    format={dateFormat}
                />
                <Column
                    dataField='serviceDateTo'
                    dataType='date'
                    allowHeaderFiltering={false}
                    //@ts-ignore
                    format={dateFormat}
                />
                <Column dataField='quantity' allowHeaderFiltering={false} />
                <Column dataField='unitPrice' format={currencyFormat}>
                    <HeaderFilter groupInterval={100} />
                </Column>
                <Column
                    dataField='totalPrice'
                    caption='Total Line Price'
                    format={currencyFormat}
                >
                    <HeaderFilter groupInterval={100} />
                </Column>
            </DxDataGrid>
        );
    };

    // Just opening one masterdetail at a time
    const onRowExpanding = (e: RowExpandingEvent) => {
        e.component.collapseAll(-1);
    };

    return (
        <>
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
                onRowExpanding={onRowExpanding}
            >
                <HeaderFilter visible />
                <Export enabled={true} />
                <SearchPanel
                    visible
                    searchVisibleColumnsOnly={false}
                    width={400}
                />
                <Paging defaultPageSize={10} />
                <Pager
                    visible={true}
                    allowedPageSizes={[10]}
                    showPageSizeSelector
                    displayMode={'compact'}
                    showInfo
                    showNavigationButtons
                />

                <Toolbar>
                    <Item>
                        <AddRowButton
                            href={`/private/accounting/${id}/expenses/addApInvoice`}
                        />
                    </Item>
                    <Item name='searchPanel' />
                </Toolbar>

                <Column
                    allowHeaderFiltering={false}
                    caption='Invoice Nr.'
                    dataField='refNumber'
                    dataType='string'
                    width={100}
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
                >
                    <HeaderFilter groupInterval={100} />
                </Column>
                <Column
                    caption='Bruto'
                    dataField='grossAmount'
                    dataType='number'
                    format={currencyFormat}
                    width={100}
                >
                    <HeaderFilter groupInterval={100} />
                </Column>
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
                <Column
                    alignment='center'
                    caption='Edit'
                    cellRender={CellRender}
                    width={100}
                />
                <MasterDetail enabled={true} component={DetailSection} />
            </DxDataGrid>
        </>
    );
};

export default DataGrid;
