// Local imports
import { fileItems } from './data.js';
import { TreeView } from './TreeView';


export const DocumentsFilesWrapper = (): React.ReactElement => {
    return (
        <>
            <TreeView dataSource={fileItems} />
        </>
    );
};
