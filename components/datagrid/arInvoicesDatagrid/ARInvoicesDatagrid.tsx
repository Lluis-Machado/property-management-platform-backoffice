'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { usePathname } from 'next/navigation';
import { Invoice } from '@/lib/types/invoices';
import DataGrid, { Column, Paging, SearchPanel, Pager, Export, Editing, HeaderFilter } from 'devextreme-react/data-grid';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import PreviewFileCellRender from '../PreviewFileCellRender';
import { Locale } from '@/i18n-config';

// Local imports

interface Props {
  dataSource: Invoice[];
  onInvoiceClick: (title: string, url: string) => void;
  lang: Locale;
}

const ARInvoicesDatagrid = ({ dataSource, onInvoiceClick, lang }: Props): React.ReactElement => {
  const pathName = usePathname();

  const getBasePath = useCallback(() => {
    if (!pathName) return undefined;
    let lastIndex = pathName.lastIndexOf('/');
    if (lastIndex !== -1) {
      return pathName.substring(0, lastIndex);
    }
    return pathName;
  }, [pathName])

  const InvoiceCellRender = useCallback(({ row }: any): React.ReactElement => (
    <PreviewFileCellRender
      onClick={() => onInvoiceClick(row.data.invoiceNumber, row.data.url)}
      url={row.data.url}
    />
  ), [onInvoiceClick]);

  return (
    <div className='mx-2'>
      <DataGrid
        dataSource={dataSource}
        keyExpr='invoiceNumber'
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
          mode="batch"
          allowUpdating
          allowAdding
          allowDeleting
          selectTextOnEditStart
          useIcons
          startEditAction={'dblClick'}
        />

        <Column
          dataField='invoiceNumber'
          dataType='string'
          caption='Invoice Number'
        />
        <Column
          dataField='date'
          dataType='date'
          caption='Date'
          //@ts-ignore
          format={dateFormat}
        />
        <Column
          dataField='serviceFromDate'
          dataType='date'
          caption='Service from date'
          //@ts-ignore
          format={dateFormat}
        />
        <Column
          dataField='serviceEndDate'
          dataType='date'
          caption='Service end date'
          //@ts-ignore
          format={dateFormat}
        />
        <Column
          dataField='net'
          dataType='number'
          caption='Netto'
          format={currencyFormat}
        >
          <HeaderFilter groupInterval={1000} />
        </Column>
        <Column
          dataField='gross'
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
    </div>

  )
}

export default ARInvoicesDatagrid