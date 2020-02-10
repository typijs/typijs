import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, BehaviorSubject, combineLatest, empty } from 'rxjs';
import { concatMap, map, tap, switchMap } from 'rxjs/operators';

import { TreeNode } from './interfaces/tree-node';
import { TreeService } from './interfaces/tree-service';
import { NodeMenuItemAction } from './interfaces/tree-menu';

@Injectable()
export class TreeStore {
    nodeSelectedInner$: Subject<Partial<TreeNode>> = new Subject<Partial<TreeNode>>();
    nodeCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeInlineCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeRenamed$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCut$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCopied$: Subject<TreeNode> = new Subject<TreeNode>();
    nodePasted$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeDelete$: Subject<TreeNode> = new Subject<TreeNode>();
    scrollToSelectedNode$: BehaviorSubject<TreeNode> = new BehaviorSubject<TreeNode>(new TreeNode());

    treeService: TreeService;

    //The tree-children component will subscribe the treeNodesRxSubject to reload sub tree
    private treeNodesRxSubject$ = {}; //store Subject of node's children with key = nodeId to load sub tree
    private treeNodes = {}; //store node's children with key = nodeId, ex nodes[parentId] = array of node's children
    private selectedNode: Partial<TreeNode>;

    getSelectedNode(): Partial<TreeNode> {
        return this.selectedNode;
    }

    setSelectedNode(node: Partial<TreeNode>) {
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

    getTreeChildrenData(nodeId: string): Observable<TreeNode[]> {
        if (this.treeNodes[nodeId]) return of(this.treeNodes[nodeId]);

        return this.getNodeChildren(nodeId);
    }

    //Reload node's children
    //@nodeId: Mongoose ObjectId
    reloadTreeChildrenData(subTreeRootId: string) {
        if (!subTreeRootId) subTreeRootId = '0'
        //Reload the root node of sub tree

        combineLatest(this.getNodeData(subTreeRootId), this.getNodeChildren(subTreeRootId))
            .subscribe(([subTreeRootNode, nodeChildren]: [TreeNode, TreeNode[]]) => {
                this.getTreeNodesSubjectByKey$(subTreeRootId).next(nodeChildren);
                subTreeRootNode.isExpanded = subTreeRootNode.hasChildren;
            });
    }

    removeEmptyNode(parent: TreeNode, node: TreeNode) {
        const childNodes = this.treeNodes[node.parentId ? node.parentId : '0'];
        if (childNodes) {
            const newNodeIndex = childNodes.findIndex((x: TreeNode) => !x.id);
            if (newNodeIndex > -1) childNodes.splice(newNodeIndex, 1);
            if (childNodes.length == 0) {
                parent.hasChildren = false;
                parent.isExpanded = false;
            }
        }
    }

    showNewNodeInline(parentNode: TreeNode) {
        const newInlineNode = new TreeNode({
            isNew: true,
            parentId: parentNode.id == '0' ? null : parentNode.id
        });

        if (this.treeNodes[parentNode.id]) {
            this.treeNodes[parentNode.id].unshift(newInlineNode);
            parentNode.isExpanded = true;
            parentNode.hasChildren = true;
        } else {
            this.getNodeChildren(parentNode.id).subscribe((nodeChildren: TreeNode[]) => {
                //insert new node to begin of node's children
                this.treeNodes[parentNode.id].unshift(newInlineNode);
                parentNode.isExpanded = true;
                parentNode.hasChildren = true;
                //reload sub tree
                this.getTreeNodesSubjectByKey$(parentNode.id).next(this.treeNodes[parentNode.id]);
            });
        }
    }

    locateToSelectedNode(newSelectedNode: TreeNode): Observable<string> {
        if (this.selectedNode && this.selectedNode.id == newSelectedNode.id) return empty();

        this.setSelectedNode(newSelectedNode);
        this.fireNodeSelectedInner(newSelectedNode);

        const parentPath = newSelectedNode.parentPath ? `0${newSelectedNode.parentPath}` : '0';
        const parentIds = parentPath.split(',').filter(id => id);

        if (parentIds.length > 0) {
            return from(parentIds).pipe(
                concatMap((nodeId: string, index: number) => (this.treeNodes[nodeId] ? of(this.treeNodes[nodeId]) : this.treeService.loadChildren(nodeId))
                    .pipe(map((nodes: TreeNode[]) => [nodeId, index, nodes]))
                ),
                map(([nodeId, index, nodes]: [string, number, TreeNode[]]) => {
                    if (!this.treeNodes[nodeId]) this.treeNodes[nodeId] = nodes;

                    if (index > 0) {
                        const currentNodeIndex = this.treeNodes[parentIds[index - 1]].findIndex(x => x.id == nodeId);
                        if (currentNodeIndex != -1)
                            this.treeNodes[parentIds[index - 1]][currentNodeIndex].isExpanded = true;
                    }
                    return nodeId;
                })
            );
        }
    }

    private getNodeData(nodeId: string): Observable<TreeNode> {
        if (nodeId == '0') return of(new TreeNode({ id: nodeId }));
        return this.treeService.getNode(nodeId).pipe(
            switchMap((nodeData: TreeNode) => this.updateTreeNodesData(nodeData))
        );
    }

    private updateTreeNodesData = (currentNode: TreeNode): Observable<TreeNode> => {
        if (!currentNode) return of(new TreeNode({ id: '0' }))

        const key = currentNode.parentId ? currentNode.parentId : '0';
        if (!this.treeNodes[key]) return of(currentNode);

        const matchIndex = this.treeNodes[key].findIndex((x: TreeNode) => x.id == currentNode.id || (x.isNew && x.name == currentNode.name));
        if (matchIndex == -1) return of(currentNode);

        this.treeNodes[key][matchIndex].id = currentNode.id;
        this.treeNodes[key][matchIndex].parentPath = currentNode.parentPath;
        this.treeNodes[key][matchIndex].isNew = false;
        this.treeNodes[key][matchIndex].isEditing = false;
        this.treeNodes[key][matchIndex].hasChildren = currentNode.hasChildren;
        return of(this.treeNodes[key][matchIndex]);
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

    handleNodeMenuItemSelected(nodeAction: { action: NodeMenuItemAction, node: TreeNode }) {
        const { action, node } = nodeAction;
        switch (action) {
            case NodeMenuItemAction.NewNode:
                this.fireNodeCreated(node);
                break;
            case NodeMenuItemAction.NewNodeInline:
                //add temp new node with status is new
                this.showNewNodeInline(node);
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
                this.fireNodeToDeleteAction(node);
                break;
            default:
                throw new Error(`Chosen menu item doesn't exist`);
        }
    }

    //fire all tree events
    fireNodeSelectedInner(node: Partial<TreeNode>) {
        this.nodeSelectedInner$.next(node);
    }

    fireNodeCreated(node: TreeNode) {
        this.nodeCreated$.next(node);
    }

    fireNodeRenamed(node: TreeNode) {
        this.nodeRenamed$.next(node);
    }

    fireNodeCut(node: TreeNode) {
        this.nodeCut$.next(node);
    }

    fireNodeCopied(node: TreeNode) {
        this.nodeCopied$.next(node);
    }

    fireNodePasted(node: TreeNode) {
        this.nodePasted$.next(node);
    }

    fireNodeToDeleteAction(node: TreeNode) {
        this.nodeDelete$.next(node);
    }

    fireScrollToSelectedNode(node: TreeNode) {
        this.scrollToSelectedNode$.next(node);
    }
}