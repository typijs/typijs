import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from "./tree-node";

export interface TreeService {
    reloadNode$: Subject<string>;
    loadChildren: (key: string) => Observable<any>;
}