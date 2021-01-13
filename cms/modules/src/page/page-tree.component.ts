import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, distinctUntilKeyChanged } from 'rxjs/operators';

import { Page, PageService } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';

import { PageTreeService } from './page-tree.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { SubjectService } from '../shared/services/subject.service';
import { TreeService } from '../shared/tree/interfaces/tree-service';

const PAGE_MENU_ACTION = {
    DeletePage: 'DeletePage',
    NewPage: 'NewPage'
};

@Component({
    template: `
    <div class='position-relative'>
        <cms-tree
            class="tree-root pl-1 pt-2 d-block"
            [root]="root"
            [config]="treeConfig"
            (nodeSelected)="pageSelected($event)"
            (menuItemSelected)="menuItemSelected($event)">
            <ng-template #treeNodeTemplate let-node>
                <span [ngClass]="{'page-node': node.id != '0', 'border-bottom': node.isSelected && node.id != '0'}">
                    <fa-icon class="mr-1" *ngIf="node.id == '0'" [icon]="['fas', 'sitemap']"></fa-icon>
                    <fa-icon class="mr-1" *ngIf="node.id != '0'" [icon]="['fas', 'file']"></fa-icon>
                    <span>{{node.name}}</span>
                </span>
            </ng-template>
        </cms-tree>
        <a role="button"
            class="btn btn-xs btn-secondary mt-2 mr-1 new-page-link"
            href="javascript:void(0)"
            [routerLink]="['new/page']">
            <fa-icon [icon]="['fas', 'plus']"></fa-icon>
        </a>
    </div>
        `,
    styleUrls: ['./page-tree.scss'],
    providers: [PageTreeService, { provide: TreeService, useExisting: PageTreeService }]
})
export class PageTreeComponent extends SubscriptionDestroy implements OnInit {
    @ViewChild(TreeComponent) cmsTree: TreeComponent;

    root: TreeNode;
    treeConfig: TreeConfig;

    constructor(
        private pageService: PageService,
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) {
        super();
        this.root = new TreeNode({ id: '0', name: 'Root', hasChildren: true });
        this.treeConfig = this.initTreeConfiguration();
    }

    ngOnInit() {
        this.subjectService.pageCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((createdPage: Page) => {
                // Reload parent page
                // Reload the children of parent to update the created page
                this.cmsTree.setSelectedNode({ id: createdPage._id, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(createdPage.parentId);
            });

        this.subjectService.pageSelected$
            .pipe(
                distinctUntilKeyChanged('_id'),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((selectedPage: Page) => {
                this.cmsTree.expandTreeToSelectedNode(new TreeNode({
                    id: selectedPage._id,
                    isNeedToScroll: true,
                    name: selectedPage.name,
                    hasChildren: selectedPage.hasChildren,
                    parentId: selectedPage.parentId,
                    parentPath: selectedPage.parentPath
                }));
            });
    }

    pageSelected(node: TreeNode) {
        if (node.id == '0') { return; }
        this.router.navigate(['content/page', node.id], { relativeTo: this.route });
    }

    menuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case PAGE_MENU_ACTION.NewPage:
                this.pageCreating(node);
                break;
            case PAGE_MENU_ACTION.DeletePage:
                this.pageDelete(node);
                break;
        }
    }

    private pageCreating(parentNode: TreeNode) {
        this.router.navigate(['new/page', parentNode.id], { relativeTo: this.route });
    }

    private pageDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') { return; }
        this.pageService.moveContentToTrash(nodeToDelete.id).subscribe((pageToDelete: Page) => {
            if (pageToDelete.isDeleted) {
                // if the deleted node is selected then need to set the parent node is the new selected node
                if (nodeToDelete.isSelected) this.cmsTree.setSelectedNode({ id: pageToDelete.parentId, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(pageToDelete.parentId);
            }
        });
    }

    private initTreeConfiguration(): TreeConfig {
        return {
            menuItems: [
                {
                    action: PAGE_MENU_ACTION.NewPage,
                    name: 'New Page'
                },
                {
                    action: NodeMenuItemAction.Cut,
                    name: 'Cut'
                },
                {
                    action: NodeMenuItemAction.Copy,
                    name: 'Copy'
                },
                {
                    action: NodeMenuItemAction.Paste,
                    name: 'Paste'
                },
                {
                    action: PAGE_MENU_ACTION.DeletePage,
                    name: 'Delete'
                },
            ]
        };
    }
}
