import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from './tree-node';

@Injectable()
export class TreeStore {
    public nodeSelected$: Subject<TreeNode> = new Subject<TreeNode>();

    private treeNodes = {};
    private nodes = {};

    constructor() { }

    loadNodes(callback, key) {
        if (this.nodes[key]) {
            this.treeNodes[key].next(this.nodes[key]);
        }
        else {
            callback(key)
                .subscribe(res => {
                    this.nodes[key] = res.map(x => new TreeNode(x._id, x.name));
                    this.treeNodes[key].next(this.nodes[key]);
                });
        }
    }

    fireNodeSelected(node) {
        this.nodeSelected$.next(node);
    }

    getTreeNodes(key) {
        if (!this.treeNodes.hasOwnProperty(key)) {
            this.treeNodes[key] = new Subject<Array<TreeNode>>();
        }
        return this.treeNodes[key].asObservable();
    }
}