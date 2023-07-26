import { Folder } from './documentsAPI';

interface TreeNode<T> {
    disabled: boolean;
    expanded: boolean;
    hasItems: boolean;
    id: string;
    items: TreeItem<T>[];
    parentId: null | string;
    selected: boolean;
    text: string;
    visible: boolean;
}

export interface TreeItem<T> extends TreeNode<Folder> {
    data: T;
}
