'use client'

// React imports
import { useState } from 'react';

// Local imports
import { DetailsWrapper } from './details/DetailsWrapper';
import { fileItems } from './folderStructure.js';
import { FileManager } from './fileManager/FileManager';
import { TreeView } from './treeView/TreeView';
import SplitPane from '@/components/splitPane/SplitPane';

const className = 'border border-primary-500/50';

export const DocumentsFilesWrapper = (): React.ReactElement => {

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isFileDetailsVisible, setIsFileDetailsVisible] = useState<boolean>(false);

    return (
        <SplitPane
            visible={isFileDetailsVisible}
            leftPanePreferredSize={200}
            rightPanePreferredSize={600}
            minSizeLeft={100}
            minSizeCenter={650}
            minSizeRight={420}
            left={<TreeView dataSource={fileItems} />}
            center={<FileManager dataSource={fileItems} folderId='1.1'/>}
            right={
                <DetailsWrapper
                    className={className}
                    selectedFile={selectedFile}
                    onFileDetailsClosed={() => { setIsFileDetailsVisible(false) }}
                />
            }
        />
    );
};
