import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from "./tree-node";

export interface TreeService {
    reloadNode$: Subject<string>;
    selectedNode$: Subject<TreeNode>;
    getNode: (nodeId: string) => Observable<any>;
    loadChildren: (parentNodeId: string) => Observable<any>;
}