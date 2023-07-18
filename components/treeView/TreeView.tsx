// React imports
import { useCallback, useMemo } from 'react';

// Libraries imports
import { ItemClickEvent } from 'devextreme/ui/tree_view';
import {
    TreeView as DxTreeView,
    SearchEditorOptions,
} from 'devextreme-react/tree-view';

// Local imports
import { TreeNode } from './root';

interface Props {
    root: TreeNode[];
    onNodeSelected: (e: TreeNode[]) => void;
}

export const TreeView = ({ root, onNodeSelected }: Props) => {
    const folderNodes = useMemo(() => getFolderNodes(root), [root]);

    const onItemClick = useCallback(
        (e: ItemClickEvent<any>) => {
            const deleteInnerFoldersFromSelectedFolder = (
                selectedFolder: TreeNode
            ): TreeNode[] =>
                selectedFolder
                    .items!.map((child) => (child.items ? undefined : child))
                    .filter((file): file is TreeNode => file !== undefined);

            const folder = getSelectedFolder(e, root);
            onNodeSelected(deleteInnerFoldersFromSelectedFolder(folder));
        },
        [onNodeSelected, root]
    );

    return (
        <DxTreeView
            dataSource={folderNodes}
            itemsExpr='items'
            keyExpr='id'
            onItemClick={onItemClick}
            searchEnabled
            searchExpr='text'
        >
            <SearchEditorOptions height={48} />
        </DxTreeView>
    );
};

const getFolderNodes = (data: TreeNode[]): TreeNode[] =>
    data
        .map((node) => {
            const newNode: TreeNode = { ...node };
            if (newNode.items) {
                newNode.items = getFolderNodes(newNode.items);
            }
            return newNode;
        })
        .filter((node) => node.items);

const getSelectedFolder = (
    e: ItemClickEvent<any>,
    root: TreeNode[]
): TreeNode => {
    const getFolderPath = (e: ItemClickEvent<any>): string[] => {
        const path: string[] = [];
        let node = e.node;

        while (node?.parent != null) {
            path.push(node.key);
            node = node.parent;
        }

        path.push(node!.key);
        return path;
    };

    const getOriginalFolderFromPath = (
        path: string[],
        root: TreeNode[]
    ): TreeNode => {
        let originalFolder = structuredClone(
            root.find((node) => node.id === path[path.length - 1])
        );

        for (let i = path.length - 2; i >= 0; i--) {
            originalFolder = originalFolder!.items!.find(
                (node) => node.id === path[i]
            );
        }

        return originalFolder!;
    };

    return getOriginalFolderFromPath(getFolderPath(e), root);
};

export default TreeView;
