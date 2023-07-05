'use client'

// Local imports
import DataGrid from './dataGrid/DataGrid';
import { TreeView } from './treeView/TreeView';
import { fileItems } from './folderStructure.js';


export const DocumentsFilesWrapper = (): React.ReactElement => {
    return (
        <div className='flex flex-row gap-4'>
            <TreeView dataSource={fileItems} />
            <DataGrid />
        </div>
    );
};
