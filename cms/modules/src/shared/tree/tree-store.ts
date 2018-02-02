import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from './tree-node';
import { TreeService } from './index';

@Injectable()
export class TreeStore {
    nodeSelected$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeInlineCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeRenamed$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCut$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCopied$: Subject<TreeNode> = new Subject<TreeNode>();
    nodePasted$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeDeleted$: Subject<TreeNode> = new Subject<TreeNode>();

    treeService: TreeService;

    private treeNodes = {};
    private nodes = {};

    private selectedNode: TreeNode;

    loadNodes(key) {
        if (this.nodes[key]) {
            this.getTreeNodes(key).next(this.nodes[key]);
        }
        else {
            this.getNodeChildren(key);
        }
    }

    reloadNode(nodeId) {
        this.getNodeChildren(nodeId);
    }

    fireNodeSelected(node) {
        this.selectedNode = node;
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
        return this.treeNodes[key];
    }

    private getNodeChildren(parentId) {
        if (this.treeService) {
            this.treeService.loadChildren(parentId)
                .subscribe(res => {
                    this.nodes[parentId] = res.map(x => new TreeNode(x._id, x.name));
                    this.getTreeNodes(parentId).next(this.nodes[parentId]);
                });
        }
    }
}