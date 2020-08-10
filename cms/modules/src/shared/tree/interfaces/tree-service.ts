import { Observable } from 'rxjs';
import { TreeNode } from "./tree-node";

export abstract class TreeService {
    abstract getNode: (nodeId: string) => Observable<TreeNode>;
    abstract loadChildren: (parentNodeId: string) => Observable<TreeNode[]>;
}