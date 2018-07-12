import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/empty';


import { TreeNode } from './tree-node';
import { TreeService } from './index';
import { TreeMenuItem, NodeMenuItemAction } from './tree-menu';

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

    getSelectedNode() {
        return this.selectedNode;
    }

    loadNodes(key) {
        if (this.nodes[key]) {
            this.getTreeNodes(key).next(this.nodes[key]);
        }
        else {
            this.getNodeChildren(key).subscribe();
        }
    }

    reloadNode(nodeId) {
        this.getNode(nodeId);
        this.getNodeChildren(nodeId).subscribe();
    }

    removeEmptyNode(parent, node) {
        let childNodes = this.nodes[node.parentId ? node.parentId : '0'];
        if (childNodes) {
            let nodeIndex = childNodes.findIndex(x => x.id == node.id);
            if (nodeIndex > -1) childNodes.splice(nodeIndex, 1);
            if (childNodes.length == 0) {
                parent.hasChildren = false;
                parent.isExpanded = false;
            }
        }
    }

    showInlineEditNode(node: TreeNode) {
        let newNode = new TreeNode({
            isNew: true,
            parentId: node.id == '0' ? null : node.id
        });

        if (this.nodes[node.id]) {
            this.nodes[node.id].push(newNode);
            node.isExpanded = true;
            node.hasChildren = true;
        } else {
            this.getNodeChildren(node.id, newNode).subscribe(result => {
                node.isExpanded = true;
                node.hasChildren = true;
            });
        }
    }

    getTreeNodes(key) {
        if (!this.treeNodes.hasOwnProperty(key)) {
            this.treeNodes[key] = new Subject<Array<TreeNode>>();
        }
        return this.treeNodes[key];
    }

    locateToSelectedNode(newSelectedNode: TreeNode) {
        if (!this.selectedNode || this.selectedNode.id != newSelectedNode.id) {
            this.selectedNode = newSelectedNode;
            var parentPath = newSelectedNode.parentPath ? `0${newSelectedNode.parentPath}` : '0';
            var parentIds = parentPath.split(',').filter(id => id);
            if (parentIds.length > 0) {
                Observable.from(parentIds)
                    .concatMap(id => {
                        if (!this.nodes[id]) {
                            return this.treeService.loadChildren(id);
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
                        return index;
                    }).subscribe(index => {
                        console.log('pointToSelectedNode: ' + parentIds[index]);
                    });

            }
        }
    }

    private getNode(nodeId) {
        if (this.treeService && nodeId) {
            this.treeService.getNode(nodeId)
                .subscribe(nodeData => {
                    if (nodeData) {
                        let parentId = nodeData.parentId ? nodeData.parentId : '0';
                        if (this.nodes[parentId]) {
                            let matchIndex = this.nodes[parentId].findIndex(x => x.id == nodeData.id || (x.isNew && x.name == nodeData.name));
                            if (matchIndex != -1) {
                                this.nodes[nodeData.parentId][matchIndex].id = nodeData.id;
                                this.nodes[nodeData.parentId][matchIndex].parentPath = nodeData.parentPath;
                                this.nodes[nodeData.parentId][matchIndex].isNew = false;
                                this.nodes[nodeData.parentId][matchIndex].isEditing = false;
                                this.nodes[nodeData.parentId][matchIndex].hasChildren = nodeData.hasChildren;
                            }
                        }
                    }
                });
        }
    }

    private getNodeChildren(parentId, newNode?: TreeNode): Observable<any> {
        if (this.treeService) {
            if (!parentId) parentId = '0';
            return this.treeService.loadChildren(parentId)
                .do(childNodes => {
                    this.nodes[parentId] = childNodes;
                    if (newNode) this.nodes[parentId].push(newNode);
                    this.getTreeNodes(parentId).next(this.nodes[parentId]);
                });
        }
        return Observable.empty();
    }

    fireNodeActions(nodeAction) {
        let action = nodeAction.action;
        let node = nodeAction.node;
        switch (action) {
            case NodeMenuItemAction.NewNode:
                this.fireNodeCreated(node);
                break;
            case NodeMenuItemAction.NewNodeInline:
                //add temp new node with status is new
                this.showInlineEditNode(node);
                break;
            case NodeMenuItemAction.Rename:
                //update current node with status is rename
                this.fireNodeRenamed(node);
                break;
            case NodeMenuItemAction.Cut:
                this.fireNodeCut(node);
                break;
            case NodeMenuItemAction.Copy:
                this.fireNodeCopied(node);
                break;
            case NodeMenuItemAction.Paste:
                this.fireNodePasted(node);
                break;
            case NodeMenuItemAction.Delete:
                this.fireNodeDeleted(node);
                break;
            default:
                throw new Error(`Chosen menu item doesn't exist`);
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