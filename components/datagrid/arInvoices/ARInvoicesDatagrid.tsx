'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { usePathname } from 'next/navigation';
import DataGrid, { Column, Paging, SearchPanel, Pager, Export, Editing } from 'devextreme-react/data-grid';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';

// Local imports

interface Props {
  dataSource: any[];
}

const ARInvoicesDatagrid = ({ dataSource }: Props): React.ReactElement => {
  const pathName = usePathname();

  const getBasePath = useCallback(() => {
    if (!pathName) return undefined;
    let lastIndex = pathName.lastIndexOf('/');
    if (lastIndex !== -1) {
      return pathName.substring(0, lastIndex);
    }
    return pathName;
  }, [pathName])

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
          dataField='net'
          dataType='number'
          caption='Netto'
          format={currencyFormat}
        />
        <Column
          dataField='gross'
          dataType='number'
          caption='Brutto'
          format={currencyFormat}
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
      </DataGrid>
    </div>

  )
}

export default ARInvoicesDatagrid