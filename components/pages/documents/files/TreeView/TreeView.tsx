'use client'

// React imports
import { useState } from 'react';

// Libraries imports
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';

// Local imports
import './TreeView.css';
import ContextMenu from './contextMenu/ContextMenu';

const itemRender = (params: any): React.ReactElement => {
    if (!params.isDirectory) return <></>;
    return (
        <div className='flex flex-row items-center text-center gap-4'>
            <FontAwesomeIcon icon={faFolder} />
            <p>
                {params.name}
            </p>
        </div>
    );
};

interface Props {
    dataSource: any;
};

export const TreeView = ({ dataSource }: Props): React.ReactElement => {
    const [selectedTreeItem, setSelectedTreeItem] = useState<any>(undefined);

    return (
        <div className='w-full relative'>
            <DxTreeView
                dataSource={dataSource}
                displayExpr='name'
                hasItemsExpr='isDirectory'
                id='treeview'
                itemRender={itemRender}
                itemsExpr='items'
                keyExpr='id'
                onItemContextMenu={({ itemData }) => setSelectedTreeItem(itemData)}
                searchEnabled
                searchExpr={['name', 'uuid']}
            />
            <ContextMenu
                dataSource={dataSource}
                selectedTreeItem={selectedTreeItem}
            />
        </div>
    );
};