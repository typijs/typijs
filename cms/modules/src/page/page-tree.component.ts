import { Component, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Page, PageService } from '@angular-cms/core';
import { TreeNode, TreeComponent, TreeConfig, NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree';
import { PageTreeService } from './page-tree.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { SubjectService } from '../shared/services/subject.service';

const PageMenuItemAction = {
    DeletePage: 'DeletePage',
    NewPage: 'NewPage'
}

@Component({
    template: `
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
                    <span *ngIf="node.id == '0'" class="badge badge-info float-right mt-2 mr-1" [routerLink]="['new/page']">NEW</span>
                </span>
            </ng-template>
        </cms-tree>
        `,
    styles: [`
        .page-node {
            width: calc(100% - 20px);
            cursor: pointer;
            display: inline-block;
        }

        .page-node:hover {
            font-weight: bold;
            border-bottom: 1px solid #a4b7c1!important;
        }
  `]
})
export class PageTreeComponent extends SubscriptionDestroy {
    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;

    root: TreeNode = new TreeNode({ id: '0', name: 'Root', hasChildren: true });
    treeConfig: TreeConfig;

    constructor(
        private injector: Injector,
        private pageService: PageService,
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) {
        super()
        this.treeConfig = {
            service: this.injector.get(PageTreeService),
            menuItems: [
                {
                    action: PageMenuItemAction.NewPage,
                    name: "New Page"
                },
                {
                    action: NodeMenuItemAction.Cut,
                    name: "Cut"
                },
                {
                    action: NodeMenuItemAction.Copy,
                    name: "Copy"
                },
                {
                    action: NodeMenuItemAction.Paste,
                    name: "Paste"
                },
                {
                    action: PageMenuItemAction.DeletePage,
                    name: "Delete"
                },
            ]
        }
    }

    ngOnInit() {
        this.subscriptions.push(this.subjectService.pageCreated$.subscribe((createdPage: Page) => {
            //Reload parent page
            //Reload the children of parent to update the created page
            this.cmsTree.selectNode({ id: createdPage._id, isNeedToScroll: true });
            this.cmsTree.reloadSubTree(createdPage.parentId);
        }));

        this.subscriptions.push(this.subjectService.pageSelected$.subscribe((selectedPage: Page) => {
            this.cmsTree.locateToSelectedNode(new TreeNode({
                id: selectedPage._id,
                isNeedToScroll: true,
                name: selectedPage.name,
                hasChildren: selectedPage.hasChildren,
                parentId: selectedPage.parentId,
                parentPath: selectedPage.parentPath
            }));
        }));
    }

    pageSelected(node: TreeNode) {
        if (node.id == '0') return;
        this.router.navigate(["content/page", node.id], { relativeTo: this.route })
    }

    menuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case PageMenuItemAction.NewPage:
                this.pageCreating(node);
                break;
            case PageMenuItemAction.DeletePage:
                this.pageDelete(node);
                break;
        }
    }

    private pageCreating(parentNode: TreeNode) {
        this.router.navigate(["new/page", parentNode.id], { relativeTo: this.route })
    }

    private pageDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') return;
        this.pageService.softDeleteContent(nodeToDelete.id).subscribe(([pageToDelete, deleteResult]: [Page, any]) => {
            console.log(deleteResult);
            this.cmsTree.selectNode({ id: pageToDelete.parentId, isNeedToScroll: true });
            this.cmsTree.reloadSubTree(pageToDelete.parentId);
        });
    }
}