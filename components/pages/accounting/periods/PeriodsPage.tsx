'use client';

// React imports
import { useCallback, useState } from 'react';
// Libraries imports
import { toast } from 'react-toastify';
import DataGrid, {
    Column,
    Editing,
    Lookup,
    Pager,
    HeaderFilter,
} from 'devextreme-react/data-grid';
import { SavedEvent } from 'devextreme/ui/data_grid';

// Local imports
import { PeriodsData } from '@/lib/types/periodsData';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';
import { idToasts } from '@/lib/types/toastid';
interface Props {
    data: PeriodsData[];
    id: string;
}
interface Items {
    label: string;
    value: number;
}
const StatusCellRender = ({ value }: any): React.ReactElement =>
    value === 1 ? (
        <div className='text-red-500'>Closed</div>
    ) : (
        <div className='text-green-700'>Open</div>
    );

const PeriodsPage = ({ data, id }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const items: Items[] = [
        { label: 'Open', value: 0 },
        { label: 'Closed', value: 1 },
    ];

    const saveEditData = useCallback(
        async (e: SavedEvent<PeriodsData, any>) => {
            const promises: Promise<any>[] = [];
            const idToasts: idToasts[] = [];
            setIsLoading(true);
            for (const change of e.changes) {
                if (change.type == 'update') {
                    const toastId = toast.loading('Updating ownership period');
                    const { tenantId, id, status } = change.data;
                    const values = {
                        tenantId,
                        id,
                        status,
                    };
                    throw new Error('API call not implemented');
                    // promises.push(
                    //     apiPatch(
                    //         `/accounting/tenants/${tenantId}/periods/${id}?Status=${status}`,
                    //         values,
                    //         token,
                    //         'Error while updating a period'
                    //     )
                    // );
                    // idToasts.push({
                    //     toastId: toastId,
                    //     msg: 'Period updated correctly!',
                    //     errormsg: 'Error while updating a period',
                    // });
                } else if (change.type == 'remove') {
                    const toastId = toast.loading('Deleting a period');
                    throw new Error('API call not implemented');
                    // promises.push(
                    //     apiDelete(
                    //         `/accounting/tenants/${id}/periods/${change.key}`,
                    //         token,
                    //         'Error while deleting an period'
                    //     )
                    // );
                    // idToasts.push({
                    //     toastId: toastId,
                    //     msg: 'Period deleted correctly!',
                    //     errormsg: 'Error while deleting an period',
                    // });
                } else if (change.type == 'insert') {
                    const toastId = toast.loading('Adding period');
                    const values = {
                        year: change.data.year,
                        month: change.data.month,
                        status: 0,
                    };
                    throw new Error('API call not implemented');
                    // promises.push(
                    //     apiPost(
                    //         `/accounting/tenants/${id}/periods`,
                    //         values,
                    //         token,
                    //         'Error while adding period'
                    //     )
                    // );
                    // idToasts.push({
                    //     toastId: toastId,
                    //     msg: 'Period added correctly!',
                    //     errormsg: 'Error while adding period',
                    // });
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
        [id]
    );
    const onEditorPreparing = (e: any) => {
        if (e.parentType === 'dataRow' && e.dataField !== 'status') {
            e.row.isNewRow
                ? (e.editorOptions.disabled = false)
                : (e.editorOptions.disabled = true);
        }
    };

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={data}
            focusedRowEnabled
            keyExpr='id'
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
            onSaved={saveEditData}
            onEditorPreparing={onEditorPreparing}
        >
            <HeaderFilter visible />

            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Editing mode='batch' allowDeleting allowAdding allowUpdating />
            <Column
                caption='Year'
                dataField='year'
                dataType='string'
                allowSorting
            />
            <Column caption='Month' dataField='month' dataType='string' />
            <Column
                dataField='status'
                dataType='number'
                caption='Status'
                allowEditing
                cellRender={StatusCellRender}
                allowFiltering={false}
            >
                <Lookup
                    dataSource={items}
                    valueExpr='value'
                    displayExpr='label'
                />
            </Column>
        </DataGrid>
    );
};
export default PeriodsPage;
