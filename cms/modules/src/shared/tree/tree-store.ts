import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, empty } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { NodeMenuItemAction } from './tree-menu';

@Injectable()
export class TreeStore {
    nodeSelectedInner$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeSelected$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeInlineCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeRenamed$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCut$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCopied$: Subject<TreeNode> = new Subject<TreeNode>();
    nodePasted$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeDeleted$: Subject<TreeNode> = new Subject<TreeNode>();

    treeService: TreeService;

    id: Number = Math.floor(Math.random() * 10);

    //The tree-children component will subscribe the treeNodesRxSubject to reload sub tree
    private treeNodesRxSubject$ = {}; //store Subject of node's children with key = nodeId to load sub tree
    private treeNodes = {}; //store node's children with key = nodeid, ex nodes[parentId] = children of parentid
    private selectedNode: TreeNode;

    getSelectedNode(): TreeNode {
        return this.selectedNode;
    }

    setSelectedNode(node: TreeNode) {
        node.isSelected = true;
        this.selectedNode = node;
    }

    //key will be node id (ObjectId)
    getTreeNodesSubjectByKey$(key: string): Subject<TreeNode[]> {
        if (!this.treeNodesRxSubject$.hasOwnProperty(key)) {
            this.treeNodesRxSubject$[key] = new Subject<TreeNode[]>();
        }
        return this.treeNodesRxSubject$[key];
    }

    getTreeChildrenData(nodeId: string) {
        if (this.treeNodes[nodeId]) {
            this.getTreeNodesSubjectByKey$(nodeId).next(this.treeNodes[nodeId]);
        }
        else {
            this.getNodeChildren(nodeId).subscribe((nodeChildren: TreeNode[]) => {
                this.getTreeNodesSubjectByKey$(nodeId).next(nodeChildren);
            });
        }
    }

    //Reload node's children
    //@nodeId: Mongoose ObjectId
    reloadTreeChildrenData(subTreeRootId: string) {
        if (!subTreeRootId) subTreeRootId = '0'
        //Reload the root node of sub tree
        this.getNodeData(subTreeRootId).subscribe();
        //Reload the children data
        this.getNodeChildren(subTreeRootId).subscribe((nodeChildren: TreeNode[]) => {
            //Reload the sub tree
            this.getTreeNodesSubjectByKey$(subTreeRootId).next(nodeChildren);
        });
    }

    removeEmptyNode(parent: TreeNode, node: TreeNode) {
        const childNodes = this.treeNodes[node.parentId ? node.parentId : '0'];
        if (childNodes) {
            const nodeIndex = childNodes.findIndex(x => x.id == node.id);
            if (nodeIndex > -1) childNodes.splice(nodeIndex, 1);
            if (childNodes.length == 0) {
                parent.hasChildren = false;
                parent.isExpanded = false;
            }
        }
    }

    showInlineEditNode(parentNode: TreeNode) {
        const newInlineNode = new TreeNode({
            isNew: true,
            parentId: parentNode.id == '0' ? null : parentNode.id
        });

        if (this.treeNodes[parentNode.id]) {
            this.treeNodes[parentNode.id].push(newInlineNode);
            parentNode.isExpanded = true;
            parentNode.hasChildren = true;
        } else {
            this.getNodeChildren(parentNode.id).subscribe((nodeChildren: TreeNode[]) => {
                this.treeNodes[parentNode.id].push(newInlineNode);
                parentNode.isExpanded = true;
                parentNode.hasChildren = true;
                //reload sub tree
                this.getTreeNodesSubjectByKey$(parentNode.id).next(this.treeNodes[parentNode.id]);
            });
        }
    }

    locateToSelectedNode(newSelectedNode: TreeNode) {
        if (!this.selectedNode || this.selectedNode.id != newSelectedNode.id) {

            this.setSelectedNode(newSelectedNode);
            this.fireNodeSelectedInner(newSelectedNode);
            const parentPath = newSelectedNode.parentPath ? `0${newSelectedNode.parentPath}` : '0';
            const parentIds = parentPath.split(',').filter(id => id);

            if (parentIds.length > 0) {
                from(parentIds).pipe(
                    concatMap(id => this.treeNodes[id] ? of(this.treeNodes[id]) : this.treeService.loadChildren(id),
                        (id, nodes, outIndex, innerIndex) => [id, nodes]
                    ),
                    map(([nodeId, nodes]: [string, TreeNode[]]) => {
                        if (!this.treeNodes[nodeId]) this.treeNodes[nodeId] = nodes;
                        const index = parentIds.findIndex(id => id == nodeId);
                        if (index > 0) {
                            const currentNodeIndex = this.treeNodes[parentIds[index - 1]].findIndex(x => x.id == nodeId);
                            if (currentNodeIndex != -1)
                                this.treeNodes[parentIds[index - 1]][currentNodeIndex].isExpanded = true;
                        }
                        return index;
                    })
                ).subscribe(index => {
                    console.log('pointToSelectedNode: ' + parentIds[index]);
                });
            }
        }
    }

    private getNodeData(nodeId: string): Observable<TreeNode> {
        if (nodeId == '0') return empty();
        return this.treeService.getNode(nodeId).pipe(
            tap((nodeData: TreeNode) => this.updateTreeNodesData(nodeData))
        );
    }

    private updateTreeNodesData = (currentNode: TreeNode): void => {
        if (!currentNode) return;

        const key = currentNode.parentId ? currentNode.parentId : '0';
        if (!this.treeNodes[key]) return;

        const matchIndex = this.treeNodes[key].findIndex((x: TreeNode) => x.id == currentNode.id || (x.isNew && x.name == currentNode.name));
        if (matchIndex != -1) {
            this.treeNodes[key][matchIndex].id = currentNode.id;
            this.treeNodes[key][matchIndex].parentPath = currentNode.parentPath;
            this.treeNodes[key][matchIndex].isNew = false;
            this.treeNodes[key][matchIndex].isEditing = false;
            this.treeNodes[key][matchIndex].hasChildren = currentNode.hasChildren;
        }
    }

    private getNodeChildren(parentId: string): Observable<TreeNode[]> {

        if (!parentId) parentId = '0';
        //the 'tap' operator same as 'do'
        return this.treeService.loadChildren(parentId).pipe(
            tap((childNodes: TreeNode[]) => {
                this.treeNodes[parentId] = childNodes;
                return this.treeNodes[parentId];
            })
        );
    }

    fireNodeActions(nodeAction: { action: NodeMenuItemAction, node: TreeNode }) {
        const { action, node } = nodeAction;
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
    fireNodeSelectedInner(node: TreeNode) {
        this.nodeSelectedInner$.next(node);
    }

    //fire all tree events
    fireNodeSelected(node: TreeNode) {
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