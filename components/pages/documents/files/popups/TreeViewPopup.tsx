// React imports
import { FC, memo, useCallback, useState } from 'react';

// libraries imports
import { Button } from 'pg-components';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'devextreme-react/popup';
import TreeView from 'devextreme-react/tree-view';

export type TreeViewPopupType = 'Move to' | 'Copy to';

interface Props {
    dataSource: any[];
    onHiding: () => void;
    onSubmit: (node: any) => void;
    onShown: () => void;
    type: TreeViewPopupType;
    visible: boolean;
};

const itemRender = (params: any): React.ReactElement => (
    <div className='flex flex-row items-center text-center gap-4'>
        <FontAwesomeIcon icon={faFolder} />
        <p>
            {params.name}
        </p>
    </div>
);

const TreeViewPopup: FC<Props> = memo(function TreeViewPopup({ dataSource, onHiding, onShown, onSubmit, type, visible }): React.ReactElement {
    const [selectedNode, setSelectedNode] = useState<any>(null);

    const handleHiding = useCallback(() => {
        setSelectedNode(null);
        onHiding();
    }, [onHiding]);

    const ContentRender = useCallback((): React.ReactElement => (
        <div className='flex flex-col gap-4'>
            <TreeView
                dataSource={dataSource}
                disabledExpr='disabled'
                displayExpr='name'
                id='treeviewPopup'
                itemRender={itemRender}
                itemsExpr='childFolders'
                keyExpr='id'
                onItemClick={({ itemData }) => setSelectedNode(itemData)}
                searchEnabled
                searchExpr='name'
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
    ), [dataSource, handleHiding, onSubmit, selectedNode, type]);

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
        />
    );
});

export default TreeViewPopup;