import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeConfig } from './tree-config';
import { TreeMenuItem, NodeMenuItemAction } from './tree-menu';

@Component({
    selector: 'tree-children',
    template: `
    <ul class="tree">
        <li class="tree-item" *ngFor="let node of children">
            <!-- Default tree node template -->
            <tree-node 
                [node]="node" 
                [config]="config"
                [templates]="templates"
                (selectNode)="selectNode($event)"
                (menuItemSelected)="menuItemSelected($event)"
                (nodeOnBlur)="nodeOnBlur($event)"></tree-node>
            <tree-children *ngIf="node.isExpanded" 
                [root]="node" 
                [config]="config" 
                [templates]="templates"></tree-children>
        </li>
    </ul>
`,
})
export class TreeChildrenComponent implements OnInit {
    @Input() config: TreeConfig;
    @Input() root: TreeNode;
    @Input() templates: any = {};

    public children = [];
    private treeService: TreeService;
    private subscriptions: Subscription[] = [];

    constructor(private store: TreeStore) { }

    ngOnInit() {
        console.log('ngOnInit: ' + this.root.id);
        if (this.config) {
            this.treeService = this.config.service;

            this.subscriptions.push(this.store.getTreeNodes(this.root.id).subscribe(nodes => {
                this.children = nodes;
                let selectedNode = this.store.getSelectedNode();
                this.children.forEach(child => {
                    if (selectedNode && selectedNode.id == child.id) {
                        child.isSelected = true;
                        this.store.fireNodeSelected(child);
                    }
                })
            }));

            if (this.treeService) {
                this.store.loadNodes(this.root.id);
            }
        }

        this.subscriptions.push(this.store.nodeSelected$.subscribe(node => {
            this.children.forEach(child => {
                if (node.id != child.id) {
                    child.isSelected = false;
                }
            })
        }));
    }

    selectNode(node: TreeNode) {
        node.isSelected = true;
        this.store.fireNodeSelected(node);
    }

    nodeOnBlur(node: TreeNode) {
        if (node.name) {
            this.store.fireNodeInlineCreated(node);
        } else {
            this.store.removeEmptyNode(this.root, node);
        }
    }

    menuItemSelected(menuEvent) {
        this.store.fireNodeActions(menuEvent);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}
