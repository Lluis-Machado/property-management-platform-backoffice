// React imports
import { FC, memo, useCallback, useState } from 'react';

// libraries imports
import { Button } from 'pg-components';
import Popup from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import { TreeItem } from '@/lib/types/treeView';
import { Archive, Folder } from '@/lib/types/documentsAPI';

export type TreeViewPopupType = 'Move to' | 'Copy to';

interface Props {
    dataSource: TreeItem<Archive>[];
    onHiding: () => void;
    onShown: () => void;
    onSubmit: (node: TreeItem<Archive | Folder>) => void;
    type: TreeViewPopupType;
    visible: boolean;
}

const TreeViewPopup: FC<Props> = memo(function TreeViewPopup({
    dataSource,
    onHiding,
    onShown,
    onSubmit,
    type,
    visible,
}): React.ReactElement {
    const [selectedNode, setSelectedNode] = useState<TreeItem<
        Archive | Folder
    > | null>(null);

    const handleHiding = useCallback(() => {
        setSelectedNode(null);
        onHiding();
    }, [onHiding]);

    const ContentRender = useCallback(
        (): React.ReactElement => (
            <div className='flex h-full flex-col gap-4'>
                <TreeView
                    dataSource={dataSource as any[]}
                    id='TreeviewPopup'
                    onItemClick={({ itemData }) =>
                        itemData &&
                        setSelectedNode(itemData as TreeItem<Archive | Folder>)
                    }
                    searchEnabled
                    className='flex overflow-y-auto border border-primary-500/20'
                    selectByClick
                    selectionMode='single'
                />
                <div className='flex justify-end'>
                    <div className='flex w-3/4 flex-row justify-end gap-2'>
                        <Button
                            disabled={selectedNode === null}
                            onClick={() => {
                                selectedNode && onSubmit(selectedNode);
                                handleHiding();
                            }}
                            text={type.replace(' to', '')}
                            type='submit'
                        />
                        <Button
                            onClick={handleHiding}
                            style='outline'
                            text='Cancel'
                            type='button'
                        />
                    </div>
                </div>
            </div>
        ),
        [dataSource, handleHiding, onSubmit, selectedNode, type]
    );

    return (
        <Popup
            contentRender={ContentRender}
            hideOnOutsideClick
            maxWidth={340}
            onHiding={handleHiding}
            onShown={onShown}
            title={type}
            visible={visible}
            container='#content'
            dragEnabled={false}
        />
    );
});

export default TreeViewPopup;
