import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';

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
    private nodes = {}; //store children of node with key = parentid, ex nodes[parentId] = children of parentid
    private selectedNode: TreeNode;

    loadNodes(key) {
        if (this.nodes[key]) {
            this.getTreeNodes(key).next(this.nodes[key]);
        }
        else {
            this.getNodeChildren(key);
        }
    }

    reloadNodeChildren(nodeId) {
        this.getNode(nodeId);
        this.getNodeChildren(nodeId);
    }

    getTreeNodes(key) {
        if (!this.treeNodes.hasOwnProperty(key)) {
            this.treeNodes[key] = new Subject<Array<TreeNode>>();
        }
        return this.treeNodes[key];
    }

    pointToSelectedNode(newSelectedNode: TreeNode) {
        if (!this.selectedNode || this.selectedNode.id != newSelectedNode.id) {
            this.selectedNode = newSelectedNode;
            var parentPath = `null${newSelectedNode.parentPath}`;
            var parentIds = parentPath.split(',').filter(id => id);
            if (parentIds.length > 0) {
                Observable.from(parentIds)
                    .concatMap(id => {
                        if (!this.nodes[id]) {
                            return this.treeService.loadChildren(id).map(res => {
                                return res.map(x=> new TreeNode({
                                    id: x._id,
                                    name: x.name,
                                    hasChildren: x.hasChildren,
                                    parentId: x.parentId,
                                    parentPath: x.parentPath
                                }));
                            });
                        } else {
                            return Observable.of(this.nodes[id]);
                        }
                    }, (id, nodes, outIndex, innerIndex) => [id, nodes])
                    .map(result => {
                        let nodeId = result[0];
                        let nodes = result[1];
                        if (!this.nodes[nodeId]) this.nodes[nodeId] = nodes;
                        let index = parentIds.findIndex(id => id == nodeId);
                        if (index > 0) {
                            let currentNodeIndex = this.nodes[parentIds[index - 1]].findIndex(x => x.id == nodeId);
                            if (currentNodeIndex != -1)
                                this.nodes[parentIds[index - 1]][currentNodeIndex].isExpanded = true;
                        }
                    }).subscribe();

            }
        }
    }

    private getNode(nodeId) {
        if (this.treeService) {
            this.treeService.getNode(nodeId)
                .subscribe(nodeData => {
                    if (nodeData) {
                        let parentId = nodeData.parentId ? nodeData.parentId : 'null';
                        if (this.nodes[parentId]) {
                            let matchIndex = this.nodes[parentId].findIndex(x => x.id == nodeData._id);
                            if (matchIndex != -1)
                                this.nodes[nodeData.parentId][matchIndex].hasChildren = nodeData.hasChildren;
                        }
                    }
                });
        }
    }

    private getNodeChildren(parentId) {
        if (this.treeService) {
            this.treeService.loadChildren(parentId)
                .subscribe(res => {
                    this.nodes[parentId] = res.map(x => new TreeNode({
                        id: x._id,
                        name: x.name,
                        hasChildren: x.hasChildren,
                        parentId: x.parentId,
                        parentPath: x.parentPath
                    }));
                    this.getTreeNodes(parentId).next(this.nodes[parentId]);
                });
        }
    }

    //fire all tree events
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
}