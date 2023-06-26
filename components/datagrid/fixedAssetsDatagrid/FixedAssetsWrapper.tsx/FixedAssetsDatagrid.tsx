'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import DataGrid, { Column, Paging, SearchPanel, HeaderFilter, Pager, Export, Editing } from 'devextreme-react/data-grid';
import { Locale } from '@/i18n-config';


// Local imports
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';
import PreviewFileCellRender from '../../PreviewFileCellRender';

interface Props {
    dataSource: any[];
    onDepreciationClick: (name: string, depreciation: []) => void;
    onInvoiceClick: (title: string, url: string) => void;
    selectedProperty: string;
    lang: Locale
};

const FixedAssetsDatagrid = ({
    dataSource,
    onDepreciationClick,
    onInvoiceClick,
    selectedProperty,
    lang
}: Props): React.ReactElement => {
    const pathName = usePathname();


    const DepreciationsCellRender = useCallback(({ row }: any): React.ReactElement => (
        <div
            onClick={() => onDepreciationClick(row.data.name, row.data.depreciation)}
            className='cursor-pointer text-primary-500 row-focused-state md:hover:scale-125 md:transition-transform'
        >
            <FontAwesomeIcon icon={faCircleInfo} />
        </div>
    ), [onDepreciationClick]);

    const InvoiceCellRender = useCallback(({ data }: { data: any }): React.ReactElement => (
        <PreviewFileCellRender
            onClick={() => onInvoiceClick(data.name, data.url)}
            url={data.url}
        />
    ), [onInvoiceClick]);

    return (
        <>
            <DataGrid
                dataSource={dataSource}
                keyExpr='ID'
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
                <Paging defaultPageSize={18} />
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
                    caption='Name'
                    dataField='name'
                    dataType='string'
                    width={250}
                />
                <Column
                    caption='Activation Date'
                    dataField='activationDate'
                    dataType='date'
                    //@ts-ignore
                    format={dateFormat}
                />
                <Column
                    caption='Depreciation Type'
                    dataField='depreciationType'
                    dataType='number'
                    format={{ type: 'percent', precision: 2 }}
                    width={160}
                >
                    <HeaderFilter groupInterval={0.05} />
                </Column>
                <Column
                    caption='NBV At Start Date'
                    dataField='NBVAtStartDate'
                    dataType='number'
                    format={currencyFormat}
                />
                <Column
                    caption='Activation Value'
                    dataField='activationValue'
                    dataType='number'
                    format={currencyFormat}
                >
                    <HeaderFilter groupInterval={10000} />
                </Column>
                <Column
                    caption='Acc. Depreciation'
                    dataField='accumulatedDepreciation'
                    dataType='number'
                    format={currencyFormat}
                >
                    <HeaderFilter groupInterval={10000} />
                </Column>
                <Column
                    alignment='center'
                    caption='Depreciations'
                    cellRender={DepreciationsCellRender}
                    width={100}
                />
                <Column
                    alignment='center'
                    caption='Invoice'
                    cellRender={InvoiceCellRender}
                    width={100}
                />
            </DataGrid>
        </>
    )
}

export default FixedAssetsDatagrid