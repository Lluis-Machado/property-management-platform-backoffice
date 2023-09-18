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
import { toast } from 'react-toastify';
import {
    faArrowUpRightFromSquare,
    faCheck,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { TokenRes } from '@/lib/types/token';
import { updateSuccessToast } from '@/lib/utils/customToasts';
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

        // API CALLS
        useImperativeHandle(ref, () => ({
            saveEditData,
            hasEditData,
            getDataSource,
        }));

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
        const saveData = useCallback(
            async (e: SavedEvent<OwnershipPropertyData, any>) => {
                let valuesArray: any[] = [];

                // LOGIC SUM OF SHARES
                const dataSource: any =
                    datagridRef.current?.instance.getDataSource();
                const data = dataSource._store._array;
                let sum: number = 0;
                let array: number[] = [];
                for (const item of data) {
                    array.push(item.share);
                    sum = array.reduce((sum: number, p: number) => sum + p);
                }

                if (sum !== 100) {
                    return;
                }
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
                        valuesArray.push(objectArray);
                    } else if (change.type == 'remove') {
                        const values = {
                            id: change.key,
                        };

                        const objectArray = {
                            values: values,
                            operation: 'delete',
                        };
                        valuesArray.push(objectArray);
                    } else if (change.type == 'insert') {
                        const contactType: any = totalContactsList?.find(
                            (item) => item.id == change.data.ownerId
                        );
                        const { ownerId, share, mainOwnership } = change.data;
                        const ownerType: string = contactType.type;
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
                        valuesArray.push(objectArray);
                    }
                    const toastId = toast.loading(
                        'Updating ownership property'
                    );
                    try {
                        await apiPost(
                            '/ownership/ownership/ownerships',
                            valuesArray,
                            token,
                            'Error while updating ownerships'
                        );
                        updateSuccessToast(
                            toastId,
                            'Ownerships updated correctly!'
                        );
                    } catch (error: unknown) {
                        customError(error, toastId);
                    }
                }
            },
            [token, propertyId, totalContactsList]
        );
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
                        />
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
