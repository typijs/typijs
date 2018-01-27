import { TreeNode } from "./tree-node";

export interface TreeService {
    root: TreeNode;
    loadChildren: (key: string) => any;
}