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
    @Input() templates: any = {};

    public children = [];

    private treeService: TreeService;
    private menuItems: TreeMenuItem[]
    private subscriptions: Subscription[] = [];

    constructor(private store: TreeStore) { }

    ngOnInit() {
        console.log('ngOnInit: ' + this.root.id);
        if (this.config) {
            this.treeService = this.config.service;
            this.menuItems = this.config.menuItems;

            this.subscriptions.push(this.store.getTreeNodes(this.root.id).subscribe(nodes => {
                this.children = nodes;
                let selectedNode = this.store.getSelectedNode();
                this.children.forEach(child=> {
                    if(selectedNode && selectedNode.id == child.id) {
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
            this.children.forEach(child=> {
                if(node.id != child.id) {
                    child.isSelected = false;
                }
            })
        }));
    }

    //handle event when node is clicked
    selectNode(node: TreeNode) {
        node.isSelected = true;
        this.store.fireNodeSelected(node);
    }

    menuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        switch (action) {
            case NodeMenuItemAction.NewNode:
                this.store.fireNodeCreated(node);
                break;
            case NodeMenuItemAction.NewNodeInline:
                this.store.fireNodeInlineCreated(node);
                break;
            case NodeMenuItemAction.Rename:
                this.store.fireNodeRenamed(node);
                break;
            case NodeMenuItemAction.Cut:
                this.store.fireNodeCut(node);
                break;
            case NodeMenuItemAction.Copy:
                this.store.fireNodeCopied(node);
                break;
            case NodeMenuItemAction.Paste:
                this.store.fireNodePasted(node);
                break;
            case NodeMenuItemAction.Delete:
                this.store.fireNodeDeleted(node);
                break;
            default:
                throw new Error(`Chosen menu item doesn't exist`);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}
