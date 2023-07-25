'use client';

// React imports
import { FC, memo, useCallback, useRef, useState } from 'react';

// Libraries imports
import { TreeView as DxTreeView } from 'devextreme-react/tree-view';

// Local imports
import { ApiCallError } from '@/lib/utils/errors';
import { Archive, Document, Folder } from '@/lib/types/documentsAPI';
import { FileManager } from './fileManager/FileManager';
import { isArchive } from '@/lib/utils/documents/utilsDocuments';
import SplitPane from '@/components/splitPane/SplitPane';
import TreeView from './treeView/TreeView';

interface Props {
    archives: any[];
}

export const DocumentsFilesWrapper: FC<Props> = memo(
    function DocumentsFilesWrapper({ archives }): React.ReactElement {
        const [selectedFolder, setSelectedFolder] = useState<
            Archive | Folder | undefined
        >(undefined);
        const [documents, setDocuments] = useState<Document[] | undefined>(
            undefined
        );

        const handleFolderSelected = useCallback(
            async (folder: Archive | Folder) => {
                setSelectedFolder(folder);
                const isFolderArchive = isArchive(folder);
                const archiveId = isFolderArchive
                    ? folder.id
                    : (folder as Folder).archiveId;
                const folderId = isFolderArchive ? null : (folder as Folder).id;

                let endpoint = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/documents/${archiveId}/documents`;
                let errorMessage = `Error while getting archive {${archiveId}} documents`;

                if (folderId) {
                    endpoint = `${endpoint}?${new URLSearchParams({
                        folderId,
                    })}`;
                    errorMessage = `Error while getting archive {${archiveId}}, folder {${folderId}} documents`;
                }

                const resp = await fetch(endpoint, { cache: 'no-cache' });
                if (!resp.ok) throw new ApiCallError(errorMessage);
                const aux = await resp.json();
                setDocuments(aux);
            },
            []
        );

        const TreeViewRef = useRef<DxTreeView>(null);

        return (
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
                            treeViewRef={TreeViewRef}
                            onFolderSelected={handleFolderSelected}
                        />
                    }
                    center={
                        <FileManager
                            dataSource={documents ?? []}
                            folder={selectedFolder}
                            treeViewRef={TreeViewRef}
                        />
                    }
                />
            </div>
        );
    }
);
