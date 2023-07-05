'use client'

// React imports
import { useCallback, useEffect, useRef } from 'react';

// Libraries imports
import { faCheck, faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { Tooltip } from 'devextreme-react/tooltip';
import { DataGrid as DxDataGrid, Column, Paging, SearchPanel, Pager, Export, Editing, HeaderFilter } from 'devextreme-react/data-grid';
import PreviewFileCellRender from '../../../datagrid/PreviewFileCellRender';
import { currencyFormat, dateFormat } from '@/lib/utils/datagrid/customFormats';

// Local imports
import { localeDevExtreme } from '@/lib/utils/datagrid/localeDevExtreme';

const ContentTooltip = ({ value }: { value: string }): React.ReactElement => {
    switch (value) {
        case 'BAT':
            return (<><strong>BAT</strong> - Beschränkt abzugsfähige Kosten pro vermieteten Tag</>);
        case 'BAV':
            return (<><strong>BAV</strong> - Beschränkt abzugsfähige Kosten für das gesamte Jahr</>);
        case 'UAT':
            return (<><strong>UAT</strong> - Unbeschränkt abzugsfähige Kosten pro vermieteten Tag</>);
        case 'UAV':
            return (<><strong>UAV</strong> - Unbeschränkt abzugsfähige Kosten für das gesamte Jahr</>);
        case 'NA':
            return (<><strong>NA</strong> - Nicht abzugsfähige Kosten</>);
        case 'Aktiv':
            return (<><strong>Aktiv</strong> - Aktivierungspflichtige Kosten</>);
        default:
            return <></>
    };
};

const CostTypeCellRender = ({ value, rowIndex }: any): React.ReactElement => (
    <div className='flex gap-2'>
        {value}
        <span id={value + rowIndex}>
            <FontAwesomeIcon
                icon={faCircleInfo}
                className='text-primary-500 row-focused-state cursor-pointer'
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
        className='text-primary-500 row-focused-state'
    />
);

interface Props {
    dataSource: any[];
    onInvoiceClick: (title: string, url: string) => void;
    params: any;
    lang: Locale;
};


const DataGrid = ({ dataSource, onInvoiceClick, params, lang }: Props): React.ReactElement => {
    const dataGridRef = useRef<DxDataGrid>(null);
    const pathName = usePathname();

    useEffect(() => {
        localeDevExtreme(lang)
    }, [lang]);

    const getBasePath = useCallback(() => {
        if (!pathName) return undefined;
        let lastIndex = pathName.lastIndexOf('/');
        if (lastIndex !== -1) {
            return pathName.substring(0, lastIndex);
        }
        return pathName;
    }, [pathName])

    const InvoiceCellRender = useCallback(({ data }: { data: any }): React.ReactElement => (
        <PreviewFileCellRender
            onClick={() => onInvoiceClick(data.invoiceNumber, data.url)}
            url={data.url}
        />
    ), [onInvoiceClick]);

    return (
        <DxDataGrid
            dataSource={dataSource}
            keyExpr='id'
            showRowLines
            defaultFilterValue={params.bp ? ['businessPartner', '=', params.bp] : undefined}
            allowColumnResizing
            rowAlternationEnabled
            focusedRowEnabled
            columnHidingEnabled={false}
            columnMinWidth={100}
            height={'85vh'}
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
                mode="batch"
                allowUpdating
                allowAdding
                allowDeleting
                selectTextOnEditStart
                useIcons
                startEditAction={'dblClick'}
            />

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
                        { text: '🞩', value: false }
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
    )
}

export default DataGrid