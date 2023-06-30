// React imports
import { useCallback } from 'react';

// Libraries imports
import { Button } from 'pg-components';
import { DataGrid, Column, Summary, TotalItem } from 'devextreme-react/data-grid';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Popup as DxPopup, Position } from 'devextreme-react/popup';

interface PopupProps {
    data: any;
    isVisible: boolean;
    onClose: () => void;
    onShown: () => void;
};

const Popup = ({ data, isVisible, onClose, onShown }: PopupProps) => {
    const contentRender = useCallback(() => (
        <PopupDatagrid dataSource={data.depreciation} />
    ), [data.depreciation]);

    const titleComponent = useCallback(() => (
        <HeaderPopup title={data.name + ' Depreciations'} onClose={onClose} />
    ), [data.name, onClose]);

    return (
        <DxPopup
            contentRender={contentRender}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick
            onHiding={onClose}
            onShown={onShown}
            titleComponent={titleComponent}
            visible={isVisible}
            width='50vw'
        >
            <Position of='#content' />
        </DxPopup>
    );
};

export default Popup;

interface PopupHeaderProps {
    title: string;
    onClose: () => void;
};

const HeaderPopup = ({ title, onClose }: PopupHeaderProps) => (
    <div className='flex justify-between'>
        <div className='flex font-bold text-2xl text-secondary-500 justify-center items-center'>
            {title}
        </div>
        <div className='w-12'>
            <Button icon={faXmark} size={'base'} onClick={onClose} style={'outline'} />
        </div>
    </div>
);

interface PopupDatagridProps {
    dataSource: any;
};

const PopupDatagrid = ({ dataSource }: PopupDatagridProps) => (
    <DataGrid
        dataSource={dataSource}
        columnAutoWidth
        rowAlternationEnabled
    >
        <Column
            dataField='monthOfYear'
            caption='Month'
            dataType='number'
            alignment="left"
        />
        <Column
            dataField='numberOfRentalDays'
            caption='Rental days'
            dataType='number'
            alignment="left"
        />
        <Column
            dataField='accumulatedDepreciation'
            caption='Accumulated depreciation'
            alignment="left"
            format={{ type: 'currency', currency: 'EUR', precision: 2 }}
        />
        <Summary>
            <TotalItem
                column="numberOfRentalDays"
                summaryType="sum" />
            <TotalItem
                column="accumulatedDepreciation"
                summaryType="sum"
                valueFormat={{ type: 'currency', currency: 'EUR', precision: 2 }} />
        </Summary>
    </DataGrid>
);