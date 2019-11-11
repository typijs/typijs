import { Observable } from 'rxjs';
import { TreeNode } from "./tree-node";

export interface TreeService {
    getNode: (nodeId: string) => Observable<TreeNode>;
    loadChildren: (parentNodeId: string) => Observable<TreeNode[]>;
}