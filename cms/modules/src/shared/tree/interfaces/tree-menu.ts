export enum NodeMenuItemAction {
    NewNode,
    NewNodeInline,
    EditNowInline,
    Cut,
    Copy,
    Paste,
    Delete
}

export interface TreeMenuItem {
    action: NodeMenuItemAction;
    name: string;
}
