import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeConfig } from './tree-config';
import { TreeMenuItem, NodeMenuItemAction } from './tree-menu';

@Component({
    selector: 'tree-children',
    templateUrl: './tree-children.component.html',
    styleUrls: ['./tree-children.component.scss']
})
export class TreeChildrenComponent implements OnInit {
    @Input() config: TreeConfig;
    @Input() root: TreeNode;

    public children = [];

    private treeService: TreeService;
    private menuItems: TreeMenuItem[]

    private subscriptions: Subscription[] = [];

    constructor(private _store: TreeStore) { }

    ngOnInit() {
        if (this.config) {
            this.treeService = this.config.service;
            this.menuItems = this.config.menuItems;

            this.subscriptions.push(this._store.getTreeNodes(this.root.id).subscribe(res => {
                this.children = res;
            }));

            if (this.treeService) {
                this._store.loadNodes(this.treeService.loadChildren, this.root.id);
            }
        }

        this.subscriptions.push(this._store.nodeSelected$.subscribe(node => {
            this.children.forEach(child=> {
                if(node.id != child.id) {
                    child.isSelected = false;
                }
            })
        }));
    }

    selectNode(node: TreeNode) {
        node.isSelected = true;
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
