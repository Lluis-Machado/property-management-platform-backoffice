'use client'

// React imports
import { useCallback, useState } from 'react';

// Local imports
import TreeView from './treeView/TreeView';
import { ApiCallError } from '@/lib/utils/errors';

const className = 'border border-primary-500/50';

interface Props {
    dataSource: any[];
};

export const DocumentsFilesWrapper = ({ dataSource }: Props): React.ReactElement => {

    const [archives, setArchives] = useState<any[]>(dataSource);
    const [selectedFolderContent, setSelectedFolderContent] = useState<any[] | undefined>(undefined);

    const handleArchiveSelected = useCallback(async (archiveId: string) => {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${archiveId}/folders`, { cache: 'no-cache' })
        if (!resp.ok) throw new ApiCallError(`Error while getting archive: ${archiveId} folders`);
        const data = await resp.json();

        setArchives(p => p.map(archive => archive.id === archiveId ? { ...archive, childFolders: data } : archive));
    }, []);

    const handleFolderSelected = useCallback(async (archiveId: string, folderId: string) => {
        const params = new URLSearchParams({ folderId })
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${archiveId}/documents?${params}`,
            { cache: 'no-cache', }
        );
        if (!resp.ok) throw new ApiCallError(`Error while getting archive: ${archiveId}, folder: ${folderId} documents`);
        const aux = await resp.json();
        setSelectedFolderContent(aux);
    }, []);

    return (
        <TreeView
            dataSource={archives}
            onArchiveSelected={handleArchiveSelected}
            onFolderSelected={handleFolderSelected}
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
