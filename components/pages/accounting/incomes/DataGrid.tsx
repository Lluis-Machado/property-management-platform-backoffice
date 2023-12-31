'use client';

// React imports
import { useCallback, memo } from 'react';

// Libraries imports
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Export,
    Editing,
    HeaderFilter,
} from 'devextreme-react/data-grid';

// Local imports
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import PreviewFileCellRender from '@/components/datagrid/PreviewFileCellRender';
import { Invoice } from '@/lib/types/invoices';
import { Locale } from '@/i18n-config';

interface Props {
    dataSource: Invoice[];
    onInvoiceClick: (title: string, url: string) => void;
    lang: Locale;
}

const ARDataGrid = ({
    dataSource,
    onInvoiceClick,
    lang,
}: Props): React.ReactElement => {
    const InvoiceCellRender = useCallback(
        ({ row }: any): React.ReactElement => (
            <PreviewFileCellRender
                onClick={() =>
                    onInvoiceClick(row.data.invoiceNumber, row.data.url)
                }
                url={row.data.url}
            />
        ),
        [onInvoiceClick]
    );

    return (
        <DataGrid
            dataSource={dataSource}
            keyExpr='id'
            showRowLines
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
            height={'85vh'}
            showBorders
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

            <Column dataField='id' dataType='string' caption='Invoice Number' />
            <Column
                dataField='date'
                dataType='date'
                caption='Date'
                width={150}
                //@ts-ignore
                format={dateFormat}
            />
            <Column
                dataField='invoiceLines[0].serviceDateFrom'
                dataType='date'
                caption='Service from date'
                //@ts-ignore
                format={dateFormat}
            />
            <Column
                dataField='invoiceLines[0].serviceDateTo'
                dataType='date'
                caption='Service end date'
                //@ts-ignore
                format={dateFormat}
            />
            <Column
                dataField='netAmount'
                dataType='number'
                caption='Netto'
                format={currencyFormat}
            >
                <HeaderFilter groupInterval={1000} />
            </Column>
            <Column
                dataField='grossAmount'
                dataType='number'
                caption='Brutto'
                format={currencyFormat}
            >
                <HeaderFilter groupInterval={1000} />
            </Column>
            <Column
                alignment='center'
                allowExporting={false}
                caption='Invoice'
                cellRender={InvoiceCellRender}
                width={120}
            />
        </DataGrid>
    );
};

export default memo(ARDataGrid);
