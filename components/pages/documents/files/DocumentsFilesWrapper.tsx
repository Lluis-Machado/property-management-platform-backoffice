'use client'

// React imports
import { useState } from 'react';

// Local imports
import DataGrid from './dataGrid/DataGrid';
import { TreeView } from './treeView/TreeView';
import { fileItems } from './folderStructure.js';
import { DetailsWrapper } from './details/DetailsWrapper';
import SplitPane from '@/components/splitPane/SplitPane';

const className = 'border border-primary-500/50';

export const DocumentsFilesWrapper = (): React.ReactElement => {

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isFileDetailsVisible, setIsFileDetailsVisible] = useState<boolean>(false);



    return (
        <SplitPane
            onReset={console.log}
            onVisibleChange={console.log}
            visible={isFileDetailsVisible}
            leftPanePreferredSize={120}
            rightPanePreferredSize={600}
            left={<TreeView dataSource={fileItems} />}
            center={<DataGrid onSelectedFile={e => { setSelectedFile(e); setIsFileDetailsVisible(true) }} />}
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
