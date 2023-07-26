// React imports
import { FC, memo, useCallback, useState } from 'react';

// libraries imports
import { Button } from 'pg-components';
import Popup from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import { TreeItem } from '@/lib/types/treeView';
import { Archive, Folder } from '@/lib/types/documentsAPI';

/**
 * Represents the type of tree view actions for the TreeViewPopup component.
 */
export type TreeViewPopupType = 'Move to' | 'Copy to';

export interface Props {
    /**
     * The data source representing the tree view items.
     */
    dataSource: TreeItem<Archive>[];
    /**
     * Callback function to be executed when the popup is hiding.
     */
    onHiding: () => void;
    /**
     * Callback function to be executed when the popup is shown.
     */
    onShown: () => void;
    /**
     * Callback function to be executed when a tree node is selected and the form is submitted.
     * @param node - The selected tree node for moving or copying items.
     */
    onSubmit: (node: TreeItem<Archive | Folder>) => void;
    /**
     * The type of tree view action to be displayed. Can be one of 'Move to' or 'Copy to'.
     */
    type: TreeViewPopupType;
    /**
     * Specifies whether the popup is visible or not.
     */
    visible: boolean;
}

/**
 * Represents a Popup with a TreeView as its content to select where to move or copy an element.
 */
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

    /**
     * Handles the hiding event of the popup.
     * Resets the selectedNode state and calls the onHiding callback.
     */
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
