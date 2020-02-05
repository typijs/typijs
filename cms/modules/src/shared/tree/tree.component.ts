import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeConfig, TreeNodeTemplate } from './tree-config';
import { NodeMenuItemAction } from './tree-menu';

@Component({
    selector: 'cms-tree',
    template: `
            <div class="tree">
                <div class="tree-item">
                    <tree-node 
                        class="node-root"
                        [node]="root" 
                        [config]="config" 
                        [templates]="templates"
                        (selectNode)="selectNode($event)"
                        (menuItemSelected)="menuItemSelected($event)">
                    </tree-node>
                    <tree-children 
                        [root]="root" 
                        [config]="config" 
                        [templates]="templates"
                        (selectNode)="selectNode($event)"
                        (menuItemSelected)="menuItemSelected($event)"
                        (nodeOnBlur)="nodeOnBlur($event)">
                    </tree-children>
                </div>
            </div>
                `,
    styleUrls: ['./tree.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStore]
})
export class TreeComponent implements OnInit {

    @ContentChild('treeNodeTemplate', { static: true }) treeNodeTemplate: TemplateRef<any>;
    @ContentChild('loadingTemplate', { static: true }) loadingTemplate: TemplateRef<any>;

    @Input() config: TreeConfig;
    @Input() root: TreeNode;

    @Output() nodeSelected: EventEmitter<any> = new EventEmitter();
    @Output() nodeCreated: EventEmitter<any> = new EventEmitter();
    @Output() nodeInlineCreated: EventEmitter<any> = new EventEmitter();
    @Output() nodeCut: EventEmitter<any> = new EventEmitter();
    @Output() nodeCopied: EventEmitter<any> = new EventEmitter();
    @Output() nodeRenamed: EventEmitter<any> = new EventEmitter();
    @Output() nodePasted: EventEmitter<any> = new EventEmitter();
    @Output() nodeDeleted: EventEmitter<any> = new EventEmitter();

    private subscriptions: Subscription[] = [];
    public templates: TreeNodeTemplate;

    constructor(private treeStore: TreeStore) { }

    ngOnInit() {
        this.templates = {
            loadingTemplate: this.loadingTemplate,
            treeNodeTemplate: this.treeNodeTemplate
        }
        if (this.config) {
            if (!this.config.service) throw new Error("The TreeService is undefined");
            this.treeStore.treeService = this.config.service;

            this.subscriptions.push(this.treeStore.nodeSelected$.subscribe(node => {
                this.nodeSelected.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeCreated$.subscribe(node => {
                this.nodeCreated.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeInlineCreated$.subscribe(node => {
                this.nodeInlineCreated.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeCut$.subscribe(node => {
                this.nodeCut.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeCopied$.subscribe(node => {
                this.nodeCopied.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeRenamed$.subscribe(node => {
                this.nodeRenamed.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodePasted$.subscribe(node => {
                this.nodePasted.emit(node);
            }));

            this.subscriptions.push(this.treeStore.nodeDeleted$.subscribe(node => {
                this.nodeDeleted.emit(node);
            }));
        }
    }

    //Set node.isSelected = true when node is clicked and fire node selected event
    selectNode(node: TreeNode) {
        this.treeStore.setSelectedNode(node);
        this.treeStore.fireNodeSelectedInner(node);
        this.treeStore.fireNodeSelected(node);
    }

    nodeOnBlur(node: TreeNode) {
        if (node.name) {
            this.treeStore.fireNodeInlineCreated(node);
        } else {
            this.treeStore.removeEmptyNode(this.root, node);
        }
    }

    menuItemSelected(nodeAction: { action: NodeMenuItemAction, node: TreeNode }) {
        this.treeStore.fireNodeActions(nodeAction);
    }

    //Reload the node data
    //Reload node's children
    //@nodeId: Mongoose ObjectId
    reloadSubTree(subTreeRootId: string) {
        this.treeStore.reloadTreeChildrenData(subTreeRootId);
    }

    locateToSelectedNode(node: TreeNode) {
        this.treeStore.locateToSelectedNode(node);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}
