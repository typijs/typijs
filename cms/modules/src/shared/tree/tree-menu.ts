export enum NodeMenuItemAction {
    NewNode,
    NewNodeInline,
    Rename,
    Cut,
    Copy,
    Paste,
    Delete
}

export interface TreeMenuItem {
    action: NodeMenuItemAction;
    name: string;
}
