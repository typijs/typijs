import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { TreeStore } from '../tree-store';
import { TreeNode } from '../interfaces/tree-node';
import { TreeConfig, TreeNodeTemplate } from '../interfaces/tree-config';
import { NodeMenuItemAction } from '../interfaces/tree-menu';
import { SubscriptionComponent } from '../../subscription.component';

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
                        (menuItemSelected)="menuItemSelected($event)"
                        (nodeOnBlur)="nodeOnBlur($event)"
                        (submitInlineNode)="submitInlineNode($event)"
                        (cancelInlineNode)="cancelInlineNode($event)">
                    </tree-node>
                    <tree-children 
                        [root]="root" 
                        [config]="config" 
                        [templates]="templates"
                        (selectNode)="selectNode($event)"
                        (menuItemSelected)="menuItemSelected($event)"
                        (nodeOnBlur)="nodeOnBlur($event)"
                        (submitInlineNode)="submitInlineNode($event)"
                        (cancelInlineNode)="cancelInlineNode($event)">
                    </tree-children>
                </div>
            </div>
                `,
    styleUrls: ['./tree.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStore]
})
export class TreeComponent extends SubscriptionComponent implements OnInit {

    @ContentChild('treeNodeTemplate', { static: true }) treeNodeTemplate: TemplateRef<any>;
    @ContentChild('loadingTemplate', { static: true }) loadingTemplate: TemplateRef<any>;

    @Input() config: TreeConfig;
    @Input() root: TreeNode;

    @Output() nodeSelected: EventEmitter<Partial<TreeNode>> = new EventEmitter();
    @Output() nodeCreated: EventEmitter<TreeNode> = new EventEmitter();
    @Output() nodeInlineCreated: EventEmitter<TreeNode> = new EventEmitter();
    @Output() nodeInlineUpdated: EventEmitter<TreeNode> = new EventEmitter();
    @Output() nodeCut: EventEmitter<any> = new EventEmitter();
    @Output() nodeCopied: EventEmitter<any> = new EventEmitter();
    @Output() nodePasted: EventEmitter<any> = new EventEmitter();
    @Output() nodeDeleteEvent: EventEmitter<any> = new EventEmitter();

    public templates: TreeNodeTemplate;

    constructor(private treeStore: TreeStore) { super(); }

    ngOnInit() {
        this.templates = {
            loadingTemplate: this.loadingTemplate,
            treeNodeTemplate: this.treeNodeTemplate
        }
        if (this.config) {
            if (!this.config.service) throw new Error("The TreeService is undefined");
            this.treeStore.treeService = this.config.service;

            this.subscribeAndEmitNodeMenuItemSelectedEvent();
        }
    }

    //Set node.isSelected = true when node is clicked and fire node selected event
    selectNode(node: Partial<TreeNode>) {
        this.treeStore.setSelectedNode(node);
        this.treeStore.fireNodeSelectedInner(node);
        this.nodeSelected.emit(node);
    }

    nodeOnBlur(node: TreeNode) {
        if(!node.name) this.cancelInlineNode(node);
    }

    submitInlineNode(node: TreeNode) {
        if (node.name && node.isNew) {
            this.nodeInlineCreated.emit(node);
            return;
        } 
        if (node.name && !node.isNew && node.isEditing) {
            this.nodeInlineUpdated.emit(node);
            node.isEditing = false;
            return;
        } 
    }

    cancelInlineNode(node: TreeNode) {
        if(node.isNew) {
            this.treeStore.cancelNewNodeInline(this.root, node);
            return;
        }

        if(!node.isNew && node.isEditing) {
            this.treeStore.cancelNodeInlineEdit(node);
            return;
        }
    }

    menuItemSelected(nodeAction: { action: NodeMenuItemAction, node: TreeNode }) {
        this.treeStore.handleNodeMenuItemSelected(nodeAction);
    }

    //Reload the node data
    //Reload node's children
    //@nodeId: Mongoose ObjectId
    reloadSubTree(subTreeRootId: string) {
        this.treeStore.reloadTreeChildrenData(subTreeRootId);
    }

    locateToSelectedNode(node: TreeNode) {
        this.treeStore.locateToSelectedNode(node).subscribe(nodeId => {
            console.log(`locateToSelectedNode has id = ${nodeId}`)
        });
    }

    private subscribeAndEmitNodeMenuItemSelectedEvent() {
        this.subscriptions.push(this.treeStore.nodeCreated$.subscribe(node => {
            this.nodeCreated.emit(node);
        }));

        this.subscriptions.push(this.treeStore.nodeCut$.subscribe(node => {
            this.nodeCut.emit(node);
        }));

        this.subscriptions.push(this.treeStore.nodeCopied$.subscribe(node => {
            this.nodeCopied.emit(node);
        }));

        this.subscriptions.push(this.treeStore.nodePasted$.subscribe(node => {
            this.nodePasted.emit(node);
        }));

        this.subscriptions.push(this.treeStore.nodeDelete$.subscribe(node => {
            this.nodeDeleteEvent.emit(node);
        }));
    }
}
