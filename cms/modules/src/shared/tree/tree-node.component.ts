import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { TreeNode } from './tree-node';
import { TreeConfig } from './tree-config';
import { NodeMenuItemAction, TreeMenuItem } from './tree-menu';
import { TreeBaseComponent } from './tree-base.component';
import { TreeStore } from './tree-store';

@Component({
    selector: 'tree-node',
    template: `
    <div class="node-value" [ngClass]="{'node-selected': node.isSelected}" [draggable]="node.id != 0" [dragData]="node">
        <span *ngIf="node.hasChildren && node.id != 0" class="tree-icon mr-2 d-inline-block">
            <fa-icon [icon]="node.isExpanded ? ['fas', 'minus-square']: ['fas', 'plus-square']" (click)="node.expand()"></fa-icon>
        </span>
        <span *ngIf="!node.hasChildren" class="no-children mr-2"></span>
        <span *ngIf="!shouldShowInputForTreeNode(node)" (click)="selectNode(node)">
            <span *ngIf="!templates?.treeNodeTemplate">{{ node.name }}</span>
            <ng-container   [ngTemplateOutlet]="templates.treeNodeTemplate" 
                            [ngTemplateOutletContext]="{ $implicit: node, node: node}">
            </ng-container>
        </span>
        
        <div *ngIf="shouldShowInputForTreeNode(node)" class="form-group row d-inline-block mb-2">
            <form class="form-inline" (ngSubmit)="createNewInlineNode(node)" #inlineNodeForm="ngForm">
                <div class="form-group mx-sm-3">
                    <input type="text" required autofocus class="form-control form-control-sm" 
                    (blur)="nodeOnBlur(node)" 
                    [(ngModel)]="node.name" name="name" #name="ngModel"/>
                </div>
                <button type="submit" class="btn btn-success btn-sm" [disabled]="!inlineNodeForm.form.valid">Save</button>
                <button type="button" class="btn btn-default btn-sm" (click)="cancelNewInlineNode(node)">Cancel</button>
            </form>
        </div>

        <div *ngIf="menuItems && node.id != 0" class="node-menu" dropdown>
            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
            <div class="dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                <a *ngFor="let menuItem of menuItems" class="dropdown-item" href="javascript:void(0)" (click)="onMenuItemSelected(menuItem.action, node)">
                    {{menuItem.name}}
                </a>
            </div>
        </div>
    </div>
    `
})
export class TreeNodeComponent extends TreeBaseComponent {
    @Input() node: TreeNode;
    @Input() config: TreeConfig;
    @Input() templates: any = {};

    menuItems: TreeMenuItem[];

    constructor(
        private treeStore: TreeStore,
        private hostElement: ElementRef<HTMLElement>) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this.treeStore.scrollToSelectedNode$.subscribe((scrollToNode: TreeNode) => {
            if (scrollToNode.id == this.node.id) this.scrollIntoNode();
        }));

        if (this.config) {
            this.menuItems = this.config.menuItems;
        }
    }

    scrollIntoNode() {
        //scroll to middle of viewport
        this.hostElement.nativeElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }

    shouldShowInputForTreeNode(node: TreeNode) {
        return node.isNew || node.isEditing;
    }

    onMenuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelected({ action: action, node: node })
    }
}