'use client';
// React imports
import {
    MutableRefObject,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    LegacyRef,
} from 'react';
// Libraries imports
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Editing,
    Lookup,
    Toolbar,
    Item,
    Summary,
    TotalItem,
} from 'devextreme-react/data-grid';
import { SavedEvent } from 'devextreme/ui/data_grid';
import {
    faArrowUpRightFromSquare,
    faCheck,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { TokenRes } from '@/lib/types/token';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { apiPost } from '@/lib/utils/apiPost';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { customError } from '@/lib/utils/customError';

interface Props {
    dataSource: OwnershipPropertyData[];
    totalContactsList: any[];
    token: TokenRes;
    isEditing: boolean;
    ref: MutableRefObject<null>;
}

const PropertiesOwnersDatagrid = forwardRef(
    ({ dataSource, totalContactsList, token, isEditing }: Props, ref) => {
        const datagridRef: LegacyRef<DataGrid<OwnershipPropertyData, any>> =
            useRef(null);
        const propertyId: number = dataSource[0].propertyId;
        const initialValues = structuredClone(dataSource);

        // API CALLS
        useImperativeHandle(ref, () => ({
            saveEditData,
            hasEditData,
            getDataSource,
        }));

        // METHODS DATAGRID
        const saveEditData = () => datagridRef.current!.instance.saveEditData();
        const hasEditData = () => datagridRef.current!.instance.hasEditData();
        const getDataSource = () =>
            datagridRef.current!.instance.getDataSource();

        //Filter Owners
        let idArray: any[] = [];
        for (const ownership of dataSource) {
            idArray.push(ownership.ownerId);
        }

        // CSS FOR SUMMARY SHARES
        const summaryShares = (e: any) => {
            if (e.rowType == 'totalFooter') {
                if (e.summaryItems[0]?.column == 'share') {
                    if (e.summaryItems[0]?.value !== 100) {
                        e.cellElement.querySelector(
                            '.dx-datagrid-summary-item'
                        ).style.color = 'red';
                    } else {
                        e.cellElement.querySelector(
                            '.dx-datagrid-summary-item'
                        ).style.color = 'rgba(51,51,51,.7)';
                    }
                }
            }
        };

        // FUNCTION TO SAVE THE CHANGES OWNERSHIPS
        const saveData = useCallback(
            async (e: SavedEvent<OwnershipPropertyData, any>) => {
                let dataOwnerships: any[] = [];
                const dataSource: any =
                    datagridRef.current?.instance.getDataSource();
                const data = dataSource._store._array;

                if (JSON.stringify(data) === JSON.stringify(initialValues)) {
                    return;
                }

                // LOGIC SUM OF SHARES
                let sum: number = 0;
                let array: number[] = [];
                for (const item of data) {
                    array.push(item.share);
                    sum = array.reduce((sum: number, p: number) => sum + p);
                }

                if (sum !== 100) {
                    return;
                }

                // not able to put owner 2 times in datagrid
                const values = data.map((object: any) => object.ownerId);
                if (
                    values.some(
                        (object: any, index: any) =>
                            values.indexOf(object) !== index
                    )
                ) {
                    return;
                }

                // SAVE OWNERSHIP WITHOUT CHANGES
                for (const initialValue of initialValues) {
                    for (let i = 0; i < data.length; i++) {
                        if (
                            initialValue.share === data[i].share &&
                            initialValue.deleted === data[i].deleted &&
                            initialValue.mainOwnership === data[i].mainOwnership
                        ) {
                            dataOwnerships.push({
                                values: initialValue,
                                operation: 'patch',
                            });
                        }
                    }
                }

                // LOOP OVER CHANGES IN DATAGRID BY TYPE OF CHANGE
                for (const change of e.changes) {
                    if (change.type == 'update') {
                        const contactType: any = totalContactsList?.find(
                            (item) => item.id == change.data.ownerId
                        );
                        const values = {
                            ...change.data,
                            ownerType: contactType.type,
                        };
                        const objectArray = {
                            values: values,
                            operation: 'patch',
                        };
                        dataOwnerships.push(objectArray);
                    } else if (change.type == 'remove') {
                        const values = {
                            id: change.key,
                        };

                        const objectArray = {
                            values: values,
                            operation: 'delete',
                        };
                        dataOwnerships.push(objectArray);
                    } else if (change.type == 'insert') {
                        const contactType: any = totalContactsList?.find(
                            (item) => item.id == change.data.ownerId
                        );

                        const ownerType: string = contactType.type;
                        if (!change.data.mainOwnership) {
                            change.data.mainOwnership = false;
                        }
                        const { ownerId, share, mainOwnership } = change.data;
                        const values = {
                            propertyId,
                            ownerId,
                            ownerType,
                            share,
                            mainOwnership,
                        };

                        const objectArray = {
                            values: values,
                            operation: 'post',
                        };
                        dataOwnerships.push(objectArray);
                    }
                }
                // Check if there are more than one main ownership
                let duplicatesMainOwnerShips: any[] = [];
                dataOwnerships.forEach((item) => {
                    if (item.values.mainOwnership === true) {
                        duplicatesMainOwnerShips.push(item);
                    }
                });
                if (duplicatesMainOwnerShips.length != 1) {
                    return;
                }
                console.log(dataOwnerships);
                // API CALL
                try {
                    await apiPost(
                        '/ownership/ownership/ownerships',
                        dataOwnerships,
                        token,
                        'Error while updating ownerships'
                    );
                } catch (error: unknown) {
                    customError(error, 'ownership call');
                }
            },
            [token, propertyId, totalContactsList, initialValues]
        );

        // LINK TO GO TO CONTACT/ COMPANY PAGE
        const CellRender = useCallback(
            ({ data }: { data: any }) => (
                <LinkWithIcon
                    href={
                        data.ownerType === 'Contact'
                            ? `/private/contacts/${data.ownerId}/contactInfo`
                            : `/private/companies/${data.ownerId}/companyInfo`
                    }
                    icon={faArrowUpRightFromSquare}
                />
            ),
            []
        );

        //CELL RENDER FOR MAIN OWNER COLUMN
        const MainOwnerCellRender = ({ value }: any): React.ReactElement => (
            <FontAwesomeIcon
                icon={value === true ? faCheck : faXmark}
                className='row-focused-state text-primary-500'
            />
        );

        return (
            <div className='flex'>
                <div className='basis-2/3'>
                    <DataGrid
                        dataSource={dataSource}
                        keyExpr='id'
                        showRowLines
                        showBorders
                        allowColumnResizing
                        rowAlternationEnabled
                        focusedRowEnabled
                        columnHidingEnabled={false}
                        columnMinWidth={100}
                        onSaved={saveData}
                        ref={datagridRef}
                        onCellPrepared={summaryShares}
                    >
                        <SearchPanel
                            visible
                            searchVisibleColumnsOnly={false}
                            width={400}
                        />
                        <Paging defaultPageSize={5} />
                        <Pager
                            visible={true}
                            displayMode={'compact'}
                            showInfo
                            showNavigationButtons
                        />
                        {isEditing === true && (
                            <Editing
                                mode='batch'
                                allowUpdating
                                allowAdding
                                allowDeleting
                                useIcons
                            />
                        )}
                        <Toolbar>
                            <Item
                                name='addRowButton'
                                disabled={isEditing === false}
                            />
                            <Item
                                name='revertButton'
                                disabled={isEditing === false}
                            />
                        </Toolbar>
                        <Column
                            alignment='center'
                            caption='Details'
                            cellRender={CellRender}
                            width={100}
                        />
                        <Column
                            dataField='ownerId'
                            caption='Full name'
                            editCellComponent={OwnerDropdownComponent}
                        >
                            <Lookup
                                dataSource={totalContactsList}
                                valueExpr='id'
                                displayExpr='firstName'
                            ></Lookup>
                        </Column>
                        <Column
                            dataField='share'
                            dataType='number'
                            caption='Property share (%)'
                        />
                        <Column
                            alignment='center'
                            dataField='mainOwnership'
                            caption='Main owner'
                            cellRender={MainOwnerCellRender}
                            width={100}
                        >
                            <Lookup
                                dataSource={[
                                    {
                                        value: true,
                                        label: '\u2713',
                                    },
                                    {
                                        value: false,
                                        label: '\u2715',
                                    },
                                ]}
                                valueExpr='value'
                                displayExpr='label'
                            />
                        </Column>
                        <Summary>
                            <TotalItem
                                column='share'
                                summaryType='sum'
                                displayFormat='{0}'
                            />
                        </Summary>
                    </DataGrid>
                </div>
                <div className='basis-1/3'></div>
            </div>
        );
    }
);
PropertiesOwnersDatagrid.displayName = 'PropertiesOwnersDatagrid';
export default PropertiesOwnersDatagrid;
