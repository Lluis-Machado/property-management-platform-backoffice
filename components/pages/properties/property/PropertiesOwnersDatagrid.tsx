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
import { SelectData } from '@/lib/types/selectData';
import { apiPatch } from '@/lib/utils/apiPatch';
import { useCallback, useState } from 'react';
import { TokenRes } from '@/lib/types/token';
import { toast } from 'react-toastify';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';
import { OwnershipPropertyData } from '@/lib/types/ownershipProperty';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { apiDelete } from '@/lib/utils/apiDelete';

interface Props {
    dataSource: OwnershipPropertyData[];
    token: TokenRes;
    contactData: SelectData[];
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

    const saveEditData = useCallback(
        async (e: SavedEvent<OwnershipPropertyData, any>) => {
            console.log(e);
            const toastId = toast.loading('Updating ownership property');
            e.changes.map((change) => {
                if ((change.type = 'update')) {
                    const values = change.data;
                    try {
                        const data = apiPatch(
                            `/ownership/ownership`,
                            values,
                            token,
                            'Error while updating a ownership property'
                        );

                        console.log('TODO CORRECTO, valores de vuelta: ', data);
                        updateSuccessToast(
                            toastId,
                            'Ownership updated correctly!'
                        );
                    } catch (error: unknown) {
                        customError(error, toastId);
                    } finally {
                        setIsLoading(false);
                    }
                } else if ((change.type = 'remove')) {
                    try {
                        apiDelete(
                            `/ownership/ownership/${change.key}`,
                            token,
                            'Error while deleting an ownership'
                        );

                        console.log('TODO CORRECTO, contact deleted');
                        updateSuccessToast(
                            toastId,
                            'Ownership Contact deleted correctly!'
                        );
                    } catch (error: unknown) {
                        customError(error, toastId);
                    } finally {
                        setIsLoading(false);
                    }
                }
            });
        },
        [token]
    );

    return (
        <DataGrid
            dataSource={dataSource}
            keyExpr='ownerId'
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
                    valueExpr='value'
                    displayExpr='label'
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
