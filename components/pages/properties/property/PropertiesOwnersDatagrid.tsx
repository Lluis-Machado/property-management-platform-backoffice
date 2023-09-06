'use client';
// React imports
import {
    MutableRefObject,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
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
    Change,
} from 'devextreme-react/data-grid';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { toast } from 'react-toastify';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { apiPatch } from '@/lib/utils/apiPatch';
import { TokenRes } from '@/lib/types/token';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { apiDelete } from '@/lib/utils/apiDelete';
import { ContactData } from '@/lib/types/contactData';
import { apiPost } from '@/lib/utils/apiPost';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import {
    faArrowUpRightFromSquare,
    faCheck,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    dataSource: OwnershipPropertyData[];
    contactlist: any[];
    token: TokenRes;
    contactData: ContactData[];
    isEditing: boolean;
    ref: MutableRefObject<null>;
}
interface idToasts {
    toastId: any;
    msg: string;
    errormsg: string;
}

const PropertiesOwnersDatagrid = forwardRef(
    (
        { dataSource, contactlist, token, contactData, isEditing }: Props,
        ref
    ) => {
        const datagridRef: LegacyRef<DataGrid<OwnershipPropertyData, any>> =
            useRef(null);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        console.log(dataSource);
        const propertyId: number = dataSource[0].propertyId;

        // API CALLS
        useImperativeHandle(ref, () => ({ saveEditData }));

        const saveEditData = () => datagridRef.current!.instance.saveEditData();

        const saveData = useCallback(
            async (e: SavedEvent<OwnershipPropertyData, any>) => {
                const promises: Promise<any>[] = [];
                const idToasts: idToasts[] = [];
                setIsLoading(true);

                for (const change of e.changes) {
                    if (change.type == 'update') {
                        const toastId = toast.loading(
                            'Updating ownership property'
                        );
                        const contactType: any = contactlist?.find(
                            (item) => item.id == change.data.ownerId
                        );

                        const values = {
                            ...change.data,
                            ownerType: contactType.type,
                        };
                        console.log(values);
                        promises.push(
                            apiPatch(
                                `/ownership/ownership`,
                                values,
                                token,
                                'Error while updating a ownership property'
                            )
                        );
                        console.log(
                            'TODO CORRECTO, valores de vuelta: ',
                            values
                        );
                        idToasts.push({
                            toastId: toastId,
                            msg: 'Ownership updated correctly!',
                            errormsg:
                                'Error while updating a ownership property',
                        });
                    } else if (change.type == 'remove') {
                        const toastId = toast.loading(
                            'Updating ownership property'
                        );
                        promises.push(
                            apiDelete(
                                `/ownership/ownership/${change.key}`,
                                token,
                                'Error while deleting an ownership'
                            )
                        );
                        //console.log('TODO CORRECTO, contact deleted');
                        idToasts.push({
                            toastId: toastId,
                            msg: 'Ownership Contact deleted correctly!',
                            errormsg: 'Error while deleting an ownership',
                        });
                    } else if (change.type == 'insert') {
                        const toastId = toast.loading(
                            'Adding contact ownership property'
                        );
                        const contactType: any = contactlist?.find(
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
                        promises.push(
                            apiPost(
                                `/ownership/ownership/`,
                                values,
                                token,
                                'Error while adding contact to property'
                            )
                        );
                        idToasts.push({
                            toastId: toastId,
                            msg: 'Ownership Contact added correctly!',
                            errormsg: 'Error while adding contact to property',
                        });
                    }
                }
                Promise.allSettled(promises).then((results) =>
                    results.forEach((result, index) => {
                        if (result.status == 'fulfilled') {
                            updateSuccessToast(
                                idToasts[index].toastId,
                                idToasts[index].msg
                            );
                        } else if (result.status == 'rejected') {
                            updateErrorToast(
                                idToasts[index].errormsg,
                                idToasts[index].toastId
                            );
                        }
                    })
                );
            },
            [token, propertyId]
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
                                dataSource={contactlist}
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
                        />
                    </DataGrid>
                </div>
                <div className='basis-1/3'></div>
            </div>
        );
    }
);
PropertiesOwnersDatagrid.displayName = 'PropertiesOwnersDatagrid';
export default PropertiesOwnersDatagrid;
