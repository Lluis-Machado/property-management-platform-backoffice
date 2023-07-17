interface TreeItem<T> {
    data: T
    disabled: boolean,
    expanded: boolean,
    hasItems: boolean,
    id: string,
    items: TreeItem<T>[],
    parentId: null | string,
    selected: boolean,
    text: string,
    visible: boolean;
};