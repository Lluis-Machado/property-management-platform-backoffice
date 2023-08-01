'use client';
// React imports

// Libraries imports
import {
    faCheck,
    faPencil,
    faTrash,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Editing,
    Lookup,
    Toolbar,
    Item,
} from 'devextreme-react/data-grid';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { apiPatch } from '@/lib/utils/apiPatch';
import { useCallback, useRef, useState } from 'react';
import { TokenRes } from '@/lib/types/token';
import { toast } from 'react-toastify';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { apiDelete } from '@/lib/utils/apiDelete';
import { ContactData } from '@/lib/types/contactData';
import { apiPost } from '@/lib/utils/apiPost';
import { useRouter } from 'next/navigation';
import { Button } from 'pg-components';

interface Props {
    dataSource: OwnershipPropertyData[];
    token: TokenRes;
    contactData: ContactData[];
}
interface idToasts {
    toastId: any;
    msg: string;
    errormsg: string;
}

const PropertiesOwnersDatagrid = ({
    dataSource,
    token,
    contactData,
}: Props) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [notAllowEditing, setNotAllowEditing] = useState<boolean>(true);

    const handleDoubleClick = useCallback(
        ({ data }: any) => {
            console.log(data);
            router.push(`/private/contacts/${data.ownerId}/contactInfo`);
        },
        [router]
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    console.log(dataSource[0]);
    const propertyId: number = dataSource[0].propertyId;

    const saveEditData = useCallback(
        async (e: SavedEvent<OwnershipPropertyData, any>) => {
            const promises: Promise<any>[] = [];
            const idToasts: idToasts[] = [];
            setIsLoading(true);

            for (const change of e.changes) {
                if (change.type == 'update') {
                    const toastId = toast.loading(
                        'Updating ownership property'
                    );
                    const values = change.data;
                    promises.push(
                        apiPatch(
                            `/ownership/ownership`,
                            values,
                            token,
                            'Error while updating a ownership property'
                        )
                    );
                    // console.log('TODO CORRECTO, valores de vuelta: ', data);
                    idToasts.push({
                        toastId: toastId,
                        msg: 'Ownership updated correctly!',
                        errormsg: 'Error while updating a ownership property',
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
                    const { ownerId, share, mainOwnership } = change.data;
                    const ownerType: string = 'Contact';
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
                    //console.log('TODO CORRECTO, contact added');
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
                        //customError(Error, idToasts[index].toastId);
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

    const editingMode = () => {
        setIsEditing((prev) => !prev);
        setNotAllowEditing((prev) => !prev);
    };

    return (
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
            onSaved={saveEditData}
            onRowDblClick={handleDoubleClick}
        >
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={5} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showInfo
                showNavigationButtons
            />
            {notAllowEditing === false && (
                <Editing mode='batch' allowUpdating allowAdding allowDeleting />
            )}
            <Toolbar>
                <Item name='addRowButton' disabled={notAllowEditing} />
                <Item name='saveButton' disabled={notAllowEditing} />
                <Item name='revertButton' disabled={notAllowEditing} />
                <Item>
                    <Button
                        elevated
                        onClick={editingMode}
                        type='button'
                        icon={isEditing ? faXmark : faPencil}
                    />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                dataField='ownerId'
                caption='Full name'
                editCellComponent={OwnerDropdownComponent}
            >
                <Lookup
                    dataSource={contactData}
                    valueExpr='id'
                    displayExpr='firstName'
                />
            </Column>
            <Column
                dataField='share'
                dataType='number'
                caption='Property share (%)'
            />
        </DataGrid>
    );
};

export default PropertiesOwnersDatagrid;
