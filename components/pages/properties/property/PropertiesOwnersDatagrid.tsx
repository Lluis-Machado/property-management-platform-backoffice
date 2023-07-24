'use client';
// React imports

// Libraries imports
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    Pager,
    Editing,
    Lookup,
} from 'devextreme-react/data-grid';

// Local imports
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { apiPatch } from '@/lib/utils/apiPatch';
import { useCallback, useState } from 'react';
import { TokenRes } from '@/lib/types/token';
import { toast } from 'react-toastify';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { apiDelete } from '@/lib/utils/apiDelete';
import { ContactData } from '@/lib/types/contactData';
import { apiPost } from '@/lib/utils/apiPost';

interface Props {
    dataSource: OwnershipPropertyData[];
    token: TokenRes;
    contactData: ContactData[];
}
interface Values {
    values: Promise<any>;
    idToast: string;
    message: string;
}

const MainContactCellRender = ({ value }: any): React.ReactElement => (
    <FontAwesomeIcon
        icon={value === true ? faCheck : faXmark}
        className='row-focused-state text-primary-600'
    />
);

const PropertiesOwnersDatagrid = ({
    dataSource,
    token,
    contactData,
}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const propertyId: number = dataSource[0].propertyId;

    const saveEditData = useCallback(
        async (e: SavedEvent<OwnershipPropertyData, any>) => {
            const promises: Promise<any>[] = [];
            const idToasts: any[] = [];
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
                        customError(Error, idToasts[index].toastId);
                    }
                })
            );
        },
        [token, propertyId]
    );

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
        >
            <SearchPanel visible searchVisibleColumnsOnly={false} width={400} />
            <Paging defaultPageSize={5} />
            <Pager
                visible={true}
                displayMode={'compact'}
                showInfo
                showNavigationButtons
            />

            <Editing
                mode='batch'
                allowUpdating
                allowAdding
                allowDeleting
                useIcons
                startEditAction={'dblClick'}
                newRowPosition='first'
            />
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
            <Column
                dataField='mainOwnership'
                dataType='boolean'
                caption='Main Contact Person'
                cellRender={MainContactCellRender}
            />
        </DataGrid>
    );
};

export default PropertiesOwnersDatagrid;
