// React imports
import { FC, memo, useCallback, useState } from 'react';

// libraries imports
import { Button } from 'pg-components';
import Popup from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';
import { Node } from 'devextreme/ui/tree_view';

export type TreeViewPopupType = 'Move to' | 'Copy to';

interface Props {
    createChildren: (parentNode: Node<any>) => any[] | PromiseLike<any>;
    onHiding: () => void;
    onShown: () => void;
    onSubmit: (node: any) => void;
    type: TreeViewPopupType;
    visible: boolean;
};

const TreeViewPopup: FC<Props> = memo(function TreeViewPopup({ createChildren, onHiding, onShown, onSubmit, type, visible }): React.ReactElement {
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const handleHiding = useCallback(() => {
        setSelectedNode(null);
        onHiding();
    }, [onHiding]);

    const ContentRender = useCallback((): React.ReactElement => (
        <div className='flex flex-col gap-4'>
            <TreeView
                createChildren={createChildren}
                dataStructure='plain'
                id='TreeviewPopup'
                onItemClick={({ itemData }) => setSelectedNode(itemData)}
                searchEnabled
            />
            <div className='flex justify-end'>
                <div className='flex flex-row gap-2 justify-end w-3/4'>
                    <Button
                        disabled={selectedNode === null}
                        onClick={() => { onSubmit(selectedNode); handleHiding() }}
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
    ), [createChildren, handleHiding, onSubmit, selectedNode, type]);

    return (
        <Popup
            contentRender={ContentRender}
            height='auto'
            hideOnOutsideClick
            maxWidth={340}
            onHiding={handleHiding}
            onShown={onShown}
            title={type}
            visible={visible}
            width='80vw'
            container='#content'
            dragEnabled={false}
        />
    );
});

export default TreeViewPopup;