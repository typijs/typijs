import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from "./tree-node";

export interface TreeService {
    getNode: (nodeId: string) => Observable<TreeNode>;
    loadChildren: (parentNodeId: string) => Observable<TreeNode[]>;
}