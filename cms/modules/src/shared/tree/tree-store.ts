import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from './tree-node';

@Injectable()
export class TreeStore {
    public nodeSelected$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeInlineCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeRenamed$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeCut$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeCopied$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodePasted$: Subject<TreeNode> = new Subject<TreeNode>();
    public nodeDeleted$: Subject<TreeNode> = new Subject<TreeNode>();

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

    fireNodeCreated(node) {
        this.nodeCreated$.next(node);
    }

    fireNodeInlineCreated(node) {
        this.nodeInlineCreated$.next(node);
    }

    fireNodeRenamed(node) {
        this.nodeRenamed$.next(node);
    }

    fireNodeCut(node) {
        this.nodeCut$.next(node);
    }

    fireNodeCopied(node) {
        this.nodeCopied$.next(node);
    }

    fireNodePasted(node) {
        this.nodePasted$.next(node);
    }

    fireNodeDeleted(node) {
        this.nodeDeleted$.next(node);
    }

    getTreeNodes(key) {
        if (!this.treeNodes.hasOwnProperty(key)) {
            this.treeNodes[key] = new Subject<Array<TreeNode>>();
        }
        return this.treeNodes[key].asObservable();
    }
}