import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeConfig } from './tree-config';
import { TreeMenuItem, NodeMenuItemAction } from './tree-menu';

@Component({
    selector: 'tree-node',
    template: `
    <div class="node-value" [ngClass]="{'node-selected': node.isSelected}">
        <i class="indicator fa" *ngIf="node.hasChildren" [ngClass]="{'fa-caret-right': !node.isExpanded, 'fa-caret-down': node.isExpanded}"
            (click)="node.expand()"></i>
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
            <input type="text " id="input-normal " name="input-normal " class="form-control " placeholder="Normal ">
        </div>

        <div *ngIf="menuItems" class="node-menu" dropdown>
            <i class="fa fa-bars" dropdownToggle></i>
            <div class="dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                <a *ngFor="let menuItem of menuItems" class="dropdown-item" href="javascript:void(0)" (click)="menuItemSelected(menuItem.action, node)">
                    {{menuItem.name}}
                </a>
            </div>
        </div>
    </div>
`,
styles: [`
        .tree-root {
            margin-left: 10px;
            display:block;
        }
        `]
})
export class TreeNodeComponent {
    @Input() node: TreeNode;
    @Input() config: TreeConfig;
    @Input() templates: any = {};

    @Output("selectNode") selectNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("menuItemSelected") menuItemSelectedEvent: EventEmitter<any> = new EventEmitter();

    private menuItems: TreeMenuItem[];

    ngOnInit() {
        if (this.config) {
            this.menuItems = this.config.menuItems;
        }
    }

    shouldShowInputForTreeNode(node: TreeNode) {
        //get status of node to show or not editable node
        return node.isNew || node.isEditing;
    }

    selectNode(node: TreeNode) {
        this.selectNodeEvent.emit(node);
    }

    menuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelectedEvent.emit({ action: action, node: node })
    }
}