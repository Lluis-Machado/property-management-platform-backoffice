'use client';
// React imports
import { memo, useEffect, useState } from 'react';

// Libraries imports
import DataGrid, {
    Column,
    Scrolling,
    SearchPanel,
    Selection,
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const OwnerDropdownComponent = (props: any) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([
        props.data.value,
    ]);
    const [isDropDownOpened, setIsDropDownOpened] = useState<boolean>(false);

    useEffect(() => {
        if (props.data.value) setSelectedRowKeys([props.data.value]);
    }, [props.data.value]);

    const handleSelectionChange = (e: any) => {
        if (!e.selectedRowKeys) return;
        setSelectedRowKeys(e.selectedRowKeys);
        setIsDropDownOpened(false);
        props.data.setValue(e.selectedRowKeys[0]);
    };

    const handleOptionChange = (e: any) => {
        if (e.name === 'opened') setIsDropDownOpened(e.value);
    };

    const contentRender = () => (
        <DataGrid
            dataSource={props.data.column.lookup.dataSource}
            keyExpr='id'
            remoteOperations
            height={250}
            defaultFocusedRowKey={selectedRowKeys[0]}
            selectedRowKeys={selectedRowKeys}
            focusedRowEnabled
            hoverStateEnabled
            onSelectionChanged={handleSelectionChange}
        >
            <SearchPanel visible />
            <Column dataField='firstName' caption='Full name' />
            <Column dataField='nif' caption='Nif' />
            <Column dataField='email' caption='Email' />
            <Scrolling mode='virtual' />
            <Selection mode='single' />
        </DataGrid>
    );

    return (
        <DropDownBox
            dataSource={props.data.column.lookup.dataSource}
            value={selectedRowKeys[0]}
            displayExpr='firstName'
            valueExpr='id'
            opened={isDropDownOpened}
            contentRender={contentRender}
            onOptionChanged={handleOptionChange}
        />
    );
};

export default memo(OwnerDropdownComponent);
