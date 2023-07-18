// Local imports
import { TreeView } from './TreeView/TreeView';
import { fileItems } from './data.js';

export const DocumentsFilesWrapper = (): React.ReactElement => {
    return (
        <>
            <TreeView dataSource={fileItems} />
        </>
    );
};
