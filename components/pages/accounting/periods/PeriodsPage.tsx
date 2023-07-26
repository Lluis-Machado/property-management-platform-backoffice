'use client';

// React imports
import { useCallback, useState } from 'react';
// Libraries imports
import { toast } from 'react-toastify';
import DataGrid, { Column, Editing, Pager } from 'devextreme-react/data-grid';
// Local imports
import { PeriodsData } from '@/lib/types/periodsData';
import { TokenRes } from '@/lib/types/token';
import { apiPatch } from '@/lib/utils/apiPatch';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { apiDelete } from '@/lib/utils/apiDelete';
import { apiPost } from '@/lib/utils/apiPost';
import { updateErrorToast, updateSuccessToast } from '@/lib/utils/customToasts';

interface Props {
    data: PeriodsData[];
    token: TokenRes;
    id: string;
}
interface idToasts {
    toastId: any;
    msg: string;
    errormsg: string;
}
const StatusCellRender = ({ value }: any): React.ReactElement =>
    value === 0 ? (
        <div className='text-green-500'>Open</div>
    ) : (
        <div className='text-red-500'>Closed</div>
    );

const PeriodsPage = ({ data, token, id }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    console.log(id);

    const saveEditData = useCallback(
        async (e: SavedEvent<PeriodsData, any>) => {
            const promises: Promise<any>[] = [];
            const idToasts: idToasts[] = [];
            setIsLoading(true);
            console.log(e.changes);
            for (const change of e.changes) {
                if (change.type == 'update') {
                    const toastId = toast.loading('Updating ownership period');
                    const values = change.data;
                    promises.push(
                        apiPatch(
                            `/accounting/tenants/${id}/periods/${change.key}`,
                            values,
                            token,
                            'Error while updating a period'
                        )
                    );
                    idToasts.push({
                        toastId: toastId,
                        msg: 'Period updated correctly!',
                        errormsg: 'Error while updating a period',
                    });
                } else if (change.type == 'remove') {
                    const toastId = toast.loading('Deleting a period');
                    promises.push(
                        apiDelete(
                            `/accounting/tenants/${id}/periods/${change.key}`,
                            token,
                            'Error while deleting an period'
                        )
                    );
                    idToasts.push({
                        toastId: toastId,
                        msg: 'Period deleted correctly!',
                        errormsg: 'Error while deleting an period',
                    });
                } else if (change.type == 'insert') {
                    const toastId = toast.loading('Adding period');

                    const values = {
                        year: change.data.year,
                        month: change.data.month,
                        status: 0,
                    };
                    promises.push(
                        apiPost(
                            `/accounting/tenants/${id}/periods`,
                            values,
                            token,
                            'Error while adding period'
                        )
                    );
                    idToasts.push({
                        toastId: toastId,
                        msg: 'Period added correctly!',
                        errormsg: 'Error while adding period',
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
        [token, id]
    );
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
        >
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Editing mode='batch' allowDeleting allowAdding allowUpdating />
            <Column caption='Year' dataField='year' dataType='string' />
            <Column caption='Month' dataField='month' dataType='string' />
            <Column
                dataField='status'
                dataType='number'
                caption='Status'
                cellRender={StatusCellRender}
            />
        </DataGrid>
    );
};
//stage.plattesapis.net/accounting//tenants/d7b51345-1e9d-4470-ab51-b0a76b380ff5/periods?includeDeleted=false 404
https: 'https://stage.plattesapis.net/accounting/tenants/d7b51345-1e9d-4470-ab51-b0a76b380ff5/periods?includeDeleted=false';
export default PeriodsPage;
