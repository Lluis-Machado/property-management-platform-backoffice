import {
    LegacyRef,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from 'react';
import DataGrid, {
    Column,
    Editing,
    Item,
    Lookup,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import { UserRoles } from '@/lib/types/user';
import { SavedEvent } from 'devextreme/ui/data_grid';
import { apiPost } from '@/lib/utils/apiPost';
import { apiDelete } from '@/lib/utils/apiDelete';

export interface RolesDatagridProps {
    saveEditData: () => Promise<void>;
    hasEditData: () => boolean;
}

interface Props {
    userId: string;
    userRoles: UserRoles[];
    roles: UserRoles[];
    isEditing: boolean;
}

const RolesDataGrid = forwardRef<RolesDatagridProps, Props>((props, ref) => {
    const { userId, userRoles, roles, isEditing } = props;
    const datagridRef: LegacyRef<DataGrid<UserRoles, any>> = useRef(null);

    useImperativeHandle(ref, () => ({
        saveEditData,
        hasEditData,
    }));

    // METHODS DATAGRID
    const saveEditData = () => datagridRef.current!.instance.saveEditData();
    const hasEditData = () => datagridRef.current!.instance.hasEditData();

    const saveData = useCallback(async (e: SavedEvent<UserRoles, any>) => {
        let rolesToAdd: string[] = [];
        let rolesToRemove: string[] = [];

        for (const change of e.changes) {
            if (change.type === 'insert') {
                rolesToAdd.push(change.data.id!);
            } else if (change.type === 'remove') {
                rolesToRemove.push(change.data.id!);
            }
        }

        let promises = [];
        if (rolesToAdd.length > 0) {
            promises.push(apiPost(`/api/users/${userId}/roles`, rolesToAdd));
        } else if (rolesToRemove.length > 0) {
            promises.push(
                apiDelete(`/api/users/${userId}/roles`, rolesToRemove)
            );
        }

        Promise.all(promises);
        // console.log('TODO CORRECTO, valores de vuelta: ', dataToSend);
    }, []);

    const filterDescription = useCallback(
        (e: any) =>
            roles.filter((role) => role.id === e.id)[0]?.description || '',
        [roles]
    );

    return (
        <DataGrid
            ref={datagridRef}
            dataSource={userRoles}
            keyExpr={'id'}
            focusedRowEnabled
            showRowLines
            showBorders
            showColumnLines
            rowAlternationEnabled
            onSaved={saveData}
        >
            <Editing
                mode='batch'
                allowAdding={isEditing}
                allowDeleting={isEditing}
                useIcons
            />
            <SearchPanel visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />
            <Toolbar>
                <Item name='addRowButton' disabled={!isEditing} />
                <Item name='revertButton' disabled={!isEditing} />
            </Toolbar>

            <Column dataField='id' caption={'Role Name'}>
                <Lookup dataSource={roles} valueExpr='id' displayExpr='name' />
            </Column>
            <Column
                dataField='description'
                caption={'Description'}
                allowEditing={false}
                calculateCellValue={(e) => filterDescription(e)}
            />
        </DataGrid>
    );
});

export default RolesDataGrid;
