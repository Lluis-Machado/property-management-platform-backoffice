'use client'

// React imports
import { useCallback, useState } from 'react';

// Local imports
import TreeView from './treeView/TreeView';
import { ApiCallError } from '@/lib/utils/errors';

const className = 'border border-primary-500/50';

interface Props {
    archives: any[];
};

export const DocumentsFilesWrapper = ({ archives }: Props): React.ReactElement => {

    const [selectedFolder, setSelectedFolder] = useState<any[] | undefined>(undefined);
    const [selectedArchive, setSelectedArchive] = useState(undefined);

    const handleTreeViewItemSelected = useCallback(async (archiveId: string, folderId?: string) => {
        let endpoint = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${archiveId}/documents`;
        let errorMessage = `Error while getting archive {${archiveId}} documents`;

        if (folderId) {
            endpoint = `${endpoint}?${new URLSearchParams({ folderId })}`;
            errorMessage = `Error while getting archive {${archiveId}}, folder {${folderId}} documents`;
        };

        const resp = await fetch(endpoint, { cache: 'no-cache' });
        if (!resp.ok) throw new ApiCallError(errorMessage);
        const aux = await resp.json();
        folderId ? setSelectedFolder(aux) : setSelectedArchive(aux);
    }, []);

    return (
        <TreeView
            archives={archives}
            onItemSelected={handleTreeViewItemSelected}
        />
        // <SplitPane
        // visible={isFileDetailsVisible}
        // leftPanePreferredSize={200}
        // rightPanePreferredSize={600}
        // minSizeLeft={100}
        // minSizeCenter={650}
        // minSizeRight={420}
        // left={<TreeView dataSource={archives} />}
        // center={<FileManager dataSource={fileItems} folderId='1.1' />}
        // right={
        //     <DetailsWrapper
        //         className={className}
        //         selectedFile={selectedFile}
        //         onFileDetailsClosed={() => { setIsFileDetailsVisible(false) }}
        //     />
        // }
        // />
    );
};
