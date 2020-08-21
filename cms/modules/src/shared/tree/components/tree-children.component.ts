import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { TreeStore } from '../tree-store';
import { TreeNode } from '../interfaces/tree-node';
import { TreeConfig } from '../interfaces/tree-config';
import { TreeBaseComponent } from './tree-base.component';

@Component({
    selector: 'tree-children',
    template: `
    <ul class="tree">
        <li class="tree-item" *ngFor="let node of nodeChildren">
            <!-- Default tree node template -->
            <tree-node
                [node]="node"
                [config]="config"
                [templates]="templates"
                (selectNode)="selectNode($event)"
                (menuItemSelected)="menuItemSelected($event)"
                (nodeOnBlur)="nodeOnBlur($event)"
                (submitInlineNode)="submitInlineNode($event)"
                (cancelInlineNode)="cancelInlineNode($event)">
            </tree-node>
            <tree-children *ngIf="node.isExpanded"
                [root]="node"
                [config]="config"
                [templates]="templates"
                (selectNode)="selectNode($event)"
                (menuItemSelected)="menuItemSelected($event)"
                (nodeOnBlur)="nodeOnBlur($event)"
                (submitInlineNode)="submitInlineNode($event)"
                (cancelInlineNode)="cancelInlineNode($event)">
            </tree-children>
        </li>
    </ul>
`,
})
export class TreeChildrenComponent extends TreeBaseComponent implements OnInit {
    @Input() config: TreeConfig;
    @Input() root: TreeNode;
    @Input() templates: any = {};

    nodeChildren: TreeNode[] = [];

    constructor(private treeStore: TreeStore) { super(); }

    ngOnInit() {
        this.treeStore.getTreeNodesSubjectByKey$(this.root.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((nodes: TreeNode[]) => {
                // Trigger render the the sub tree
                const selectedNode = this.treeStore.getSelectedNode();
                this.nodeChildren = this.setExpandStateForNewNodeChildren(nodes);
                this.nodeChildren.forEach(child => {
                    if (selectedNode && selectedNode.id == child.id) {
                        this.treeStore.fireNodeSelectedInner(selectedNode);
                    }
                });
            });

        // using this event to set all other child node is false
        this.treeStore.nodeSelectedInner$.subscribe(selectedNode => {
            this.nodeChildren.forEach(childNode => {
                childNode.isSelected = selectedNode.id == childNode.id;
                if (childNode.isSelected && selectedNode.isNeedToScroll) {
                    this.treeStore.fireScrollToSelectedNode(childNode);
                }
            });
        });

        this.treeStore.getTreeChildrenData(this.root.id).subscribe((nodeChildren: TreeNode[]) => {
            this.treeStore.getTreeNodesSubjectByKey$(this.root.id).next(nodeChildren);
        });
    }

    private setExpandStateForNewNodeChildren(newNodes: TreeNode[]) {
        if (!this.nodeChildren) { return newNodes; }

        this.nodeChildren.forEach((node: TreeNode) => {
            const matchIndex = newNodes.findIndex(x => x.id == node.id);
            if (matchIndex != -1) { newNodes[matchIndex].isExpanded = node.isExpanded; }
        });
        return newNodes;
    }
}
