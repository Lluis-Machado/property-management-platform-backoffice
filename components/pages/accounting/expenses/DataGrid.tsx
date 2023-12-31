'use client';

// React imports
import { useCallback, useEffect, useRef, useState } from 'react';

// Libraries imports
import {
    faCheck,
    faPenToSquare,
    faTrash,
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
import { useRouter } from 'next/navigation';
// Local imports
import { ApInvoice } from '@/lib/types/apInvoice';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import AddRowButton from '@/components/buttons/AddRowButton';
import ConfirmationPopup from '@/components/popups/ConfirmationPopup';
import { toast } from 'react-toastify';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';
import { apiDeleteAccounting } from '@/lib/utils/apiDeleteAccounting';
import { downloadDocument } from '@/lib/utils/documents/apiDocuments';

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
    //////////// States ////////////
    const [invoiceId, setInvoiceId] = useState<string>('');
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [dataGridValues, setDataGridValues] = useState<ApInvoice[]>(
        structuredClone(dataSource)
    );

    //////////// Refs ////////////
    const dataGridRef = useRef<DxDataGrid>(null);
    const masterdetailRef = useRef<DxDataGrid>(null);

    //////////// Custom Hooks ////////////
    const router = useRouter();

    const handleDeleteClick = (data: any) => {
        setDeleteVisible((prev) => !prev);
        setInvoiceId(data.id);
    };

    // Function delete Ap Invoice
    const handleDelete = useCallback(async () => {
        const toastId = toast.loading('Deleting invoice...');
        try {
            await apiDeleteAccounting(
                '/api/accounting/apInvoices',
                id!,
                invoiceId!
            );

            updateSuccessToast(toastId, 'Invoice deleted correctly!');

            // Pass the ID to reload the page
            router.refresh();
        } catch (error: unknown) {
            customError(error, toastId);
        }
    }, [id, invoiceId, router]);

    // useEffect(() => {
    //     addUrl();
    // }, []);

    // //TODO FALTA QUE PASAN EL DOC ID PARA HACER LA LLAMADA CORRECTA PARA CONSEGUIR EL URL
    // const addUrl = useCallback(() => {
    //     let valuesDg: any[] = [];
    //     for (const item of dataSource) {
    //         const archiveId = 'c1b1bacc-7a32-41d2-9dc0-e67afc867d0f';
    //         const docId = '0059cd7e-cf90-4cb6-be13-17fe08cee45e';
    //         const fetchData = async () => {
    //             const url = URL.createObjectURL(
    //                 await downloadDocument(archiveId, docId)
    //             );
    //             return url;
    //         };
    //         fetchData().then((res) => {
    //             item.url = res;
    //         });
    //         valuesDg.push(item);
    //     }
    //     setDataGridValues(valuesDg);
    //     //dataGridRef.current?.instance.option("dataSource", valuesDg);
    // }, [dataSource]);

    // Cell render for preview invoice column
    const InvoiceCellRender = useCallback(
        (data: any) => {
            return (
                <PreviewFileCellRender
                    onClick={() => onInvoiceClick(data.data.id, data.data.url)}
                    url={data.data.url}
                />
            );
        },
        [onInvoiceClick]
    );

    // Cell render for edit column
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <>
                <LinkWithIcon
                    href={`/private/accounting/${id}/expenses/${data.id}/editApInvoice`}
                    icon={faPenToSquare}
                />
            </>
        ),
        [id]
    );

    // Cell render for delete invoice column
    const DeleteCellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <button
                className='cursor-pointer transition-all hover:border-primary-500 hover:shadow-md'
                onClick={() => handleDeleteClick(data)}
            >
                <FontAwesomeIcon
                    icon={faTrash}
                    className='row-focused-state text-primary-500 transition-transform hover:scale-125'
                />
            </button>
        ),
        []
    );

    // function is date from/to are visible in masterdetail
    const visibleDateFromTO = (e: any) => {
        // if (e.rowType === 'data') {
        //     if (e.data.expenseCategory.expenseTypeCode === "BAT" || e.data.expenseCategory.expenseTypeCode === "UAT") {
        //         masterdetailRef.current!.instance.columnOption(
        //             'serviceDateFrom',
        //             'visible',
        //             true
        //         ),
        //         masterdetailRef.current!.instance.columnOption(
        //             'serviceDateTo',
        //             'visible',
        //             true
        //         )
        //     } else {
        //         masterdetailRef.current!.instance.columnOption(
        //             'serviceDateFrom',
        //             'visible',
        //             false
        //         ),
        //         masterdetailRef.current!.instance.columnOption(
        //             'serviceDateTo',
        //             'visible',
        //             false
        //         )
        //         masterdetailRef.current!.instance.refresh();
        //     }
        // }
    };

    // Masterdetail
    const DetailSection = ({ data }: any) => {
        return (
            <DxDataGrid
                dataSource={data.data.invoiceLines}
                showBorders={true}
                keyExpr={'id'}
                columnAutoWidth={true}
                focusedRowEnabled={true}
                autoNavigateToFocusedRow={true}
                onRowPrepared={visibleDateFromTO}
                ref={masterdetailRef}
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
                <Column
                    dataField='description'
                    allowHeaderFiltering={false}
                    width={600}
                />
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
                <Column
                    dataField='tax'
                    allowHeaderFiltering={false}
                    format="#0.##'%'"
                />
                <Column
                    dataField='discount'
                    allowHeaderFiltering={false}
                    format="#0.##'%'"
                />
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
            {/* Popups */}
            <ConfirmationPopup
                message='Are you sure you want to delete this AP Invoice?'
                isVisible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                onConfirm={handleDelete}
            />
            <DxDataGrid
                dataSource={dataGridValues}
                keyExpr='id'
                showRowLines
                showBorders
                defaultFilterValue={
                    params.bp ? ['businessPartner', '=', params.bp] : undefined
                }
                allowColumnResizing
                rowAlternationEnabled
                focusedRowEnabled
                columnHidingEnabled={false}
                columnMinWidth={100}
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
                    alignment='center'
                    caption='Edit'
                    cellRender={CellRender}
                    width={100}
                />
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
                    dataField='businessPartnerName'
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
                {/* <Column
                    alignment='center'
                    allowExporting={false}
                    caption='Invoice'
                    cellRender={InvoiceCellRender}
                    width={100}
                />
                {/* <Column
                    alignment='center'
                    caption='Delete'
                    cellRender={DeleteCellRender}
                    width={100}
                /> */}
                <MasterDetail enabled={true} component={DetailSection} />
            </DxDataGrid>
        </>
    );
};

export default DataGrid;
