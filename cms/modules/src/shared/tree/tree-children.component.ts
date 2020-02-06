import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeConfig } from './tree-config';
import { NodeMenuItemAction } from './tree-menu';
import { SubscriptionComponent } from '../subscription.component';
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
                (createNewInlineNode)="createNewInlineNode($event)"
                (cancelNewInlineNode)="cancelNewInlineNode($event)">
            </tree-node>
            <tree-children *ngIf="node.isExpanded" 
                [root]="node" 
                [config]="config" 
                [templates]="templates"
                (selectNode)="selectNode($event)"
                (menuItemSelected)="menuItemSelected($event)"
                (nodeOnBlur)="nodeOnBlur($event)"
                (createNewInlineNode)="createNewInlineNode($event)"
                (cancelNewInlineNode)="cancelNewInlineNode($event)">
            </tree-children>
        </li>
    </ul>
`,
})
export class TreeChildrenComponent extends TreeBaseComponent implements OnInit {
    @Input() config: TreeConfig;
    @Input() root: TreeNode;
    @Input() templates: any = {};

    public nodeChildren: TreeNode[] = [];
    private treeService: TreeService;

    constructor(private treeStore: TreeStore) { super() }

    ngOnInit() {
        this.subscriptions.push(this.treeStore.getTreeNodesSubjectByKey$(this.root.id).subscribe((nodes: TreeNode[]) => {
            const selectedNode = this.treeStore.getSelectedNode();
            this.nodeChildren = nodes;
            this.nodeChildren.forEach(child => {
                if (selectedNode && selectedNode.id == child.id && child.isSelected == false) {
                    this.treeStore.fireNodeSelectedInner(selectedNode);
                }
            })
        }));

        this.subscriptions.push(this.treeStore.nodeSelectedInner$.subscribe(selectedNode => {
            this.nodeChildren.forEach(childNode => {
                childNode.isSelected = selectedNode.id == childNode.id;
            })
        }));

        if (this.config) {
            this.treeService = this.config.service;
            if (this.treeService) {
                this.treeStore.getTreeChildrenData(this.root.id);
            }
        }
    }
}
