'use client';

// React imports
import { useCallback, useState } from 'react';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { DetailsWrapper } from './details/DetailsWrapper';
import { FileManager } from './fileManager/FileManager';
import SplitPane from '@/components/splitPane/SplitPane';
import TreeView from './treeView/TreeView';

const className = 'border border-primary-500/50';

interface Props {
    archives: any[];
}

export const DocumentsFilesWrapper = ({
    archives,
}: Props): React.ReactElement => {
    const [documents, setDocuments] = useState<any[] | undefined>(undefined);

    const handleTreeViewItemSelected = useCallback(
        async (archiveId: string, folderId?: string) => {
            let endpoint = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${archiveId}/documents`;
            let errorMessage = `Error while getting archive {${archiveId}} documents`;

            if (folderId) {
                endpoint = `${endpoint}?${new URLSearchParams({ folderId })}`;
                errorMessage = `Error while getting archive {${archiveId}}, folder {${folderId}} documents`;
            }

            const resp = await fetch(endpoint, { cache: 'no-cache' });
            if (!resp.ok) throw new ApiCallError(errorMessage);
            const aux = await resp.json();
            setDocuments(aux);
        },
        []
    );

    return (
        // <TreeView
        //     archives={archives}
        //     onItemSelected={handleTreeViewItemSelected}
        // />
        <div className='absolute inset-4 border border-primary-500'>
            <SplitPane
                visible={false}
                leftPanePreferredSize={200}
                rightPanePreferredSize={600}
                minSizeLeft={100}
                minSizeCenter={650}
                minSizeRight={420}
                left={
                    <TreeView
                        archives={archives}
                        onItemSelected={handleTreeViewItemSelected}
                    />
                }
                center={<FileManager dataSource={documents!} folderId='1.1' />}
            />
        </div>
    );
};
