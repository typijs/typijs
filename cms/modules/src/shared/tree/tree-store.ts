import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, BehaviorSubject, forkJoin, empty } from 'rxjs';
import { concatMap, map, tap, switchMap } from 'rxjs/operators';

import { TreeNode } from './interfaces/tree-node';
import { TreeService } from './interfaces/tree-service';
import { NodeMenuItemAction, TreeMenuActionEvent } from './interfaces/tree-menu';

@Injectable()
export class TreeStore {
    nodeMenuActionEvent$: Subject<TreeMenuActionEvent> = new Subject<TreeMenuActionEvent>();
    nodeSelectedInner$: Subject<Partial<TreeNode>> = new Subject<Partial<TreeNode>>();
    nodeInlineCreated$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCut$: Subject<TreeNode> = new Subject<TreeNode>();
    nodeCopied$: Subject<TreeNode> = new Subject<TreeNode>();
    nodePasted$: Subject<TreeNode> = new Subject<TreeNode>();
    scrollToSelectedNode$: BehaviorSubject<TreeNode> = new BehaviorSubject<TreeNode>(new TreeNode());

    /**
     * The dictionary of the node children subject with key of parent node's id.
     *
     * Each tree-children component will get the corresponding subject by node id to subscribe and show the node children
     *
     */
    private subjectOfNodeChildrenDictionary: { [nodeId: string]: Subject<TreeNode[]> } = {};

    /**
     * This dictionary of node's children with key of parent node Id
     *
     * The whole tree nodes data will be store in this dictionary
     *
     *  ex nodes[parentId] = array of node's children
     */
    private nodeChildrenDictionary: { [nodeId: string]: TreeNode[] } = {};
    private selectedNode: Partial<TreeNode>;
    /**
     * Default Id: `0` in case node id is undefined or null
     */
    private readonly DEFAULT_NODE_ID: string = '0';

    constructor(private treeService: TreeService) { }

    getSelectedNode(): Partial<TreeNode> {
        return this.selectedNode;
    }

    setSelectedNode(node: Partial<TreeNode>) {
        node.isSelected = true;
        this.selectedNode = node;
    }

    /**
     * This method will get the corresponding subject node children of parent node's id
     *
     * The `treeNodesRxSubject$` Subject of node's children with key of node's id.
     *
     * @returns Return the `Subject` of node's children by which each tree-children component will get the corresponding subject by node id to subscribe and show the node children
     */
    getSubjectOfNodeChildren(nodeId: string): Subject<TreeNode[]> {
        if (!this.subjectOfNodeChildrenDictionary.hasOwnProperty(nodeId)) {
            this.subjectOfNodeChildrenDictionary[nodeId] = new Subject<TreeNode[]>();
        }
        return this.subjectOfNodeChildrenDictionary[nodeId];
    }

    /**
     * Gets node children based on parent node id. Check if the node children was loaded
     * @param parentId
     * @returns tree children data
     */
    getNodeChildren(parentId: string): Observable<TreeNode[]> {
        if (this.nodeChildrenDictionary[parentId]) { return of(this.nodeChildrenDictionary[parentId]); }

        return this.fetchNodeChildren(parentId);
    }

    /**
     * Reload whole the tree including tree node children and parent node
     * @param subTreeRootId
     */
    reloadTreeChildrenData(subTreeRootId: string) {
        if (!subTreeRootId) { subTreeRootId = this.DEFAULT_NODE_ID; }
        // Reload the root node of sub tree

        forkJoin(this.fetchNodeData(subTreeRootId), this.fetchNodeChildren(subTreeRootId))
            .subscribe(([subTreeRootNode, nodeChildren]: [TreeNode, TreeNode[]]) => {
                this.getSubjectOfNodeChildren(subTreeRootId).next(nodeChildren);
                subTreeRootNode.isExpanded = subTreeRootNode.hasChildren;
            });
    }

    /**
     * Fetch the node children based on parent node id
     * @param parentId Parent node's Id
     */
    private fetchNodeChildren(parentId: string): Observable<TreeNode[]> {
        // Set default parent id
        if (!parentId) { parentId = this.DEFAULT_NODE_ID; }

        return this.treeService.loadChildren(parentId).pipe(
            tap((childNodes: TreeNode[]) => {
                this.nodeChildrenDictionary[parentId] = childNodes;
                return this.nodeChildrenDictionary[parentId];
            })
        );
    }

    private fetchNodeData(nodeId: string): Observable<TreeNode> {
        if (nodeId == this.DEFAULT_NODE_ID) { return of(new TreeNode({ id: nodeId })); }
        return this.treeService.getNode(nodeId).pipe(
            switchMap((nodeData: TreeNode) => this.updateNodeDataInDictionary(nodeData))
        );
    }

    /**
     * Update node data in dictionary
     */
    private updateNodeDataInDictionary = (currentNode: TreeNode): Observable<TreeNode> => {
        if (!currentNode) { return of(new TreeNode({ id: this.DEFAULT_NODE_ID })); }

        const { id, parentId, parentPath, hasChildren } = currentNode;
        const parentKey = parentId ? parentId : this.DEFAULT_NODE_ID;
        if (!this.nodeChildrenDictionary[parentKey]) { return of(currentNode); }

        const matchIndex = this.nodeChildrenDictionary[parentKey]
            .findIndex((x: TreeNode) => x.id == currentNode.id || (x.isNew && x.name == currentNode.name));

        if (matchIndex == -1) { return of(currentNode); }

        const currentNodeItem = this.nodeChildrenDictionary[parentKey][matchIndex];

        currentNodeItem.id = id;
        currentNodeItem.parentPath = parentPath;
        currentNodeItem.isNew = false;
        currentNodeItem.isEditing = false;
        currentNodeItem.hasChildren = hasChildren;
        return of(currentNodeItem);
    }

    /**
     * Expand the tree to target node
     * @param newSelectedNode
     */
    expandTreeToSelectedNode(newSelectedNode: TreeNode): Observable<string> {
        if (this.selectedNode && this.selectedNode.id == newSelectedNode.id) { return empty(); }

        this.setSelectedNode(newSelectedNode);
        this.fireNodeSelectedInner(newSelectedNode);

        const parentPath = newSelectedNode.parentPath ?
            `${this.DEFAULT_NODE_ID}${newSelectedNode.parentPath}${newSelectedNode.id},` :
            `${this.DEFAULT_NODE_ID},${newSelectedNode.id},`;

        const parentIds = parentPath.split(',').filter(id => id);

        if (parentIds.length > 0) {
            return from(parentIds).pipe(
                concatMap((nodeId: string, index: number) =>
                    (this.nodeChildrenDictionary[nodeId] ? of(this.nodeChildrenDictionary[nodeId]) : this.treeService.loadChildren(nodeId))
                        .pipe(map((nodes: TreeNode[]) => [nodeId, index, nodes])) // TODO: need to refactor this
                ),
                map(([nodeId, index, nodes]: [string, number, TreeNode[]]) => {
                    if (!this.nodeChildrenDictionary[nodeId]) { this.nodeChildrenDictionary[nodeId] = nodes; }

                    if (index > 0) {
                        const currentNodeIndex = this.nodeChildrenDictionary[parentIds[index - 1]].findIndex(x => x.id == nodeId);
                        if (currentNodeIndex != -1) {
                            this.nodeChildrenDictionary[parentIds[index - 1]][currentNodeIndex].isExpanded = true;
                        }
                    }
                    return nodeId;
                })
            );
        }
    }

    /**
     * Fires node selected event in inner tree scope. Only inner components in the tree will subscribe this event
     * @param node
     */
    fireNodeSelectedInner(node: Partial<TreeNode>) {
        this.nodeSelectedInner$.next(node);
    }

    fireScrollToSelectedNode(node: TreeNode) {
        this.scrollToSelectedNode$.next(node);
    }

    handleNodeMenuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case NodeMenuItemAction.NewNodeInline:
                // add temp new node with status is new
                this.showNewNodeInline(node);
                break;
            case NodeMenuItemAction.EditNowInline:
                // update current node with status is rename
                this.showNodeInlineEdit(node);
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
            default:
                this.fireMenuActionSelected(nodeAction);
                break;
        }
    }

    showNewNodeInline(parentNode: TreeNode) {
        const newInlineNode = new TreeNode({
            isNew: true,
            parentId: parentNode.id == this.DEFAULT_NODE_ID ? null : parentNode.id
        });

        // Check if the child nodes of parentNode has been loaded
        if (this.nodeChildrenDictionary[parentNode.id]) {
            // insert new node to begin of node's children
            this.nodeChildrenDictionary[parentNode.id].unshift(newInlineNode);
            parentNode.isExpanded = true;
            parentNode.hasChildren = true;
        } else {
            this.fetchNodeChildren(parentNode.id).subscribe((nodeChildren: TreeNode[]) => {
                // insert new node to begin of node's children
                this.nodeChildrenDictionary[parentNode.id].unshift(newInlineNode);
                parentNode.isExpanded = true;
                parentNode.hasChildren = true;
                // reload sub tree
                this.getSubjectOfNodeChildren(parentNode.id).next(this.nodeChildrenDictionary[parentNode.id]);
            });
        }
    }

    cancelNewNodeInline(parent: TreeNode, node: TreeNode) {
        const childNodes = this.nodeChildrenDictionary[node.parentId ? node.parentId : this.DEFAULT_NODE_ID];
        if (childNodes) {
            const newNodeIndex = childNodes.findIndex((x: TreeNode) => !x.id);
            if (newNodeIndex > -1) { childNodes.splice(newNodeIndex, 1); }
            if (childNodes.length == 0) {
                parent.hasChildren = false;
                parent.isExpanded = false;
            }
        }
    }

    showNodeInlineEdit(node: TreeNode) {
        node.isEditing = true;
    }

    cancelNodeInlineEdit(node: TreeNode) {
        node.isEditing = false;
    }

    private fireNodeCut(node: TreeNode) {
        this.nodeCut$.next(node);
    }

    private fireNodeCopied(node: TreeNode) {
        this.nodeCopied$.next(node);
    }

    private fireNodePasted(node: TreeNode) {
        this.nodePasted$.next(node);
    }

    // fire and forward menu action click event
    private fireMenuActionSelected(actionEvent: TreeMenuActionEvent) {
        this.nodeMenuActionEvent$.next(actionEvent);
    }
}
