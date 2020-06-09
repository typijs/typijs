import { Component, Input, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { TreeNode } from '../interfaces/tree-node';
import { TreeConfig } from '../interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuItem } from '../interfaces/tree-menu';
import { TreeBaseComponent } from './tree-base.component';
import { TreeStore } from '../tree-store';

@Component({
    selector: 'tree-node',
    template: `
    <div class="node-value" [ngClass]="{'node-selected': node.isSelected}" [draggable]="node.id != '0'" [dragData]="node">
        <span *ngIf="node.hasChildren && node.id != '0'" class="tree-icon mr-2 d-inline-block">
            <fa-icon [icon]="node.isExpanded ? ['fas', 'minus-square']: ['fas', 'plus-square']" (click)="node.expand()"></fa-icon>
        </span>
        <span *ngIf="!node.hasChildren" class="no-children mr-2"></span>
        <span *ngIf="!(node.isNew || node.isEditing)" (click)="selectNode(node)" [ngClass]="{'font-weight-bold': node.isSelected && node.id != '0'}">
            <span *ngIf="!templates?.treeNodeTemplate" >{{ node.name }}</span>
            <ng-container   [ngTemplateOutlet]="templates.treeNodeTemplate" 
                            [ngTemplateOutletContext]="{ $implicit: node, node: node}">
            </ng-container>
        </span>
        
        <div *ngIf="node.isNew || node.isEditing" class="form-group row d-inline-block mb-2">
            <form class="form-inline" (ngSubmit)="submitInlineNode(node)" #inlineNodeForm="ngForm">
                <div class="form-group mx-sm-3">
                    <input type="text" required autofocus class="form-control form-control-sm" 
                    (blur)="nodeOnBlur(node)" 
                    [(ngModel)]="node.name" name="name" #name="ngModel"/>
                </div>
                <button type="submit" class="btn btn-success btn-sm" [disabled]="!inlineNodeForm.form.valid">Save</button>
                <button type="button" class="btn btn-default btn-sm" (click)="cancelInlineNode(node)">Cancel</button>
            </form>
        </div>

        <div *ngIf="menuItems && node.id != '0'" class="node-menu" dropdown container="body" (isOpenChange)="onMenuOpenChange($event, node)">
            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
            <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                <a *ngFor="let menuItem of menuItems" class="dropdown-item p-2" href="javascript:void(0)" (click)="onMenuItemSelected(menuItem.action, node)">
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
        this.treeStore.scrollToSelectedNode$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((scrollToNode: TreeNode) => {
                if (scrollToNode.id == this.node.id) this.scrollIntoNode();
            });

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

    onMenuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelected({ action: action, node: node })
    }

    onMenuOpenChange(isOpened: boolean, node: TreeNode): void {
        const selectedNode = this.treeStore.getSelectedNode();
        if (!selectedNode || selectedNode.id != node.id)
            node.isSelected = isOpened;
    }
}