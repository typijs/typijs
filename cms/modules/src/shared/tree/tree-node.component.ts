import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TreeNode } from './tree-node';
import { TreeConfig } from './tree-config';
import { NodeMenuItemAction, TreeMenuItem } from './tree-menu';

@Component({
    selector: 'tree-node',
    template: `
    <div class="node-value" [ngClass]="{'node-selected': node.isSelected}" [draggable] [dragData]="node">
        <fa-icon *ngIf="node.hasChildren" [icon]="node.isExpanded ? ['fas', 'caret-down']: ['fas', 'caret-right']" (click)="node.expand()"></fa-icon>
        <div class="no-children" *ngIf="!node.hasChildren"></div>
        <div *ngIf="!shouldShowInputForTreeNode(node)">
            <a href="javascript:void(0)" (click)="selectNode(node)">
                <span *ngIf="!templates.treeNodeTemplate">{{ node.name }}</span>
                <ng-container   [ngTemplateOutlet]="templates.treeNodeTemplate" 
                                [ngTemplateOutletContext]="{ $implicit: node, node: node}">
                </ng-container>
            </a>
        </div>
        
        <div *ngIf="shouldShowInputForTreeNode(node)">
            <input autofocus type="text" class="form-control" (blur)="nodeOnBlur(node)" [(ngModel)]="node.name"/>
        </div>

        <div *ngIf="menuItems" class="node-menu" dropdown>
            <fa-icon [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
            <div class="dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                <a *ngFor="let menuItem of menuItems" class="dropdown-item" href="javascript:void(0)" (click)="menuItemSelected(menuItem.action, node)">
                    {{menuItem.name}}
                </a>
            </div>
        </div>
    </div>
    `
})
export class TreeNodeComponent {
    @Input() node: TreeNode;
    @Input() config: TreeConfig;
    @Input() templates: any = {};

    @Output("selectNode") selectNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("nodeOnBlur") nodeOnBlurEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("menuItemSelected") menuItemSelectedEvent: EventEmitter<any> = new EventEmitter();


    menuItems: TreeMenuItem[];

    ngOnInit() {
        if (this.config) {
            this.menuItems = this.config.menuItems;
        }
    }

    shouldShowInputForTreeNode(node: TreeNode) {
        return node.isNew || node.isEditing;
    }

    selectNode(node: TreeNode) {
        this.selectNodeEvent.emit(node);
    }

    menuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelectedEvent.emit({ action: action, node: node })
    }

    nodeOnBlur(node: TreeNode) {
        this.nodeOnBlurEvent.emit(node);
    }
}