import { TreeNode } from "./tree-node";

export interface TreeService {
    loadChildren: (key: string) => any;
}