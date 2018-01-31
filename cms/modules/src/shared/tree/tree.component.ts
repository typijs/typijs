import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeConfig } from './tree-config';
import { TreeMenuItem, NodeMenuItemAction } from './tree-menu';

@Component({
    selector: 'cms-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    providers: [TreeStore]
})
export class TreeComponent implements OnInit {
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

    public children = [];

    private treeService: TreeService;
    private menuItems: TreeMenuItem[]

    private subscriptions: Subscription[] = [];

    constructor(private _store: TreeStore) { }

    ngOnInit() {
        if (this.config) {
            this.treeService = this.config.service;
            this.menuItems = this.config.menuItems;

            if (this.treeService) {
                this._store.loadNodes(this.treeService.loadChildren, this.root.id);
            }

            this.subscriptions.push(this._store.getTreeNodes(this.root.id).subscribe(res => {
                this.children = res;
            }));

            this.subscriptions.push(this._store.nodeSelected$.subscribe(node => {
                this.nodeSelected.emit(node);
            }));

            this.subscriptions.push(this._store.nodeCreated$.subscribe(node => {
                this.nodeCreated.emit(node);
            }));

            this.subscriptions.push(this._store.nodeInlineCreated$.subscribe(node => {
                this.nodeInlineCreated.emit(node);
            }));

            this.subscriptions.push(this._store.nodeCut$.subscribe(node => {
                this.nodeCut.emit(node);
            }));

            this.subscriptions.push(this._store.nodeCopied$.subscribe(node => {
                this.nodeCopied.emit(node);
            }));

            this.subscriptions.push(this._store.nodeRenamed$.subscribe(node => {
                this.nodeRenamed.emit(node);
            }));

            this.subscriptions.push(this._store.nodePasted$.subscribe(node => {
                this.nodePasted.emit(node);
            }));

            this.subscriptions.push(this._store.nodeDeleted$.subscribe(node => {
                this.nodeDeleted.emit(node);
            }));
        }
    }

    selectNode(node: TreeNode) {
        this._store.fireNodeSelected(node);
    }

    menuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        switch (action) {
            case NodeMenuItemAction.NewNode:
                this._store.fireNodeCreated(node);
                break;
            case NodeMenuItemAction.NewNodeInline:
                this._store.fireNodeInlineCreated(node);
                break;
            case NodeMenuItemAction.Rename:
                this._store.fireNodeRenamed(node);
                break;
            case NodeMenuItemAction.Cut:
                this._store.fireNodeCut(node);
                break;
            case NodeMenuItemAction.Copy:
                this._store.fireNodeCopied(node);
                break;
            case NodeMenuItemAction.Paste:
                this._store.fireNodePasted(node);
                break;
            case NodeMenuItemAction.Delete:
                this._store.fireNodeDeleted(node);
                break;
            default:
                throw new Error(`Chosen menu item doesn't exist`);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}
