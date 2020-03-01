import { TreeNode } from './tree-node'
import { TypeofExpr } from '@angular/compiler'

export enum NodeMenuItemAction {
    //NewNode,
    NewNodeInline,
    EditNowInline,
    Cut,
    Copy,
    Paste,
    //Delete
}

export type TreeMenuItem = {
    action: NodeMenuItemAction | string
    name: string;
}

export type TreeMenuActionEvent = {
    action: NodeMenuItemAction | number | string;
    node: TreeNode;
}

