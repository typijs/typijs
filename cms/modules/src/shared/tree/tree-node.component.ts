import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TreeNode } from './tree-node';
import { TreeConfig } from './tree-config';
import { NodeMenuItemAction, TreeMenuItem } from './tree-menu';

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
        
        <div *ngIf="shouldShowInputForTreeNode(node)">
            <input autofocus type="text" class="form-control" (blur)="nodeOnBlur(node)" [(ngModel)]="node.name"/>
        </div>

        <div *ngIf="menuItems && node.id != 0" class="node-menu" dropdown>
            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
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
        if (node.id == '0') return;
        this.selectNodeEvent.emit(node);
    }

    menuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelectedEvent.emit({ action: action, node: node })
    }

    nodeOnBlur(node: TreeNode) {
        this.nodeOnBlurEvent.emit(node);
    }
}