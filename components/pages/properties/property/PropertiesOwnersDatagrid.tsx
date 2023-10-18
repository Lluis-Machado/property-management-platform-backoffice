'use client';
// React imports
import {
    MutableRefObject,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    LegacyRef,
    useState,
    memo,
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
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import DataSource from 'devextreme/data/data_source';
import { apiPost } from '@/lib/utils/apiPost';

export interface PODatagridProps {
    saveEditData: () => Promise<void>;
    hasEditData: () => boolean;
    getDataSource: () => DataSource<OwnershipPropertyData, any>;
}

interface Props {
    dataSource: OwnershipPropertyData[];
    totalContactsList: any[];
    isEditing: boolean;
    ref: MutableRefObject<null>;
}
const PropertiesOwnersDatagrid = forwardRef<PODatagridProps, Props>(
    (props, ref) => {
        const { dataSource, totalContactsList, isEditing } = props;
        const datagridRef: LegacyRef<DataGrid<OwnershipPropertyData, any>> =
            useRef(null);
        const propertyId: number = dataSource[0].propertyId;
        const [initialValues, _] = useState(structuredClone(dataSource));

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

        // Css styles for sum of shares
        const summaryShares = ({ rowType, summaryItems, cellElement }: any) => {
            if (
                rowType === 'totalFooter' &&
                summaryItems[0] &&
                summaryItems[0].column === 'share'
            ) {
                cellElement.querySelector(
                    '.dx-datagrid-summary-item'
                ).style.color =
                    summaryItems[0].value !== 100 ? 'red' : 'rgba(51,51,51,.7)';
            }
        };

        // Function to save changes ownershipsdatagrid
        const saveData = useCallback(
            async (e: SavedEvent<OwnershipPropertyData, any>) => {
                const data: OwnershipPropertyData[] =
                    datagridRef.current?.instance
                        .getDataSource()
                        .items() as OwnershipPropertyData[];
                if (JSON.stringify(data) === JSON.stringify(initialValues))
                    return;

                // Check if shares are not equal to 100. Complexity O(n)
                let sum: number = 0;
                for (const item of data) {
                    sum += item.share;
                    if (sum > 100) {
                        break;
                    }
                }

                if (sum !== 100) return;

                // Check if there are repeated owners. Complexity O(n)
                const ownerIdSet = new Set();
                const duplicateOwners = new Set();

                for (const item of data) {
                    const ownerId = item.ownerId;

                    if (ownerIdSet.has(ownerId)) {
                        duplicateOwners.add(ownerId);
                    } else {
                        ownerIdSet.add(ownerId);
                    }
                }

                const duplicateOwnersArray = Array.from(duplicateOwners);
                if (duplicateOwnersArray.length > 0) return;

                // Get only the ownerships that didn't change
                let dataOwnerships: any[] = [];
                for (const initialValue of initialValues) {
                    const match = data.find(
                        (item) =>
                            JSON.stringify(item) ===
                            JSON.stringify(initialValue)
                    );

                    if (match) {
                        dataOwnerships.push({
                            values: initialValue,
                            operation: 'patch',
                        });
                    }
                }

                // Add the ownerships that did change
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

                const dataToSend = await apiPost(
                    '/api/ownerships',
                    dataOwnerships
                );
                console.log('TODO CORRECTO, valores de vuelta: ', dataToSend);
            },
            [propertyId, totalContactsList, initialValues]
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
                        <Editing
                            mode='batch'
                            allowUpdating={isEditing}
                            allowAdding={isEditing}
                            allowDeleting={isEditing}
                            useIcons
                        />
                        <Toolbar>
                            <Item name='addRowButton' disabled={!isEditing} />
                            <Item name='revertButton' disabled={!isEditing} />
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
                            />
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

export default memo(PropertiesOwnersDatagrid);
